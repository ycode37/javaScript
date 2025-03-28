const express = require("express");
const path = require("path");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create Express App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, ".")));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/campusconnect", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify email configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("Email configuration error:", error);
    console.error("\nCurrent configuration:");
    console.error("EMAIL_USER:", process.env.EMAIL_USER);
    console.error("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);
    console.error("\nTroubleshooting steps:");
    console.error(
      "1. Verify your Gmail account has 2-Step Verification enabled"
    );
    console.error("2. Generate a new App Password:");
    console.error("   - Go to Google Account settings");
    console.error("   - Security > 2-Step Verification > App passwords");
    console.error("   - Select app: Other (Custom name)");
    console.error('   - Enter "CampusConnect" and click Generate');
    console.error("3. Copy the new 16-character password (without spaces)");
    console.error("4. Update your .env file with the new password");
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Generate verification token
const generateVerificationToken = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Authentication Routes
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, college } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !college) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: {
          email: !email,
          password: !password,
          firstName: !firstName,
          lastName: !lastName,
          college: !college,
        },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      college,
      verificationToken,
      verificationTokenExpires,
    });

    await newUser.save();

    try {
      // Send verification email
      const verificationUrl = `http://localhost:3002/api/verify/${verificationToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER || "your-email@gmail.com",
        to: email,
        subject: "Verify your Campus Connect account",
        html: `
          <h1>Welcome to Campus Connect!</h1>
          <p>Please click the link below to verify your account:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>This link will expire in 24 hours.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Verification email sent successfully");

      res.status(201).json({
        message:
          "Registration successful. Please check your email to verify your account.",
        success: true,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // If email fails, delete the user and return error
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({
        message:
          "Registration successful but failed to send verification email. Please contact support.",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

app.get("/api/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
        needsVerification: true,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "YOUR_SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Protected route example
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
