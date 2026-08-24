# Changelog

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
