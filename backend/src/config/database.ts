import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hackathon_registration",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection established successfully.");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

export default pool;
