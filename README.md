# Product Protege Site (editorial redesign)

The Product Protege marketing site in its 2026 editorial design: white paper
ground, forest display type, definition-list rows, spec cards, a micro-bar,
and a pre-footer conversion block on every main page. Eleven in-page views,
including the dedicated Product Thinking Diagnostic page and the North
platform page with real product screens.

Static and dependency free: one `index.html`, one stylesheet, one behavior
file, plus photo modules and media. No framework, no build step.

Read `CLAUDE.md` before changing anything. It carries the brand law, the
methodology, and the technical constraints, and `docs/CONTENT_RULES.md` is
binding for all copy.

## Deploy (Netlify)

1. Netlify dashboard: Add new site, then Import an existing project.
2. Pick GitHub and select `New-Product-Protege-Site`.
3. Build command: leave empty. Publish directory: `.` (netlify.toml already
   says so, Netlify will read it).
4. Under Site configuration, Change site name to pick your subdomain.

Every push to `main` redeploys. Pull requests get deploy previews, and the
Lighthouse workflow runs an accessibility gate (0.90 minimum) on each PR.
