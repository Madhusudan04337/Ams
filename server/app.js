// app.js

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// --- Security Middleware ---
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    statusCode: 429,
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
    data: null,
  },
});

app.use("/api", limiter);

// --- Body Parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get("/", (req, res) => {
  res.json({
    statusCode: 200,
    success: true,
    message: "AMS API is running.",
    data: null,
  });
});

// --- Routes ---
app.use("/api/v1/auth", require("./modules/auth/auth.routes"));
app.use("/api/v1/attendance", require("./modules/attendance/attendance.routes"));
app.use("/api/v1/leave", require("./modules/leave/leave.routes"));
app.use("/api/v1/analytics", require("./modules/analytics/analytics.routes"));
app.use("/api/v1/audit", require("./modules/audit/audit.routes"));
// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: `Route ${req.originalUrl} not found.`,
    data: null,
  });
});

// --- Central Error Handler ---
app.use(errorHandler);

module.exports = app;