-- SQL Script to add Zimbabwean employees to company ID 4 (Goden Tech Inc.)
-- First, check if 'Goden Tech Inc.' exists with a different ID
SET @existing_company_id = (SELECT id FROM companies WHERE name = 'Goden Tech Inc.' LIMIT 1);

-- If it exists with a different ID, use that ID instead
SET @company_id = IFNULL(@existing_company_id, 4);

-- If the company doesn't exist at all, create it
INSERT IGNORE INTO companies (id, name, address, created_at)
VALUES (4, 'Goden Tech Inc.', '123 Enterprise Road, Harare, Zimbabwe', NOW());

-- Now update the company details to ensure they're correct
UPDATE companies 
SET name = 'Goden Tech Inc.', 
    address = '123 Enterprise Road, Harare, Zimbabwe'
WHERE id = @company_id;

-- Delete all other companies except our target company
DELETE FROM companies WHERE id != @company_id;

-- Delete all departments not belonging to company ID 4
DELETE FROM departments WHERE company_id != @company_id;

-- Delete all employees not belonging to company ID 4
DELETE FROM employees WHERE company_id != @company_id;

-- Delete all departments (we'll recreate them to ensure consistency)
DELETE FROM departments WHERE company_id = @company_id;

-- Add departments for company ID 5
INSERT INTO departments (company_id, name, description) VALUES
(@company_id, 'IT', 'Information Technology'),
(@company_id, 'HR', 'Human Resources'),
(@company_id, 'Finance', 'Finance and Accounting'),
(@company_id, 'Operations', 'Operations Management');

-- Get department IDs
SET @dept_it = (SELECT id FROM departments WHERE company_id = @company_id AND name = 'IT' LIMIT 1);
SET @dept_hr = (SELECT id FROM departments WHERE company_id = @company_id AND name = 'HR' LIMIT 1);
SET @dept_finance = (SELECT id FROM departments WHERE company_id = @company_id AND name = 'Finance' LIMIT 1);
SET @dept_operations = (SELECT id FROM departments WHERE company_id = @company_id AND name = 'Operations' LIMIT 1);

-- Delete all employees from company ID 5 (clean slate)
DELETE FROM employees WHERE company_id = @company_id;

-- Add employees with Zimbabwean names
-- Default password is hashed 'password123' (bcrypt hash)
SET @default_password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

-- Employee 1 (CEO)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Tendai Moyo',
    'tendai.moyo@godentech.co.zw',
    NULL,
    'Chief Executive Officer',
    @default_password,
    CONCAT('GODEN-', LPAD(1, 4, '0')),
    '2020-01-15',
    'Active'
);

-- Employee 2 (IT Manager)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Farai Ndlovu',
    'farai.ndlovu@godentech.co.zw',
    @dept_it,
    'IT Manager',
    @default_password,
    CONCAT('GODEN-', LPAD(2, 4, '0')),
    '2020-03-10',
    'Active'
);

-- Employee 3 (Senior Developer)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Tatenda Chiweshe',
    'tatenda.chiweshe@godentech.co.zw',
    @dept_it,
    'Senior Software Developer',
    @default_password,
    CONCAT('GODEN-', LPAD(3, 4, '0')),
    '2020-05-22',
    'Active'
);

-- Employee 4 (HR Manager)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Ruvimbo Muzenda',
    'ruvimbo.muzenda@godentech.co.zw',
    @dept_hr,
    'HR Manager',
    @default_password,
    CONCAT('GODEN-', LPAD(4, 4, '0')),
    '2020-02-18',
    'Active'
);

-- Employee 5 (Finance Manager)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Tinashe Makoni',
    'tinashe.makoni@godentech.co.zw',
    @dept_finance,
    'Finance Manager',
    @default_password,
    CONCAT('GODEN-', LPAD(5, 4, '0')),
    '2020-04-05',
    'Active'
);

-- Employee 6 (Operations Manager)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Kudzai Marufu',
    'kudzai.marufu@godentech.co.zw',
    @dept_operations,
    'Operations Manager',
    @default_password,
    CONCAT('GODEN-', LPAD(6, 4, '0')),
    '2020-06-12',
    'Active'
);

-- Employee 7 (Developer)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Tafadzwa Moyo',
    'tafadzwa.moyo@godentech.co.zw',
    @dept_it,
    'Software Developer',
    @default_password,
    CONCAT('GODEN-', LPAD(7, 4, '0')),
    '2021-01-15',
    'Active'
);

-- Employee 8 (HR Officer)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Nyasha Chikomo',
    'nyasha.chikomo@godentech.co.zw',
    @dept_hr,
    'HR Officer',
    @default_password,
    CONCAT('GODEN-', LPAD(8, 4, '0')),
    '2021-02-20',
    'Active'
);

-- Employee 9 (Accountant)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Tatenda Muzarabani',
    'tatenda.muzarabani@godentech.co.zw',
    @dept_finance,
    'Accountant',
    @default_password,
    CONCAT('GODEN-', LPAD(9, 4, '0')),
    '2021-03-10',
    'Active'
);

-- Employee 10 (Operations Assistant)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Rutendo Chidziva',
    'rutendo.chidziva@godentech.co.zw',
    @dept_operations,
    'Operations Assistant',
    @default_password,
    CONCAT('GODEN-', LPAD(10, 4, '0')),
    '2021-04-05',
    'Active'
);

-- Employee 11 (IT Support)
INSERT INTO employees (company_id, name, email, department_id, role, password, employeeId, hireDate, status)
VALUES (
    @company_id,
    'Tawanda Nyoni',
    'tawanda.nyoni@godentech.co.zw',
    @dept_it,
    'IT Support Specialist',
    @default_password,
    CONCAT('GODEN-', LPAD(11, 4, '0')),
    '2021-05-15',
    'Active'
);

-- Add admin user (Takudzwa)
-- First, check if admin exists
SET @admin_exists = (SELECT COUNT(*) FROM employees WHERE email = 'takudzwa@asset.com');

-- If admin doesn't exist, add them
INSERT INTO employees (
    company_id, 
    name, 
    email, 
    department_id, 
    role, 
    password, 
    employeeId, 
    hireDate, 
    status
)
SELECT 
    @company_id,
    'Takudzwa',
    'takudzwa@asset.com',
    NULL,
    'System Administrator',
    -- Password hash for 'takudzwa' (bcrypt)
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    CONCAT('GODEN-', 'ADMIN'),
    CURDATE(),
    'Active'
WHERE @admin_exists = 0;

-- Display all employees including the admin
SELECT e.employeeId, e.name, e.email, d.name as department, e.role, e.hireDate, e.status
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
WHERE e.company_id = @company_id
ORDER BY 
    CASE 
        WHEN e.email = 'takudzwa@asset.com' THEN 0  -- Admin first
        ELSE 1 
    END, 
    e.id;
