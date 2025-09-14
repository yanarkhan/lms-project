import type { Request, Response, NextFunction } from "express";
import Transaction from "../models/transactionModel";
import { PaymentWebhookInput } from "../utils/schema";
import { MongoError } from "mongodb";

export const handlePayment = async (
  req: Request<{}, {}, PaymentWebhookInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { order_id, transaction_status } = req.body;

    let newStatus: string;

    switch (transaction_status) {
      case "capture":
      case "settlement":
        newStatus = "success";
        break;
      case "deny":
      case "expire":
      case "cancel":
        newStatus = "failed";
        break;
      case "pending": // case untuk pending
      default:
        res.status(200).json({ message: "No action needed for this status." });
        return;
    }

    // update status transaksi di database
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      order_id,
      { status: newStatus },
      { new: true } 
    );

    if (!updatedTransaction) {
      res.status(404).json({ message: "Transaction not found." });
      return;
    }

    res.status(200).json({
      message: "Handle Payment Success",
      data: updatedTransaction,
    });
  } catch (error) {
    if (error instanceof MongoError) {
      res.status(500).json({ message: "Database Error." });
    } else {
      next(error);
    }
  }
};
