# Ictinus Contractors Website

Vite + React website for Ictinus Contractors.

## Local Development

```bash
npm install
npm run dev
```

The Vite dev server runs at:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

The production build outputs to:

```text
dist
```

## Cloudflare Pages Deployment

This site now includes a Cloudflare Pages Function for the quote form backend:

```text
POST /api/quote
```

The quote backend will only work when the site is deployed through Cloudflare Pages. It will not run from GitHub Pages, Namecheap static hosting, or any other static-only host.

Cloudflare Pages settings:

```text
Root directory: /
Build command: npm run build
Build output directory: dist
```

## Quote Backend

The quote form in `src/components/QuoteForm.jsx` submits multipart form data to the same-origin endpoint:

```text
/api/quote
```

The backend lives at:

```text
functions/api/quote.js
```

It handles:

- required field validation
- Cloudflare Turnstile verification
- photo validation
- R2 uploads
- Resend email notification

Uploaded images are stored in R2 with keys like:

```text
quotes/ictinus/YYYY-MM-DD/submission-id/sanitized-original-filename
```

Images are not attached to the email. The email includes R2 object keys and clickable links when `R2_PUBLIC_BASE_URL` is configured.

## Required Environment Variables

Set these in Cloudflare Pages.

Function secrets / variables:

```text
RESEND_API_KEY
TURNSTILE_SECRET_KEY
QUOTE_TO_EMAIL
QUOTE_FROM_EMAIL
ALLOWED_ORIGIN
R2_PUBLIC_BASE_URL
```

Frontend build variable:

```text
VITE_TURNSTILE_SITE_KEY
```

Production values:

```text
QUOTE_TO_EMAIL=info@ictinuscontractors.co.uk
QUOTE_FROM_EMAIL=Ictinus Contractors <quotes@ictinuscontractors.co.uk>
ALLOWED_ORIGIN=https://www.ictinuscontractors.co.uk
R2_PUBLIC_BASE_URL=https://uploads.ictinuscontractors.co.uk
```

Never commit real API keys or Turnstile secrets.

## R2 Binding

Create an R2 bucket and bind it to the Pages project as:

```text
QUOTE_UPLOADS
```

For dashboard-based Cloudflare Pages deployment, configure this binding in the Cloudflare Pages project settings.

## Turnstile Setup

In Cloudflare:

1. Create a Turnstile widget for the Ictinus Contractors domain.
2. Add the site key as `VITE_TURNSTILE_SITE_KEY`.
3. Add the secret key as `TURNSTILE_SECRET_KEY`.
4. The frontend sends the token as `cf-turnstile-response`.
5. The Pages Function verifies the token server-side before accepting the quote request.

## Resend Setup

In Resend:

1. Verify `ictinuscontractors.co.uk` as a sending domain.
2. Add the required DNS records.
3. Create an API key.
4. Add it to Cloudflare Pages as `RESEND_API_KEY`.
5. Make sure `QUOTE_FROM_EMAIL` uses a verified sender/domain.

## Local Pages Function Testing

Create a local `.dev.vars` file from the example:

```bash
cp .dev.vars.example .dev.vars
```

Replace placeholders in `.dev.vars` with local/test credentials.

`VITE_TURNSTILE_SITE_KEY` is a frontend build variable, so make sure it is available when Vite builds the app. For local testing, export it in your shell or add it to a local Vite env file before running the build.

Build and run Cloudflare Pages locally:

```bash
npm run build
npx wrangler pages dev dist
```

Then open:

```text
http://localhost:8788/contact#quote
```

Local testing checklist:

- Submit with missing required fields and confirm inline validation.
- Submit without completing Turnstile and confirm the friendly error.
- Submit with one JPG/PNG/WebP image.
- Submit with more than 8 images and confirm validation.
- Submit an image larger than 5MB and confirm validation.
- Confirm an R2 object is created under `quotes/ictinus/`.
- Confirm the Resend email arrives.
- Confirm successful submission navigates to `/thank-you`.

## Production Testing Checklist

After deployment through Cloudflare Pages:

- Confirm `/api/quote` is served by Cloudflare Pages Functions.
- Confirm no request is sent to Web3Forms.
- Confirm Turnstile renders on `/contact#quote`.
- Submit a test quote with photos.
- Confirm photos land in the `QUOTE_UPLOADS` R2 bucket.
- Confirm the email includes the submission ID, quote fields, object keys, and upload links.
- Confirm `/thank-you` navigation works after `ok: true`.
- Confirm quote tracking fires only after a successful backend response.

## Project Structure

```text
functions/
  api/
    quote.js          - Cloudflare Pages Function quote backend
src/
  components/
    QuoteForm.jsx     - Contact/quote request form
  pages/
    ContactPage.jsx   - Contact page rendering the quote form
  App.jsx             - Routes
  main.jsx            - React entry point
  index.css           - Tailwind + custom ict-* CSS
index.html
vite.config.js
tailwind.config.js
```
