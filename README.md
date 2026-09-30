# VZN Prints

Next.js App Router rebuild of the VZN Prints website. The site is code-managed and keeps the original WordPress media URLs available under `public/wp-content/uploads/2019`. The six customer-facing pages retain the live site's substantive headings, paragraphs, and inline imagery, with restored brand content and quote wording. Layout, semantic markup, and form implementation differ from the original; see the audit below.

## Local development

Requires Node.js 20+ and pnpm.

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Without a Turnstile site key, local development forms use a development verification token. Email delivery requires SMTP credentials or a valid Resend API key. Production verification never accepts the development bypass.

## Environment variables

Copy `.env.example` and configure:

- `NEXT_PUBLIC_SITE_URL`: canonical production origin, normally `https://vznprints.com`.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`: required for Cloudflare Turnstile widget and server verification in production. Configure the widget for the deployment hostname. Rebuild when changing a `NEXT_PUBLIC_` value.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`: SMTP delivery for both the contact and quote forms. Use a sender address authorized by your mail provider. Keep these server-only; never prefix credentials with `NEXT_PUBLIC_`.
- `CONTACT_TO_EMAIL`: destination inbox for both forms, defaulting to `contact@vznprints.com`. The visitor's email is set as Reply-To.
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL`: optional alternative when `SMTP_HOST` is empty. Verify the sending domain in Resend before launch.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: GA4 measurement ID. GA4 loads only after cookie acceptance.
- `GOOGLE_SITE_VERIFICATION`: Search Console verification token.

For SMTP on port 587, use `SMTP_SECURE=false` (STARTTLS is required). For port 465, use `SMTP_SECURE=true` (TLS from connection start). If `SMTP_SECURE` is blank, port 465 selects TLS automatically. SMTP takes precedence when `SMTP_HOST` is populated; configuration or delivery errors are surfaced as form errors instead of retrying through another provider.

`.env.example` contains the configuration template; `.env.local` is ignored by Git. Fill in credentials locally or in the deployment provider's environment settings. Empty placeholders do not enable email delivery. No real message was sent during the audit; mail tests mock the providers.

## Verification

```bash
pnpm verify
pnpm start
pnpm check:routes
```

`check:routes` expects the production server on `http://localhost:3000`. Set `ROUTE_CHECK_BASE_URL` to check another origin, and `ROUTE_CHECK_SITE_URL` if the expected canonical origin differs from `https://vznprints.com`. It checks unique titles and descriptions, a single H1 and ordered H2/H3 headings inside each page's main content, canonical URLs, social metadata, JSON-LD syntax, alt attributes, both XML sitemaps, robots.txt, internal links, the social image, archived assets, and static redirects from the production build.

## Live-site comparison and SEO audit — 2026-09-30

Compared the six local content pages with direct live HTML/CSS responses, both live page sitemaps, the live image sitemap, robots.txt, the legacy `/test/` page, and 38 legacy image URLs. All 45 discovered live page/image URLs responded successfully after redirects. No connected browser was available, so this is an HTML, CSS, content, and HTTP audit; desktop/mobile screenshot matching, interactive behavior, accessibility tooling, and Core Web Vitals were not measured.

