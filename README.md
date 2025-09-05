# Asset Management System

This is a comprehensive Asset Management System built with Next.js and Firebase. It provides a full suite of tools for tracking, managing, and auditing company assets and employees in a modern, easy-to-use interface. The application features AI-powered assistance to streamline workflows and a responsive design that works on any device.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Generative AI:** [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Charts & Visualization:** [Recharts](https://recharts.org/)

## Features

### 1. Authentication & Security
- **Admin Login:** A secure login page at `/login` protects the administrative section.
- **Middleware-Based Route Protection:** The `middleware.ts` file ensures that only authenticated users can access `/admin` routes.
- **Session Management:** A simple cookie-based session is used to track logged-in users.

### 2. Admin Dashboard (`/admin/dashboard`)
A central hub providing a high-level overview of the system's status.
- **Dynamic Charts:** Visualizes asset distribution by status (e.g., Available, Checked Out) and by type (e.g., Laptop, Monitor).
- **Statistic Cards:** At-a-glance metrics for total assets, active employees, and pending returns.
- **Recent Transactions:** A live feed showing the latest asset check-ins and check-outs.

### 3. Comprehensive Asset Management
- **Asset Inventory (`/admin/assets`):**
  - A searchable and filterable table of all assets.
  - Displays key information like name, type, status, serial number, and purchase date.
- **Asset Registration (`/admin/assets/register`):**
  - A user-friendly form to add new assets to the inventory.
  - **AI-Powered Suggestions:** An integrated AI tool suggests asset properties (like manufacturer or type) based on the asset name, speeding up data entry.
- **Edit and Delete Workflows:** Fully implemented UI modals for editing asset details and confirming deletions.
- **QR Code Label Generator (`/admin/assets/labels`):**
  - Select multiple assets from the inventory list to generate printable QR code labels.
  - The generated page is optimized for printing.

### 4. Employee Directory (`/admin/employees`)
- A complete list of all employees, with their role, department, and current status.
- Includes a search bar to quickly find employees.
- Features "Add Employee" and "Edit Employee" modals with a complete UI.

### 5. Scanning & Transactions
- **Card Scanner (`/` and `/admin/check-in-out`):** A dedicated, full-screen interface designed for kiosk-style ID card scanning to quickly check items in or out.
- **QR Code Scanner (`/admin/qr-scan`):**
  - A page for scanning asset QR codes to record transactions.
  - Includes a fallback manual entry form.

## Running the Application Locally

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
To start the application in development mode, run the following command:
```bash
npm run dev
```
The application will be available at `http://localhost:9002`.

The Genkit AI flows can be tested and run separately using the Genkit developer UI:
```bash
npm run genkit:dev
```
This will start the Genkit development server, typically on port `3100`.
