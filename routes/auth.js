const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require("../controllers/auth.js");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken.js");

console.log(checkAuth);
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
