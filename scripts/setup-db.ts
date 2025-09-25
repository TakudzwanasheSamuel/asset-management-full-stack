import pool from '../src/lib/db';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const createTables = async () => {
  const connection = await pool.getConnection();
  try {
    console.log('Creating tables...');

    // Drop tables if they exist (in reverse dependency order)
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('DROP TABLE IF EXISTS user_roles, roles, maintenance_records, attachments, audit_logs, transactions, assets, asset_categories, employees, departments, locations, vendors, companies;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    // Companies
    await connection.query(`
      CREATE TABLE companies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY (name)
      );
    `);

    // Departments
    await connection.query(`
      CREATE TABLE departments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        UNIQUE KEY (name),
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      );
    `);

    // Employees
    await connection.query(`
      CREATE TABLE employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        department VARCHAR(100),
        role VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        department_id INT,
        employeeId VARCHAR(255),
        avatar VARCHAR(2048),
        hireDate DATE,
        status ENUM('Active','Inactive','Terminated') NOT NULL DEFAULT 'Active',
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        UNIQUE KEY (email),
        UNIQUE KEY (employeeId),
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      );
    `);

    // Asset Categories
    await connection.query(`
      CREATE TABLE asset_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        UNIQUE KEY (name)
      );
    `);

    // Locations
    await connection.query(`
      CREATE TABLE locations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        UNIQUE KEY (name)
      );
    `);

    // Vendors
    await connection.query(`
      CREATE TABLE vendors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        contact_info VARCHAR(255),
        warranty_info VARCHAR(255),
        address TEXT,
        UNIQUE KEY (name)
      );
    `);

    // Assets
    await connection.query(`
      CREATE TABLE assets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        category_id INT,
        type ENUM('Laptop','Monitor','Keyboard','Mouse','Phone','Tablet','Other') NOT NULL,
        status ENUM('Available','Checked Out','In Repair','Lost','Retired','Maintenance') NOT NULL DEFAULT 'Available',
        assignedTo INT,
        serialNumber VARCHAR(255),
        manufacturer VARCHAR(255),
        model VARCHAR(255),
        purchaseDate DATE,
        purchasePrice DECIMAL(10,2),
        location_id INT,
        vendor_id INT,
        description TEXT,
        nfcId VARCHAR(255),
        rfid VARCHAR(255),
        imageUrl VARCHAR(2048),
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        UNIQUE KEY (serialNumber),
        UNIQUE KEY (nfcId),
        UNIQUE KEY (rfid),
        FOREIGN KEY (assignedTo) REFERENCES employees(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES asset_categories(id) ON DELETE SET NULL,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      );
    `);

    // Attachments
    await connection.query(`
      CREATE TABLE attachments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        asset_id INT,
        file_url VARCHAR(2048) NOT NULL,
        file_type VARCHAR(255),
        uploaded_by INT,
        uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
        FOREIGN KEY (uploaded_by) REFERENCES employees(id) ON DELETE SET NULL
      );
    `);

    // Audit Logs
    await connection.query(`
      CREATE TABLE audit_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        table_name VARCHAR(255) NOT NULL,
        record_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        performed_by INT,
        performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        details TEXT,
        FOREIGN KEY (performed_by) REFERENCES employees(id) ON DELETE SET NULL
      );
    `);

    // Maintenance Records
    await connection.query(`
      CREATE TABLE maintenance_records (
        id INT PRIMARY KEY AUTO_INCREMENT,
        asset_id INT NOT NULL,
        performed_by INT,
        vendor_id INT,
        maintenance_date DATE NOT NULL,
        description TEXT,
        cost DECIMAL(10,2),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
        FOREIGN KEY (performed_by) REFERENCES employees(id) ON DELETE SET NULL,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
      );
    `);

    // Roles
    await connection.query(`
      CREATE TABLE roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        description TEXT,
        UNIQUE KEY (name)
      );
    `);

    // Transactions
    await connection.query(`
      CREATE TABLE transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        assetId INT NOT NULL,
        employeeId INT NOT NULL,
        type ENUM('Check-In','Check-Out') NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        condition ENUM('Excellent','Good','Fair','Poor'),
        createdBy INT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        FOREIGN KEY (assetId) REFERENCES assets(id) ON DELETE CASCADE,
        FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
        FOREIGN KEY (createdBy) REFERENCES employees(id) ON DELETE CASCADE
      );
    `);

    // User Roles
    await connection.query(`
      CREATE TABLE user_roles (
        employee_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (employee_id, role_id),
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
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
