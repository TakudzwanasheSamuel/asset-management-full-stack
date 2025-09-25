
-- SQL schema for asset_mng_db
CREATE DATABASE IF NOT EXISTS asset_mng_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE asset_mng_db;

-- Table: departments
CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);


CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  department_id INT,
  employeeId VARCHAR(255) UNIQUE,
  avatar VARCHAR(2048),
  hireDate DATE,
  status ENUM('Active', 'Inactive', 'Terminated') NOT NULL DEFAULT 'Active',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Table: user_roles (many-to-many for employees and roles)
CREATE TABLE IF NOT EXISTS user_roles (
  employee_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (employee_id, role_id),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS asset_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

-- Table: vendors
CREATE TABLE IF NOT EXISTS vendors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  contact_info VARCHAR(255),
  warranty_info VARCHAR(255),
  address TEXT
);

-- Table: locations
CREATE TABLE IF NOT EXISTS locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  address TEXT
);

CREATE TABLE IF NOT EXISTS assets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category_id INT,
  type ENUM('Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Phone', 'Tablet', 'Other') NOT NULL,
  status ENUM('Available', 'Checked Out', 'In Repair', 'Lost', 'Retired', 'Maintenance') NOT NULL DEFAULT 'Available',
  assignedTo INT,
  serialNumber VARCHAR(255) UNIQUE,
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  purchaseDate DATE,
  purchasePrice DECIMAL(10, 2),
  location_id INT,
  vendor_id INT,
  description TEXT,
  imageUrl VARCHAR(2048),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (assignedTo) REFERENCES employees(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES asset_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
);

-- Table: maintenance_records
CREATE TABLE IF NOT EXISTS maintenance_records (
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

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  table_name VARCHAR(255) NOT NULL,
  record_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  performed_by INT,
  performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  details TEXT,
  FOREIGN KEY (performed_by) REFERENCES employees(id) ON DELETE SET NULL
);

-- Table: attachments
CREATE TABLE IF NOT EXISTS attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  asset_id INT,
  file_url VARCHAR(2048) NOT NULL,
  file_type VARCHAR(255),
  uploaded_by INT,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  department_id INT,
  employeeId VARCHAR(255) UNIQUE,
  avatar VARCHAR(2048),
  hireDate DATE,
  status ENUM('Active', 'Inactive', 'Terminated') NOT NULL DEFAULT 'Active',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS assets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category_id INT,
  type ENUM('Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Phone', 'Tablet', 'Other') NOT NULL,
  status ENUM('Available', 'Checked Out', 'In Repair', 'Lost', 'Retired', 'Maintenance') NOT NULL DEFAULT 'Available',
  assignedTo INT,
  serialNumber VARCHAR(255) UNIQUE,
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  purchaseDate DATE,
  purchasePrice DECIMAL(10, 2),
  location_id INT,
  vendor_id INT,
  description TEXT,
  imageUrl VARCHAR(2048),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (assignedTo) REFERENCES employees(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES asset_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assetId INT NOT NULL,
  employeeId INT NOT NULL,
  type ENUM('Check-In', 'Check-Out') NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  `condition` ENUM('Excellent', 'Good', 'Fair', 'Poor'),
  createdBy INT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (assetId) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy) REFERENCES employees(id) ON DELETE CASCADE
);
-- Indexes for performance
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_assignedTo ON assets(assignedTo);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(date);
