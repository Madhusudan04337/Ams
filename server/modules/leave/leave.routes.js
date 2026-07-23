// modules/leave/leave.routes.js

const router = require("express").Router();
const {
  apply,
  myLeaves,
  allLeaves,
  approve,
  reject,
} = require("./leave.controller");
const { verifyToken } = require("../../middleware/auth");
const { requireRole } = require("../../middleware/rbac");

// Employee — apply for leave
router.post(
  "/apply",
  verifyToken,
  requireRole("employee"),
  apply
);

// Employee — view own leave requests
router.get(
  "/my",
  verifyToken,
  requireRole("employee"),
  myLeaves
);

// Admin + Manager — view all leave requests
router.get(
  "/all",
  verifyToken,
  requireRole("admin", "manager"),
  allLeaves
);

// Admin + Manager — approve leave
router.put(
  "/:id/approve",
  verifyToken,
  requireRole("admin", "manager"),
  approve
);

// Admin + Manager — reject leave
router.put(
  "/:id/reject",
  verifyToken,
  requireRole("admin", "manager"),
  reject
);

module.exports = router;