import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  courses: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const categoryModel: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategory>("Category", categoryModel);

export default Category;
