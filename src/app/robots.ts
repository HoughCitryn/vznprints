import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Let crawlers see the 410 response on the retired /test/ route.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: [`${siteConfig.url}/sitemap.xml`, `${siteConfig.url}/image-sitemap.xml`],
    host: siteConfig.url,
  };
}
