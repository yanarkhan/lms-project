import express from "express";
import {
  deleteCourse,
  getCategories,
  getCourseById,
  getCourses,
  postCourse,
  updateCourse,
} from "../controller/courseController";
import { verifyToken } from "../middleware/verifyToken";
import { uploadCourseThumbnail } from "../utils/multer";

const courseRoutes = express.Router();

courseRoutes.get("/courses", verifyToken, getCourses);
courseRoutes.get("/categories", verifyToken, getCategories);
courseRoutes.get("/courses/:id", verifyToken, getCourseById);

courseRoutes.post(
  "/courses",
  verifyToken,
  uploadCourseThumbnail.single("thumbnail"),
  postCourse
);

courseRoutes.put(
  "/courses/:id",
  verifyToken,
  uploadCourseThumbnail.single("thumbnail"),
  updateCourse
);

courseRoutes.delete("/courses/:id", verifyToken, deleteCourse);

export default courseRoutes;
