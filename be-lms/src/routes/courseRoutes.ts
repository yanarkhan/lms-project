import express from "express";
import { getCourses } from "../controller/courseController";
import { verifyToken } from "../middleware/verifyToken";

const courseRoutes = express.Router();

courseRoutes.get("/courses", verifyToken, getCourses);

export default courseRoutes;
