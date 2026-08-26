import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/submissions", () => ({
  verifyTurnstile: vi.fn(),
  sendQuoteEmail: vi.fn(),
}));

import { POST } from "@/app/api/quote/route";
import { sendQuoteEmail, verifyTurnstile } from "@/lib/submissions";

const payload = {
  name: "Jane Smith",
  company: "Example Co",
  phone: "661-555-1212",
  email: "jane@example.com",
  service: "Apparel Printing",
  quantity: "50",
  neededBy: "2026-10-01",
  projectDetails: "Please quote 50 printed shirts.",
  turnstileToken: "test-token",
  website: "",
};

const request = (body: unknown) =>
  new Request("http://localhost/api/quote", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/quote", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns success after verification and delivery", async () => {
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
    vi.mocked(sendQuoteEmail).mockResolvedValue({ id: "email-id" });
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "success" });
  });

  it("returns validation_error", async () => {
    const response = await POST(request({ ...payload, quantity: "" }));
    expect(response.status).toBe(400);
    expect((await response.json()).status).toBe("validation_error");
  });

  it("returns spam_rejected for a filled honeypot", async () => {
    const response = await POST(request({ ...payload, website: "bot" }));
    expect(response.status).toBe(400);
    expect((await response.json()).status).toBe("spam_rejected");
  });

  it("returns delivery_error", async () => {
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
    vi.mocked(sendQuoteEmail).mockRejectedValue(new Error("failed"));
    const response = await POST(request(payload));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ status: "delivery_error" });
  });
});
