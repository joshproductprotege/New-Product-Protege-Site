# CLAUDE.md — Product Protégé Marketing Site

**Read this file completely before making any change.** It carries the strategy, brand law,
methodology, and hard-won technical constraints behind this site. Much of it is not
inferable from the code, and several rules exist because a specific bug or wrong turn
already happened once.

Companion documents in this repo: `docs/CONTENT_RULES.md` (language law, binding) and
`docs/ARCHITECTURE.md` (technical detail).

---

## 1. Who and what this is

**Product Protégé LLC** — a B2B product management coaching, training, advisory, and tooling
firm based in the Atlanta area. Founded by **Jason Abdo** (mechanical engineering background,
structured problem-solver; author of *The Product Protégé Guide*; publishes the *Protege
Pulse* Substack).

This repository is the company's marketing site. It is a static, dependency-free site: one
`index.html` with ten in-page views, one stylesheet, one behavior file, plus media modules.
No framework, no build step.

**People and roles:**
- **Josh** — consultant driving this work. Primary person you will be taking direction from.
- **Jason Abdo** — founder and head coach. The brand's center of gravity.
- **Deployment**: Netlify, linked to this repository. Every push to `main` auto-deploys
  to **https://productprotege.netlify.app/**. The build (`netlify.toml`) publishes only
  `index.html` and `assets/` into `_site`, so this file, `docs/`, and the changelog never
  reach the live site. Do not change `netlify.toml` or `.github/workflows/` casually.
  Work on a branch, open a PR; `main` is what deploys.

**How Josh wants to be worked with** (stated directly, honor it):
- Ask clarifying questions before long, detailed work.
- Do not agree just because agreement is expected. Push back where he is wrong.
- Help him find the most true and most helpful answer, not the most agreeable one.

---

## 2. The strategic thesis — why this site exists

Product Protégé was historically a **B2C** business: a book, an accelerator course, a
certificate, a newsletter, and a podcast, all aimed at helping an individual product manager
get better at the craft. The old site spoke to the practitioner ("level up your product
management game," "Analyst of Product to Associate PM to Senior PM and beyond").

**This site exists to flip the buyer to B2B.** The economic decision to upskill a product
organization is not made by a product manager. It is made by the CEO, CPO, CTO, and the VPs
who own the P&L and the operating model. Those buyers do not wake up wanting "better product
managers." They wake up wanting faster time-to-market, higher return on engineering spend,
fewer expensive features nobody uses, and a team that can tell them which bets to make.

**The craft is the means. Business outcomes are what they buy.**

Two consequences that should shape every editorial decision:

1. **You are selling an operating-model change, not a course.** Organizations do not become
   product-led by training individuals; they change how decisions get made, who is trusted
   with what, and what gets measured. A certificate changes a résumé. An operating model
   changes the company.
2. **Behavior change happens in the flow of work.** Training without coaching reverts.
   This is the strategic reason coaching, and now **North**, matter more than content alone.

**The two-door principle.** Do not abandon the practitioner audience to win leaders. The
practitioner community (book, course, newsletter) is credibility and demand generation — when
a CPO evaluates Product Protégé, their own product managers often already trust the brand.
Lead with the **leadership door** (operating model, outcomes, ROI, diagnostic, advisory) and
keep the **practitioner door** (book, course, resources) present but secondary.

**What moves each buyer** (useful when writing or reordering copy):
- **CEO / Board** — predictable returns on technology investment; strategy that survives
  contact with the roadmap; resilience that does not depend on a few heroes.
- **CPO** — feature factory to outcome-driven; empowered teams trusted with problems, not
  tasks; a discovery habit that de-risks spend before it is spent.
- **CTO / VP Engineering** — less waste; flow and lead time; a healthier product-engineering
  partnership with fewer thrash cycles.
- **VP / Head of Product** — scale onboarding without cloning yourself; consistency across
  squads so leadership reviews compare apples to apples; air cover from an outside authority.

The site's persona toggle (CPO / Exec / HR-Org Transformation) exists to serve this. Keep
its copy sets distinct and true to each buyer.

**Full source:** the complete strategic brief this section distills — mismatch catalogue,
the five-tier enterprise offer ladder, the practitioner-to-leadership phrase translation
table, the economic case, and the thought-leader citations — lives at
`docs/B2B_REPOSITIONING_BRIEF.md`. Read it when a task needs the full argument rather than
the summary above.

**Proof the C-suite weighs:** outcome metrics (before/after), named case studies with a
leader's quote, method credibility, and scale signals (product managers trained, orgs served,
coach bench). Book reviews are practitioner proof — keep them in the practitioner door.

