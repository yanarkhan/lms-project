import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  price: number;
  status: "pending" | "success" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const TransactionModel: Schema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionModel
);

export default Transaction;
