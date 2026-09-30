import type { MetadataRoute } from "next";
import { pageSeo, siteConfig, visiblePageImages } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    [pageSeo.home, visiblePageImages.home],
    [pageSeo.apparel, visiblePageImages.apparel],
    [pageSeo.marketing, visiblePageImages.marketing],
    [pageSeo.graphicDesign, visiblePageImages.graphicDesign],
    [pageSeo.contact, visiblePageImages.contact],
    [pageSeo.quote, visiblePageImages.quote],
  ] as const;

  return routes.map(([seo, images]) => ({
    url: new URL(seo.path, siteConfig.url).toString(),
    // Omit lastModified until actual content revision dates are tracked.
    changeFrequency: seo.path === "/" ? "weekly" : "monthly",
    priority: seo.path === "/" ? 1 : seo.path === "/quote/" ? 0.9 : 0.8,
    images: [...new Set(images)].map((image) => new URL(image, siteConfig.url).toString()),
  }));
}
