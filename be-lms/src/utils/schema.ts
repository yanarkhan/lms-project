import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string().min(3),
});

export const signUpSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

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
});

export type ExampleInput = z.infer<typeof exampleSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>;
