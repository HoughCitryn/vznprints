# VZN Prints

Faithful Next.js App Router rebuild of the VZN Prints website. The site is code-managed and keeps the original WordPress media URLs available under `public/wp-content/uploads/2019`.

## Local development

Requires Node.js 20+ and pnpm.

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Without a Turnstile site key, local forms use a development verification token. Email delivery still requires a valid Resend API key.

## Environment variables

Copy `.env.example` and configure:

- `NEXT_PUBLIC_SITE_URL`: canonical production origin.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile widget and server verification.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_TO_EMAIL`: form delivery. Verify the sending domain in Resend before launch.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: GA4 measurement ID. GA4 loads only after cookie acceptance.
- `GOOGLE_SITE_VERIFICATION`: Search Console verification token.

## Verification

```bash
pnpm verify
pnpm start
pnpm check:routes
```

`check:routes` expects the production server on `http://localhost:3000`. Set `ROUTE_CHECK_BASE_URL` to check another origin.

## Deployment

Deploy to Vercel with pnpm as the package manager, add all production environment variables, and verify the preview before changing DNS. Vercel provides HTTP-to-HTTPS enforcement; the application redirects the `www` host to the canonical apex domain.

After cutover, test both real forms, submit `/sitemap.xml` and `/image-sitemap.xml` in Search Console, and monitor 404s and canonical selection.
