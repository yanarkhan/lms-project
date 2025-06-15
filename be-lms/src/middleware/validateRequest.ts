import { AnyZodObject, ZodError, z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((err) => err.message);

        res
          .status(400)
          .json({ error: "Invalid Request", details: errorMessage });
      }

      console.error("Unhandled error in validateRequest middleware:", error);
      res.status(500).json({ error: "Internal Server Error" }); // Menangani error non-Zod
    }
  };
