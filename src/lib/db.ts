import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Ensure that the environment variables are loaded correctly
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
  console.error("Database environment variables are not set. Please create a .env file with DB_HOST, DB_USER, DB_PASSWORD, and DB_DATABASE.");
  // process.exit(1); // This would stop the execution if run in a node environment. In Next.js, it will likely just log the error.
}


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
