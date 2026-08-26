import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/submissions", () => ({
  verifyTurnstile: vi.fn(),
  sendContactEmail: vi.fn(),
}));

import { POST } from "@/app/api/contact/route";
import { sendContactEmail, verifyTurnstile } from "@/lib/submissions";

const payload = {
  name: "Jane Smith",
  phone: "661-555-1212",
  email: "jane@example.com",
  message: "Please quote 50 printed shirts.",
  turnstileToken: "test-token",
  website: "",
};

const request = (body: unknown) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/contact", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns success after verification and delivery", async () => {
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
    vi.mocked(sendContactEmail).mockResolvedValue({ id: "email-id" });
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "success" });
  });

  it("returns validation_error", async () => {
    const response = await POST(request({ ...payload, email: "nope" }));
    expect(response.status).toBe(400);
    expect((await response.json()).status).toBe("validation_error");
  });

  it("returns spam_rejected", async () => {
    vi.mocked(verifyTurnstile).mockResolvedValue(false);
    const response = await POST(request(payload));
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ status: "spam_rejected" });
  });

  it("returns delivery_error", async () => {
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
    vi.mocked(sendContactEmail).mockRejectedValue(new Error("failed"));
    const response = await POST(request(payload));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ status: "delivery_error" });
  });
});
