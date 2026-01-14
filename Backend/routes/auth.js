const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || "secret123"; // Add JWT_SECRET to your .env!

// REGISTER (You can use this once to create your Admin account)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) return res.status(400).json("User not found");

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // Logged in: Create the token
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.json({
        id: userDoc._id,
        username,
        token, // Send this to the frontend
      });
    });
  } else {
    res.status(400).json("Wrong credentials");
  }
});

// GET current user info (Check if logged in)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Don't send the password!
    res.json(user);
  } catch (error) {
    res.status(500).json("Server error");
  }
});

module.exports = router;
