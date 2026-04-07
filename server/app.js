const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit =require ("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit ({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        statusCode: 429,
        success: false,
        message: "Too many requsts. Please try again after 15 minutes.",
        data: null,
    },
});

app.use("/api",limiter);

// Body parsing
app.use(express.json());
app.use(express.erlencoded({ extended: true}));

// Health check
app.get("/",(req, res) => {
    res.json({
        statusCode: 200,
        success: true,
        message: "AMS API is running.",
        data: null,
    });
});

// Routes
app.use("/api/v1/auth", require("./modules/auth/auth.routes"));
app.use("/api/v1/attendance", require("./modules/attendance/attendance.routes"));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        statusCode: 404,
        success: false,
        message: `Route ${req.originalUrl} not found.`,
    })
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;