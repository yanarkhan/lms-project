import { Types } from "mongoose";
import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string().min(3),
});

export const signUpSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const signInSchema = signUpSchema.omit({ name: true });

export const paymentWebhookSchema = z.object({
  order_id: z.string(),
  transaction_status: z.enum([
    "capture",
    "settlement",
    "pending",
    "deny",
    "expire",
    "cancel",
    "refund",
    "partial_refund",
    "chargeback",
    "authorize",
  ]),
  status_code: z.string(),
  gross_amount: z.string(), // dari midtrans ngirimnya as a string
  signature_key: z.string(),
  fraud_status: z.enum(["accept", "challenge", "deny"]).optional(),
});

export const mutateCourseSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  categoryId: z
    .string()
    .min(1, "Category ID is required")
    .refine((v) => Types.ObjectId.isValid(v), "Invalid category id format"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

export const mutateContentSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    courseId: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), "Invalid Course ID format"),
    type: z.enum(["video", "text"]),
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
        message: "Youtube ID is required for video content",
        path: ["youtubeId"],
      });
    }
    if (data.type === "text" && (!data.text || data.text.length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Text content is required (min 10 chars)",
        path: ["text"],
      });
    }
  });

export type ExampleInput = z.infer<typeof exampleSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type MutateCourseInput = z.infer<typeof mutateCourseSchema>;
export type MutateContentInput = z.infer<typeof mutateContentSchema>;
