import type { Metadata } from "next";
import type { PageSeo } from "@/content/site";
import { siteConfig } from "@/content/site";

export function createMetadata(seo: PageSeo): Metadata {
  const canonical = new URL(seo.path, siteConfig.url);

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteConfig.name,
      title: seo.title,
      description: seo.description,
      url: canonical,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "VZN Prints" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/opengraph-image"],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: `${siteConfig.url}/`,
        name: siteConfig.name,
        description: "T-Shirt Printing in Bakersfield, CA",
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: `${siteConfig.url}/`,
        image: `${siteConfig.url}/wp-content/uploads/2019/02/VZN-LOGO.png`,
        logo: `${siteConfig.url}/wp-content/uploads/2019/02/VZN-LOGO.png`,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        areaServed: { "@type": "City", name: "Bakersfield" },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: siteConfig.phone,
          email: siteConfig.email,
          contactType: "customer service",
          areaServed: "US",
          availableLanguage: "English",
        },
        sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
      },
    ],
  };
}

export function pageJsonLd(seo: PageSeo, serviceName?: string) {
  const pageUrl = new URL(seo.path, siteConfig.url).toString();
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${siteConfig.url}/`,
    },
  ];

  if (seo.path !== "/") {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 2,
      name: serviceName ?? seo.title.split("|")[0].trim(),
      item: pageUrl,
    });
  }

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: seo.title,
      description: seo.description,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#organization` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: breadcrumbs,
    },
  ];

  if (serviceName) {
    graph.push({
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: serviceName,
      description: seo.description,
      areaServed: { "@type": "City", name: "Bakersfield" },
      provider: { "@id": `${siteConfig.url}/#organization` },
      url: pageUrl,
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
