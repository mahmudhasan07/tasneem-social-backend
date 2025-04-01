import { z } from "zod";

const reviewSchema = z.object({
  rating: z
    .number({
      invalid_type_error: "Rating must be a number.",
      required_error: "Rating is required.",
    })
    .refine((value) => value >= 0, {
      message: "Rating must be a positive number.",
    })
    .refine((value) => value <= 5, {
      message: "Rating must be 5 or less.",
    }),
  review: z
    .string()
    .min(10, "review minimum atleast 10 characters long")
    .max(1000, "review maximum atleast 1000 characters long"),
  reviewFile: z.string().optional(),
});

export const reviewValidation = { reviewSchema };
