import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { runMigrations } from "./migrate";

dotenv.config();

let pool: mysql.Pool | null = null;

export async function getPool(): Promise<mysql.Pool> {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "dzakcloud",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0,
  });

  return pool;
}

export async function initializeDatabase(): Promise<void> {
  const pool = await getPool();

  try {
    // Create tables
    const createTablesSQL = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Payments table
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        email VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'IDR',
        service VARCHAR(255) NOT NULL,
        paymentId VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        qrCodeUrl LONGTEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Contacts table
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description LONGTEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        notes LONGTEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Create indexes for better query performance
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_payments_userId ON payments(userId);
      CREATE INDEX idx_payments_status ON payments(status);
      CREATE INDEX idx_contacts_status ON contacts(status);
    `;

    // Execute each CREATE TABLE statement separately
    const statements = createTablesSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.startsWith("--"));

    for (const statement of statements) {
      try {
        await pool.execute(statement);
        console.log("✅ Executed:", statement.substring(0, 50) + "...");
      } catch (error: any) {
        // Ignore "already exists" errors
        if (!error.message.includes("already exists")) {
          console.error("❌ Error executing statement:", error.message);
        }
      }
    }

    console.log("✅ Database initialized successfully!");

    // Run migrations after tables are created
    console.log("");
    await runMigrations();
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
