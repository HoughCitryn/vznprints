import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail, createTransport, resendSend } = vi.hoisted(() => ({
  sendMail: vi.fn(),
  createTransport: vi.fn(),
  resendSend: vi.fn(),
}));

vi.mock("nodemailer", () => ({ default: { createTransport } }));
vi.mock("resend", () => ({ Resend: class { emails = { send: resendSend }; } }));

import { sendWebsiteEmail } from "@/lib/mail";
import { sendContactEmail, sendQuoteEmail } from "@/lib/submissions";

const message = { replyTo: "customer@example.com", subject: "Print enquiry", html: "<p>Hello</p>" };

describe("website email delivery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const name of ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASS", "SMTP_API", "SMTP_FROM_EMAIL", "CONTACT_TO_EMAIL", "RESEND_API_KEY", "RESEND_FROM_EMAIL"]) {
      vi.stubEnv(name, "");
    }
    createTransport.mockReturnValue({ sendMail });
    sendMail.mockResolvedValue({ messageId: "smtp-id", accepted: ["contact@vznprints.com"], rejected: [] });
    resendSend.mockResolvedValue({ data: { id: "resend-id" }, error: null });
  });

  afterEach(() => vi.unstubAllEnvs());

  function configureSmtp() {
    vi.stubEnv("SMTP_HOST", "smtp.example.com");
    vi.stubEnv("SMTP_USER", "username");
    vi.stubEnv("SMTP_PASS", "password");
    vi.stubEnv("SMTP_FROM_EMAIL", "VZN Prints <website@example.com>");
  }

  it("uses authenticated STARTTLS and the configured sender and recipient", async () => {
    configureSmtp();
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
    await expect(sendWebsiteEmail(message)).resolves.toEqual({ id: "smtp-id" });
    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: "smtp.example.com", port: 587, secure: false, requireTLS: true,
      auth: { user: "username", pass: "password" },
    }));
    expect(sendMail).toHaveBeenCalledWith({ ...message, from: "VZN Prints <website@example.com>", to: "inbox@example.com" });
  });

  it("uses implicit TLS on port 465", async () => {
    configureSmtp();
    vi.stubEnv("SMTP_PORT", "465");
    vi.stubEnv("SMTP_SECURE", "true");
    await sendWebsiteEmail(message);
    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({ port: 465, secure: true, requireTLS: false }));
  });

  it("accepts SMTP_API as the provider's password alias", async () => {
    configureSmtp();
    vi.stubEnv("SMTP_PASS", "");
    vi.stubEnv("SMTP_API", "provider-password");
    await sendWebsiteEmail(message);
    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({
      auth: { user: "username", pass: "provider-password" },
    }));
  });

  it("prefers SMTP_PASS when both password variables are set", async () => {
    configureSmtp();
    vi.stubEnv("SMTP_API", "older-password");
    await sendWebsiteEmail(message);
    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({
      auth: { user: "username", pass: "password" },
    }));
  });

  it("prefers SMTP when both providers are configured", async () => {
    configureSmtp();
    vi.stubEnv("RESEND_API_KEY", "re_test");
    await sendWebsiteEmail(message);
    expect(resendSend).not.toHaveBeenCalled();
  });

  it.each(["SMTP_USER", "SMTP_PASS", "SMTP_FROM_EMAIL"])("fails before connecting when %s is missing", async (name) => {
    configureSmtp();
    vi.stubEnv(name, "");
    await expect(sendWebsiteEmail(message)).rejects.toThrow(name);
    expect(createTransport).not.toHaveBeenCalled();
  });

  it.each(["abc", "0", "65536", "587.5"])("rejects invalid SMTP port %s", async (port) => {
    configureSmtp();
    vi.stubEnv("SMTP_PORT", port);
    await expect(sendWebsiteEmail(message)).rejects.toThrow("SMTP_PORT");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects an invalid TLS setting", async () => {
    configureSmtp();
    vi.stubEnv("SMTP_SECURE", "yes");
    await expect(sendWebsiteEmail(message)).rejects.toThrow("SMTP_SECURE");
  });

  it("does not report success when the SMTP server rejects recipients", async () => {
    configureSmtp();
    sendMail.mockResolvedValue({ messageId: "smtp-id", accepted: [], rejected: ["contact@vznprints.com"] });
    await expect(sendWebsiteEmail(message)).rejects.toThrow("not accepted");
  });

  it("propagates SMTP failures without retrying through another provider", async () => {
    configureSmtp();
    vi.stubEnv("RESEND_API_KEY", "re_test");
    sendMail.mockRejectedValue(new Error("Connection failed"));
    await expect(sendWebsiteEmail(message)).rejects.toThrow("Connection failed");
    expect(resendSend).not.toHaveBeenCalled();
  });

  it("preserves Resend delivery when SMTP is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    await expect(sendWebsiteEmail(message)).resolves.toEqual({ id: "resend-id" });
    expect(resendSend).toHaveBeenCalledWith(expect.objectContaining({ ...message, to: "contact@vznprints.com" }));
    expect(createTransport).not.toHaveBeenCalled();
  });

  it("fails clearly when neither provider is configured", async () => {
    await expect(sendWebsiteEmail(message)).rejects.toThrow("Configure SMTP_HOST or RESEND_API_KEY");
  });

  it("delivers contact and quote templates with escaped HTML and customer Reply-To", async () => {
    configureSmtp();
    const contact = { name: "Jane <Smith>", phone: "661-555-1212", email: "jane@example.com", turnstileToken: "test-token" };
    await sendContactEmail({ ...contact, message: "Print <script>alert(1)</script>\n50 shirts" });
    await sendQuoteEmail({ ...contact, service: "Apparel Printing", quantity: "50", projectDetails: "Print <b>our logo</b>" });
    expect(sendMail).toHaveBeenCalledTimes(2);
    expect(sendMail.mock.calls[0][0]).toMatchObject({ replyTo: contact.email });
    expect(sendMail.mock.calls[0][0].html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;<br>50 shirts");
    expect(sendMail.mock.calls[1][0].html).toContain("&lt;b&gt;our logo&lt;/b&gt;");
    expect(sendMail.mock.calls[1][0].html).toContain("Apparel Printing");
  });
});
