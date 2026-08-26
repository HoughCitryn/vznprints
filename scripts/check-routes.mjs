import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const baseUrl = process.env.ROUTE_CHECK_BASE_URL ?? "http://localhost:3000";
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
  if (![...html.matchAll(/<h1(?:\s|>)/g)].length) failures.push(`${pageRoute}: missing h1`);
  if (!html.includes('<link rel="canonical"')) failures.push(`${pageRoute}: missing canonical`);
  if (!html.includes('<meta name="description"')) failures.push(`${pageRoute}: missing meta description`);
  if (!html.includes('type="application/ld+json"')) failures.push(`${pageRoute}: missing JSON-LD`);
  const imageTags = [...html.matchAll(/<img\s[^>]*>/g)].map((match) => match[0]);
  if (imageTags.some((tag) => !/\salt="[^"]*"/.test(tag))) failures.push(`${pageRoute}: image without alt attribute`);
  const hrefs = [...html.matchAll(/href=["']([^"'#]+)["']/g)].map((match) => match[1]);
  for (const href of hrefs) {
    const url = new URL(href, baseUrl);
    if (url.origin !== new URL(baseUrl).origin || url.pathname.startsWith("/_next/")) continue;
    const linked = await fetch(url, { redirect: "manual" });
    if (linked.status >= 400) failures.push(`${pageRoute} -> ${url.pathname}: ${linked.status}`);
  }
}

const redirectChecks = [
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/image-sitemap-1.xml", "/image-sitemap.xml"],
  ["/vzn-logo/", "/wp-content/uploads/2019/02/VZN-LOGO.png"],
];

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

console.log(`Verified ${routes.length + 1} routes, ${mediaFiles.length} archived assets, redirects, metadata, and rendered internal links.`);
