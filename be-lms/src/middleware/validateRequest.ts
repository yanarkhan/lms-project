import { AnyZodObject, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Validasi body request
      schema.parse(req.body);
      // 2. Jika validasi berhasil, lanjutkan ke middleware atau controller berikutnya
      next();
    } catch (error) {
      // 3. Tangani error validasi Zod
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((err) => err.message);

        res
          .status(400)
          .json({ error: "Invalid Request", details: errorMessage });

        return; // untuk menghentikan eksekusi dan mencegah kode di bawahnya berjalan
      }
      next(error);
    }
  };
