import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  photo: string;
  email: string;
  password: string;
  role: "manager" | "student";
  createdAt: Date;
  updatedAt: Date;
}

const UserModel: Schema = new mongoose.Schema({
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
});

const User = mongoose.model<IUser>("User", UserModel);

export default User;
