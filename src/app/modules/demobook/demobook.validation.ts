import { z } from "zod";

const demoBookValidationSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required.",
      invalid_type_error: "First name must be a string.",
    })
    .min(1, "First name cannot be empty.")
    .max(50, "First name must not exceed 50 characters."),
  lastName: z
    .string({
      required_error: "Last name is required.",
      invalid_type_error: "Last name must be a string.",
    })
    .min(1, "Last name cannot be empty.")
    .max(50, "Last name must not exceed 50 characters."),
  email: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Email must be a valid string.",
    })
    .email("Email must be a valid email address."),
  phoneNumber: z
    .string({
      invalid_type_error: "Phone number must be a string.",
    })
    .optional(),
  selectDateTime: z
    .string({
      required_error: "Select date and time is required.",
      invalid_type_error: "Date must be a valid ISO string.",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Date must be a valid ISO 8601 string.",
    }),
  websiteUrl: z
    .string({
      required_error: "Website URL is required.",
      invalid_type_error: "Website URL must be a string.",
    })
    .url("Website URL must be a valid URL."),
  reasonOfCall: z
    .string({
      required_error: "Reason of call is required.",
      invalid_type_error: "Reason of call must be a string.",
    })
    .min(1, "Reason of call cannot be empty."),
  shortPitch: z
    .string({
      required_error: "Short pitch is required.",
      invalid_type_error: "Short pitch must be a string.",
    })
    .min(10, "Short pitch must be at least 10 characters long.")
    .max(200, "Short pitch must not exceed 200 characters."),
  message: z
    .string({
      required_error: "Message is required.",
      invalid_type_error: "Message must be a string.",
    })
    .min(1, "Message cannot be empty."),
});

const updateDemoValidationSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required.",
      invalid_type_error: "First name must be a string.",
    })
    .min(1, "First name cannot be empty.")
    .max(50, "First name must not exceed 50 characters.")
    .optional(),
  lastName: z
    .string({
      required_error: "Last name is required.",
      invalid_type_error: "Last name must be a string.",
    })
    .min(1, "Last name cannot be empty.")
    .max(50, "Last name must not exceed 50 characters.")
    .optional(),
  email: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Email must be a valid string.",
    })
    .email("Email must be a valid email address.")
    .optional(),
  phoneNumber: z
    .string({
      invalid_type_error: "Phone number must be a string.",
    })
    .optional()
    .optional(),
  selectDateTime: z
    .string({
      required_error: "Select date and time is required.",
      invalid_type_error: "Date must be a valid ISO string.",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Date must be a valid ISO 8601 string.",
    })
    .optional(),
  websiteUrl: z
    .string({
      required_error: "Website URL is required.",
      invalid_type_error: "Website URL must be a string.",
    })
    .url("Website URL must be a valid URL.")
    .optional(),
  reasonOfCall: z
    .string({
      required_error: "Reason of call is required.",
      invalid_type_error: "Reason of call must be a string.",
    })
    .min(1, "Reason of call cannot be empty.")
    .optional(),
  shortPitch: z
    .string({
      required_error: "Short pitch is required.",
      invalid_type_error: "Short pitch must be a string.",
    })
    .min(10, "Short pitch must be at least 10 characters long.")
    .max(200, "Short pitch must not exceed 200 characters.")
    .optional(),
  message: z
    .string({
      required_error: "Message is required.",
      invalid_type_error: "Message must be a string.",
    })
    .min(1, "Message cannot be empty.")
    .optional(),
});

export const demoBookValidation = {
  demoBookValidationSchema,
  updateDemoValidationSchema,
};
