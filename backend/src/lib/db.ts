import mongoose from "mongoose";

export const connectDB = async (url?: string) => {
  const dbUrl = url || process.env.MONGODB_URL;
  try {
    if (!dbUrl) {
      throw new Error("Db url not provided!");
    }
    const conn = await mongoose.connect(dbUrl);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (e) {
    console.log("Failed to connect to Mongodb", e);

    process.exit(1); // 1 is failure and 0 is success
  }
};
