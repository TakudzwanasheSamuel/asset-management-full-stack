# Prompt for AI Backend Generation

**Objective:** Create the backend for a Next.js Asset Management System using a MySQL database. Implement API routes for all CRUD (Create, Read, Update, Delete) operations for assets, employees, and transactions.

---

### 1. Technology Stack & Setup

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Database:** MySQL
*   **Database ORM/Client:** Use a library like `mysql2` or `drizzle-orm` to interact with the database. Create a database utility file (e.g., `src/lib/db.ts`) to manage the database connection.
*   **Environment Variables:** All database credentials (host, user, password, database name) must be stored in the `.env` file.

---

### 2. API Route Structure

Create the following API routes within the `src/app/api/` directory. Each route should handle the specified HTTP methods and logic.

#### **Assets (`/api/assets`)**

*   **`GET /api/assets`**:
    *   Fetch a list of all assets from the `assets` table.
    *   Accept optional query parameters for searching (`?search=...`) and filtering (`?status=...`).
    *   Return a JSON array of assets.

*   **`POST /api/assets`**:
    *   Create a new asset.
    *   Accept a JSON body with the new asset's data (name, type, serialNumber, etc.).
    *   Insert the new record into the `assets` table.
    *   Return the newly created asset object with its database-assigned ID.

*   **`PUT /api/assets/[id]`**:
    *   Update an existing asset by its ID.
    *   Accept a JSON body with the fields to update.
    *   Update the corresponding record in the `assets` table.
    *   Return the updated asset object.

*   **`DELETE /api/assets/[id]`**:
    *   Delete an asset by its ID.
    *   Remove the record from the `assets` table.
    *   Return a success message with a 200 status code.

#### **Employees (`/api/employees`)**

*   **`GET /api/employees`**:
    *   Fetch a list of all employees from the `employees` table.
    *   Accept an optional `?search=...` query parameter to filter by name or role.
    *   Return a JSON array of employees.

*   **`POST /api/employees`**:
    *   Create a new employee.
    *   Accept a JSON body with the new employee's data.
    *   Insert the new record into the `employees` table.
    *   Return the newly created employee object.

*   **`PUT /api/employees/[id]`**:
    *   Update an existing employee by their ID.
    *   Accept a JSON body with the fields to update.
    *   Update the corresponding record in the `employees` table.
    *   Return the updated employee object.

*   **`DELETE /api/employees/[id]`**:
    *   Delete an employee by their ID.
    *   Remove the record from the `employees` table.
    *   Return a success message.

#### **Transactions (`/api/transactions`)**

*   **`GET /api/transactions`**:
    *   Fetch a list of the 10 most recent transactions.
    *   Join with the `assets` and `employees` tables to include asset and employee names.
    *   Return a JSON array of transactions.

*   **`POST /api/transactions`**:
    *   Create a new transaction (a check-in or check-out).
    *   Accept a JSON body containing `assetId`, `employeeId`, `type`, and `notes`.
    *   When a transaction is created, **the status of the corresponding asset in the `assets` table must be updated** (e.g., to 'Checked Out' or 'Available').
    *   Return the newly created transaction object.

---

### 3. Authentication

*   **`POST /api/login`**:
    *   This route already exists but needs modification.
    *   Instead of being a mock, it should query the `employees` table (or a dedicated `users` table) for a user matching the provided email and password.
    *   Use a secure method for password verification (e.g., `bcrypt`).
    *   If credentials are valid, return a JWT (JSON Web Token) in the session cookie instead of a simple string.

*   **Middleware (`middleware.ts`):**
    *   Update the middleware to verify the JWT from the session cookie on all `/admin/*` routes.
    *   If the JWT is invalid or expired, redirect to the `/login` page.

---

### 4. Implementation Details

*   Ensure all API routes handle potential errors gracefully (e.g., database errors, item not found) and return appropriate HTTP status codes (e.g., 404 for not found, 500 for server error).
*   Use TypeScript for all backend logic and define types for API request bodies and responses.
