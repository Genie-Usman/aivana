import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    // Check if the connection is still active
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Using cached database connection");
      return cached.conn;
    } else {
      // If the connection is not active, reset the cache
      console.log("⚠️ Cached connection is not active. Reconnecting...");
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGO_URI, { dbName: "aivana", bufferCommands: false })
      .then((mongoose) => {
        console.log("✅ Successfully connected to MongoDB!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}