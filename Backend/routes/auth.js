const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || "secret123";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // FIX: You need to hash the password here!
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword, // Now this variable exists
      role: "user", // Defaulting to user
    });

    await newUser.save();
    res.status(201).json("User registered successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) return res.status(400).json("User not found");

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // FIX: Include 'role' in the payload so isAdmin middleware can see it
    jwt.sign(
      { username, id: userDoc._id, role: userDoc.role },
      secret,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          id: userDoc._id,
          username,
          role: userDoc.role, // Also send to frontend for UI logic
          token,
        });
      }
    );
  } else {
    res.status(400).json("Wrong credentials");
  }
});

// GET current user info
router.get("/me", verifyToken, async (req, res) => {
  try {
    // req.user.id comes from the decoded token in verifyToken middleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json("Server error");
  }
});

module.exports = router;
