
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    const MONGO_NAME = process.env.MONGO_NAME;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined. Check your .env file.");
    }

    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_NAME,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
