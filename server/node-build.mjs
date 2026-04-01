import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
async function migrateUsers() {
  try {
    const usersPath = path.join(process.cwd(), "data", "users.json");
    if (!fs.existsSync(usersPath)) {
      console.log("⏭️  No users.json file found, skipping users migration");
      return;
    }
    const data = fs.readFileSync(usersPath, "utf-8");
    const users = JSON.parse(data);
    if (users.length === 0) {
      console.log("⏭️  No users to migrate");
      return;
    }
    const pool2 = await getPool();
    for (const user of users) {
      try {
        await pool2.execute(
          `INSERT INTO users (email, password, fullName, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE email=email`,
          [
            user.email,
            user.password,
            user.name || user.fullName || "Unknown",
            user.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
            user.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
          ]
        );
      } catch (error) {
        if (!error.message.includes("Duplicate entry")) {
          console.error(`Error migrating user ${user.email}:`, error.message);
        }
      }
    }
    console.log(`✅ Migrated ${users.length} users successfully`);
  } catch (error) {
    console.error("Error during users migration:", error);
  }
}
async function migratePayments() {
  try {
    const paymentsPath = path.join(process.cwd(), "data", "payments.json");
    if (!fs.existsSync(paymentsPath)) {
      console.log("⏭️  No payments.json file found, skipping payments migration");
      return;
    }
    const data = fs.readFileSync(paymentsPath, "utf-8");
    const payments = JSON.parse(data);
    if (payments.length === 0) {
      console.log("⏭️  No payments to migrate");
      return;
    }
    const pool2 = await getPool();
    for (const payment of payments) {
      try {
        await pool2.execute(
          `INSERT INTO payments (email, service, amount, paymentId, status, qrCodeUrl, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE email=email`,
          [
            payment.email,
            payment.service || payment.package || "Unknown Service",
            payment.amount,
            payment.id,
            payment.status || "pending",
            payment.qrCodeUrl || null,
            payment.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
            payment.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
          ]
        );
      } catch (error) {
        if (!error.message.includes("Duplicate entry")) {
          console.error(`Error migrating payment ${payment.id}:`, error.message);
        }
      }
    }
    console.log(`✅ Migrated ${payments.length} payments successfully`);
  } catch (error) {
    console.error("Error during payments migration:", error);
  }
}
async function migrateContacts() {
  try {
    const contactsPath = path.join(process.cwd(), "data", "contacts.json");
    if (!fs.existsSync(contactsPath)) {
      console.log("⏭️  No contacts.json file found, skipping contacts migration");
      return;
    }
    const data = fs.readFileSync(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    if (contacts.length === 0) {
      console.log("⏭️  No contacts to migrate");
      return;
    }
    const pool2 = await getPool();
    for (const contact of contacts) {
      try {
        await pool2.execute(
          `INSERT INTO contacts (name, email, topic, subject, description, status, notes, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            contact.name,
            contact.email,
            contact.topic,
            contact.subject,
            contact.description,
            contact.status || "new",
            contact.notes || "",
            contact.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
            contact.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
          ]
        );
      } catch (error) {
        console.error(`Error migrating contact ${contact.id}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${contacts.length} contacts successfully`);
  } catch (error) {
    console.error("Error during contacts migration:", error);
  }
}
async function runMigrations() {
  console.log("🔄 Starting data migration from JSON to MySQL...");
  console.log("");
  try {
    await migrateUsers();
    await migratePayments();
    await migrateContacts();
    console.log("");
    console.log("✅ All migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}
dotenv.config();
let pool = null;
async function getPool() {
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
    keepAliveInitialDelayMs: 0
  });
  return pool;
}
async function initializeDatabase() {
  const pool2 = await getPool();
  try {
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
    const statements = createTablesSQL.split(";").map((stmt) => stmt.trim()).filter((stmt) => stmt && !stmt.startsWith("--"));
    for (const statement of statements) {
      try {
        await pool2.execute(statement);
        console.log("✅ Executed:", statement.substring(0, 50) + "...");
      } catch (error) {
        if (!error.message.includes("already exists")) {
          console.error("❌ Error executing statement:", error.message);
        }
      }
    }
    console.log("✅ Database initialized successfully!");
    console.log("");
    await runMigrations();
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
}
async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const handleCreatePayment = async (req, res) => {
  try {
    const { email, service, amount, qrCodeUrl, paymentId, status = "pending" } = req.body;
    if (!email || !service || !amount) {
      res.status(400).json({ error: "Missing required fields: email, service, amount" });
      return;
    }
    const pool2 = await getPool();
    const id = paymentId || crypto.randomBytes(8).toString("hex");
    const query = `
      INSERT INTO payments (email, service, amount, paymentId, status, qrCodeUrl)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool2.execute(query, [
      email,
      service,
      parseFloat(amount),
      id,
      status,
      qrCodeUrl || null
    ]);
    res.status(201).json({
      success: true,
      paymentId: id,
      message: "Payment created successfully",
      payment: {
        id,
        email,
        service,
        amount,
        status,
        qrCodeUrl,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleGetPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const pool2 = await getPool();
    const query = "SELECT * FROM payments WHERE paymentId = ?";
    const [rows] = await pool2.execute(query, [id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }
    res.json({
      success: true,
      payment: rows[0]
    });
  } catch (error) {
    console.error("Payment retrieval error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleGetAllPayments = async (req, res) => {
  try {
    const pool2 = await getPool();
    const query = "SELECT * FROM payments ORDER BY createdAt DESC";
    const [rows] = await pool2.execute(query);
    res.json({
      success: true,
      count: Array.isArray(rows) ? rows.length : 0,
      payments: Array.isArray(rows) ? rows : []
    });
  } catch (error) {
    console.error("Payments retrieval error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleUpdatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }
    const pool2 = await getPool();
    const [checkRows] = await pool2.execute(
      "SELECT * FROM payments WHERE paymentId = ?",
      [id]
    );
    if (!Array.isArray(checkRows) || checkRows.length === 0) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }
    const query = "UPDATE payments SET status = ?, updatedAt = NOW() WHERE paymentId = ?";
    await pool2.execute(query, [status, id]);
    const [updatedRows] = await pool2.execute(
      "SELECT * FROM payments WHERE paymentId = ?",
      [id]
    );
    res.json({
      success: true,
      message: "Payment updated successfully",
      payment: Array.isArray(updatedRows) ? updatedRows[0] : null
    });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleCreateContact = async (req, res) => {
  try {
    const { name, email, topic, subject, description } = req.body;
    if (!name || !email || !topic || !subject || !description) {
      res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email format"
      });
      return;
    }
    const pool2 = await getPool();
    const query = `
      INSERT INTO contacts (name, email, topic, subject, description, status, notes)
      VALUES (?, ?, ?, ?, ?, 'new', '')
    `;
    const [result] = await pool2.execute(query, [name, email, topic, subject, description]);
    const id = result.insertId;
    res.status(201).json({
      success: true,
      message: "Your message has been received. We'll get back to you soon!",
      contactId: id,
      contact: {
        id,
        name,
        email,
        topic,
        subject,
        description,
        status: "new",
        notes: "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (error) {
    console.error("Contact creation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
const handleGetContact = async (req, res) => {
  try {
    const { id } = req.params;
    const pool2 = await getPool();
    const query = "SELECT * FROM contacts WHERE id = ?";
    const [rows] = await pool2.execute(query, [id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Contact not found"
      });
      return;
    }
    res.json({
      success: true,
      contact: rows[0]
    });
  } catch (error) {
    console.error("Contact retrieval error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
const handleGetAllContacts = async (req, res) => {
  try {
    const pool2 = await getPool();
    const { status } = req.query;
    let query = "SELECT * FROM contacts";
    const params = [];
    if (status && typeof status === "string") {
      query += " WHERE status = ?";
      params.push(status.toLowerCase());
    }
    query += " ORDER BY createdAt DESC";
    const [allRows] = await pool2.execute("SELECT COUNT(*) as total FROM contacts");
    const [rows] = await pool2.execute(query, params);
    const total = Array.isArray(allRows) ? allRows[0].total : 0;
    res.json({
      success: true,
      count: Array.isArray(rows) ? rows.length : 0,
      total,
      contacts: Array.isArray(rows) ? rows : []
    });
  } catch (error) {
    console.error("Contacts retrieval error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
const handleUpdateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const pool2 = await getPool();
    const [checkRows] = await pool2.execute("SELECT * FROM contacts WHERE id = ?", [id]);
    if (!Array.isArray(checkRows) || checkRows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Contact not found"
      });
      return;
    }
    const updates = [];
    const values = [];
    if (status !== void 0) {
      updates.push("status = ?");
      values.push(status);
    }
    if (notes !== void 0) {
      updates.push("notes = ?");
      values.push(notes);
    }
    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        error: "No fields to update"
      });
      return;
    }
    updates.push("updatedAt = NOW()");
    values.push(id);
    const query = `UPDATE contacts SET ${updates.join(", ")} WHERE id = ?`;
    await pool2.execute(query, values);
    const [updatedRows] = await pool2.execute("SELECT * FROM contacts WHERE id = ?", [id]);
    res.json({
      success: true,
      message: "Contact updated successfully",
      contact: Array.isArray(updatedRows) ? updatedRows[0] : null
    });
  } catch (error) {
    console.error("Contact update error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
const handleDeleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const pool2 = await getPool();
    const [checkRows] = await pool2.execute("SELECT * FROM contacts WHERE id = ?", [id]);
    if (!Array.isArray(checkRows) || checkRows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Contact not found"
      });
      return;
    }
    const deletedContact = checkRows[0];
    await pool2.execute("DELETE FROM contacts WHERE id = ?", [id]);
    res.json({
      success: true,
      message: "Contact deleted successfully",
      contact: deletedContact
    });
  } catch (error) {
    console.error("Contact deletion error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
const handleGetContactStats = async (req, res) => {
  try {
    const pool2 = await getPool();
    const [statusRows] = await pool2.execute(
      "SELECT status, COUNT(*) as count FROM contacts GROUP BY status"
    );
    const stats = {
      total: 0,
      new: 0,
      inProgress: 0,
      resolved: 0
    };
    if (Array.isArray(statusRows)) {
      for (const row of statusRows) {
        const statusRow = row;
        const count = statusRow.count || 0;
        stats.total += count;
        if (statusRow.status === "new") stats.new = count;
        else if (statusRow.status === "in_progress") stats.inProgress = count;
        else if (statusRow.status === "resolved") stats.resolved = count;
      }
    }
    const [topicRows] = await pool2.execute(
      "SELECT topic, COUNT(*) as count FROM contacts GROUP BY topic"
    );
    const topicBreakdown = {};
    if (Array.isArray(topicRows)) {
      for (const row of topicRows) {
        const topicRow = row;
        topicBreakdown[topicRow.topic] = topicRow.count || 0;
      }
    }
    res.json({
      success: true,
      stats: {
        ...stats,
        topicBreakdown
      }
    });
  } catch (error) {
    console.error("Stats retrieval error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
const DEMO_ACCOUNT = {
  id: 1,
  name: "Tester Account",
  email: "tester@dzakcloud.com",
  password: "Tester123!",
  createdAt: (/* @__PURE__ */ new Date()).toISOString()
};
const generateToken = () => {
  return `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};
const handleRegisterWithFallback = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
      return;
    }
    try {
      const pool2 = await getPool();
      const [existingUsers] = await pool2.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        res.status(409).json({
          success: false,
          message: "Email already registered"
        });
        return;
      }
      const query = `
        INSERT INTO users (email, password, fullName)
        VALUES (?, ?, ?)
      `;
      const [result] = await pool2.execute(query, [email, password, name]);
      const userId = result.insertId;
      const token = generateToken();
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        token,
        user: {
          id: userId,
          name,
          email,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    } catch (dbError) {
      console.warn("⚠️ Database unavailable, using demo mode for registration");
      if (email === DEMO_ACCOUNT.email) {
        res.status(409).json({
          success: false,
          message: "Email already registered"
        });
        return;
      }
      const token = generateToken();
      res.status(201).json({
        success: true,
        message: "Account created successfully (Demo Mode)",
        token,
        user: {
          id: Date.now(),
          name,
          email,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const handleLoginWithFallback = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login attempt:", { email, hasPassword: !!password });
    if (!email || !password) {
      console.log("❌ Missing email or password");
      res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
      return;
    }
    let dbSuccess = false;
    try {
      const pool2 = await getPool();
      const [rows] = await pool2.execute("SELECT * FROM users WHERE email = ?", [email]);
      if (Array.isArray(rows) && rows.length > 0) {
        const user = rows[0];
        if (password === user.password) {
          console.log("✅ Login successful from database");
          const token = generateToken();
          res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
              id: user.id,
              name: user.fullName,
              email: user.email,
              createdAt: user.createdAt
            }
          });
          return;
        }
      }
    } catch (dbError) {
      console.warn("⚠️ Database error, falling back to demo mode", dbError);
    }
    console.log("🎭 Using demo mode for login");
    if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
      console.log("✅ Login successful in demo mode");
      const token = generateToken();
      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: DEMO_ACCOUNT.id,
          name: DEMO_ACCOUNT.name,
          email: DEMO_ACCOUNT.email,
          createdAt: DEMO_ACCOUNT.createdAt
        }
      });
      return;
    }
    console.log("❌ Invalid credentials");
    res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const handleGetProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }
    const userId = req.userId;
    try {
      const pool2 = await getPool();
      const [rows] = await pool2.execute("SELECT * FROM users WHERE id = ?", [userId]);
      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found"
        });
        return;
      }
      const user = rows[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (dbError) {
      res.json({
        success: true,
        user: {
          id: DEMO_ACCOUNT.id,
          name: DEMO_ACCOUNT.name,
          email: DEMO_ACCOUNT.email,
          createdAt: DEMO_ACCOUNT.createdAt
        }
      });
    }
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const handleUpdateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }
    const { name, email } = req.body;
    const userId = req.userId;
    try {
      const pool2 = await getPool();
      const [userRows] = await pool2.execute("SELECT * FROM users WHERE id = ?", [userId]);
      if (!Array.isArray(userRows) || userRows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found"
        });
        return;
      }
      const user = userRows[0];
      if (email && email !== user.email) {
        const [existingEmail] = await pool2.execute(
          "SELECT * FROM users WHERE email = ? AND id != ?",
          [email, userId]
        );
        if (Array.isArray(existingEmail) && existingEmail.length > 0) {
          res.status(409).json({
            success: false,
            message: "Email already in use"
          });
          return;
        }
      }
      const updates = [];
      const values = [];
      if (name) {
        updates.push("fullName = ?");
        values.push(name);
      }
      if (email) {
        updates.push("email = ?");
        values.push(email);
      }
      if (updates.length === 0) {
        res.status(400).json({
          success: false,
          message: "No fields to update"
        });
        return;
      }
      values.push(userId);
      const query = `UPDATE users SET ${updates.join(", ")}, updatedAt = NOW() WHERE id = ?`;
      await pool2.execute(query, values);
      const [updatedRows] = await pool2.execute("SELECT * FROM users WHERE id = ?", [userId]);
      const updatedUser = Array.isArray(updatedRows) ? updatedRows[0] : null;
      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser?.id,
          name: updatedUser?.fullName,
          email: updatedUser?.email,
          createdAt: updatedUser?.createdAt
        }
      });
    } catch (dbError) {
      res.json({
        success: true,
        message: "Profile updated successfully (Demo Mode)",
        user: {
          id: DEMO_ACCOUNT.id,
          name: name || DEMO_ACCOUNT.name,
          email: email || DEMO_ACCOUNT.email,
          createdAt: DEMO_ACCOUNT.createdAt
        }
      });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const handleLogout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
async function createServer() {
  try {
    await initializeDatabase();
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
  }
  const app = express__default();
  app.use(cors());
  app.use(express__default.json());
  app.use(express__default.urlencoded({ extended: true }));
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);
  app.post("/api/payment", handleCreatePayment);
  app.get("/api/payment/:id", handleGetPayment);
  app.get("/api/payments", handleGetAllPayments);
  app.patch("/api/payment/:id", handleUpdatePayment);
  app.post("/api/contact", handleCreateContact);
  app.get("/api/contact/:id", handleGetContact);
  app.get("/api/contacts", handleGetAllContacts);
  app.patch("/api/contact/:id", handleUpdateContact);
  app.delete("/api/contact/:id", handleDeleteContact);
  app.get("/api/contacts/stats", handleGetContactStats);
  app.post("/api/auth/register", handleRegisterWithFallback);
  app.post("/api/auth/login", handleLoginWithFallback);
  app.get("/api/auth/profile", handleGetProfile);
  app.patch("/api/auth/profile", handleUpdateProfile);
  app.post("/api/auth/logout", handleLogout);
  return app;
}
const port = process.env.PORT || 3e3;
(async () => {
  const app = await createServer();
  const __dirname = import.meta.dirname;
  const distPath = path.join(__dirname, "../spa");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
  app.listen(port, () => {
    console.log(`🚀 Fusion Starter server running on port ${port}`);
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
  });
  process.on("SIGTERM", async () => {
    console.log("🛑 Received SIGTERM, shutting down gracefully");
    await closeDatabase();
    process.exit(0);
  });
  process.on("SIGINT", async () => {
    console.log("🛑 Received SIGINT, shutting down gracefully");
    await closeDatabase();
    process.exit(0);
  });
})();
//# sourceMappingURL=node-build.mjs.map
