import { RequestHandler } from "express";
import { getPool } from "../db";
import crypto from "crypto";

export const handleCreatePayment: RequestHandler = async (req, res) => {
  try {
    const { email, service, amount, qrCodeUrl, paymentId, status = "pending" } = req.body;

    if (!email || !service || !amount) {
      res.status(400).json({ error: "Missing required fields: email, service, amount" });
      return;
    }

    const pool = await getPool();
    const id = paymentId || crypto.randomBytes(8).toString("hex");

    const query = `
      INSERT INTO payments (email, service, amount, paymentId, status, qrCodeUrl)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      email,
      service,
      parseFloat(amount),
      id,
      status,
      qrCodeUrl || null,
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
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetPayment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getPool();
    const query = "SELECT * FROM payments WHERE paymentId = ?";
    const [rows] = await pool.execute(query, [id]);

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    res.json({
      success: true,
      payment: rows[0],
    });
  } catch (error) {
    console.error("Payment retrieval error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetAllPayments: RequestHandler = async (req, res) => {
  try {
    const pool = await getPool();
    const query = "SELECT * FROM payments ORDER BY createdAt DESC";
    const [rows] = await pool.execute(query);

    res.json({
      success: true,
      count: Array.isArray(rows) ? rows.length : 0,
      payments: Array.isArray(rows) ? rows : [],
    });
  } catch (error) {
    console.error("Payments retrieval error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleUpdatePayment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }

    const pool = await getPool();

    // Check if payment exists
    const [checkRows] = await pool.execute(
      "SELECT * FROM payments WHERE paymentId = ?",
      [id]
    );

    if (!Array.isArray(checkRows) || checkRows.length === 0) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    // Update payment
    const query = "UPDATE payments SET status = ?, updatedAt = NOW() WHERE paymentId = ?";
    await pool.execute(query, [status, id]);

    const [updatedRows] = await pool.execute(
      "SELECT * FROM payments WHERE paymentId = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Payment updated successfully",
      payment: Array.isArray(updatedRows) ? updatedRows[0] : null,
    });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
