// modules/auth/auth.routes.js

const router = require("express").Router();
const {
  register,
  login,
  myProfile,
  refresh,
  logout,
} = require("./auth.controller");
const { verifyToken } = require("../../middleware/auth");

// Public routes — no token needed
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes — token required
router.get("/me", verifyToken, myProfile);
router.post("/logout", verifyToken, logout);

module.exports = router;