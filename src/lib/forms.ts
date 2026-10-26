import { z } from "zod";
import { serviceOptions } from "@/content/site";

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(30, "Enter a valid phone number.");

const email = z.string().trim().email("Enter a valid email address.").max(254);
const turnstileToken = z.string().trim().min(1, "Please complete the security check.").max(2048);
const honeypot = z.string().max(200).optional().default("");

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  phone,
  email,
  message: z.string().trim().min(10, "Tell us a little more about your project.").max(5000),
  turnstileToken,
  website: honeypot,
});

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  company: z.string().trim().max(150).optional().default(""),
  phone,
  email,
  service: z.enum(serviceOptions, { message: "Choose a service." }),
  quantity: z.string().trim().min(1, "Enter an estimated quantity.").max(100),
  neededBy: z.string().trim().max(30).optional().default(""),
  projectDetails: z
    .string()
    .trim()
    .min(10, "Tell us a little more about your project.")
    .max(5000),
  turnstileToken,
  website: honeypot,
});

export type { ContactSubmission, QuoteSubmission } from "@/content/models";

export type SubmissionStatus =
  | "success"
  | "validation_error"
  | "spam_rejected"
  | "delivery_error";

export type SubmissionResponse = {
  status: SubmissionStatus;
  fieldErrors?: Record<string, string[]>;
};
