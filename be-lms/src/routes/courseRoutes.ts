import express from "express";
import {
  deleteContentCourse,
  deleteCourse,
  getCategories,
  getCourseById,
  getCourses,
  postContentCourse,
  postCourse,
  updateContentCourse,
  updateCourse,
} from "../controller/courseController";
import { verifyToken } from "../middleware/verifyToken";
import { uploadCourseThumbnail } from "../utils/multer";
import { mutateContentSchema } from "../utils/schema";
import { validateRequest } from "../middleware/validateRequest";

const courseRoutes = express.Router();

courseRoutes.get("/courses", verifyToken, getCourses);
courseRoutes.get("/categories", verifyToken, getCategories);
courseRoutes.get("/courses/:id", verifyToken, getCourseById);
courseRoutes.post(
  "/courses",
  verifyToken,
  uploadCourseThumbnail.single("thumbnail"),
  postCourse,
);
courseRoutes.put(
  "/courses/:id",
  verifyToken,
  uploadCourseThumbnail.single("thumbnail"),
  updateCourse,
);
courseRoutes.delete("/courses/:id", verifyToken, deleteCourse);

courseRoutes.post(
  "/courses/contents",
  verifyToken,
  validateRequest(mutateContentSchema),
  postContentCourse,
);
courseRoutes.put(
  "/courses/contents/:id",
  verifyToken,
  validateRequest(mutateContentSchema),
  updateContentCourse,
);
courseRoutes.delete("/courses/contents/:id", verifyToken, deleteContentCourse);

export default courseRoutes;