---

## 3. Brand voice and language law

`docs/CONTENT_RULES.md` is binding. The essentials, plus the reasoning:

### Locked terminology

| Rule | Correct | Never |
|---|---|---|
| The library | **Protégé Library** (accented é) | Protege Library |
| Participant-facing testing | **exercise**, snapshot, diagnostic | assessment |
| Pricing and packaging | **included** | free |
| Build partners | **co-creators** | resources, "the dev team" |
| Brand assets | **Protégé Coach**, **E3 Product Mindset** | any renamed variant |

- **On the public site, always spell out "Product Manager" / "Product Managers."** Internal
  Product Protégé documents permit "PM" (and "PdM" in client contexts that use it), but Josh
  has directed that site copy spells it out. Site copy wins here.
- **"Protege Pulse"** (the Substack) is intentionally **unaccented**. This is not a typo.
- **S.P.O.T. is deprecated.** Do not reference or define it anywhere.

### Mechanics
- **No em-dashes. No semicolons** in body copy. Rewrite as separate sentences or use commas.
- No emojis in body copy.
- Active voice, direct second person ("you").

### Tone
Confident, warm, plain-spoken. Sharp but not cold. **Professional without being stiff or
corporate. Conversational without being flippant or glib.** Brevity first: no preamble, no
flattery, no "great question."

### The antithesis ban (important, and easy to violate accidentally)
**Avoid "it's not X, it's Y" and its cousins** ("not a fixed package," "not just theory,"
"not the classroom"). It reads as AI-generated TED-talk cadence and the brand explicitly
rejects it. This pattern has already been cleaned out of the site once — do not reintroduce
it. Write the positive claim directly instead:
- "Built around your team, **shaped to your goals**" (not "not a fixed package")
- "Built from years in the **product trenches**" (not "not the classroom")
- "A proven track record, **earned in the field**" (not "not just theory")

