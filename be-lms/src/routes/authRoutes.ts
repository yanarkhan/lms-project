import express  from "express";
import { validateRequest } from "../middleware/validateRequest";
import { signUpSchema } from "../utils/schema";
import { signUpAction } from "../controller/authController";

const authRoutes = express.Router()

authRoutes.post("/sign-up", validateRequest(signUpSchema), signUpAction)

export default authRoutes