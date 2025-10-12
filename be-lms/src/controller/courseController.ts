import type { Request, Response } from "express";
import Course from "../models/courseModel";
import { mutateCourseSchema, MutateCourseInput } from "../utils/schema";
import fs from "fs";
import Category from "../models/categoryModel";
import User from "../models/userModel";

export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courses = await Course.find({
      manager: req.user?._id,
    })
      .select("name thumbnail students category")
      .populate({
        path: "category",
        select: "name -_id",
      })
      .populate({
        path: "students",
        select: "name",
      })
      .lean();

    const baseUrl =
      process.env.APP_URL ?? `${req.protocol}://${req.get("host")}`;

    const responseData = courses.map((course) => ({
      _id: course._id,
      name: course.name,
      thumbnail: course.thumbnail,
      category: course.category,
      students: course.students,
      thumbnail_url: `${baseUrl}${course.thumbnail}`,
      total_students: course.students.length,
    }));

    res
      .status(200)
      .json({ message: "Get courses successfully", data: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postCourse = async (
  req: Request<{}, {}, MutateCourseInput>,
  res: Response
): Promise<void> => {
  try {
    const parseResult = mutateCourseSchema.safeParse(req.body);
    if (!parseResult.success) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      const errorMessages = parseResult.error.issues.map((err) => err.message);
      res.status(400).json({ message: "Invalid input", errors: errorMessages });
      return;
    }

    const { name, categoryId, tagline, description } = parseResult.data;

    const category = await Category.findById(categoryId);
    if (!category) {
      if (req.file?.path && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      res.status(404).json({ message: "Category not found" });
      return;
    }

    if (!req.file?.filename) {
      res
        .status(400)
        .json({ message: "Thumbnail is required and must be PNG/JPG/JPEG" });
      return;
    }

    const thumbnailPath = `/uploads/courses/${req.file.filename}`;
    const newCourse = new Course({
      name,
      category: category._id,
      tagline,
      description,
      thumbnail: thumbnailPath,
      manager: req.user?._id,
    });
    await newCourse.save();

    await Category.findByIdAndUpdate(
      category._id,
      {
        $push: { courses: newCourse._id },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $push: { courses: newCourse._id },
      },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "Course created successfully", data: newCourse });
  } catch (error) {
    console.error(error);
    // buat hapus file kalau terjadi error tak terduga
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (_) {}
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