A small number of concrete, warm contrasts survive deliberately (for example "Tailored
packages, not a fixed menu" in the boutique copy, which is Josh's own language). Do not
expand that set.

### Team framing — never a one-man army
Product Protégé is **led by founder Jason Abdo and delivered by a team of seasoned product
leaders**. The other coaches have each launched many products across different industries and
share a passion for helping Product Managers hone their craft. Any copy implying Jason works
alone is wrong and has been corrected before.

---

## 4. The methodology (get this right; it is the product)

### The two-framework architecture
1. **The Product Empowerment Pyramid** — the *what*. A five-level artifact hierarchy.
2. **The E3 Product Mindset / E3 Operating Model** — the *how*. A three-phase repeatable
   process moving an idea from spark to live product.

**Unifying philosophy:** Product Managers own the **why** and the **what**; co-creators own
the **how**. **Empowerment is achieved through clarity.** The signature mental model is
"zoom out / zoom in."

### The Pyramid (canonical levels)
| Level | Role | Meaning |
|---|---|---|
| **Vision** | the "Why" | North Star, ultimate customer benefit. One to two sentences. |
| **Strategy** | the "Guardrails" | 3 to 5 strategic pillars that guide decisions. |
| **Roadmap** | the "Plan" | A prioritized sequence of problems to solve. |
| **Epic** | the "What" | A defined solution to a specific customer problem. |
| **User Story** | the "How" | Granular, testable requirements (Given-When-Then). |

Note the apparent conflict and keep it straight: at the **system** level, Pyramid = what and
E3 = how. **Within** the Pyramid, Epic = what and User Story = how. Both are correct at their
own level.

### E3 phases
- **ENVISION — Framing Strategy & Opportunity** ("Blueprint and Purpose"). Connect with
  customers and run discovery, then a **Pitch Deck with ROI**, then prioritize the roadmap.
  **No idea reaches a roadmap without a one-page Pitch Deck** stating problem, hypothesis,
  expected outcomes, and measurement plan.
- **EMPOWER — Guiding and Driving Execution** ("Construction Phase"). The **Epic is the
  source of truth**, not a Jira ticket. User Stories in BDD Given-When-Then. Architect review
  and refinement. Execution and UAT.
- **ELEVATE — Measuring, Improving, Storytelling** ("Move-In and Upgrade Cycle"). Go/No-Go,
  then **KPI Trees** connecting granular measurements to business KPIs, then optimization and
  roadmap updates. **Launch is the starting line, not the finish.**

### Core beliefs (the philosophical spine)
- **Curiosity over Advice.** Stay curious longer than is comfortable. Resist the **Advice
  Monster** (its three heads: Tell-it, Save-it, Control-it). Solving someone's problem for
  them is the fastest way to make them dependent on you.
- **Questions over Solutions.** The right question beats the perfect answer.
- **Outcomes over Output.** "How will we know if it was successful?" replaces "When will it
  be done?"
- **The Dual Value Lens.** Every decision balances **customer value** against **sustainable
  business ROI**. A lopsided score is a flag, not a verdict — it forces an explicit choice.
  Quadrants: Sweet Spot (build), Loss Leader (time-box), Extraction (danger), Distraction (cut).
- **Fix the strategy before the ticket.** Tactical struggles at the bottom of the Pyramid are
  symptoms of ambiguity at the top. Diagnose upward first.
- **A clear strategy is a polite way to say no.** "That doesn't align with pillars A, B, C.
  Let's document it and revisit at planning."
- **Replace negotiations with partnerships.** Bring evidence, not haggling.
- **"AI is the middle, humans remain end-to-end."**

**The mission**, stated plainly: grow strong product leaders who can think clearly, make tough
calls, and stand on their own. Transform Product Managers from passive executors into
strategic, outcome-driven owners.

### Named frameworks (use exact names)
- **777 Framework** (a.k.a. the **7 Strategic Vision Inputs**) — seven questions to elicit a
  world-class Vision, with parallel sevens for Strategy and Roadmap.
- **14-Point Epic Spec** — the required sections that make an Epic the source of truth.
- **8-Stage Prioritization Flow** — Capture → Strategic Filter → MoSCoW Triage → Sizing Signal
  → Pitch Deck → Sheet Entry → Score + Sequence → Delivery Planning. The antidote to "loudest
  stakeholder wins."
- **Seven Core Questions** — Kickstart, AWE ("And what else?"), Focus ("What's the real
  challenge here for *you*?"), Foundation, Lazy, Strategic ("If you're saying yes to this,
  what are you saying no to?"), Learning. The Focus and Strategic questions are the signature
  two.
- **KPI Tree** — Vision → Strategy pillars → KPIs → features. Full traceability.
- **Readiness DNA** — radar-chart view of a Product Manager's readiness across competency
  dimensions. Used in coaching reports, in North, and in this site's Snapshot results.
- Scoring tools referenced in the method: RICE, MoSCoW, custom weighted scoring, Kano,
  opportunity scoring, cost of delay. A framework is decision **support**, not truth.

---

## 5. The offerings (keep consistent across every page)

- **Product Thinking Diagnostic** — the full evaluation run **with prospective clients** by
  the Product Protégé team. Every Product Manager scored across the eight themes, whole-cohort
  view, discovery conversations, a findings readout, and a tailored engagement plan. This is
  the universal entry point and the primary conversion goal for organizations.
- **Product Mindset Snapshot** — the **2-minute**, self-guided, on-site exercise. Ten
  questions, instant score, archetype, radar. No email required to start. It is the quick
  taste, not the Diagnostic. **This distinction must stay explicit everywhere it appears.**
- **Discovery** — a read of how the team applies the craft on real work and artifacts.
- **Live Training** — sets shared language across a team quickly.
- **1:1 Live Coaching** — where concepts become habit.
- **Protégé Library** — templates, guides, and playbooks that keep quality consistent.
- **North** — see below.
- **Online Course** (Product Management Accelerator) — $379 per seat, or $35/month across 12
  payments, with volume and enterprise pricing for cohorts. Written for organizational buyers
  enrolling teams, not for individuals.
- **Strategic Advising** and the **Fractional Product Advisor** — senior outside judgment for
  leaders; a standing sounding board, roadmap reviews, pre-board prep, on-call thinking partner.
- **The Product Protégé Guide** (book) and the **cheat sheets** (vision, strategy, roadmap)
  serve the practitioner door.

### North (newest and strategically important)
**North by Product Protégé** is an **AI native software platform**: backlog management,
roadmaps, and OKR/KPI alignment, ensuring all work in an organization aligns to strategic
vision and goals. Its differentiator is **embedded product management coaching** — it coaches
Product Managers on requirements, storytelling, strategic thinking, and craft **while they
work in their tool of record**. Its AI coach pushes back on weak thinking rather than filling
in answers, and it scores artifacts against a rubric that rewards specificity and penalizes
buzzwords.

North sits **before** the engineering tracker in the flow: Vision → Strategy → Roadmap →
Epics → User Stories → (Azure DevOps or equivalent). Companies use it for **consistency**
(everyone uses the same frameworks in the same shape), **rigor** (weak strategies score low),
and **organizational memory** (product intellectual property stays searchable and survives
departures).

**Commercially:** North can be bought **standalone** as product tooling, **or bundled** with
the other offerings — the bundle being the most effective route to changing an organization's
product mindset. Frame it as an investment in improving the team's ability **while they do
their work**.

### Positioning line to preserve
"**Personalized and tailored to your needs where it counts. Fortune 50 scalable where you
need it.**" (Updated from "Boutique where it counts" at Josh's direction, July 2026; the
boutique module also moved up the home page to sit directly under the logo strip.)
Product Protégé can
partner alongside any organization, from one team finding its footing to forty teams moving
together. Boutique in the moments that matter (senior coaches who know your context, tailored
packages, the Diagnostic shaping the partnership); built to scale when needed (cohorts across
business units, scalable training, classes and workshops).

### Client experience framing (be precise, this was corrected before)
The logo strip represents organizations where **our coaches have coached, led, and shipped**.
That experience spans **both** formal Product Protégé engagements **and** years spent as
product leaders and coaches inside those organizations. Current list: The Home Depot, HD
Supply, State Farm, USAA, Carter's, Cox Communications, Ingage, eMusic, GLG. (Pulte and
Popular Bank were explicitly removed.) These are third-party trademarks — usage rights should
be confirmed before launch.

