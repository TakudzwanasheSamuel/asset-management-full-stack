# Database Schema for Asset Management System

This document outlines the table structures for the MySQL database.

---

### Table: `assets`

Stores all company assets.

| Column          | Type                                                                  | Constraints / Notes                          |
|-----------------|-----------------------------------------------------------------------|----------------------------------------------|
| `id`            | `INT`                                                                 | `PRIMARY KEY`, `AUTO_INCREMENT`              |
| `name`          | `VARCHAR(255)`                                                        | `NOT NULL`                                   |
| `type`          | `ENUM('Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Phone', 'Tablet', 'Other')` | `NOT NULL`                                   |
| `status`        | `ENUM('Available', 'Checked Out', 'In Repair', 'Lost', 'Retired', 'Maintenance')` | `NOT NULL`, `DEFAULT 'Available'`            |
| `assignedTo`    | `INT`                                                                 | `NULL`, Foreign Key to `employees(id)`       |
| `serialNumber`  | `VARCHAR(255)`                                                        | `UNIQUE`, `NULL`                             |
| `manufacturer`  | `VARCHAR(255)`                                                        | `NULL`                                       |
| `model`         | `VARCHAR(255)`                                                        | `NULL`                                       |
| `purchaseDate`  | `DATE`                                                                | `NULL`                                       |
| `purchasePrice` | `DECIMAL(10, 2)`                                                      | `NULL`                                       |
| `location`      | `VARCHAR(255)`                                                        | `NULL`                                       |
| `description`   | `TEXT`                                                                | `NULL`                                       |
| `imageUrl`      | `VARCHAR(2048)`                                                       | `NULL`                                       |
| `createdAt`     | `TIMESTAMP`                                                           | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`      |
| `updatedAt`     | `TIMESTAMP`                                                           | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |

---

### Table: `employees`

Stores information about all employees.

| Column       | Type           | Constraints / Notes                          |
|--------------|----------------|----------------------------------------------|
| `id`         | `INT`          | `PRIMARY KEY`, `AUTO_INCREMENT`              |
| `name`       | `VARCHAR(255)` | `NOT NULL`                                   |
| `email`      | `VARCHAR(255)` | `NOT NULL`, `UNIQUE`                         |
| `password`   | `VARCHAR(255)` | `NOT NULL` (Store hashed passwords)          |
| `department` | `VARCHAR(255)` | `NULL`                                       |
| `role`       | `VARCHAR(255)` | `NULL`                                       |
| `employeeId` | `VARCHAR(255)` | `UNIQUE`, `NULL`                             |
| `avatar`     | `VARCHAR(2048)`| `NULL`                                       |
| `hireDate`   | `DATE`         | `NULL`                                       |
| `status`     | `ENUM('Active', 'Inactive', 'Terminated')` | `NOT NULL`, `DEFAULT 'Active'` |
| `createdAt`  | `TIMESTAMP`    | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`      |
| `updatedAt`  | `TIMESTAMP`    | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |

---

### Table: `transactions`

A log of all check-in and check-out events.

| Column      | Type                                | Constraints / Notes                          |
|-------------|-------------------------------------|----------------------------------------------|
| `id`        | `INT`                               | `PRIMARY KEY`, `AUTO_INCREMENT`              |
| `assetId`   | `INT`                               | `NOT NULL`, Foreign Key to `assets(id)`      |
| `employeeId`| `INT`                               | `NOT NULL`, Foreign Key to `employees(id)`   |
| `type`      | `ENUM('Check-In', 'Check-Out')`     | `NOT NULL`                                   |
| `date`      | `TIMESTAMP`                         | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`      |
| `notes`     | `TEXT`                              | `NULL`                                       |
| `condition` | `ENUM('Excellent', 'Good', 'Fair', 'Poor')` | `NULL`                               |
| `createdBy` | `INT`                               | `NOT NULL` (User ID of admin who performed the action) |
| `createdAt` | `TIMESTAMP`                         | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`      |
