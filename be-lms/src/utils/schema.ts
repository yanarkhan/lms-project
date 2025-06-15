import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
});

export type ExampleInput = z.infer<typeof exampleSchema>;
