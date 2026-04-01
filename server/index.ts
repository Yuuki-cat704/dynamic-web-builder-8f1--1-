import "dotenv/config";
import express from "express";
import cors from "cors";
import { initializeDatabase } from "./db";
import { handleDemo } from "./routes/demo";
import {
  handleCreatePayment,
  handleGetPayment,
  handleGetAllPayments,
  handleUpdatePayment,
} from "./routes/payment";
import {
  handleCreateContact,
  handleGetContact,
  handleGetAllContacts,
  handleUpdateContact,
  handleDeleteContact,
  handleGetContactStats,
} from "./routes/contact";
import {
  handleRegisterWithFallback,
  handleLoginWithFallback,
  handleGetProfile,
  handleUpdateProfile,
  handleLogout,
} from "./routes/auth-demo";

export async function createServer() {
  // Initialize database
  try {
    await initializeDatabase();
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
  }
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Payment API routes
  app.post("/api/payment", handleCreatePayment);
  app.get("/api/payment/:id", handleGetPayment);
  app.get("/api/payments", handleGetAllPayments);
  app.patch("/api/payment/:id", handleUpdatePayment);

  // Contact API routes
  app.post("/api/contact", handleCreateContact);
  app.get("/api/contact/:id", handleGetContact);
  app.get("/api/contacts", handleGetAllContacts);
  app.patch("/api/contact/:id", handleUpdateContact);
  app.delete("/api/contact/:id", handleDeleteContact);
  app.get("/api/contacts/stats", handleGetContactStats);

  // Auth API routes (with fallback/demo mode)
  app.post("/api/auth/register", handleRegisterWithFallback);
  app.post("/api/auth/login", handleLoginWithFallback);
  app.get("/api/auth/profile", handleGetProfile);
  app.patch("/api/auth/profile", handleUpdateProfile);
  app.post("/api/auth/logout", handleLogout);

  return app;
}
