import type { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { MongoError } from "mongodb";

export const signUpAction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body; // Konsep Destructuring (course react Udemy) untuk mengambil data yang divalidasi

    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      photo: "default.png",
      password: hashPassword,
      role: "manager",
    });

    await user.save(); // Menggunakan await karena user.save() adalah operasi asinkron

    res.status(201).json({
      message: "Sign Up Success",
      data: {
        midtrans_payment_url: "https://google.com",
      },
    });
  } catch (error) {
    if (error instanceof MongoError && error.code === 11000) {
      console.error("User registration failed: Email already exists.");
      res.status(409).json({ message: "Email already exists." });
    } else {
      console.error("An unexpected error occurred during sign up:", error);
      next(error); // Meneruskan error lainnya ke global error handle
    }
  }
};
