# ADS Fix Step 2 Report

Date: 2026-05-14

## What Files Changed

- `Website2/index.html`
- `Website2/public/404.html`
- `Website2/public/robots.txt`
- `Website2/public/sitemap.xml`
- `Website2/src/App.jsx`
- `Website2/src/pages/AboutPage.jsx`
- `Website2/src/pages/PortfolioPage.jsx`
- `Website2/src/pages/ContactPage.jsx`
- Built output regenerated in `Website2/dist/`

## How the Direct-Route 404 Issue Was Fixed

GitHub Pages does not support server-side rewrite rules for React Router routes. To stop visitors from seeing the default GitHub Pages 404 page on direct route loads, a client-side SPA fallback was added:

- `public/404.html` captures the requested path, query string, and hash.
- It redirects to `/?gh-path=...`.
- `index.html` restores the intended URL with `history.replaceState()` before React Router mounts.
- React Router then renders the correct route.

This preserves direct loads and refreshes for public routes as far as GitHub Pages allows without server-side rewrites.

## Routes Tested

All required real routes were tested in the production preview and returned a rendered page with an H1:

- `/`
- `/about`
- `/services`
- `/services/property-refurbishment-extensions`
- `/services/bathroom-fitting`
- `/services/hard-flooring`
- `/services/plastering`
- `/services/painting-and-decorating`
- `/services/finishing-carpentry`
- `/services/electrical-works`
- `/services/plumbing`
- `/portfolio`
- `/contact`

Alias routes were also tested:

- `/request-a-quote` -> `/contact#quote`
- `/projects` -> `/portfolio`
- `/services/property-refurbishment-extensions-london` -> `/services/property-refurbishment-extensions`
- `/services/bathroom-fitting-london` -> `/services/bathroom-fitting`
- `/services/hard-flooring-london` -> `/services/hard-flooring`
- `/services/plastering-london` -> `/services/plastering`
- `/services/painting-decorating-london` -> `/services/painting-and-decorating`
- `/services/finishing-carpentry-london` -> `/services/finishing-carpentry`
- `/services/electrical-works-london` -> `/services/electrical-works`
- `/services/plumbing-london` -> `/services/plumbing`

## Metadata and Canonical Changes Made

Unique metadata was added to:

- `/about`
  - Title: `About Ictinus Contractors | London Refurbishment & Decorating Team`
  - Description: `Learn about Ictinus Contractors, a trusted London team for refurbishment, decorating, bathrooms, flooring, plastering and finishing works.`
  - Canonical: `https://ictinuscontractors.co.uk/about`

- `/portfolio`
  - Title: `Project Portfolio | Ictinus Contractors London`
  - Description: `View recent refurbishment, decorating, bathroom, flooring and plastering projects completed by Ictinus Contractors across London.`
  - Canonical: `https://ictinuscontractors.co.uk/portfolio`

- `/contact`
  - Title: `Request a Quote | Ictinus Contractors London`
  - Description: `Request a free quote from Ictinus Contractors for refurbishment, bathroom fitting, painting, decorating, plastering, flooring and finishing works across London.`
  - Canonical: `https://ictinuscontractors.co.uk/contact`

Canonical URLs and schema URL references were also normalised to the non-www domain used by the live site and requested robots/sitemap URL.

## robots.txt Status

Added `public/robots.txt`.

Built output confirmed at `dist/robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://ictinuscontractors.co.uk/sitemap.xml
```

## sitemap.xml Status

`public/sitemap.xml` remains limited to the 13 real indexable pages:

- `/`
- `/about`
- `/services`
- `/services/property-refurbishment-extensions`
- `/services/bathroom-fitting`
- `/services/hard-flooring`
- `/services/plastering`
- `/services/painting-and-decorating`
- `/services/finishing-carpentry`
- `/services/electrical-works`
- `/services/plumbing`
- `/portfolio`
- `/contact`

The redirect-only routes were not added to the sitemap.

Built output confirmed at `dist/sitemap.xml` with 13 `<loc>` entries.

## Validation

- Production build completed successfully with Vite.
- Production preview tested successfully on `http://127.0.0.1:4173`.
- All required routes and alias routes rendered with status `200` in local production preview.
- Metadata/canonical checks passed for `/about`, `/portfolio`, and `/contact`.
- `dist/404.html` exists.
- `dist/robots.txt` exists.
- `dist/sitemap.xml` exists.

## GitHub Pages Limitations

GitHub Pages cannot provide true server-side 301 redirects or rewrite all SPA routes to `index.html` with a `200` response at the server level.

The implemented fallback is client-side:

- Direct route requests first hit `404.html` on GitHub Pages.
- JavaScript immediately redirects to the app and restores the intended URL.
- Alias redirects are React Router client-side redirects, not server-side 301s.

For true server-side `200` rewrites and `301` redirects, use hosting with redirect/rewrite support such as Netlify, Vercel, Cloudflare Pages, or a custom web server.

## Next Recommended Step

Deploy the updated build to GitHub Pages, then re-check the live URLs:

- `https://ictinuscontractors.co.uk/services`
- `https://ictinuscontractors.co.uk/contact`
- `https://ictinuscontractors.co.uk/portfolio`
- the main service pages
- `/robots.txt`
- `/sitemap.xml`

After the live routing is confirmed, move to conversion tracking and thank-you page work.
