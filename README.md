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

Live site: **https://productprotege.netlify.app/**

Netlify is linked to this repository. Every push to `main` redeploys the live
site, and pull requests get deploy previews. The build is defined in
`netlify.toml`: it stages `index.html` and `assets/` into `_site` and publishes
that, so internal docs (`CLAUDE.md`, `docs/`, `CHANGELOG.md`) are never served.
