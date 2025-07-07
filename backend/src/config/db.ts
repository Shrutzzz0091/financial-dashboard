import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export function connectDB(uri: string) {
  return mongoose
    .connect(uri)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Failed:", err));
}
