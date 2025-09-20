import express from "express";
import { validateRequest } from "../middleware/validateRequest";
import { signInSchema, signUpSchema } from "../utils/schema";
import { signInAction, signUpAction } from "../controller/authController";

const authRoutes = express.Router();

authRoutes.post("/sign-up", validateRequest(signUpSchema), signUpAction);
authRoutes.post("/sign-in", validateRequest(signInSchema), signInAction);
export default authRoutes;
