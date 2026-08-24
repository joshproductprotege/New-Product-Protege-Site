# Changelog

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
