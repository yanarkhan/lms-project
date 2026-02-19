import mongoose, { Schema, Document, Types } from "mongoose";
import Course from "./courseModel";

export interface ICourseDetail extends Document {
  _id: Types.ObjectId;
  title: string;
  type: "video" | "text";
  youtubeId?: string;
  text?: string;
  course: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const courseDetailModel: Schema<ICourseDetail> = new Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "text"],
      default: "video",
    },
    youtubeId: { type: String },
    text: { type: String },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

courseDetailModel.post("findOneAndDelete", async (doc) => {
  if (doc) {
    try {
      await Course.findByIdAndUpdate(doc.course, {
        $pull: { details: doc._id },
      }).exec();
    } catch (err) {
      console.error(
        "Failed to cleanup course.details after CourseDetail delete",
        err,
      );
    }
  }
});

const CourseDetail = mongoose.model<ICourseDetail>(
  "CourseDetail",
  courseDetailModel,
);

export default CourseDetail;
