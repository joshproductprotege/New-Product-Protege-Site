# Changelog

## September 9, 2026: canvas edits, landing page rework, coaches page, CI coverage
- Landing page: hero photo and ideation photo sit beside their copy; the situation cards
  became a six-item challenge picker that composes a one-sentence suggestion and a
  Book a call button; "The outcome" cards, "Why your seat cares", "Built to your shape",
  "Why our approach works", and the "Start here" spec card were removed; "The proof"
  numbers now carry the eyebrow "The outcome" with the two testimonials side by side;
  a See How We Work button sits under the collective section copy.
- How We Work: the module list (now eight, with Strategic Advising and the Fractional
  Product Advisor merged into Product Advisor) opens the page; the engagement builder
  matches; "From feature factory to value driver" sits on a full-bleed forest band; the
  page closes with the same two-card section as the landing page; the secondary button
  in the mix panel is readable.
- Coaches: founder block for Jason with his photo, then a pale-green "Who you might be
  matched with" list with rounded portraits; J'Nae added; logo strip returned beneath
  the hero; Carter's and Cox logos self-hosted; coach photos replaced.
- North: dashboard screenshot beside the headline. Diagnostic and other pages: copy
  edits ported from the design canvas.
- Accessibility and CI: Enter and Space now activate role="button" links; the hero
  photo is no longer lazy-loaded; Resources heading order fixed; the Lighthouse
  workflow also runs on every push to main.
- Asset links carry a version query so Netlify's one-week cache cannot serve stale
  CSS or JS after a deploy.
- README rewritten as a handoff guide.

## Link hardening + North label
- Removed href attributes from all internal links (82 converted to data-view/data-anchor
  routing) and added a capture-phase navigation guard, eliminating every possible
  "external link" popup for in-site navigation in sandboxed previews.
- North nav and footer labels now read "North (our tooling platform)".

## North launch round
- New North page (view-north): AI native product tooling with embedded coaching, with the
  2-minute overview video, three product screenshots, standalone vs bundle framing, and a
  "See North in action" demo request form.
- North added to the Build the Engagement module picker with combination-aware evaluation,
  plus references on the Coaching page (contextual coaching) and the Run journey stage.
- New "What is Product Protégé?" nav tab and homepage intro answering the question directly.
- "Build your engagement" link added from the homepage offerings section.
- Router now intercepts every internal hash link, eliminating "leaving Claude / external
  link" popups for in-site navigation in sandboxed previews.
- New media assets under assets/media (video + poster) and assets/js/media-*.js screenshots.

## Production split
- Split the single-file build into index.html + assets/css/styles.css + assets/js/app.js
  + assets/js/photos-*.js so files can be updated and reviewed independently.
- Coaches ordered: Jason (feature), Jeremiah, Josh, Robert.
- Logo strip loads local assets/logos/*.svg first with live-API and favicon fallbacks.

## Initial repository
- Packaged the single-file marketing site as `index.html`.
- Coaches section ordered: Jason (feature), Jeremiah, Josh, Robert.
- Company logo strip loads local `assets/logos/*.svg` first, with live-API and favicon fallbacks.
- Root-cause fix for scrollbar gray-out and FAQ scroll-jump (summary/details guard in router).
- Course page rewritten for B2B buyers; Enroll and See-what's-inside modals wired.
- Working lead-capture forms via FormSubmit AJAX (needs one-time activation).
- Added docs: ARCHITECTURE.md, CONTENT_RULES.md; logo asset guide.
