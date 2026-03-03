import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const signInSchema = signUpSchema.omit({ name: true });

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export const createCourseSchema = z.object({
  name: z.string().min(5, "Course name must be at least 5 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  thumbnail: z
    .instanceof(File, { message: "Thumbnail image is required." })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE_BYTES,
      `Max file size is ${MAX_FILE_SIZE_MB}MB.`,
    )
    .refine(
      (file) => ALLOWED_MIME_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, and .webp formats are supported.",
    ),
});

export const updateCourseSchema = createCourseSchema.partial({
  thumbnail: true,
});

export const mutateContentSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    courseId: z.string().min(1, "Course ID is required"),
    type: z
      .string()
      .refine(
        (val): val is "video" | "text" => val === "video" || val === "text",
        { message: "Please select a content type" },
      ),
    youtubeId: z.string().optional(),
    text: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "video" &&
      (!data.youtubeId || data.youtubeId.length < 3)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "YouTube Video ID is required for video content (min 3 characters)",
        path: ["youtubeId"],
      });
    }
    if (data.type === "text" && (!data.text || data.text.length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Text content is required (min 10 characters)",
        path: ["text"],
      });
    }
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;
export type UpdateCourseFormValues = z.infer<typeof updateCourseSchema>;

export type MutateContentInput = z.input<typeof mutateContentSchema>;
export type MutateContentOutput = z.output<typeof mutateContentSchema>;
export type MutateContentFormValues = MutateContentInput;
