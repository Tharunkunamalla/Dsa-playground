import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../server/db.js"; // ✅ Import shared connection

import authRoutes from "../server/routes/auth.js";
import creativeRoutes from "../server/routes/creative.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
app.use(cors());

// ✅ Custom Middleware: Await DB Connection for every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed in middleware:", error);
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "DSA Visualizer API running 🚀",
  });
});

app.get("/api/debug", (req, res) => {
  res.json({
    message: "Debug Info",
    mongoEnv: process.env.MONGO_URI ? "Set" : "Not Set",
    mongoConn: mongoose.connection.readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    cachedState: global.mongoose ? "Present" : "Missing"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/creative", creativeRoutes);

export default app;
