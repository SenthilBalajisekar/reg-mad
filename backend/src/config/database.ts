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

// Test connection and auto-initialize tables
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection established successfully.");

    // Auto-create database tables if they do not exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS participants (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(50) NOT NULL,
          college_name VARCHAR(255) NOT NULL,
          department VARCHAR(255) NOT NULL,
          year INT NOT NULL,
          student_id VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS teams (
          id INT AUTO_INCREMENT PRIMARY KEY,
          team_name VARCHAR(255) NOT NULL UNIQUE,
          team_leader_id INT NULL,
          track VARCHAR(100) NOT NULL,
          problem_statement TEXT NOT NULL,
          technology_stack VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (team_leader_id) REFERENCES participants(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS team_members (
          id INT AUTO_INCREMENT PRIMARY KEY,
          team_id INT NOT NULL,
          participant_id INT NOT NULL,
          role VARCHAR(50) DEFAULT 'member',
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_team_participant (team_id, participant_id),
          FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
          FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS registrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          registration_id VARCHAR(100) NOT NULL UNIQUE,
          team_id INT NOT NULL UNIQUE,
          status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
          registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
          setting_key VARCHAR(100) PRIMARY KEY,
          setting_value VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      INSERT INTO settings (setting_key, setting_value)
      VALUES ('registration_open', 'true')
      ON DUPLICATE KEY UPDATE setting_key=setting_key;
    `);

    console.log("✅ Database tables verified and auto-created successfully.");

    // Clean up sample/seed mock data if present
    await connection.query("DELETE FROM registrations WHERE registration_id = 'HACK-2026-00001'").catch(() => {});
    await connection.query("DELETE FROM teams WHERE team_name = 'Alpha Devs'").catch(() => {});
    await connection.query("DELETE FROM participants WHERE email = 'john.doe@example.com'").catch(() => {});

    // Normalize existing registration IDs to 2-digit format (e.g. HACK-2026-00002 -> HACK-2026-01)
    await connection.query("UPDATE registrations SET registration_id = 'HACK-2026-01' WHERE registration_id = 'HACK-2026-00002'").catch(() => {});
    await connection.query("UPDATE registrations SET registration_id = 'HACK-2026-01' WHERE registration_id = 'HACK-2026-00001'").catch(() => {});

    connection.release();
  } catch (error) {
    console.error("❌ Database connection/initialization failed:", error);
    process.exit(1);
  }
}

export default pool;
