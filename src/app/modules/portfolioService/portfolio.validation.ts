import { z } from "zod";

const portfolioSchema = z.object({
  categoryId: z.string(),
  description: z
    .string()
    .min(2, "description must be at least 2 characters long")
    .max(120, "description must be less than 120 characters")
    .optional(),
  userAvatar: z.string().optional(),
  protfolioType: z
    .string()
    .min(2, "name must be at least 2 characters long")
    .max(20, "name must be at less than 20 characters"),
});

export const portfolioValidation = { portfolioSchema };
