import express from "express";
import { getCourses, postCourse } from "../controller/courseController";
import { verifyToken } from "../middleware/verifyToken";
import { uploadCourseThumbnail } from "../utils/multer";

const courseRoutes = express.Router();

courseRoutes.get("/courses", verifyToken, getCourses);

courseRoutes.post(
  "/courses",
  verifyToken,
  uploadCourseThumbnail.single("thumbnail"),
  postCourse
);

export default courseRoutes;
