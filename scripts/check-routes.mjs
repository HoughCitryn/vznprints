import { readFile, readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { JSDOM } from "jsdom";

const baseUrl = process.env.ROUTE_CHECK_BASE_URL ?? "http://localhost:3000";
const siteUrl = new URL(process.env.ROUTE_CHECK_SITE_URL ?? "https://vznprints.com").origin;
const routes = [
  "/",
  "/apparel/",
  "/marketing-material/",
  "/graphic-design/",
  "/contact-us/",
  "/quote/",
  "/robots.txt",
  "/sitemap.xml",
  "/image-sitemap.xml",
];

const failures = [];
const seenTitles = new Set();
const seenDescriptions = new Set();
const checkedLinks = new Set();
const pageImages = new Map();

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

for (const route of routes) {
  const response = await fetch(new URL(route, baseUrl), { redirect: "manual" });
  if (response.status !== 200) {
    failures.push(`${route}: expected 200, received ${response.status}`);
  }
}

const gone = await fetch(new URL("/test/", baseUrl), { redirect: "manual" });
if (gone.status !== 410) {
  failures.push(`/test/: expected 410, received ${gone.status}`);
}

for (const pageRoute of routes.slice(0, 6)) {
  const response = await fetch(new URL(pageRoute, baseUrl));
  const html = await response.text();
  const document = new JSDOM(html).window.document;
  const main = document.querySelector("main");
  const title = document.title.trim();
  const description = document.querySelector('meta[name="description"]')?.content.trim();
  if (!title || seenTitles.has(title)) failures.push(`${pageRoute}: missing or duplicate title`);
  if (!description || seenDescriptions.has(description)) failures.push(`${pageRoute}: missing or duplicate description`);
  seenTitles.add(title);
  seenDescriptions.add(description);
  const headings = [...(main?.querySelectorAll("h1,h2,h3,h4,h5,h6") ?? [])];
  const counts = [1, 2, 3].map((level) => headings.filter((h) => h.tagName === `H${level}`).length);
  if (document.querySelectorAll("h1").length !== 1 || counts[0] !== 1) failures.push(`${pageRoute}: expected exactly one main h1`);
  if (!counts[1] || !counts[2]) failures.push(`${pageRoute}: missing main-content h2 or h3`);
  let previousLevel = 0;
  for (const heading of headings) {
    const level = Number(heading.tagName.slice(1));
    if (level > previousLevel + 1) failures.push(`${pageRoute}: heading skips to ${heading.tagName}`);
    if (!heading.textContent.trim()) failures.push(`${pageRoute}: empty heading`);
    previousLevel = level;
  }
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (canonical !== new URL(pageRoute, siteUrl).href) failures.push(`${pageRoute}: incorrect canonical ${canonical}`);
  if (/noindex/.test(document.querySelector('meta[name="robots"]')?.content ?? "")) failures.push(`${pageRoute}: unexpectedly noindex`);
  for (const selector of ['meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[name="twitter:card"]']) {
    if (!document.querySelector(selector)?.content) failures.push(`${pageRoute}: missing ${selector}`);
  }
  const structuredData = [...document.querySelectorAll('script[type="application/ld+json"]')];
  if (!structuredData.length) failures.push(`${pageRoute}: missing JSON-LD`);
  for (const script of structuredData) {
    try { JSON.parse(script.textContent); } catch { failures.push(`${pageRoute}: invalid JSON-LD`); }
  }
  const images = [...document.querySelectorAll("img")];
  if (images.some((image) => !image.hasAttribute("alt"))) failures.push(`${pageRoute}: image without alt attribute`);
  pageImages.set(pageRoute, [...(main?.querySelectorAll("img") ?? [])].map((image) => {
    const url = new URL(image.src, baseUrl);
    return url.searchParams.get("url") ?? url.pathname;
  }));
  console.log(`${pageRoute}: title ${title.length} chars; description ${description?.length ?? 0} chars; H1/H2/H3 ${counts.join("/")}`);
  const hrefs = [...document.querySelectorAll("a[href], link[rel='icon'], link[rel='manifest']")].map((element) => element.getAttribute("href"));
  for (const href of hrefs) {
    const url = new URL(href, baseUrl);
    if (url.origin !== new URL(baseUrl).origin || url.pathname.startsWith("/_next/") || checkedLinks.has(url.href)) continue;
    checkedLinks.add(url.href);
    const linked = await fetch(url);
    if (linked.status >= 400) failures.push(`${pageRoute} -> ${url.pathname}: ${linked.status}`);
  }
}

const expectedUrls = routes.slice(0, 6).map((route) => new URL(route, siteUrl).href).sort();
for (const path of ["/sitemap.xml", "/image-sitemap.xml"]) {
  const response = await fetch(new URL(path, baseUrl));
  const document = new JSDOM(await response.text(), { contentType: "text/xml" }).window.document;
  const entries = [...document.getElementsByTagName("url")];
  const actualUrls = entries.map((entry) => entry.getElementsByTagName("loc")[0]?.textContent).sort();
  if (JSON.stringify(actualUrls) !== JSON.stringify(expectedUrls)) failures.push(`${path}: must contain all six canonical pages exactly once`);
  for (const entry of entries) {
    const page = new URL(entry.getElementsByTagName("loc")[0].textContent).pathname;
    const images = [...entry.getElementsByTagNameNS("http://www.google.com/schemas/sitemap-image/1.1", "loc")].map((image) => image.textContent);
    for (const image of pageImages.get(page) ?? []) {
      if (!images.includes(new URL(image, siteUrl).href)) failures.push(`${path}: ${page} is missing image ${image}`);
    }
    for (const image of images) {
      const url = new URL(image);
      if (url.origin !== siteUrl || !(pageImages.get(page) ?? []).includes(url.pathname)) failures.push(`${path}: ${image} does not belong to ${page}`);
    }
  }
}

const robots = await (await fetch(new URL("/robots.txt", baseUrl))).text();
for (const path of ["/sitemap.xml", "/image-sitemap.xml"]) {
  if (!robots.includes(`Sitemap: ${siteUrl}${path}`)) failures.push(`robots.txt: missing ${path}`);
}
if (/Disallow:\s*\/\s*(?:\r?\n|$)/.test(robots)) failures.push("robots.txt blocks the entire site");

const socialImage = await fetch(new URL("/opengraph-image/", baseUrl));
if (socialImage.status !== 200 || !socialImage.headers.get("content-type")?.startsWith("image/")) failures.push("Open Graph image is unavailable");

let redirectChecks = [
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/image-sitemap-1.xml", "/image-sitemap.xml"],
  ["/vzn-logo/", "/wp-content/uploads/2019/02/VZN-LOGO.png"],
];

// A production build exposes every static legacy redirect, including attachment URLs.
try {
  const manifest = JSON.parse(await readFile(join(process.cwd(), ".next", "routes-manifest.json"), "utf8"));
  redirectChecks = manifest.redirects
    .filter((redirect) => !redirect.has && !redirect.source.includes(":") && !redirect.source.includes("("))
    .map((redirect) => [redirect.source, redirect.destination]);
} catch {
  // Retain the representative checks when running against a development server.
}

for (const [source, destination] of redirectChecks) {
  const response = await fetch(new URL(source, baseUrl), { redirect: "manual" });
  if (![307, 308].includes(response.status) || response.headers.get("location") !== destination) {
    failures.push(`${source}: redirect mismatch (${response.status} ${response.headers.get("location")})`);
  }
}

const publicRoot = join(process.cwd(), "public");
const mediaRoot = join(publicRoot, "wp-content", "uploads", "2019");
const mediaFiles = await walk(mediaRoot);
for (const file of mediaFiles) {
  const pathname = `/${relative(publicRoot, file).split(sep).join("/")}`;
  const response = await fetch(new URL(pathname, baseUrl), { redirect: "manual" });
  if (response.status !== 200) failures.push(`${pathname}: archived media returned ${response.status}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Verified ${routes.length + 1} routes, ${mediaFiles.length} archived assets, ${redirectChecks.length} redirects, unique metadata, heading hierarchy, both sitemaps, robots.txt, social image, and internal links.`);
