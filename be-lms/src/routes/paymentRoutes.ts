console.log("[ROUTE] /api/handle-payment-midtrans registered");

import express from "express";
import { handlePayment } from "../controller/paymentController";
import { validatePaymentSignature } from "../middleware/paymentSignature";
import type { Request, Response, NextFunction } from "express";

const paymentRoutes = express.Router();
paymentRoutes.post(
  "/handle-payment-midtrans",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("[ROUTE] hit /api/handle-payment-midtrans");
    next();
  },
  validatePaymentSignature,
  handlePayment
);

export default paymentRoutes;
