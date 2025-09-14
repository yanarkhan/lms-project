import type { Request, Response, NextFunction } from "express";
import { MongoError } from "mongodb";
import Transaction from "../models/transactionModel";
import type { PaymentWebhookInput } from "../utils/schema";

export const handlePayment = async (
  req: Request<{}, {}, PaymentWebhookInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { order_id, transaction_status, fraud_status } = req.body;

    let newStatus: "pending" | "success" | "failed";

    switch (transaction_status) {
      case "settlement":
        newStatus = "success";
        break;

      case "capture":
        newStatus = fraud_status === "accept" ? "success" : "pending";
        break;

      case "deny":
      case "expire":
      case "cancel":
        newStatus = "failed";
        break;

      // "pending", "refund", "partial_refund", "chargeback", "authorize", dll
      default:
        newStatus = "pending";
        break;
    }

    const transactionDoc = await Transaction.findById(order_id);
    if (!transactionDoc) {
      res.status(404).json({ message: "Transaction not found." });
      return;
    }

    if (transactionDoc.status === "success" && newStatus !== "success") {
      res.status(200).json({
        ok: true,
        order_id,
        status: transactionDoc.status,
      });
      return;
    }

    if (transactionDoc.status !== newStatus) {
      transactionDoc.status = newStatus;
      await transactionDoc.save();
    }

    res.status(200).json({
      ok: true,
      order_id,
      status: transactionDoc.status,
    });
  } catch (err) {
    if (err instanceof MongoError) {
      res.status(500).json({ message: "Database Error." });
    } else {
      next(err);
    }
  }
};
