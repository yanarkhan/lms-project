import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { ZodError } from "zod";
import { paymentWebhookSchema } from "../utils/schema";

export const validatePaymentSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = await paymentWebhookSchema.parseAsync(req.body);
    const { order_id, status_code, gross_amount, signature_key } = parsed;

    const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
    if (!serverKey) {
      res.status(500).json({ message: "Missing MIDTRANS_SERVER_KEY." });
      return;
    }

    const raw = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const computedHex = crypto.createHash("sha512").update(raw).digest("hex").toLowerCase();
    const receivedHex = (signature_key || "").toLowerCase();

    // timing-safe compare
    const a = Buffer.from(computedHex, "hex");
    const b = Buffer.from(receivedHex, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      res.status(401).json({ message: "Invalid signature key." });
      return;
    }

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        message: "Invalid payload.",
        details: err.issues.map((i) => i.message),
      });
      return;
    }
    res.status(500).json({ message: "Internal server error." });
  }
};
