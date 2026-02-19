import type { Request, Response } from "express";
import Course, { ICourse } from "../models/courseModel";
import {
  mutateCourseSchema,
  MutateCourseInput,
  MutateContentInput,
  mutateContentSchema,
} from "../utils/schema";
import fs from "fs";
import Category, { ICategory } from "../models/categoryModel";
import User from "../models/userModel";
import path from "path";
import { Types } from "mongoose";
import CourseDetail, { ICourseDetail } from "../models/courseDetailModel";

export const getCourses = async (
  req: Request,
  res: Response,
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

export const getCategories = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories: ICategory[] = await Category.find()
      .select("name _id")
      .lean()
      .exec();

    res
      .status(200)
      .json({ message: "Get categories success", data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourseById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { preview } = req.query;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid course ID format" });
      return;
    }

    const detailsSelect =
      preview === "true" ? "title type youtubeId text" : "title type";
    const course = await Course.findById(id)
      .populate<{ category: ICategory }>({
        path: "category",
        select: "_id name",
      })
      .populate({
        path: "details",
        select: detailsSelect,
      })
      .lean()
      .exec();
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    if (course.manager.toString() !== req.user?._id) {
      res.status(403).json({
        message: "Forbidden: You are not authorized to view this course",
      });
      return;
    }

    const baseUrl =
      process.env.APP_URL ?? `${req.protocol}://${req.get("host")}`;
    const responseData = {
      ...course,
      thumbnail_url: course.thumbnail ? `${baseUrl}${course.thumbnail}` : null,
    };

    res
      .status(200)
      .json({ message: "Get Course Detail success", data: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postCourse = async (
  req: Request<{}, {}, MutateCourseInput>,
  res: Response,
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
      { new: true },
    );

    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $push: { courses: newCourse._id },
      },
      { new: true },
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

export const updateCourse = async (
  req: Request<{ id: string }, {}, MutateCourseInput>,
  res: Response,
): Promise<void> => {
  try {
    const { id: courseId } = req.params;

    const parseResult = mutateCourseSchema.safeParse(req.body);
    if (!parseResult.success) {
      if (req.file?.path) fs.unlinkSync(req.file.path);
      const errorMessage = parseResult.error.issues.map((err) => err.message);
      res
        .status(400)
        .json({ message: "Validation error", error: errorMessage });
      return;
    }

    const { name, categoryId, tagline, description } = parseResult.data;

    const category = await Category.findById(categoryId).exec();
    if (!category) {
      if (req.file?.path) fs.unlinkSync(req.file.path);
      res.status(404).json({ message: "Category not found" });
      return;
    }

    const oldCourse = await Course.findById(courseId).exec();
    if (!oldCourse) {
      if (req.file?.path) fs.unlinkSync(req.file.path);
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (oldCourse.category.toString() !== categoryId) {
      await Category.findByIdAndUpdate(
        oldCourse.category,
        { $pull: { courses: oldCourse._id } },
        { new: false },
      ).exec();
      await Category.findByIdAndUpdate(
        categoryId,
        { $addToSet: { courses: oldCourse._id } },
        { new: false },
      ).exec();
    }

    const thumbnailPath = req.file
      ? `/uploads/courses/${req.file.filename}`
      : oldCourse.thumbnail;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        name,
        category: category._id,
        tagline,
        description,
        thumbnail: thumbnailPath,
      },
      { new: true },
    ).exec();

    if (req.file && oldCourse.thumbnail) {
      const oldThumbnailAbsolutePath = path.join(
        process.cwd(),
        "public",
        oldCourse.thumbnail,
      );
      if (fs.existsSync(oldThumbnailAbsolutePath)) {
        fs.unlinkSync(oldThumbnailAbsolutePath);
      }
    }

    res.status(200).json({
      message: "Course updated successfully",
      data: updatedCourse,
    });
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

export const deleteCourse = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id: courseId } = req.params;
    const course = await Course.findById(courseId).exec();
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.manager.toString() !== req.user?._id) {
      res.status(403).json({
        message: "Forbidden: You are not authorized to delete this course",
      });
      return;
    }

    await Course.findByIdAndDelete(courseId).exec();
    if (course.thumbnail) {
      const filePath = path.join(process.cwd(), "public", course.thumbnail);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Promise.all([
      User.findByIdAndUpdate(course.manager, {
        $pull: { courses: course._id },
      }).exec(),
      Category.findByIdAndUpdate(course.category, {
        $pull: { courses: course._id },
      }).exec(),
    ]);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postContentCourse = async (
  req: Request<{}, {}, MutateContentInput>,
  res: Response,
): Promise<void> => {
  try {
    const parseResult = mutateContentSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map((err) => err.message);
      res
        .status(400)
        .json({ message: "Validation error", errors: errorMessages });
      return;
    }
    const { title, type, courseId, youtubeId, text } = parseResult.data;

    const course = await Course.findById(courseId).exec();
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.manager.toString() !== req.user?._id) {
      res.status(403).json({
        message:
          "Forbidden: You are not authorized to add content to this course",
      });
      return;
    }

    const newContent = new CourseDetail({
      title,
      course: course._id,
      type,
      youtubeId: type === "video" ? youtubeId : undefined,
      text: type === "text" ? text : undefined,
    });
    await newContent.save();

    try {
      await Course.findByIdAndUpdate(
        course._id,
        { $push: { details: newContent._id } },
        { new: true },
      ).exec();
    } catch (updateError) {
      await CourseDetail.findByIdAndDelete(newContent._id).exec();

      console.error(
        "Failed to link content to course, rolling back:",
        updateError,
      );
      res.status(500).json({ message: "Failed to create content" });
      return;
    }

    res.status(201).json({
      message: "Content created successfully",
      data: newContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateContentCourse = async (
  req: Request<{ id: string }, {}, MutateContentInput>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid content ID format" });
      return;
    }

    const parseResult = mutateContentSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map((err) => err.message);
      res
        .status(400)
        .json({ message: "Validation error", error: errorMessage });
      return;
    }

    const { title, courseId, type, youtubeId, text } = parseResult.data;
    if (!Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: "Invalid course ID format" });
      return;
    }

    const [targetCourse, content] = await Promise.all([
      Course.findById(courseId).exec(),
      CourseDetail.findById(id).exec(),
    ]);
    if (!targetCourse) {
      res.status(404).json({ message: "Target Course not found" });
      return;
    }
    if (!content) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    if (targetCourse.manager.toString() !== req.user?._id) {
      res.status(403).json({
        message: "Forbidden: You are not authorized to modify this course",
      });
      return;
    }

    const oldCourseId = content.course.toString();
    if (oldCourseId !== courseId) {
      await Course.findByIdAndUpdate(oldCourseId, {
        $pull: { details: content._id },
      }).exec();
      await Course.findByIdAndUpdate(targetCourse._id, {
        $addToSet: { details: content._id },
      }).exec();
    }

    const updateData: Partial<ICourseDetail> = {
      title,
      type,
      course: targetCourse._id,
    };
    const unsetData: Record<string, 1> = {};

    if (type === "video") {
      updateData.youtubeId = youtubeId;
      unsetData.text = 1;
    } else if (type === "text") {
      updateData.text = text;
      unsetData.youtubeId = 1;
    }

    const updatedContent = await CourseDetail.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        $unset: unsetData,
      },
      { new: true, runValidators: true },
    ).exec();

    res.status(200).json({
      message: "Content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteContentCourse = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid content ID format" });
      return;
    }

    const content = await CourseDetail.findById(id)
      .populate<{ course: ICourse }>("course")
      .exec();
    if (!content) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    if (content.course) {
      const parentCourse = content.course;

      if (parentCourse.manager.toString() !== req.user?._id) {
        res.status(403).json({
          message: "Forbidden: You are not authorized to delete this content",
        });
        return;
      }
    }

    await CourseDetail.findByIdAndDelete(id).exec();

    res.status(200).json({ message: "Delete Content Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
