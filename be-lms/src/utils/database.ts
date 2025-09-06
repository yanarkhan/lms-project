import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri: string | undefined = process.env.MONGODB_URL;
    if (!mongoUri) {
      throw new Error(
        "MONGODB_URL is not defined in the environment variables."
      );
    }

    await mongoose.connect(mongoUri);
    console.log("Database Connected to MongoDB!");

    mongoose.connection.on("error", (err: Error) => {
      console.error("MongoDB connection error: ", err);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Initial MongoDB connection failed:", error.message);
    } else {
      console.error("An unknown error occurred during database connection.");
    }
    process.exit(1); // keluar dari aplikasi jika koneksi gagal
  }
};

export default connectDB;
