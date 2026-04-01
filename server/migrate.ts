import { getPool } from "./db";
import fs from "fs";
import path from "path";

interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Payment {
  id: string;
  email: string;
  package?: string;
  service?: string;
  amount: number;
  status?: string;
  qrCodeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  topic: string;
  subject: string;
  description: string;
  status?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

async function migrateUsers() {
  try {
    const usersPath = path.join(process.cwd(), "data", "users.json");

    if (!fs.existsSync(usersPath)) {
      console.log("⏭️  No users.json file found, skipping users migration");
      return;
    }

    const data = fs.readFileSync(usersPath, "utf-8");
    const users: User[] = JSON.parse(data);

    if (users.length === 0) {
      console.log("⏭️  No users to migrate");
      return;
    }

    const pool = await getPool();

    for (const user of users) {
      try {
        await pool.execute(
          `INSERT INTO users (email, password, fullName, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE email=email`,
          [
            user.email,
            user.password,
            user.name || user.fullName || "Unknown",
            user.createdAt || new Date().toISOString(),
            user.updatedAt || new Date().toISOString(),
          ]
        );
      } catch (error: any) {
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
    const payments: Payment[] = JSON.parse(data);

    if (payments.length === 0) {
      console.log("⏭️  No payments to migrate");
      return;
    }

    const pool = await getPool();

    for (const payment of payments) {
      try {
        await pool.execute(
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
            payment.createdAt || new Date().toISOString(),
            payment.updatedAt || new Date().toISOString(),
          ]
        );
      } catch (error: any) {
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
    const contacts: Contact[] = JSON.parse(data);

    if (contacts.length === 0) {
      console.log("⏭️  No contacts to migrate");
      return;
    }

    const pool = await getPool();

    for (const contact of contacts) {
      try {
        await pool.execute(
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
            contact.createdAt || new Date().toISOString(),
            contact.updatedAt || new Date().toISOString(),
          ]
        );
      } catch (error: any) {
        console.error(`Error migrating contact ${contact.id}:`, error.message);
      }
    }

    console.log(`✅ Migrated ${contacts.length} contacts successfully`);
  } catch (error) {
    console.error("Error during contacts migration:", error);
  }
}

export async function runMigrations() {
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
