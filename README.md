# Product Protégé marketing site: handoff guide

This repository is the live marketing site for **Product Protégé LLC**, a B2B product
management coaching, training, advisory, and tooling firm led by founder Jason Abdo.
The site exists to move the company's buyer from the individual practitioner to the
leaders who fund a product organization (CEO, CPO, CTO, VP Product). Everything in
the code and copy serves that shift.

This README is the entry point for anyone picking the site up cold. It tells you what
is here, how the site works, how to change it safely, how it ships, and where the
strategy and research behind the copy live. Read it top to bottom once, then use the
file map as a reference.

- Live site: **https://productprotege.netlify.app/** (Netlify site name `productprotege`)
- Repository: https://github.com/joshproductprotege/New-Product-Protege-Site
- Deploys from: the `main` branch, automatically, on every push

## 1. Read these, in this order

| File | Why it matters | Time |
|---|---|---|
| `README.md` (this file) | Orientation, file map, editing and deploy playbook, research context | 20 min |
| `CLAUDE.md` | The binding reference: strategy, brand law, methodology, offerings, and the technical rules that exist because a bug already happened once. Written for an AI assistant but every rule applies to a human editor too. | 30 min |
| `docs/CONTENT_RULES.md` | Locked language rules for all copy. Short and non-negotiable. | 5 min |
| `docs/ARCHITECTURE.md` | How the one-page router, modals, forms, and interactive pieces are wired. | 10 min |
| `docs/B2B_REPOSITIONING_BRIEF.md` | The full strategic and research brief the site was built from. Read when you need the argument, not just the rule. | 45 min |
| `CHANGELOG.md` | What changed and when, newest first. | 5 min |

If you only have ten minutes: read section 3 of this file, then `docs/CONTENT_RULES.md`,
then section 7 of `CLAUDE.md` before touching `index.html`.

## 2. File map

```
index.html                    The whole site. Eleven in-page "views" in one file (see section 3).
netlify.toml                  Netlify build: copies index.html + assets/ into _site and serves that.
lighthouserc.js               Lighthouse CI settings and score thresholds (accessibility gate = 0.90).
.github/workflows/lighthouse.yml
                              GitHub Actions job that runs Lighthouse on every pull request and every push to main.
CLAUDE.md                     Strategy, brand law, methodology, offerings, technical rules. Binding.
CHANGELOG.md                  Release notes, newest first.
README.md                     This handoff guide.

assets/css/styles.css         All styles. Brand tokens live in :root at the top. One file, no preprocessor.
assets/js/app.js              All behavior: router, keyboard activation, drawer, modals, forms, the Snapshot quiz,
                              the engagement builder, the home page challenge picker, reveal animations.
assets/js/photos-*.js         Coach headshots as base64 data URLs (jason, jeremiah, robert, josh, jnae).
                              Loaded before app.js; app.js copies each into <img data-photo="name">.
assets/logos/                 Client logo files for the coaches page strip, plus a README listing the
                              expected filenames. Only usaa.png, carters.png, and cox.png are self-hosted today.
assets/media/                 Photos of Jason and the team, North product screenshots, the North overview
                              video (19 MB) and its poster frame.

docs/ARCHITECTURE.md          Technical detail on routing, modals, forms, and interactive pieces.
docs/CONTENT_RULES.md         Language law.
docs/B2B_REPOSITIONING_BRIEF.md
                              The strategy and research source document (see section 9).
```

There is no build step, no package.json, no framework, and no dependency to install.
Open `index.html` in a browser and the site works.

## 3. How the site works

**One HTML file, eleven views.** `index.html` contains every page as a
`<div class="view" id="view-NAME">`. The names are `home`, `snapshot`, `work`, `advisor`,
`course`, `book`, `coaching`, `resources`, `coaches`, `north`, and `diagnostic`. Only one
is visible at a time. `app.js` shows and hides them in memory; there is no History API
and no URL change, so the browser back button does not move between views. That is a
deliberate trade for surviving sandboxed iframes and previews.

**Links never use `href="#..."`.** Every in-site link is
`<a role="button" tabindex="0" data-view="north">` (switch view) or
`<a role="button" tabindex="0" data-anchor="builder">` (scroll to an element id, switching
view first if needed). A capture-phase guard at the top of `app.js` blocks hash navigation,
and a keydown handler makes Enter and Space activate these links for keyboard users.
Contact buttons use `data-contact="diagnostic|coaching|course|north|mix|advisor"` and
open the shared contact modal with a preset heading.

**Where the copy for each page lives.** Search `index.html` for `id="view-NAME"` and read
down to the next `id="view-`. The views appear in this order: home, snapshot, work,
advisor, course, book, coaching, resources, coaches, north, diagnostic. Shared chrome
(micro-bar, nav, drawer, the two modals) sits above the first view.

