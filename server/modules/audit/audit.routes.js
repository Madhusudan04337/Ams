// modules/audit/audit.routes.js

const router = require("express").Router();
const { allLogs, myLogs } = require("./audit.controller");
const { verifyToken } = require("../../middleware/auth");
const { requireRole } = require("../../middleware/rbac");

// Admin only — view all audit logs
router.get(
  "/logs",
  verifyToken,
  requireRole("admin"),
  allLogs
);

// Any logged in user — view own activity
router.get(
  "/my",
  verifyToken,
  myLogs
);

module.exports = router;