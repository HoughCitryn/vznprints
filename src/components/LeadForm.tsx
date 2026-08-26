"use client";

import { useCallback, useState, type FormEvent } from "react";
import { serviceOptions } from "@/content/site";
import type { SubmissionResponse } from "@/lib/forms";
import { Turnstile } from "@/components/Turnstile";

type LeadFormProps = { type: "contact" | "quote" };

const failureMessage = "Something went wrong. Please try again or call 661-546-3113.";

export function LeadForm({ type }: LeadFormProps) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formKey, setFormKey] = useState(0);
  const handleToken = useCallback((value: string) => setToken(value), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFieldErrors({});

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch(`/api/${type}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, turnstileToken: token }),
    }).catch(() => null);

    if (!response) {
      setStatus("error");
      return;
    }

    const result = (await response.json().catch(() => ({ status: "delivery_error" }))) as SubmissionResponse;
    if (response.ok && result.status === "success") {
      setStatus("success");
      form.reset();
      setToken("");
      setFormKey((value) => value + 1);
      window.gtag?.("event", "generate_lead", { form_type: type });
      return;
    }

    setFieldErrors(result.fieldErrors ?? {});
    setStatus("error");
  }

  const errorFor = (field: string) => fieldErrors[field]?.[0];

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${type}-website`}>Website</label>
        <input id={`${type}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor={`${type}-name`}>Name</label>
          <input id={`${type}-name`} name="name" autoComplete="name" required aria-describedby={errorFor("name") ? `${type}-name-error` : undefined} />
          {errorFor("name") ? <span id={`${type}-name-error`} className="field-error">{errorFor("name")}</span> : null}
        </div>
        {type === "quote" ? (
          <div className="field">
            <label htmlFor="quote-company">Company <span>(optional)</span></label>
            <input id="quote-company" name="company" autoComplete="organization" />
          </div>
        ) : null}
        <div className="field">
          <label htmlFor={`${type}-phone`}>{type === "contact" ? "Phone" : "Phone Number"}</label>
          <input id={`${type}-phone`} name="phone" type="tel" autoComplete="tel" required aria-describedby={errorFor("phone") ? `${type}-phone-error` : undefined} />
          {errorFor("phone") ? <span id={`${type}-phone-error`} className="field-error">{errorFor("phone")}</span> : null}
        </div>
        <div className="field">
          <label htmlFor={`${type}-email`}>Email Address</label>
          <input id={`${type}-email`} name="email" type="email" autoComplete="email" required aria-describedby={errorFor("email") ? `${type}-email-error` : undefined} />
          {errorFor("email") ? <span id={`${type}-email-error`} className="field-error">{errorFor("email")}</span> : null}
        </div>
        {type === "quote" ? (
          <>
            <div className="field">
              <label htmlFor="quote-service">Service</label>
              <select id="quote-service" name="service" required defaultValue="">
                <option value="" disabled>Choose a service</option>
                {serviceOptions.map((option) => <option value={option} key={option}>{option}</option>)}
              </select>
              {errorFor("service") ? <span className="field-error">{errorFor("service")}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="quote-quantity">Estimated Quantity</label>
              <input id="quote-quantity" name="quantity" inputMode="numeric" required />
              {errorFor("quantity") ? <span className="field-error">{errorFor("quantity")}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="quote-needed-by">Needed By <span>(optional)</span></label>
              <input id="quote-needed-by" name="neededBy" type="date" />
            </div>
          </>
        ) : null}
      </div>

      <div className="field field--full">
        <label htmlFor={`${type}-message`}>{type === "quote" ? "Project Details" : "Message"}</label>
        <textarea id={`${type}-message`} name={type === "quote" ? "projectDetails" : "message"} rows={7} required />
        {errorFor(type === "quote" ? "projectDetails" : "message") ? (
          <span className="field-error">{errorFor(type === "quote" ? "projectDetails" : "message")}</span>
        ) : null}
      </div>

      <Turnstile key={formKey} onChange={handleToken} />
      <button className="button button--magenta" type="submit" disabled={status === "sending" || !token}>
        {status === "sending" ? "Sending..." : type === "quote" ? "Request My Quote" : "Send Message"}
      </button>
      <div className={`form-status form-status--${status}`} role="status" aria-live="polite">
        {status === "success"
          ? type === "quote"
            ? "Thanks! Your quote request has been sent."
            : "Thanks! Your message has been sent."
          : status === "error"
            ? failureMessage
            : ""}
      </div>
    </form>
  );
}
