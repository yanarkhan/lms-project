import type { Request, Response } from "express";
import Course from "../models/courseModel";

export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courses = await Course.find({
      manager: req.user?._id,
    })
      .select("name thumbnail")
      .populate({
        path: "category",
        select: "name -_id",
      })
      .populate({
        path: "students",
        select: "name",
      });

    res
      .status(200)
      .json({ message: "Get courses successfully", data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