**Styling.** `styles.css` starts with the brand tokens (`--yellow #ffc534` is the
signature, `--forest #16322a`, `--ink #16261f`, `--teal`, `--coral`, `--cream`). The
current design system is the "editorial" set near the end of the file: `.asec` sections,
`.dh` display headings, `.eb` eyebrows, `.lede`, `.defrow`, `.ocard`, `.speccard`,
`.sidefig` (copy beside a photo), `.asec-forest` (dark green band), `.picks` (challenge
picker), `.founder` and `.team-band` (coaches page). Older classes from earlier
iterations remain because some views still use them.

**Behavior worth knowing before you edit `app.js`.**
- The home page challenge picker: `RECS` maps each challenge to offerings with a weight
  and a reason, and `render()` composes the one-sentence suggestion. Edit copy there.
- The engagement builder on How We Work: `MOD_NAMES`, `PHASE`, `PRESETS`, and the
  `headline()` map drive the "Evaluate this mix" panel. Module ids must match the
  `data-id` attributes in `index.html`.
- The Snapshot quiz, scoring, archetypes, and radar chart are all in `app.js` under the
  snapshot section. The eight themes there must stay aligned with the Diagnostic copy.
- Multiselect widgets capture and restore scroll position on every click. Selecting an
  option must never move the page. Keep that pattern for anything new.

## 4. Running and checking locally

```
cd New-Product-Protege-Site
python3 -m http.server 8080        # or any static server
# open http://localhost:8080/index.html
```

Before you commit, run the checks in section 8 of `CLAUDE.md`. The short version:

```
node --check assets/js/app.js                       # syntax
grep -c 'href="#' index.html                        # must print 0
grep -o 'id="[^"]*"' index.html | sort | uniq -d    # must print nothing
```

Then confirm every `data-view` target has a matching `id="view-NAME"` and every
`data-anchor` target has a matching element id, and re-read new copy against
`docs/CONTENT_RULES.md`.

To run Lighthouse locally the way CI does:
`npx lighthouse http://localhost:8080/index.html --preset=desktop --view`.
CI audits the home view only (the others are hidden at load); to audit another view,
temporarily change `show('home')` near line 99 of `app.js` to that view's name.

## 5. Editing playbook

**Copy changes.** Edit the text in `index.html` inside the right view. Keep the HTML
entities that are already there (`&middot;`, `&#8594;`, `&eacute;`). Run the content
rules check. Bump the asset version if you also touched CSS or JS (next paragraph).

**Any change to `styles.css`, `app.js`, or a `photos-*.js` file must bump the version
query in `index.html`.** Netlify serves everything under `/assets/` with a one-week
browser cache (see `netlify.toml`). The stylesheet and script tags near line 16 and the
bottom of `index.html` carry `?v=20260909m` style suffixes; change the suffix and the
browser fetches the new file. Skipping this step is how a deploy ends up with new HTML
and stale styles, which looks like a broken page.

**Adding a section.** Copy the closest existing section as a template (an `.asec` with a
`.wrap`, an `.eb` eyebrow, a `.dh` heading, a `.lede`). Use `class="reveal"` on blocks
that should fade in. Decorative overlays must be `pointer-events:none`. Test at 390 px
wide as well as desktop.

**Coach photos.** Each headshot is a base64 JPEG in `assets/js/photos-NAME.js` with the
shape `window.PP_PHOTOS['name']='data:image/jpeg;base64,...'`. To replace one, encode
the new JPEG (aim for a 4:5 portrait around 600 px wide, under 60 KB) and overwrite the
string. The coaches page shows them as rounded rectangles, the Coaching page as small
circles, so the source must be a rectangular photo, not a circular crop.

**Client logos.** Drop files into `assets/logos/` using the filenames in
`assets/logos/README.md` and update the `<img src>` if the extension differs. Logos
that are missing fall back to an external logo API and then to text, which produces
console errors and costs a few Best Practices points in Lighthouse.

**Nav changes.** The burger must stay visible at every width. If you add or rename nav
items, re-measure the breakpoints described in `CLAUDE.md` section 7, rule 9, with the
real fonts loaded.

## 6. Branching, CI, and deployment

- `main` is production. Netlify redeploys within a couple of minutes of every push.
- Work on a branch and open a pull request. The Lighthouse workflow runs on the PR,
  comments the four scores, attaches the HTML report as a workflow artifact, and fails
  the check if accessibility is below 0.90. Performance, Best Practices, and SEO are
  reported but never block.
- The same workflow also runs on every push to `main`, so a direct merge is still
  audited after the fact.
- **Recommended, not yet enabled:** protect `main` in the repository settings (require a
  pull request, require the "Lighthouse accessibility gate" status check). Until that is
  on, the gate is visible but cannot stop a deploy, because Netlify does not wait for
  GitHub.
- Do not edit `netlify.toml` or the workflow without agreement from whoever owns
  deployments. `CLAUDE.md` refers to a separate collaborator who handles deploy config.

Scores at handoff (September 9, 2026, desktop preset, median of three runs, home view):
Accessibility 100, Performance 89 to 90, Best Practices 96, SEO 100. Every other view
scores 100 accessibility when audited individually. Mobile performance is 78, limited by
the render-blocking Google Fonts request.

