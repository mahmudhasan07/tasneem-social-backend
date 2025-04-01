import { z } from "zod";

const optionsSchema = z.array(
  z.object({
    service: z.string().nonempty("Service is required."),
    price: z.number().positive("Price must be a positive number."),
  })
);

const createService = z.object({
  categoryId: z.string(),
  description: z
    .string()
    .min(2, "description must be at least 2 characters long")
    .max(120, "description must be less than 120 characters")
    .optional(),
  userAvatar: z.string().optional(),
  name: z
    .string()
    .min(2, "name must be at least 2 characters long")
    .max(20, "name must be at less than 20 characters"),
});

export const serviceValidation = {
  createService,
};
