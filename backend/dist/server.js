"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const registration_1 = __importDefault(require("./routes/registration"));
// Initialize environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Middlewares
app.use((0, helmet_1.default)());
// CORS configuration
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use((0, cors_1.default)({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
// Body Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Rate Limiting (Prevent API spam)
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: { error: "Too many requests from this IP. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false
});
app.use("/api/", limiter);
// API Routes
app.use("/api/registrations", registration_1.default);
// Root endpoint welcome message
app.get("/", (req, res) => {
    res.status(200).json({
        name: "Mobile App Club Hackathon 2026 API",
        status: "Online",
        healthCheck: "/health",
        apiPrefix: "/api/registrations"
    });
});
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});
// Start Server and Test DB connection
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await (0, database_1.testConnection)();
});
