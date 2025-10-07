import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICourseDetail extends Document {
  _id: Types.ObjectId;
  title: "video" | "text";
  videoId?: string;
  text?: string;
  course: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const courseDetailModel: Schema<ICourseDetail> = new Schema(
  {
    title: {
      type: String,
      enum: ["video", "text"],
      default: "video",
    },
    videoId: { type: String },
    text: { type: String },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  {
    timestamps: true,
  }
);

const CourseDetail = mongoose.model<ICourseDetail>(
  "CourseDetail",
  courseDetailModel
);

export default CourseDetail;
