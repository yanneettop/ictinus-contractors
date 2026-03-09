# Ictinus Contractors — Website

Vite + React static site, deployable to Namecheap shared hosting.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build for production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the built site locally
```

## Deploy to Namecheap

1. Run `npm run build`
2. Upload **everything inside** `dist/` to your `public_html/` folder via cPanel File Manager or FTP.
   - `dist/index.html`   → `public_html/index.html`
   - `dist/assets/`      → `public_html/assets/`
   - `dist/.htaccess`    → `public_html/.htaccess`
3. The `.htaccess` file enables SPA routing so all paths return `index.html`.

> Make sure `.htaccess` is visible/included — some FTP clients hide dotfiles.

## Add email form (Formspree)

1. Sign up at https://formspree.io and create a form
2. Open `src/components/QuoteForm.jsx`
3. Uncomment the `fetch(...)` block and replace `YOUR_FORM_ID` with your Formspree form ID
4. Remove the "coming soon" notice logic

## Project structure

```
src/
  components/
    Nav.jsx           — Fixed navigation bar
    Hero.jsx          — Full-screen hero with CTA
    TrustRow.jsx      — Fully Insured / Clean Work / Transparent Quote
    Services.jsx      — Main 6 services grid
    SmallerProjects.jsx — Home maintenance cards
    WhyChooseUs.jsx   — 4 trust/value cards
    Portfolio.jsx     — Photo grid with hover captions
    BeforeAfter.jsx   — Before & After project pairs
    Testimonials.jsx  — 3 client reviews
    QuoteForm.jsx     — Contact/quote request form
    AreasWeCover.jsx  — London area coverage tags
    Footer.jsx        — Footer with columns + copyright
  App.jsx
  main.jsx
  index.css           — Tailwind + all custom ict-* CSS
index.html
vite.config.js
tailwind.config.js
```