| Page | Comparison with the live site | Local main-content H1 / H2 / H3 after fixes |
| --- | --- | --- |
| [Home](https://vznprints.com/) | Original headings, paragraphs, and inline imagery are present. Restored the recommended-brands section with BELLA+CANVAS, American Apparel, ei-lo, and Anvil logos. The hero now uses the live `02/T-Shirt-Printing-Bakersfield-CA.jpg`, and the apparel service image preserves `03/T-Shirt-Printing-in-Bakersfield.jpg`. Typography and layout still differ. | 1 / 12 / 3 |
| [Apparel](https://vznprints.com/apparel/) | Original print-method, garment, and fabric copy and images are present. Restored all three inline quote links and the live hero image, `03/Webp.net-resizeimage-1-min.jpg`. | 1 / 4 / 16 |
| [Marketing Material](https://vznprints.com/marketing-material/) | Eight product descriptions and the hero image are retained. The numbered product treatment is new; hero typography differs (live 46px H1 and Lato subtitle versus local responsive H1 up to 76px and Abel subtitle). | 1 / 1 / 8 |
| [Graphic Design](https://vznprints.com/graphic-design/) | Introductory copy and three artwork images are retained. The subtitle has moved into the hero, a hero quote button has been added, and heading size/alignment differs. | 1 / 1 / 3 |
| [Contact Us](https://vznprints.com/contact-us/) | Original contact information, labels, and four customer fields are present. Restored the live `Email` label and `black-and-white-lights-abstract-curves.jpg` hero image. Content arrangement and form implementation differ. | 1 / 1 / 3 |
| [Quote](https://vznprints.com/quote/) | Restored the original heading, introduction, and 24-hour/weekend response promise. The custom quote form sits beneath this wording. The live site's unprocessed WPForms shortcode is replaced by the actual form; local form labels and supporting H2/H3 headings remain. | 1 / 1 / 1 |
| [Legacy test page](https://vznprints.com/test/) | Live returns 200 and is included in the live page sitemaps. Local intentionally returns 410 with noindex and is excluded from sitemaps. | Retired; not an indexable content page |

Shared navigation and quote behavior also differ: the live header, footer, and most hero quote links lead to `/contact-us/`; local quote links lead to `/quote/`. The local layout, header/footer styling, and semantic heading levels were rebuilt rather than copied exactly. The 38 legacy image URLs are preserved through permanent redirects to archived media. These differences remain for a separate fidelity pass; this audit does not claim a visual replica.

Content verification after restoration compared the rendered production HTML with fresh live responses. All 90 substantive heading/paragraph blocks were found locally after whitespace normalization: Home 31, Apparel 27, Marketing Material 18, Graphic Design 4, Contact 8, and Quote 2. Every unique inline image from the live main content is also represented locally (Home 8, Apparel 15, Graphic Design 3). The comparison excludes WordPress theme controls, form/plugin implementation text, and the broken shortcode. The six customer-facing routes are complete; the legacy test page remains retired.

All six local pages already had unique titles and meta descriptions. Live graphic-design/contact pages reuse the homepage title, and graphic-design/contact/quote responses lack meta descriptions. Five of the six live content pages advertise HTTP canonicals; local canonicals use the configured HTTPS origin. Live robots.txt and sitemaps exist, but include mixed HTTP/HTTPS sitemap URLs and the test page.

Corrections made locally:

- Added a main-content H2 on Marketing Material, accessible H3 headings for artwork examples, semantic H3 headings for contact details, and a project-details H3 on Quote. Artwork headings are visually hidden for screen-reader navigation; existing gallery appearance is preserved.
- Confirmed `/robots.txt`, `/sitemap.xml`, and `/image-sitemap.xml` respond with 200. Both sitemaps list the six canonical pages, with images mapped to their actual pages. Added the missing apparel hero image and removed an unused marketing image from sitemap data.
- Removed generated `lastModified` timestamps that represented build time instead of verified content changes. Normalized the site origin to avoid duplicate slashes in absolute URLs.
- Allowed crawlers to reach the retired test page and see its 410/noindex response; API routes remain disallowed.
- Removed the starter Vercel favicon and redirected `/favicon.ico` to the existing VZN icon.
- Added SMTP delivery and configuration templates for both forms, retaining Resend as the alternative when SMTP is unset.
- Restored the homepage brand section, original quote wording, apparel inline quote links, contact label, and mismatched hero images. Updated sitemap image data to cover the restored content.

Verification: TypeScript, ESLint, 28 tests, and production build passed. The HTTP audit passed for all six content pages, robots.txt, both sitemaps, the retired test route, 38 archived assets, 45 static redirects (including the favicon), metadata, heading hierarchy, internal links, and the generated social image. An unknown URL correctly returned 404 with noindex. JSON-LD syntax was checked; Google Rich Results eligibility and indexing were not verified. Actual email delivery still requires provider credentials and production Turnstile keys.

Reference for sitemap timestamps: [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). SMTP settings follow [Nodemailer's transport documentation](https://nodemailer.com/smtp).

## Deployment

Deploy to Vercel with pnpm as the package manager, add all production environment variables, and verify the preview before changing DNS. Vercel provides HTTP-to-HTTPS enforcement; the application redirects the `www` host to the canonical apex domain.

After cutover, test both real forms, submit `/sitemap.xml` and `/image-sitemap.xml` in Search Console, and monitor 404s and canonical selection.
