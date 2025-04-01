import { z } from "zod";

const optionsSchema = z.array(
  z.object({
    service: z.string().nonempty("Service is required."),
    price: z.number().positive("Price must be a positive number."),
    time: z.string().nonempty("Service Time is required"),
  })
);

const createProvideService = z.object({
  service: z
    .string()
    .min(2, "service name must be at least 2 characters long")
    .max(30, "service name must be at less than 30 characters"),
  description: z
    .string()
    .min(2, "description must be at least 2 characters long")
    .max(120, "description must be less than 120 characters"),
  options: optionsSchema,
});

export const provideServiceValidation = {
  createProvideService,
};
