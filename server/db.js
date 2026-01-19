import mongoose from 'mongoose';

// ✅ Cached connection for Serverless & Local
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        console.log("✅ Using cached MongoDB connection");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Return errors immediately rather than buffering
        };

        const uri = process.env.MONGO_URI;
        if (!uri) {
             throw new Error("❌ MONGO_URI is missing from environment variables");
        }

        cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
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
};

export default connectDB;
