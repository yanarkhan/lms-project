import type { Request, Response } from "express";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import path from "path";

import User from "../models/userModel";
import Course from "../models/courseModel";
import {
  mutateStudentSchema,
  updateStudentSchema,
  type MutateStudentInput,
  type UpdateStudentInput,
} from "../utils/schema";
import { removeUploadedFile } from "../utils/multer";

const getPhotoUrl = (req: Request, filename: string | undefined): string => {
  if (!filename) return "";
  const baseUrl = process.env.APP_URL ?? `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/students/${filename}`;
};

export const getStudents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const students = await User.find({
      role: "student",
      manager: req.user?._id,
    })
      .select("name photo courses")
      .lean()
      .exec();

    const data = students.map((student) => ({
      ...student,
      photo_url: getPhotoUrl(req, student.photo),
    }));

    res.status(200).json({ message: "Get Students success", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid student ID format" });
      return;
    }

    const student = await User.findById(id)
      .select("name email photo")
      .lean()
      .exec();
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({
      message: "Get student detail success",
      data: {
        ...student,
        photo_url: getPhotoUrl(req, student.photo),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postStudent = async (
  req: Request<{}, {}, MutateStudentInput>,
  res: Response,
): Promise<void> => {
  try {
    const parseResult = mutateStudentSchema.safeParse(req.body);
    if (!parseResult.success) {
      removeUploadedFile(req.file?.path);

      const errors = parseResult.error.issues.map((issue) => issue.message);
      res.status(400).json({ message: "Validation error", errors });
      return;
    }

    const { name, email, password } = parseResult.data;

    const existingUser = await User.findOne({ email }).lean().exec();
    if (existingUser) {
      removeUploadedFile(req.file?.path);
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const student = new User({
      name,
      email,
      password: hashedPassword,
      photo: req.file?.filename,
      role: "student",
      manager: req.user?._id,
    });

    await student.save();

    res.status(201).json({ message: "Create student success" });
  } catch (error) {
    removeUploadedFile(req.file?.path);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStudent = async (
  req: Request<{ id: string }, {}, UpdateStudentInput>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      removeUploadedFile(req.file?.path);
      res.status(400).json({ message: "Invalid student ID format" });
      return;
    }

    const parseResult = updateStudentSchema.safeParse(req.body);
    if (!parseResult.success) {
      removeUploadedFile(req.file?.path);
      const errors = parseResult.error.issues.map((issue) => issue.message);
      res.status(400).json({ message: "Validation error", errors });
      return;
    }

    const student = await User.findById(id).exec();
    if (!student) {
      removeUploadedFile(req.file?.path);
      res.status(404).json({ message: "Student not found" });
      return;
    }

    if (student.manager?.toString() !== req.user?._id) {
      removeUploadedFile(req.file?.path);
      res.status(403).json({
        message: "Forbidden: You are not authorized to update this student",
      });
      return;
    }

    const { name, email, password } = parseResult.data;
    if (email) {
      const emailOwner = await User.findOne({ email });

      if (emailOwner && emailOwner._id.toString() !== id) {
        removeUploadedFile(req.file?.path);

        res.status(409).json({
          message: "Email already used by another user",
        });
        return;
      }
    }

    const hashedPassword = password
      ? bcrypt.hashSync(password, 12)
      : student.password;

    if (req.file && student.photo) {
      const oldPhotoPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "students",
        student.photo,
      );
      removeUploadedFile(oldPhotoPath);
    }

    await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
      photo: req.file ? req.file.filename : student.photo,
    }).exec();

    res.status(200).json({ message: "Update student success" });
  } catch (error) {
    removeUploadedFile(req.file?.path);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStudent = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid student ID format" });
      return;
    }

    const student = await User.findById(id).exec();
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    if (student.manager?.toString() !== req.user?._id) {
      res.status(403).json({
        message: "Forbidden: You are not authorized to delete this student",
      });
      return;
    }

    await Course.updateMany(
      { students: id },
      { $pull: { students: id } },
    ).exec();

    if (student.photo) {
      const photoPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "students",
        student.photo,
      );
      removeUploadedFile(photoPath);
    }

    await User.findByIdAndDelete(id).exec();

    res.status(200).json({ message: "Delete student success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoursesForStudent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)
      .populate<{
        courses: Array<{
          _id: Types.ObjectId;
          name: string;
          thumbnail: string;
          category: { name: string };
        }>;
      }>({
        path: "courses",
        select: "name category thumbnail",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .lean()
      .exec();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const baseUrl =
      process.env.APP_URL ?? `${req.protocol}://${req.get("host")}`;

    const data = (user.courses ?? []).map((course) => ({
      ...course,
      thumbnail_url: `${baseUrl}/uploads/courses/${course.thumbnail}`,
    }));

    res.status(200).json({ message: "Get courses success", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
