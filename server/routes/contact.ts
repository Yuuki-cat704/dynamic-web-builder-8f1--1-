import { RequestHandler } from "express";
import { getPool } from "../db";

export const handleCreateContact: RequestHandler = async (req, res) => {
  try {
    const { name, email, topic, subject, description } = req.body;

    // Validate required fields
    if (!name || !email || !topic || !subject || !description) {
      res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
      return;
    }

    const pool = await getPool();
    const query = `
      INSERT INTO contacts (name, email, topic, subject, description, status, notes)
      VALUES (?, ?, ?, ?, ?, 'new', '')
    `;

    const [result] = await pool.execute(query, [name, email, topic, subject, description]);

    const id = (result as any).insertId;

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Contact creation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleGetContact: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getPool();
    const query = "SELECT * FROM contacts WHERE id = ?";
    const [rows] = await pool.execute(query, [id]);

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Contact not found",
      });
      return;
    }

    res.json({
      success: true,
      contact: rows[0],
    });
  } catch (error) {
    console.error("Contact retrieval error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleGetAllContacts: RequestHandler = async (req, res) => {
  try {
    const pool = await getPool();
    const { status } = req.query;

    let query = "SELECT * FROM contacts";
    const params: any[] = [];

    if (status && typeof status === "string") {
      query += " WHERE status = ?";
      params.push(status.toLowerCase());
    }

    query += " ORDER BY createdAt DESC";

    const [allRows] = await pool.execute("SELECT COUNT(*) as total FROM contacts");
    const [rows] = await pool.execute(query, params);

    const total = Array.isArray(allRows) ? (allRows[0] as any).total : 0;

    res.json({
      success: true,
      count: Array.isArray(rows) ? rows.length : 0,
      total,
      contacts: Array.isArray(rows) ? rows : [],
    });
  } catch (error) {
    console.error("Contacts retrieval error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleUpdateContact: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const pool = await getPool();

    // Check if contact exists
    const [checkRows] = await pool.execute("SELECT * FROM contacts WHERE id = ?", [id]);

    if (!Array.isArray(checkRows) || checkRows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Contact not found",
      });
      return;
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push("notes = ?");
      values.push(notes);
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        error: "No fields to update",
      });
      return;
    }

    updates.push("updatedAt = NOW()");
    values.push(id);

    const query = `UPDATE contacts SET ${updates.join(", ")} WHERE id = ?`;
    await pool.execute(query, values);

    const [updatedRows] = await pool.execute("SELECT * FROM contacts WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Contact updated successfully",
      contact: Array.isArray(updatedRows) ? updatedRows[0] : null,
    });
  } catch (error) {
    console.error("Contact update error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleDeleteContact: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getPool();

    // Get contact before deletion
    const [checkRows] = await pool.execute("SELECT * FROM contacts WHERE id = ?", [id]);

    if (!Array.isArray(checkRows) || checkRows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Contact not found",
      });
      return;
    }

    const deletedContact = checkRows[0];

    // Delete contact
    await pool.execute("DELETE FROM contacts WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Contact deleted successfully",
      contact: deletedContact,
    });
  } catch (error) {
    console.error("Contact deletion error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleGetContactStats: RequestHandler = async (req, res) => {
  try {
    const pool = await getPool();

    // Get counts by status
    const [statusRows] = await pool.execute(
      "SELECT status, COUNT(*) as count FROM contacts GROUP BY status"
    );

    const stats = {
      total: 0,
      new: 0,
      inProgress: 0,
      resolved: 0,
    };

    if (Array.isArray(statusRows)) {
      for (const row of statusRows) {
        const statusRow = row as any;
        const count = statusRow.count || 0;
        stats.total += count;

        if (statusRow.status === "new") stats.new = count;
        else if (statusRow.status === "in_progress") stats.inProgress = count;
        else if (statusRow.status === "resolved") stats.resolved = count;
      }
    }

    // Get topic breakdown
    const [topicRows] = await pool.execute(
      "SELECT topic, COUNT(*) as count FROM contacts GROUP BY topic"
    );

    const topicBreakdown: Record<string, number> = {};
    if (Array.isArray(topicRows)) {
      for (const row of topicRows) {
        const topicRow = row as any;
        topicBreakdown[topicRow.topic] = topicRow.count || 0;
      }
    }

    res.json({
      success: true,
      stats: {
        ...stats,
        topicBreakdown,
      },
    });
  } catch (error) {
    console.error("Stats retrieval error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
