"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = testConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create the connection pool
const pool = promise_1.default.createPool({
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
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Database connection established successfully.");
        connection.release();
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
}
exports.default = pool;
