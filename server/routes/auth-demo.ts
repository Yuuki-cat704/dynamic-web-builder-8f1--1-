import { RequestHandler } from "express";
import { RequestHandler } from "express";
import { getPool } from "../db";

// Demo test account
const DEMO_ACCOUNT = {
  id: 1,
  name: "Tester Account",
  email: "tester@dzakcloud.com",
  password: "Tester123!",
  createdAt: new Date().toISOString(),
};

// Simple token generation
const generateToken = (): string => {
  return `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

// Try to use database, fallback to demo mode
const executeQuery = async (query: string, params: any[], fallback: any) => {
  try {
    const pool = await getPool();
    const [result] = await pool.execute(query, params);
    return { success: true, data: result };
  } catch (error) {
    console.warn("⚠️ Database unavailable, using demo mode");
    return { success: false, data: fallback };
  }
};

export const handleRegisterWithFallback: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    try {
      const pool = await getPool();

      // Check if user already exists
      const [existingUsers] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        res.status(409).json({
          success: false,
          message: "Email already registered",
        });
        return;
      }

      // Create new user
      const query = `
        INSERT INTO users (email, password, fullName)
        VALUES (?, ?, ?)
      `;

      const [result] = await pool.execute(query, [email, password, name]);
      const userId = (result as any).insertId;

      const token = generateToken();

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        token,
        user: {
          id: userId,
          name,
          email,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (dbError) {
      // Fallback: Demo mode
      console.warn("⚠️ Database unavailable, using demo mode for registration");

      if (email === DEMO_ACCOUNT.email) {
        res.status(409).json({
          success: false,
          message: "Email already registered",
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
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const handleLoginWithFallback: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt:", { email, hasPassword: !!password });

    // Validation
    if (!email || !password) {
      console.log("❌ Missing email or password");
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Try database first
    let dbSuccess = false;
    try {
      const pool = await getPool();
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

      if (Array.isArray(rows) && rows.length > 0) {
        const user = rows[0] as any;

        // Compare plain text password
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
              createdAt: user.createdAt,
            },
          });
          return;
        }
      }
    } catch (dbError) {
      console.warn("⚠️ Database error, falling back to demo mode", dbError);
    }

    // Fallback: Demo mode
    console.log("🎭 Using demo mode for login");

    // Check against demo account
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
          createdAt: DEMO_ACCOUNT.createdAt,
        },
      });
      return;
    }

    // Invalid credentials
    console.log("❌ Invalid credentials");
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const handleGetProfile: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // In a real app, verify the token properly
    const userId = (req as any).userId;

    try {
      const pool = await getPool();
      const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);

      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      const user = rows[0] as any;

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (dbError) {
      // Fallback
      res.json({
        success: true,
        user: {
          id: DEMO_ACCOUNT.id,
          name: DEMO_ACCOUNT.name,
          email: DEMO_ACCOUNT.email,
          createdAt: DEMO_ACCOUNT.createdAt,
        },
      });
    }
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const handleUpdateProfile: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { name, email } = req.body;
    const userId = (req as any).userId;

    try {
      const pool = await getPool();

      // Check if user exists
      const [userRows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);

      if (!Array.isArray(userRows) || userRows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      const user = userRows[0] as any;

      // Check if new email is already in use
      if (email && email !== user.email) {
        const [existingEmail] = await pool.execute(
          "SELECT * FROM users WHERE email = ? AND id != ?",
          [email, userId]
        );

        if (Array.isArray(existingEmail) && existingEmail.length > 0) {
          res.status(409).json({
            success: false,
            message: "Email already in use",
          });
          return;
        }
      }

      // Update user
      const updates: string[] = [];
      const values: any[] = [];

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
          message: "No fields to update",
        });
        return;
      }

      values.push(userId);

      const query = `UPDATE users SET ${updates.join(", ")}, updatedAt = NOW() WHERE id = ?`;
      await pool.execute(query, values);

      const [updatedRows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);
      const updatedUser = Array.isArray(updatedRows) ? (updatedRows[0] as any) : null;

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser?.id,
          name: updatedUser?.fullName,
          email: updatedUser?.email,
          createdAt: updatedUser?.createdAt,
        },
      });
    } catch (dbError) {
      // Fallback
      res.json({
        success: true,
        message: "Profile updated successfully (Demo Mode)",
        user: {
          id: DEMO_ACCOUNT.id,
          name: name || DEMO_ACCOUNT.name,
          email: email || DEMO_ACCOUNT.email,
          createdAt: DEMO_ACCOUNT.createdAt,
        },
      });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  try {
    // In a real app, invalidate the token
    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
