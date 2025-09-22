
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import { sendOtpEmail } from "../utils/mailer.js";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRE_MINUTES || 10);

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Hash OTP before saving
const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

// ================= SIGNUP =================
export const handleSignUp = async (req, res) => {
  try {
    const { name, email, password, job, contact, gender } = req.body;
    if (!name || !email || !password || !job || !contact || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create user
    const user = new User({ name, email, password, job, contact, gender });

    // Generate OTP
    const otp = generateOtp();
    user.otp = hashOtp(otp);
    user.otpExpires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

    await user.save();

    // Send OTP via email
    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "User registered. OTP sent to email.", email });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= VERIFY OTP =================
export const handleVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });
    if (!user.otp || !user.otpExpires) return res.status(400).json({ message: "No OTP found, please request resend" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired, please request a new one" });

    const hashed = hashOtp(otp);
    if (hashed !== user.otp) return res.status(400).json({ message: "Invalid OTP" });

    // Mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Email verified successfully", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= RESEND OTP =================
export const handleResendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const otp = generateOtp();
    user.otp = hashOtp(otp);
    user.otpExpires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= LOGIN =================
export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email, cart: user.cart }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= LOGOUT =================
export const handleLogout = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// ================= GET PROFILE =================
export const handleGetProfile = async (req, res) => {
  try {
    // The user object is attached to the request by the authMiddleware
    const user = req.user;
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cart: user.cart,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
