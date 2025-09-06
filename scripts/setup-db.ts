import pool from '../src/lib/db';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const createTables = async () => {
  const connection = await pool.getConnection();
  try {
    console.log('Creating tables...');

    // Drop tables if they exist
    await connection.query('DROP TABLE IF EXISTS transactions;');
    await connection.query('DROP TABLE IF EXISTS assets;');
    await connection.query('DROP TABLE IF EXISTS employees;');


    await connection.query(`
      CREATE TABLE employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        role VARCHAR(255),
        employeeId VARCHAR(255) UNIQUE,
        avatar VARCHAR(2048),
        hireDate DATE,
        status ENUM('Active', 'Inactive', 'Terminated') NOT NULL DEFAULT 'Active',
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE assets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        type ENUM('Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Phone', 'Tablet', 'Other') NOT NULL,
        status ENUM('Available', 'Checked Out', 'In Repair', 'Lost', 'Retired', 'Maintenance') NOT NULL DEFAULT 'Available',
        assignedTo INT,
        serialNumber VARCHAR(255) UNIQUE,
        manufacturer VARCHAR(255),
        model VARCHAR(255),
        purchaseDate DATE,
        purchasePrice DECIMAL(10, 2),
        location VARCHAR(255),
        description TEXT,
        imageUrl VARCHAR(2048),
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (assignedTo) REFERENCES employees(id) ON DELETE SET NULL
      );
    `);

    await connection.query(`
      CREATE TABLE transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        assetId INT NOT NULL,
        employeeId INT NOT NULL,
        type ENUM('Check-In', 'Check-Out') NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        condition ENUM('Excellent', 'Good', 'Fair', 'Poor'),
        createdBy INT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assetId) REFERENCES assets(id) ON DELETE CASCADE,
        FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
        FOREIGN KEY (createdBy) REFERENCES employees(id) ON DELETE CASCADE
      );
    `);

    console.log('Tables created successfully.');

    console.log('Creating default admin user...');
    const saltRounds = 10;
    const adminPassword = 'password';
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    await connection.query(`
      INSERT INTO employees (name, email, password, role)
      VALUES ('Admin User', 'admin@example.com', ?, 'Admin');
    `, [hashedPassword]);

    console.log('Default admin user created with email: admin@example.com and password: password');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    connection.release();
    pool.end();
  }
};

createTables();
