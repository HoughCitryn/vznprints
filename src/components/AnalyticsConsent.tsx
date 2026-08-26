"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { X } from "@phosphor-icons/react";

const consentKey = "vznprints-cookie-consent";
const consentEvent = "vznprints-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(consentEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(consentEvent, callback);
  };
}

function getConsentSnapshot(): "accepted" | "denied" | null {
  const stored = window.localStorage.getItem(consentKey);
  return stored === "accepted" || stored === "denied" ? stored : null;
}

export function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribe, getConsentSnapshot, () => null);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    function trackClick(event: MouseEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-ga-event]");
      const eventName = target?.dataset.gaEvent;
      if (eventName) window.gtag?.("event", eventName);
    }
    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, []);

  function decide(value: "accepted" | "denied") {
    window.localStorage.setItem(consentKey, value);
    window.dispatchEvent(new Event(consentEvent));
  }

  return (
    <>
      {consent === "accepted" && measurementId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="vzn-ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
      {consent === null ? (
        <aside className="cookie-banner" aria-label="Cookie notice">
          <p>We use cookies to ensure that we give you the best experience on our website. If you continue to use this site we will assume that you are happy with it.</p>
          <button className="cookie-banner__accept" type="button" onClick={() => decide("accepted")}>Ok</button>
          <button className="cookie-banner__close" type="button" aria-label="Close and decline analytics cookies" onClick={() => decide("denied")}>
            <X size={18} weight="bold" />
          </button>
        </aside>
      ) : null}
    </>
  );
}
