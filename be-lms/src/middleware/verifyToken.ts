import jwt, { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/userModel";

interface CustomJwtPayload extends JwtPayload {
  data?: {
    id?: string;
  };
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  const secretKey = process.env.SECRET_KEY_JWT ?? "";

  // validasi format header authorization
  if (
    !authHeader ||
    (!authHeader.startsWith("Bearer ") && !authHeader.startsWith("JWT "))
  ) {
    res.status(401).json({
      message: "Not authorized, no token provided or invalid format.",
    });
    return;
  }

  // buat ambil token dari header
  token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;

    const userId = decoded?.data?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res
        .status(401)
        .json({ message: "Not authorized, invalid token or token expired." });
      return;
    }

    const currentUser = await User.findById(userId)
      .select("_id name email role")
      .lean();
    if (!currentUser) {
      res.status(401).json({
        message: "Not authorized, user for this token no longer exists.",
      });
      return;
    }

    req.user = {
      _id: currentUser._id.toString(),
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed." });
  }
};
