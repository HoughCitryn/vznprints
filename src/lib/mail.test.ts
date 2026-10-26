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
    for (const name of ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASS", "SMTP_API", "SMTP_CHANNEL", "CONTACT_FROM_EMAIL", "SMTP_FROM_EMAIL", "CONTACT_TO_EMAIL", "RESEND_API_KEY", "RESEND_FROM_EMAIL"]) {
      vi.stubEnv(name, "");
    }
    createTransport.mockReturnValue({ sendMail });
    sendMail.mockResolvedValue({ messageId: "smtp-id", accepted: ["contact@vznprints.com"], rejected: [] });
    resendSend.mockResolvedValue({ data: { id: "resend-id" }, error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

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

  it("does not treat SMTP_API as an SMTP password", async () => {
    configureSmtp();
    vi.stubEnv("SMTP_PASS", "");
    vi.stubEnv("SMTP_API", "provider-password");
    await expect(sendWebsiteEmail(message)).rejects.toThrow("SMTP_CHANNEL");
    expect(createTransport).not.toHaveBeenCalled();
  });

  it("requires complete API configuration instead of using stale SMTP credentials", async () => {
    configureSmtp();
    vi.stubEnv("SMTP_API", "older-password");
    await expect(sendWebsiteEmail(message)).rejects.toThrow("SMTP_CHANNEL");
    expect(createTransport).not.toHaveBeenCalled();
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
    await expect(sendWebsiteEmail(message)).rejects.toThrow("Configure SMTP_API");
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

  function configureApi() {
    vi.stubEnv("SMTP_API", "test-api-key");
    vi.stubEnv("SMTP_CHANNEL", "vzn-channel");
    vi.stubEnv("CONTACT_FROM_EMAIL", "contactforms@citryn.com");
    const api = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: "success", data: { msg_id: "accepted-id" } }) });
    vi.stubGlobal("fetch", api);
    return api;
  }

  it.each([
    { status: "success", data: { msg_id: "accepted-id" } },
    { status: "success", data: { message: "accepted, msg_id: accepted-id" } },
  ])("recognizes SMTP.com acceptance and uses the authenticated sender: %j", async (result) => {
    configureSmtp();
    vi.stubEnv("RESEND_API_KEY", "resend-key");
    const api = configureApi();
    api.mockResolvedValue({ ok: true, json: async () => result });
    await expect(sendWebsiteEmail(message)).resolves.toEqual({ id: "accepted-id" });
    expect(api).toHaveBeenCalledOnce();
    expect(api.mock.calls[0][0]).toBe("https://api.smtp.com/v4/messages");
    const request = api.mock.calls[0][1];
    expect(request).toMatchObject({
      method: "POST", redirect: "error", signal: expect.any(AbortSignal),
      headers: { "X-SMTPCOM-API": "test-api-key", "Content-Type": "application/json" },
    });
    expect(JSON.parse(request.body)).toEqual({
      channel: "vzn-channel",
      recipients: { to: [{ address: "contact@vznprints.com" }] },
      originator: {
        from: { name: "VZN Prints", address: "contactforms@citryn.com" },
        reply_to: { address: message.replyTo },
      },
      subject: message.subject,
      body: { parts: [{ type: "text/html", charset: "UTF-8", content: message.html }] },
    });
    expect(createTransport).not.toHaveBeenCalled();
    expect(resendSend).not.toHaveBeenCalled();
  });

  it.each([
    ["SMTP_API", ""], ["SMTP_CHANNEL", ""], ["CONTACT_FROM_EMAIL", ""],
    ["CONTACT_FROM_EMAIL", "bad-email"], ["CONTACT_TO_EMAIL", "bad-email"],
  ])("rejects incomplete API configuration before contacting a provider: %s", async (key, value) => {
    configureSmtp();
    const api = configureApi();
    vi.stubEnv(key, value);
    await expect(sendWebsiteEmail(message)).rejects.toThrow("Configure SMTP_API");
    expect(api).not.toHaveBeenCalled();
    expect(createTransport).not.toHaveBeenCalled();
    expect(resendSend).not.toHaveBeenCalled();
  });

  it.each([
    { status: "fail", data: { msg_id: "id" } },
    { status: "success", data: { msg_id: " " } },
    { status: "success", data: { message: "accepted" } },
    { status: "success", data: { message: "accepted, msg_id: " } },
    null,
  ])("does not claim delivery without an accepted message ID: %j", async (result) => {
    configureSmtp();
    const api = configureApi();
    api.mockResolvedValue({ ok: true, json: async () => result });
    await expect(sendWebsiteEmail(message)).rejects.toThrow("did not confirm message acceptance");
    expect(api).toHaveBeenCalledOnce();
    expect(createTransport).not.toHaveBeenCalled();
    expect(resendSend).not.toHaveBeenCalled();
  });

  it.each(["http", "network", "invalid-json"])("does not retry through another provider after an API %s failure", async (failure) => {
    configureSmtp();
    vi.stubEnv("RESEND_API_KEY", "resend-key");
    const api = configureApi();
    if (failure === "network") api.mockRejectedValue(new Error("API unavailable"));
    else if (failure === "http") api.mockResolvedValue({ ok: false, status: 403 });
    else api.mockResolvedValue({ ok: true, json: async () => { throw new SyntaxError("invalid response"); } });
    await expect(sendWebsiteEmail(message)).rejects.toThrow();
    expect(api).toHaveBeenCalledOnce();
    expect(createTransport).not.toHaveBeenCalled();
    expect(resendSend).not.toHaveBeenCalled();
  });

  it("sends both form templates through the API with escaped content and visitor Reply-To", async () => {
    const api = configureApi();
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
    const contact = { name: "Jane <Smith>", phone: "661-555-1212", email: "jane@example.com", turnstileToken: "test-token" };
    await sendContactEmail({ ...contact, message: "Print <script>alert(1)</script>\n50 shirts" });
    await sendQuoteEmail({ ...contact, service: "Apparel Printing", quantity: "50", projectDetails: "Print <b>our logo</b>" });
    expect(api).toHaveBeenCalledTimes(2);
    const bodies = api.mock.calls.map(([, request]) => JSON.parse(request.body));
    for (const body of bodies) {
      expect(body.originator.reply_to).toEqual({ address: contact.email });
      expect(body.recipients.to).toEqual([{ address: "inbox@example.com" }]);
      expect(body.body.parts[0].content).toContain("Jane &lt;Smith&gt;");
    }
    expect(bodies[0].body.parts[0].content).toContain("&lt;script&gt;alert(1)&lt;/script&gt;<br>50 shirts");
    expect(bodies[1].body.parts[0].content).toContain("&lt;b&gt;our logo&lt;/b&gt;");
    expect(bodies[1].subject).toContain("Apparel Printing");
  });
});
