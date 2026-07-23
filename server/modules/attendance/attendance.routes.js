// modules/attendance/attendance.routes.js

const router = require("express").Router();
const {
  mark,
  myAttendance,
  allAttendance,
  rectify,
  exportReport,
} = require("./attendance.controller");
const { verifyToken } = require("../../middleware/auth");
const { requireRole } = require("../../middleware/rbac");

// Employee — mark own attendance
router.post(
  "/mark",
  verifyToken,
  requireRole("employee"),
  mark
);

// Employee — view own history
router.get(
  "/my",
  verifyToken,
  requireRole("employee"),
  myAttendance
);

// Admin + Manager — view all attendance
router.get(
  "/all",
  verifyToken,
  requireRole("admin", "manager"),
  allAttendance
);

// Admin + Manager — rectify attendance
router.put(
  "/rectify/:id",
  verifyToken,
  requireRole("admin", "manager"),
  rectify
);

// Admin + Manager — export attendance as Excel
router.get(
  "/export",
  verifyToken,
  requireRole("admin", "manager"),
  exportReport
);

module.exports = router;