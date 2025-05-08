import { z } from "zod";

export const CommentSchema = z.object({
  comment: z.string().min(3, { message: "must atleast 1 word" }),
});
