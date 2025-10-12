import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  photo: string;
  email: string;
  password: string;
  role: "manager" | "student";
  courses: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserModel: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["manager", "student"],
      default: "manager",
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserModel);

export default User;