### Coaching delivery
All coaching is **virtual**. Avoid language that emphasizes on-site versus virtual, and do not
reference the Greater Atlanta area or travel as a coaching feature. Frame it as **team
workshops** and **1:1 coaching**, always tailored.

---

## 6. Site architecture

Eleven views, each `<div class="view" id="view-NAME">`: `home, snapshot, diagnostic, work,
north, advisor, coaching, coaches, course, book, resources`. (This branch carries the 2026
editorial rework modeled on the approved alternative-site design: white paper ground, forest
display type, definition-list rows, spec cards, a micro-bar, and pre-footer conversion blocks.
The persona toggle and home Signals module were retired with it; the four-chairs section is
static copy now.)

```
index.html               All markup
assets/css/styles.css    All styles (CSS custom properties in :root)
assets/js/app.js         All behavior
assets/js/photos-*.js    Coach headshots (base64 data modules)
assets/js/media-*.js     North product screenshots (base64 data modules)
assets/media/            North overview video + poster
assets/logos/            Client logos (see its README for filenames and sources)
docs/                    ARCHITECTURE.md, CONTENT_RULES.md
```

**Brand colors** (in `:root`): yellow `#ffc534` (the signature), ink `#16261f`, forest
`#16322a`, teal `#1f8a7e`, coral `#e8623a`, cream `#fbf7ee`. Fonts: Poppins (display) and
Inter (body). The logo is the transparent-background lightbulb/P mark, embedded inline as SVG.

**Interactive pieces:** persona toggle (home), Product Mindset Signals multiselect (home),
the scored Snapshot with radar and archetypes, the engagement builder with combination-aware
"Evaluate this mix," contact/enrollment modals, and the course preview modal.

**Forms:** `PP_FORM_ENDPOINT` near the top of `app.js` POSTs JSON to FormSubmit.
**A one-time activation click is required** on the first real submission (an email goes to
hello@productprotege.com). Swap the endpoint for a CRM or webhook when ready. Contact modal
presets: `advisor, coaching, diagnostic, course, mix, north`.

---

## 7. Non-negotiable technical behaviors

Every one of these exists because the bug already happened. Do not regress them.

1. **No internal `href="#..."` anywhere.** All in-site links use `data-view` (switch page) or
   `data-anchor` (scroll to section) with `role="button" tabindex="0"`. A capture-phase guard
   is the **first statement** in `app.js` and blocks hash navigation. Reason: any real
   navigation surfaces an "external link" popup inside sandboxed previews.
2. **The router sets `data-current-view` on `<html>` — never `data-view`.** When it was
   `data-view`, every bubbled click matched the delegate, graying out the page and hijacking
   scrollbar clicks.
3. **The click delegate must ignore `<summary>` and `<details>`,** and must only match
   `a[data-view]`, `button[data-view]`, `[role="button"][data-view]`. This keeps FAQ
   accordions working (independently open, no scroll jump).
4. **Decorative overlays must be `pointer-events:none`.** Full-bleed `::before`/`::after`
   gradients on `.final`, `.pdark`, `.promise`, `.boutique`, `.mix-inner`, `.res-hero`
   silently swallowed clicks on secondary buttons. Button rows are layered above them.
5. **Multiselect widgets must never move the page.** The Signals picklist and the engagement
   builder capture `scrollX/scrollY` before DOM updates and restore synchronously and again
   on the next animation frame. Josh has been emphatic: selecting an option must not scroll,
   ever. Only the explicit "Evaluate this mix" button may scroll results into view.
