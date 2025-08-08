import {z} from "zod";

export const Todo = z.object({
  title: z.string().min(5, "Title Must be Atleast 5 Aplhabet Long"),
  description: z
    .string()
    .min(10, "Description Must be Atleast 10 Alphabet Long"),
});
