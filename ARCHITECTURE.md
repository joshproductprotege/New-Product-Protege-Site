# Architecture

The site is plain static files with no framework and no build step: `index.html`
(all markup), `assets/css/styles.css` (all styles), `assets/js/app.js` (all behavior),
and `assets/js/photos-*.js` (coach headshots as base64 data, loaded before app.js,
hydrated into `img[data-photo]` tags by a small loader at the top of app.js).

## Views (single-page routing)

The site behaves like a small single-page app. Each "page" is a `<div class="view" id="view-NAME">`.
A tiny router in the script shows one view at a time:

- Any clickable element with `data-view="NAME"` switches to that view.
- The router sets `data-current-view` on `<html>` (used for nav highlighting).
- Routing is in-memory only. It does **not** use the History API, because the site is
  designed to run inside sandboxed iframes where `history.pushState` throws. If you host it
  normally and want the back button / deep links to work, you can layer History API calls
  into the `show()` function.

Views present: `home, snapshot, work, advisor, course, book, coaching, resources, coaches`.

### Important click-handling detail

The global click handler returns early for any click inside a `<summary>` or `<details>`
element, and only treats elements matching `a[data-view]`, `button[data-view]`, or
`[role="button"][data-view]` as navigation triggers. This prevents two bugs: the FAQ
accordions bouncing to the top of the page, and the page graying out when interacting with
the scrollbar. Keep that guard if you refactor the router.

## Modals

Two modal systems:

1. **Contact / lead form** (`#contactModal`): opened by any element with `data-contact="KIND"`.
   Kinds: `advisor, coaching, diagnostic, course, mix`. Each kind sets its own title, intro,
   and email subject. Submitting POSTs to the form endpoint (see below).
2. **Course preview** (`#previewModal`): opened by `data-preview="course"`. Its internal
   "Enroll" button hands off to the contact form.

## Forms / lead capture

Near the top of `assets/js/app.js`:

```js
var PP_FORM_ENDPOINT = 'https://formsubmit.co/ajax/hello@productprotege.com';
window.__ppSend = function(fields){ ... }  // POSTs JSON, returns a Promise
```

- All forms call `__ppSend(...)`.
- FormSubmit requires a **one-time activation**: the first real submission emails
  `hello@productprotege.com` with a confirmation link. Click it once.
- To use a different backend, change `PP_FORM_ENDPOINT` to any URL that accepts a JSON POST.

## Interactive pieces

- **Persona toggle** (home): swaps hero/section copy via elements with `class="swap" data-k="KEY"`.
- **Product Mindset Signals** (home): a pure multiselect; selecting options updates the
  analysis text in place and never scrolls the page (scroll position is captured/restored).
- **Product Mindset Snapshot** (snapshot view): a 10-question scored instrument with an
  archetype result and a radar chart, all computed client-side.
- **Engagement builder** (work view): pick modules, then "Evaluate this mix" renders a
  dynamic, combination-aware summary inline.

## Coach photos

The four coach headshots live as base64 data in `assets/js/photos-*.js` (one file per
coach, cropped to consistent squares). A loader at the top of `app.js` sets each
`img[data-photo="name"]` src. No external image requests are needed for them.

## Styling

All CSS is in `assets/css/styles.css`, driven by CSS custom properties defined in
`:root` (brand colors: `--yellow #ffc534`, `--ink`, `--forest`, `--teal`, `--coral`,
`--cream`, etc.). Fonts are Poppins + Inter from Google Fonts.