6. **No History API.** Routing is in-memory only, so the site survives sandboxed iframes
   where `pushState` throws. Consequence: browser back does not traverse views. Accepted.
7. **Every link must perform its intended function.** No dead buttons, no bounce-to-top. This
   has been a recurring source of frustration; audit links after any structural change.
8. **Mobile first.** Test the persona toggle, nav drawer, and any grid at narrow widths.
9. **The nav burger must stay visible and clickable at every width.** The link row is
   tightened (10px gap, 14px font) so the full menu fits from 1240px up, and a media query
   hides the inline links (keeping the Snapshot CTA and the burger) between 641px and
   1239px. Below 641px the CTA hides too. The drawer is the only route to The Book, Resources, and Protege
   Pulse, so a clipped or covered burger cuts those pages off. Two hard-won lessons live in
   the 1400px number: measure with the real Poppins and Inter loaded (fallback fonts
   measure about 45px narrower and gave a false pass), and leave slack for classic
   scrollbars and display scaling (a 1366px Chromebook clipped a breakpoint tuned to
   1300px). If nav items are added or renamed, re-measure and re-run a width sweep.

---

## 8. Before you finish any change

- `node --check assets/js/app.js`
- Confirm **zero** occurrences of `href="#` in `index.html`
- Confirm every `data-view` target matches an existing `id="view-NAME"`, and every
  `data-anchor` target matches a real element id
- Check for duplicate element ids (one known benign case: `modCount`)
- Re-scan new copy against `docs/CONTENT_RULES.md`: no em-dash, no "assessment," no "free,"
  no bare "PM," no "not X, it's Y"
- Verify the Snapshot vs Diagnostic distinction is still explicit wherever both appear
- Work on a branch and open a PR. `main` auto-deploys to productprotege.netlify.app via Netlify.

---

## 9. Accessibility gate (Lighthouse CI)

Every pull request into `main` runs `.github/workflows/lighthouse.yml`. It serves the repo
root as a static site, runs Lighthouse three times on `index.html` with the desktop preset,
and takes the median run. Results appear as a status check and a score-table comment on the
PR, and the full HTML report is attached to the workflow run as the `lighthouse-report`
artifact (workflow run page, Artifacts section, download and open the `.html` file).

**What blocks and what informs.** The thresholds live in `lighthouserc.js` at the repo root,
under `ci.assert.assertions`:
- **Accessibility** is the gate: `error` at `minScore: 0.9`. Below 0.90 the check fails and,
  once marked required in branch protection, blocks the merge. Adjust the threshold by
  editing that one line.
- **Performance, Best Practices, SEO** are `warn` only. They report scores and never block.
  This is deliberate: performance moves with network conditions, and the 19MB North overview
  video legitimately depresses it.

The desktop preset is set in `lighthouserc.js` (`settings` block). Comments there explain
how to switch to mobile or run both.

**Current standing.** The home view scores 1.0, so the gate has real margin. Conventions
that keep it there, do not regress them:
- Small coral text on light grounds uses `--coral-text` (#b84420), never `--coral` or
  `--coral-deep` (both miss 4.5:1 for small text on cream). Buttons, hovers, borders,
  icons, and large display text keep the original coral values.
- Small teal text uses `--teal-deep`, not `--teal`.
- The primary button pairs ink text with the coral fill (same pattern as the yellow
  button). Its hover lifts and deepens the shadow, keeping the fill, because ink on
  `--coral-deep` would fail.
- The closed nav drawer is `visibility:hidden` (flipping after the slide-out transition),
  which makes its links unfocusable in every browser. Do not use `inert` for this: WebKit
  has shipped bugs where dynamically removing it left the drawer links dead, which
  unreachable-menu reports traced back to.
- The decorative ladder numerals render via CSS `content:attr(data-n)`, not DOM text, so
  the contrast audit skips them deterministically. Keep new decorative text out of the DOM
  the same way.
- The logo links carry no `aria-label`. Their accessible name derives from the visible
  text, which keeps voice control working. Do not add one back.

**Limits of the automated check.** Lighthouse covers only automatable checks: contrast, alt
text, ARIA validity, form labels. It cannot judge keyboard navigation or screen-reader flow,
and this site's many `role="button"` links (required by the no-`href="#"` rule above) depend
on the keydown handlers in `app.js` for Enter and Space activation. Those flows still need
occasional manual review. Also, because this is a one-page site where nine of the ten views
are hidden at load, Lighthouse effectively audits the home view only. Hidden views escape
most automated checks, so treat the score as a floor for the home view, and spot-check other
views manually after structural changes.
