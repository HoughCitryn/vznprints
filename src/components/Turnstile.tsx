"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

type TurnstileProps = {
  onChange: (token: string) => void;
};

export function Turnstile({ onChange }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const renderWidget = useCallback(() => {
    if (!siteKey || !container.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      callback: onChange,
      "expired-callback": () => onChange(""),
      "error-callback": () => onChange(""),
      theme: "light",
    });
  }, [onChange, siteKey]);

  useEffect(() => {
    if (!siteKey && process.env.NODE_ENV === "development") onChange("development-bypass");
    renderWidget();
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [onChange, siteKey, renderWidget]);

  if (!siteKey) {
    return <p className="form-note">{process.env.NODE_ENV === "development"
      ? "Local development: security verification is bypassed."
      : "The form is temporarily unavailable. Please call 661-546-3113 or email contact@vznprints.com."}</p>;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderWidget}
        onReady={renderWidget}
      />
      <div ref={container} className="turnstile" aria-label="Security verification" />
    </>
  );
}
