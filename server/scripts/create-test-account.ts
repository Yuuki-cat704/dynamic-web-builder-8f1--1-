import "dotenv/config";
import { getPool } from "../db";

// Test account credentials
const TEST_ACCOUNT = {
  name: "Tester Account",
  email: "tester@dzakcloud.com",
  password: "Tester123!", // Will be hashed
};

async function createTestAccount() {
  try {
    console.log("🔄 Creating test account...");
    console.log(`📧 Email: ${TEST_ACCOUNT.email}`);
    console.log(`🔐 Password: ${TEST_ACCOUNT.password}`);

    const pool = await getPool();

    // Check if account already exists
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [TEST_ACCOUNT.email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      console.log("✅ Test account already exists!");
      console.log(`📧 Email: ${TEST_ACCOUNT.email}`);
      console.log(`🔐 Password: ${TEST_ACCOUNT.password}`);
      return;
    }

    // Create account (plain text password - for testing only)
    const query = `
      INSERT INTO users (email, password, fullName)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      TEST_ACCOUNT.email,
      TEST_ACCOUNT.password,
      TEST_ACCOUNT.name,
    ]);

    console.log("✅ Test account created successfully!");
    console.log(`\n📋 LOGIN CREDENTIALS:\n`);
    console.log(`📧 Email:    ${TEST_ACCOUNT.email}`);
    console.log(`🔐 Password: ${TEST_ACCOUNT.password}`);
    console.log(`\n🎯 Use these credentials to login at: /login`);
    console.log(`📊 Access dashboard at: /dashboard\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test account:", error);
    process.exit(1);
  }
}

createTestAccount();
