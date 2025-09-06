import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import globalRoutes from "./routes/globalRoutes";
import authRoutes from "./routes/authRoutes";
import connectDB from "./utils/database";

dotenv.config();
// --- KONEKSI DATABASE ---
connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 8000;

// Middleware
app.use(express.json()); // Middleware untuk menguraikan JSON body dari request
app.use(express.urlencoded({ extended: true })); // Middleware untuk menguraikan URL-encoded body
app.use(cors()); // Middleware untuk mengizinkan permintaan dari domain lain dan API kita bisa diakses di website lain
app.use(express.static("public"));

// Use Router
app.use("/api", globalRoutes);
app.use("/api", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running with TypeScript and Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
