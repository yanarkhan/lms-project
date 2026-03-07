import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createDiskStorage = (uploadPath: string) => {
  const fullPath = path.join(process.cwd(), "public", "uploads", uploadPath);
  ensureDir(fullPath);

  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, fullPath);
    },
    filename: (_req, file: Express.Multer.File, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${uniqueId}${ext}`);
    },
  });
};
export const imageFileFilter: multer.Options["fileFilter"] = (
  _req,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."));
  }
};

export const uploadCourseThumbnail = multer({
  storage: createDiskStorage("courses"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const uploadStudentPhoto = multer({
  storage: createDiskStorage("students"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const removeUploadedFile = (filePath: string | undefined): void => {
  if (!filePath) return;
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};