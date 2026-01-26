import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const {username, password} = req.body;

  try {
    const userExists = await User.findOne({username});

    if (userExists) {
      return res.status(400).json({message: "User already exists"});
    }

    const user = await User.create({
      username,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        password: user.password,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({message: "Invalid user data"});
    }
  } catch (error) {
    console.error("Register Error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({message: messages.join(", ")});
    }
    res.status(500).json({message: error.message || "Internal Backend Error"});
  }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const {username, password} = req.body;

  try {
    const user = await User.findOne({username});

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        completedTopics: user.completedTopics,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({message: "Invalid username or password"});
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({message: error.message || "Server Error"});
  }
});

// @route   POST /api/auth/google
// @desc    Auth with Google
// @access  Public
router.post("/google", async (req, res) => {
  const { token } = req.body;


  if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("Missing GOOGLE_CLIENT_ID in server .env");
      return res.status(500).json({ message: "Server Configuration Error: Missing Google Client ID" });
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub } = ticket.getPayload();

    let user = await User.findOne({ googleId: sub });
    
    // Fallback: check by email if googleId not found
    if (!user && email) {
        user = await User.findOne({ email });
        if (user) {
            user.googleId = sub;
            await user.save();
        }
    }

    if (!user) {
        // Generate unique username
        let username = name.replace(/\s+/g, '').toLowerCase();
        let usernameExists = await User.findOne({ username });
        while (usernameExists) {
            username = name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 10000);
            usernameExists = await User.findOne({ username });
        }

        user = await User.create({
            username,
            email,
            // password field omitted to avoid minlength validation
            googleId: sub,
        });
    }

    res.json({
        _id: user._id,
        username: user.username,
        completedTopics: user.completedTopics,
        token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({ message: "Google Sign-In failed" });
  }
});

export default router;
