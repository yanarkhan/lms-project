import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const COURSE_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "courses"
);

if (!fs.existsSync(COURSE_UPLOAD_DIR)) {
  fs.mkdirSync(COURSE_UPLOAD_DIR, { recursive: true });
}

export const fileStorageCourse = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, COURSE_UPLOAD_DIR);
  },
  filename: (_req, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueId}${ext}`);
  },
});

export const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only PNG, JPG, or JPEG are allowed."));
  }
};

export const uploadCourseThumbnail = multer({
  storage: fileStorageCourse,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
