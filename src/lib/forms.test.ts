import { describe, expect, it } from "vitest";
import { contactSchema, quoteSchema } from "@/lib/forms";

const contact = {
  name: "Jane Smith",
  phone: "661-555-1212",
  email: "jane@example.com",
  message: "Please quote 50 printed shirts.",
  turnstileToken: "test-token",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a complete contact submission", () => {
    expect(contactSchema.safeParse(contact).success).toBe(true);
  });

  it("rejects invalid fields", () => {
    expect(contactSchema.safeParse({ ...contact, email: "wrong" }).success).toBe(false);
  });
});

describe("quoteSchema", () => {
  const quote = {
    ...contact,
    company: "Example Co",
    service: "Apparel Printing",
    quantity: "50",
    neededBy: "2026-10-01",
    projectDetails: contact.message,
  };

  it("accepts a valid quote", () => {
    expect(quoteSchema.safeParse(quote).success).toBe(true);
  });

  it("rejects an unsupported service", () => {
    expect(quoteSchema.safeParse({ ...quote, service: "Web Design" }).success).toBe(false);
  });
});
