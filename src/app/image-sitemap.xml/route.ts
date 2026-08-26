import { allMediaAssets, siteConfig } from "@/content/site";

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function GET() {
  const images = allMediaAssets.map((asset) => `    <image:image>\n      <image:loc>${escapeXml(new URL(asset, siteConfig.url).toString())}</image:loc>\n    </image:image>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n  <url>\n    <loc>${escapeXml(`${siteConfig.url}/`)}</loc>\n${images}\n  </url>\n</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=86400" } });
}
