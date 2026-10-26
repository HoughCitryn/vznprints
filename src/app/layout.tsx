import type { Metadata, Viewport } from "next";
import { Abel, Doppio_One, Lato, Montserrat } from "next/font/google";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StructuredData } from "@/components/StructuredData";
import { siteConfig } from "@/content/site";
import { organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const doppio = Doppio_One({ weight: "400", subsets: ["latin"], variable: "--font-doppio", display: "swap" });
const lato = Lato({ weight: ["400", "700", "900"], subsets: ["latin"], variable: "--font-lato", display: "swap" });
const abel = Abel({ weight: "400", subsets: ["latin"], variable: "--font-abel", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: { default: "VZN Prints | Print Shop in Bakersfield, CA", template: "%s" },
  description: "VZN Prints is your one stop print shop in Bakersfield.",
  icons: {
    icon: "/wp-content/uploads/2019/02/cropped-Favicon3-1.png",
    apple: "/wp-content/uploads/2019/02/cropped-Favicon3-1.png",
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION?.trim() ? { google: process.env.GOOGLE_SITE_VERIFICATION.trim() } : undefined,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${doppio.variable} ${lato.variable} ${abel.variable} ${montserrat.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <StructuredData data={organizationJsonLd()} />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ? <AnalyticsConsent /> : null}
      </body>
    </html>
  );
}
