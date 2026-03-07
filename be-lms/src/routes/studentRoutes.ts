import express from "express";
import {
  getStudents,
  getStudentById,
  postStudent,
  updateStudent,
  deleteStudent,
  getCoursesForStudent,
} from "../controller/studentController";
import { verifyToken } from "../middleware/verifyToken";
import { uploadStudentPhoto } from "../utils/multer";

const studentRoutes = express.Router();

studentRoutes.get("/students", verifyToken, getStudents);
studentRoutes.get("/students/:id", verifyToken, getStudentById);

studentRoutes.post(
  "/students",
  verifyToken,
  uploadStudentPhoto.single("photo"),
  postStudent,
);

studentRoutes.put(
  "/students/:id",
  verifyToken,
  uploadStudentPhoto.single("photo"),
  updateStudent,
);

studentRoutes.delete("/students/:id", verifyToken, deleteStudent);

studentRoutes.get("/students/courses", verifyToken, getCoursesForStudent);

export default studentRoutes;
