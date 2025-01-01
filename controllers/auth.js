const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {
  sendVerficationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} = require("../mailtrap/emails.js");
const generateVerificationCode = require("../utils/generateVerificationcode");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const generateResetToken = require("../utils/generateResetToken.js");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = generateVerificationCode();
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      verificationToken: verificationCode,
      VerificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();
    //jwt
    const { token, options } = generateTokenAndSetCookie(res, user._id);
    await sendVerficationEmail(user.email, verificationCode);
    const { password: pass, ...rest } = user._doc;

    return res.cookie("token", token, options).status(201).json({
      message: "User created successfully",
      rest,
    });
  } catch (error) {
    console.log("Error message", error);
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      VerificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid verification code or expired" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.VerificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    const { password: pass, ...rest } = user._doc;
    return res
      .status(200)
      .json({ message: "Email verified successfully", rest });
  } catch (error) {
    console.log("Error message", error);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const { token, options } = generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    const { password: pass, ...rest } = user._doc;

    return res.cookie("token", token, options).status(200).json({
      message: "Logged in successfully",
      rest,
    });
  } catch (error) {
    console.log("Error message", error);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const { resetToken, resetTokenExpiresAt } = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetpasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email successfully",
    });
  } catch (error) {
    console.log("Error occured during  forgetting password ", error);
    res.status(400).json({ success: false, messahe: error.message });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetpasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid token or expired token",
      });
    }

    //update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetpasswordExpiresAt = undefined;
    await user.save();
    sendPasswordResetSuccessEmail(user.email);
    res.status(200).json({
      success: true,
      message: "Password reset successfull",
    });
  } catch (error) {}
});

const checkAuth = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    const { password: pass, ...rest } = user._doc;

    return res.status(200).json({ success: true, rest });
  } catch (error) {
    console.log("error in checkAuth", error);
    throw new Error();
  }
});
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
};
