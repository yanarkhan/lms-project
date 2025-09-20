import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { MongoError } from "mongodb";
import User from "../models/userModel";
import Transaction from "../models/transactionModel";
import { SignInInput, SignUpInput } from "../utils/schema";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const signUpAction = async (
  req: Request<{}, {}, SignUpInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const midtransUrl = process.env.MIDTRANS_URL;
    const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
    const clientCallbackUrl = process.env.CLIENT_CALLBACK_URL;

    if (!midtransUrl || !serverKey || !clientCallbackUrl) {
      throw new Error("Missing Midtrans environment variables");
    }

    const authHeader = Buffer.from(`${serverKey}:`).toString("base64");
    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      photo: "default.png",
      password: hashPassword,
      role: "manager",
    });

    const transaction = new Transaction({
      user: user._id,
      price: 280000,
    });

    const orderId = transaction._id.toString();

    const body = {
      transaction_details: {
        order_id: orderId,
        gross_amount: transaction.price,
      },
      credit_card: { secure: true },
      customer_details: { email: user.email },
      callbacks: { finish: clientCallbackUrl },
    };

    const midtransResponse = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(body),
    });

    if (!midtransResponse.ok) {
      const errorData = await midtransResponse.text().catch(() => "");
      throw new Error(
        `Midtrans API Error (${midtransResponse.status}): ${errorData}`
      );
    }

    const resMidtrans = await midtransResponse.json();
    await Promise.all([user.save(), transaction.save()]);

    res.status(201).json({
      message: "Sign Up Success",
      data: { midtrans_payment_url: resMidtrans.redirect_url },
    });
  } catch (error) {
    if (error instanceof MongoError && (error as any).code === 11000) {
      res.status(409).json({ message: "Email already exists." });
    } else {
      next(error);
    }
  }
};

export const signInAction = async (
  req: Request<{}, {}, SignInInput>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).exec();
    if (!existingUser) {
      res.status(404).json({
        message: "Email not registered",
      });
      return;
    }

    const comparePassword = bcrypt.compareSync(password, existingUser.password);
    if (!comparePassword) {
      res.status(401).json({
        message: "Email or password incorrect",
      });
      return;
    }

    if (existingUser.role !== "student") {
      const isValidUser = await Transaction.findOne({
        user: existingUser._id,
        status: "success",
      });

      if (!isValidUser) {
        res.status(403).json({
          message: "User not verified! Please complete your payment.",
        });
      }
      return;
    }

    const secret = process.env.SECRET_KEY_JWT;
    if (!secret) {
      res.status(500).json({
        message: "JWT secret key not configured.",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: (existingUser._id as Types.ObjectId).toString(),
        role: existingUser.role,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      data: {
        name: existingUser.name,
        email: existingUser.email,
        token,
        role: existingUser.role,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
