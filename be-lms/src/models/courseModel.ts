import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICourse extends Document {
  _id: Types.ObjectId;
  name: string;
  thumbnail: string;
  category: Types.ObjectId;
  tagline: string;
  description: string;
  students: Types.ObjectId[];
  manager: Types.ObjectId;
  details: Types.ObjectId[];
}

const courseModel: Schema<ICourse> = new Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  manager: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  details: [
    {
      type: Schema.Types.ObjectId,
      ref: "CourseDetail",
    },
  ],
});

const Course = mongoose.model<ICourse>("Course", courseModel);

export default Course;
