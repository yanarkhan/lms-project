// src/controllers/globalController.ts
import { Request, Response } from "express";

export const helloWorld = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.json({ message: "Hello World from TypeScript API!" });
  } catch (error) {
    console.error("Error in helloWorld controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
