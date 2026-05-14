# ADS Fix Step 3 Report

## Files changed

- `src/App.jsx`
- `src/components/Footer.jsx`
- `src/components/Hero.jsx`
- `src/components/Nav.jsx`
- `src/components/QuoteForm.jsx`
- `src/components/Services.jsx`
- `src/hooks/useContactLinkTracking.js`
- `src/hooks/useSEO.js`
- `src/pages/ContactPage.jsx`
- `src/pages/ServicePageTemplate.jsx`
- `src/pages/ServicesPage.jsx`
- `src/pages/ThankYouPage.jsx`
- `src/utils/tracking.js`

## Thank-you page

Added `/thank-you` as a new React route.

The page thanks the user for their enquiry, confirms the quote request has been received, explains that the team will review the details and contact them as soon as possible, and includes:

- `Call 07586 480417`
- `View Our Services`
- `Back to Home`

The page uses the existing dark/gold hero styling and site navigation/footer so the design remains consistent with the rest of the website.

## Noindex status

`/thank-you` is set to:

```html
<meta name="robots" content="noindex, nofollow">
```

This is handled through the existing `useSEO` hook, which now supports a `robots` value and restores/removes that tag on route changes.

## Sitemap status

Confirmed `/thank-you` is not present in `public/sitemap.xml`.

`robots.txt` was left unchanged.

## Quote form redirect behavior

The existing Web3Forms submission remains in place.

On successful Web3Forms response:

- The non-personal quote context is stored in `sessionStorage` under `ictinus_quote_context`.
- `quote_form_submit` is fired.
- The user is redirected to `/thank-you`.

On failed response or network error:

- The user remains on `/contact#quote`.
- The existing inline error handling is preserved.
- No thank-you redirect occurs.

Stored context only includes:

- `service_type`
- `property_type`
- `preferred_contact_method`
- `page_path`

No personal form fields are stored.

## Tracking utility

Added `src/utils/tracking.js`.

The helper safely fires events without breaking the site if analytics is missing:

- Calls `window.gtag('event', eventName, params)` when `gtag` exists.
- Pushes `{ event: eventName, ...params }` to `window.dataLayer` when it exists.
- Logs with `console.debug` in development only.
- Catches errors so missing analytics never blocks navigation, form submission, or links.

## Events added

- `quote_form_submit`
- `thank_you_view`
- `phone_click`
- `email_click`
- `service_cta_click`
- `whatsapp_click` helper only, not wired to a visible link because no confirmed WhatsApp URL exists.

## Tracked CTAs and links

Globally tracked:

- All `tel:` links via `phone_click`
- All `mailto:` links via `email_click`

Explicit `service_cta_click` tracking added to:

- Header/nav `GET A QUOTE`
- Mobile header `GET A QUOTE`
- Header service dropdown links
- Hero `Request a Quote`
- Homepage planning CTA
- Homepage final quote CTA
- Homepage service cards
- Homepage `View All Services`
- Homepage services-section `Request a Quote`
- Footer service links
- Footer `Get a Quote`
- Service detail page `Request a Quote`
- Service detail page `View Recent Work`
- Service detail page final `Request a Quote`
- Service detail page final `Call 07586 480417`
- Related service links
- Services overview page service quote buttons
- Services overview page final quote CTA
- Thank-you page `View Our Services`
- Thank-you page `Back to Home`

## WhatsApp decision

Option B was used.

The quote form still allows `WhatsApp` as a preferred contact method, but no visible WhatsApp link was added because there is no confirmed WhatsApp number or URL in the site/config. Add a visible WhatsApp button and wire `whatsapp_click` once the correct number is confirmed.

## Validation results

Build:

- Passed with Vite using the bundled Node runtime.
- Existing Vite warnings remain: large chunk warning and repeated compression output names.

Local browser checks:

- `/thank-you` renders correctly.
- `/thank-you` has `meta[name="robots"]` set to `noindex, nofollow`.
- Successful quote form submission with mocked successful Web3Forms response redirects to `/thank-you`.
- Failed quote form submission with mocked failed Web3Forms response stays on `/contact#quote` and shows the inline error.
- Mobile-width quote form successful submission was tested at `390px` viewport.
- `quote_form_submit` fires after successful submission.
- `thank_you_view` fires on `/thank-you`.
- `phone_click` fires on `tel:` links.
- `email_click` fires on `mailto:` links.
- `service_cta_click` fires on key quote and service CTAs.
- Normal CTA navigation from homepage to `/contact#quote` and service page to `/portfolio` still works.

Sitemap/robots checks:

- `/thank-you` is not in `public/sitemap.xml`.
- `public/robots.txt` remains unchanged.

## Remaining tasks before Google Ads launch

- Create real Google Ads conversion actions in Google Ads.
- Add the live Google Ads conversion ID/labels or connect through GTM/GA4.
- Decide whether conversion attribution should use direct `gtag`, GTM triggers, GA4 key events, or a combined setup.
- Confirm the correct WhatsApp number before adding a visible WhatsApp contact button.
- Run live post-deploy QA for `/thank-you`, quote form redirect, and analytics events in Google Tag Assistant / GTM Preview.
