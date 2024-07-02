import { z } from "zod";

export const model = "category";

// Define the schema using Zod

export const todoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(200),
  completed: z.boolean(),
});
export type Todo = z.infer<typeof todoSchema>;
