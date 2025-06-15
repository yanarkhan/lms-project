import express, { Request, Response } from "express";
import { helloWorld } from "../controller/globalController";
import { validateRequest } from "../middleware/validateRequest";
import { exampleSchema } from "../utils/schema";

const globalRoutes = express.Router();

globalRoutes.get("/helloWorld", helloWorld);
globalRoutes.post(
  "/test-validate",
  validateRequest(exampleSchema),
  async (req: Request, res: Response): Promise<void> => {
    res.json({ message: "Sukses Validasi", data: req.body });
  }
);

export default globalRoutes;
