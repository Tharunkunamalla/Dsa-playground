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

// ✅ Cached connection for Serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log("✅ New MongoDB Connection Established");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", e);
    throw e;
  }

  return cached.conn;
}

// Initialize connection (swallow error here prevents startup crash, middleware will handle it)
connectDB().catch(err => console.error("Initial DB connection failed (will retry on request):", err));

// ✅ Custom Middleware: Await DB Connection for every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "DSA Visualizer API is running 🚀",
    dbStatus: cached.conn ? "Connected" : "Disconnected",
    env: {
      mongo: !!process.env.MONGO_URI,
      jwt: !!process.env.JWT_SECRET
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/creative", creativeRoutes);

// ❌ REMOVE app.listen()
// ✅ EXPORT the app for Vercel
export default app;
