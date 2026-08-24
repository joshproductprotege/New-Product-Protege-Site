# Product Protégé — Marketing Site

A dependency-free static marketing site for Product Protégé. No build step, no framework. `index.html` plus plain CSS/JS assets, hostable anywhere that serves static files.

## Quick start

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

This is a static site. Any of these work with zero build step:

- **Netlify:** drag the folder onto https://app.netlify.com/drop, or connect this repo and set the publish directory to the repo root.
- **Vercel:** import the repo, framework preset "Other", output directory = root.
- **GitHub Pages:** enable Pages on the `main` branch, root folder. The site will serve `index.html` automatically.
- **Cloudflare Pages / S3 / any static host:** upload `index.html` and the `assets/` folder.

No environment variables or server code are required.

## Project structure

```
index.html               All page markup (nine in-page views)
assets/css/styles.css    All styles
assets/js/app.js         All behavior (router, modals, forms, snapshot, builder)
assets/js/photos-*.js    Coach headshots as embedded data (rarely change)
assets/logos/            Company logo files (see assets/logos/README.md)
docs/ARCHITECTURE.md     How the single-page routing, modals, and forms work
docs/CONTENT_RULES.md    The locked brand language rules for editing copy
CHANGELOG.md             Running history of changes
```

## Two things to finish before launch

1. **Lead-capture forms.** The contact and enrollment forms POST to a FormSubmit AJAX
   endpoint (`PP_FORM_ENDPOINT` near the top of `assets/js/app.js`). The
   **first submission triggers a one-time activation email** to `hello@productprotege.com`;
   click the link in it once and submissions will flow. To route leads into a CRM instead,
   replace `PP_FORM_ENDPOINT` with your Formspree / HubSpot / webhook URL. The payload is a
   flat JSON object (`name`, `email`, `phone`, `message`, `_subject`).

2. **Company logos.** The "where our coaches have worked" strip currently falls back to a
   live logo API. For a crisp, self-hosted result, drop official SVGs into
   `assets/logos/` using the filenames listed in `assets/logos/README.md`. These are
   third-party trademarks — confirm usage rights with each company before launch.

## Editing copy

Please read `docs/CONTENT_RULES.md` first. The brand has strict, non-obvious language
rules (for example: never the word "assessment", never "free", spell out "Product Manager",
no em-dashes). Following them keeps the voice consistent.

## License / ownership

All Product Protégé brand content, the E3 Product Mindset, the Product Empowerment Pyramid,
and coach likenesses are the property of Product Protégé LLC. Company logos in `assets/logos/`
are the trademarks of their respective owners.
