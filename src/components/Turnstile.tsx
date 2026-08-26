"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

type TurnstileProps = {
  onChange: (token: string) => void;
};

export function Turnstile({ onChange }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const renderWidget = () => {
    if (!siteKey || !container.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      callback: onChange,
      "expired-callback": () => onChange(""),
      "error-callback": () => onChange(""),
      theme: "light",
    });
  };

  useEffect(() => {
    if (!siteKey) onChange("development-bypass");
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
    };
  }, [onChange, siteKey]);

  if (!siteKey) {
    return <p className="form-note">Security verification is enabled in production.</p>;
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
