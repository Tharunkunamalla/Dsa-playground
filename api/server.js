import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "../server/routes/auth.js";
import creativeRoutes from "../server/routes/creative.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Prevent multiple DB connections (important for Vercel)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("DSA Visualizer API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/creative", creativeRoutes);

// ❌ REMOVE app.listen()
// ✅ EXPORT the app for Vercel
export default app;