## 7. Forms and lead capture

The contact modal and the Snapshot email capture POST JSON to FormSubmit
(`PP_FORM_ENDPOINT` near the top of `app.js`) addressed to hello@productprotege.com.
FormSubmit requires a one-time activation click from that inbox on the first real
submission. To route into a CRM, replace that one endpoint. Every submission is labeled
with its origin (Diagnostic booking, coaching enquiry, course enrollment, North demo,
engagement mix, advisor enquiry) so the inbox can be triaged.

## 8. The design canvas

Site copy has been edited visually in a Claude Design canvas that mirrors every view as
an artboard. It belongs to Josh Throop's Claude account and is not part of this
repository. Edits made there were ported into `index.html` by hand and by diff, so the
repository is always the source of truth. If you are not using that workflow, ignore it;
nothing in the code depends on it.

## 9. Strategy, brand, and market research context

**Where the thinking lives.** `docs/B2B_REPOSITIONING_BRIEF.md` is the source document.
It contains:

1. A mismatch catalogue showing where the previous site spoke to practitioners instead
   of leaders, section by section.
2. The practitioner-to-leadership phrase translation table and the four messages that
   move each buyer (CEO and Board, CPO, CTO and VP Engineering, VP and Head of Product).
3. The proof points a C-suite weighs: outcome metrics, named case studies, method
   credibility, scale signals.
4. The five-tier enterprise offer ladder and how existing assets map onto it.
5. The rationale for why operating-model change beats training alone, with the economic
   case and the positioning statement.

`CLAUDE.md` distills that brief into the rules the site follows (section 2 for the
thesis, section 3 for voice, section 4 for the E3 methodology and the Product
Empowerment Pyramid, section 5 for the offerings and how they must be described).

**What the research base is.** The strategic argument rests on the recognized product
management and change management literature rather than on commissioned market
studies: Marty Cagan (EMPOWERED, Transformed), Melissa Perri (Escaping the Build Trap),
Teresa Torres (continuous discovery), John Doerr (OKRs), John Kotter (change model),
Henrik Kniberg (scaling accounts), Jez Humble (flow and delivery metrics), Jeff Gothelf
and Josh Seiden (Lean UX, outcomes), Lyssa Adkins (coaching), plus Pichler, Olsen, and
Cutler. The brief cites where each idea is used. **There is no survey data, analyst
report, or competitor teardown stored in this repository.** If external quantitative
research is needed for a claim, it has to be sourced and added; nothing here should be
cited as if it were.

**Where the numbers on the site come from.** They are first-party figures supplied by
Product Protégé, not external research:
- 150+ Product Managers coached, 15+ years in product per coach, Fortune 50 experience.
- The cohort results on the landing page (+1.25 levels on the competency scale, 63%
  reaching Senior Product Manager or above, 23% of engineering time recovered, 4.8 of 5
  satisfaction) come from one coaching cycle with a top US bank's product team.
- 4.9-star rating for The Product Protégé Guide.
- Client logo strip: The Home Depot, HD Supply, State Farm, USAA, Carter's, Cox
  Communications, Ingage, eMusic, GLG. These reflect where the coaches have coached,
  led, or shipped, spanning both formal engagements and prior employment. They are
  third-party trademarks; confirm usage rights before any wider launch.
- The two testimonials are from a cohort participant at that bank and a Product Manager
  at a Fortune 50 company.

Confirm any of these with Jason Abdo before reusing them elsewhere or updating them.

**The jobs-to-be-done reframe.** The landing page challenge picker and the openings of
the North and Diagnostic pages were built from a jobs-to-be-done reframe brief (four
buyer "jobs": strategic alignment, coaching that sticks, judging team capability,
knowing what is broken before spending). That brief was shared in conversation and is
not in the repository; the commit messages on the `jtbd-*` branches describe what was
applied.

## 10. Known gaps and suggested next steps

- Six client logos are not self-hosted (Home Depot, HD Supply, State Farm, Ingage,
  eMusic, GLG). Adding the files removes the external dependency and the console errors.
- Coach photos were cut from page captures at display size. Replace them with original
  headshots for sharpness on Retina screens. J'Nae has no surname on the site yet.
- The Advisor page and footer still say "Fractional Product Advisor" while the module
  list says "Product Advisor." Decide on one.
- Mobile performance: the Google Fonts request is render-blocking. Self-hosting the two
  fonts, or preloading them, is the main lever.
- The reveal fade-in on above-the-fold elements inflates Speed Index. Consider limiting
  it to below-the-fold blocks.
- Enable branch protection on `main` so the accessibility gate can block a merge.
- The related repository `product-protege-external-testing` holds the previous site
  and deploys to a separate Netlify site (`product-protege-beta`). It is historical.

## 11. People

- **Jason Abdo**, founder and head coach. Final say on copy, claims, and offerings.
- **Josh Throop**, consultant who directed this build and the design canvas edits.
- A separate collaborator owns deployment configuration.

Questions about intent behind any rule in `CLAUDE.md` should go to Josh first.
