import nextEnv from "@next/env";
import nodemailer from "nodemailer";

// Match Next.js production environment loading; never print credentials.
nextEnv.loadEnvConfig(process.cwd(), false);
const value = (name) => process.env[name]?.trim() ?? "";
const failures = [];
const required = (name) => {
  if (!value(name)) failures.push(`${name} is missing.`);
};

try {
  const site = new URL(value("NEXT_PUBLIC_SITE_URL"));
  if (site.protocol !== "https:" || ["localhost", "127.0.0.1"].includes(site.hostname)) {
    failures.push("NEXT_PUBLIC_SITE_URL must be the public HTTPS production origin.");
  }
} catch {
  failures.push("NEXT_PUBLIC_SITE_URL must be a valid public HTTPS origin.");
}

for (const name of ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"]) {
  required(name);
  if (/^[123]x0{10,}/.test(value(name))) failures.push(`${name} is a test key; use a production key.`);
}
if (!value("GOOGLE_SITE_VERIFICATION")) {
  console.log("NOTE: GOOGLE_SITE_VERIFICATION is empty. Confirm Search Console uses DNS verification before launch.");
}
const gaId = value("NEXT_PUBLIC_GA_MEASUREMENT_ID");
if (gaId && !/^G-[A-Z0-9]+$/.test(gaId)) failures.push("NEXT_PUBLIC_GA_MEASUREMENT_ID is not a GA4 measurement ID.");
console.log(gaId ? "Google Analytics: configured (requires visitor consent)." : "Google Analytics: disabled.");

if (value("SMTP_HOST")) {
  const beforeSmtp = failures.length;
  for (const name of ["SMTP_USER", "SMTP_FROM_EMAIL"]) required(name);
  if (!value("SMTP_PASS") && !value("SMTP_API")) failures.push("SMTP_PASS (or SMTP_API) is missing.");
  const port = Number(value("SMTP_PORT") || 587);
  const setting = value("SMTP_SECURE");
  if (!Number.isInteger(port) || port < 1 || port > 65535) failures.push("SMTP_PORT must be a valid port number.");
  if (setting && !["true", "false"].includes(setting)) failures.push("SMTP_SECURE must be true or false.");

  if (process.argv.includes("--smtp") && failures.length === beforeSmtp) {
    const secure = setting ? setting === "true" : port === 465;
    const transport = nodemailer.createTransport({
      host: value("SMTP_HOST"), port, secure, requireTLS: !secure,
      auth: { user: process.env.SMTP_USER, pass: value("SMTP_PASS") ? process.env.SMTP_PASS : process.env.SMTP_API },
      connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
    });
    try {
      await transport.verify();
      console.log("SMTP connection, TLS, and authentication: PASS. No message sent.");
    } catch (error) {
      const code = /^[A-Z_]+$/.test(error.code) ? error.code : "SMTP_ERROR";
      const status = Number.isInteger(error.responseCode) ? `, server status ${error.responseCode}` : "";
      failures.push(`SMTP verification failed: ${code}${status}. Check provider credentials and sender authorization.`);
    } finally {
      transport.close();
    }
  }
} else if (!value("RESEND_API_KEY")) {
  failures.push("Configure SMTP_HOST and credentials, or RESEND_API_KEY.");
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Required launch configuration is present. Validate both real forms and Search Console on the deployed domain.");
}
