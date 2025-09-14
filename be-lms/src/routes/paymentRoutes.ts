import express from "express";
import { handlePayment } from "../controller/paymentController";
import { validatePaymentSignature } from "../middleware/paymentSignature";

const paymentRoutes = express.Router();
paymentRoutes.post(
  "/handle-payment-midtrans",
  validatePaymentSignature,
  handlePayment
);

export default paymentRoutes;
