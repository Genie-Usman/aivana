import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGO_URI) throw new Error("Missing MONGO_URI");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGO_URI, {
      dbName: "aivana",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
