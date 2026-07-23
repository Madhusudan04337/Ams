// modules/analytics/analytics.routes.js

const router = require("express").Router();
const {
  mySummary,
  departmentSummary,
} = require("./analytics.controller");
const { verifyToken } = require("../../middleware/auth");
const { requireRole } = require("../../middleware/rbac");

// All logged in users — own summary
router.get(
  "/summary",
  verifyToken,
  mySummary
);

// Admin + Manager only — department breakdown
router.get(
  "/department",
  verifyToken,
  requireRole("admin", "manager"),
  departmentSummary
);

module.exports = router;