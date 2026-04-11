const router = require("express").Router();
const { register, login, myProfile } = require("./auth.controller");
const {verifyToken} = require("../../middleware/auth");

// public routes - no token needed
router.post("/register", register);
router.post("/login", login);

//protected route - token requried
router.get("/me", verifyToken, myProfile);

module.exports = router;