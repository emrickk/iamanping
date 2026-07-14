# iamanping.com portfolio site — design spec

Date: 2026-07-14
Status: Approved by Anping (design + faithful visual direction), pending spec review
Owner: Anping Wang

## Context

iamanping.com is Anping's professional portfolio, currently hosted on Wix. He is
ditching Wix and migrating to a static site on GitHub Pages under his personal
GitHub account (emrickk), following the same playbook as the theneverless.com
blog cutover (2026-07-14).

Key facts established during brainstorming:

- Domain registered at **GoDaddy** (expiry 2028-04-18); only the **nameservers**
  point at Wix (ns6/ns7.wixdns.net). No domain transfer needed — this is a
  nameserver + hosting cutover, same shape as theneverless.com.
- Full content archive exists at `Personal Website/Portfolio/iamanping.com/`
  (scraped 2026-06-06): 9 articles (Markdown), 4 project case studies (text),
  page texts, 47 images at original resolution, raw HTML of every page.
- The live site's Resume button serves a **Wix placeholder PDF** ("I'M A
  DOCUMENT", md5 acf6bf898dce0fa464e3d98539d71823) — there is no real CV on the
  site. Verified against both the archive and the live URL.
- The 9 articles were already imported to the blog as bilingual posts
  (blog commit c97194e). A parallel session is migrating the 4 remaining
  project case studies (Aiyou, 360 Mobile Security, Missing Children Alert
  System — WeChat Red Packet Assistant is already live) into the blog.

## Decisions (from brainstorming with Anping)

1. **Content home**: summaries + links. iamanping.com holds short summaries;
   every "Read more" links to the full case study / article on
   https://theneverless.com. One source of truth, near-zero duplication.
2. **Language**: English-only. (The blog's EN·中 toggle serves bilingual needs.)
3. **Resume**: LinkedIn only at launch. No resume button until Anping provides
   a real, web-safe CV. The design leaves an obvious slot to add it back.
4. **Structure**: multi-page, mirroring the Wix site ("I want something
   similar"): Home/About, Projects, Articles, Contact.
5. **Visual**: faithful recreation of the current Wix design, built from
   Anping's screenshots and the archived raw HTML — not a reinterpretation.
   An earlier generic mockup was rejected ("horrible"); the corrected faithful
   mockup was approved ("good. go").
6. **Contact**: "Let's talk" page with LinkedIn CTA. No form at launch (static
   host; a Formspree-style service can be added later without redesign).
7. **Build approach**: hand-rolled minimal Astro site. No theme, no UI
   framework. For a 4-page site, replicating the Wix look directly is less
   work than bending any theme, and leaves nothing to maintain.

## Site map

| Route | Content | Source in archive |
|---|---|---|
| `/` | Hero: profile card + "Hello / I'm Anping" + bio + buttons (LINKEDIN outline pill, PROJECTS solid pill) | `content/pages/home.txt`, screenshot, `raw/page_home.html` |
| `/projects` | 5 project cards with exact Wix copy and metric lines | `content/pages/projects.txt` |
| `/articles` | 9 articles, dated list, one-line summaries | `content/posts/*.md` frontmatter |
| `/contact` | "Let's talk" heading + LinkedIn CTA | `content/pages/contact.txt` (heading only) |
| `/404` | Simple not-found page linking home | — |

Navigation: `About Me / Projects / Articles` (+ contact reachable from nav —
final placement to match Wix's "More" or a "Let's talk" item; decide during
implementation from raw HTML nav structure).

### Project cards (5, exact Wix copy from archive)

| Project | Metric line | "Read more" target |
|---|---|---|
| Aiyou | 2M+ users, 50K→200K DAUs | blog case study (pending from parallel session) |
| WeChat Red Packet Assistant | 20M+ users | blog post `wechat-red-packet-assistant` (live) |
| Revitalizing 360 Mobile Security | +6M MAU, +6% D2 retention | blog case study (pending) |
| Missing Children Alert System | first Amber-like system in China | blog case study (pending) |
| TuSimple | confidential; links to methodology writing | blog PM-methodology posts (live) |

### Articles (9)

All nine posts from `content/posts/` listed with title + date, each linking to
its imported counterpart on theneverless.com. Exact blog URLs are resolved at
implementation time from the blog repo's content collections (slugs differ
from Wix slugs) and enforced by the link checker.

## Visual specification (from screenshot + archived CSS)

- **Palette**: white background; black `#000` primary text; gray `#727272` /
  `#767674` secondary; accent blue `#0050FF` (Wix theme color_18; occurs 13×
  in archived home page). Light theme only, like the Wix site.
- **Typography**: Poppins (400/600/700), self-hosted in the repo (no Google
  Fonts request). Wix also used Avenir Heavy / DIN Next; Poppins covers the
  look — the giant "Hello" is rendered in the heaviest Poppins weight.
- **Header**: 13px blue square mark + "Anping Wang" (bold) + "/ Product
  Manager" (gray); nav right-aligned, active item in accent blue.
- **Hero (home)**: two columns.
  - Left: profile card, thin (~1.5px) `#0050FF` border. Inside, centered:
    circular profile photo (archive `images/80f892_1ec10782ba8547e68225c0f46fdc5ff9~mv2.jpeg`),
    "Anping Wang" bold on two lines, short blue rule, letter-spaced
    "Product Management and Design" caption. Footer cell separated by a blue
    border containing the LinkedIn "in" mark, linked.
  - Right: display-size "Hello" headline, "I'm Anping" subhead, pill buttons
    (LINKEDIN outline replacing Wix's RESUME; PROJECTS solid blue), two bio
    paragraphs from the archive copy.
- **Buttons**: fully rounded pills; outline (1.5px black) and solid blue
  variants, uppercase labels with slight letter-spacing.
- **Projects/Articles pages**: layout replicated from `raw/page_projects.html`
  and `raw/page_blog.html` at implementation time — same fidelity rule as the
  homepage: recreate, don't reinterpret.
- Fidelity check at the end of implementation: side-by-side against Anping's
  screenshots and the archived pages.

## Architecture

- **Astro** (current stable major), zero integrations except `@astrojs/sitemap`.
- Layout:
  - `src/pages/{index,projects,articles,contact,404}.astro`
  - `src/layouts/Base.astro` (head/meta/og tags, header, footer)
  - `src/components/{Nav,ProjectCard,ArticleRow}.astro`
  - `src/data/site-content.ts` — single typed data file: projects and articles
    as arrays of `{ title, summary, metric?, image?, blogUrl, date? }`. Pages
    render data; future edits touch one file.
  - `src/styles/global.css` — custom properties for the palette, Poppins
    `@font-face`, base rules.
  - `public/images/` — profile photo + project thumbnails copied from the
    archive at original resolution (Wix media IDs renamed to semantic names;
    for wixstatic URLs, strip `/v1/fill` parameters to get originals).
  - `public/CNAME` → `iamanping.com`; `public/robots.txt`.
- `astro.config.mjs`: `site: 'https://iamanping.com'`.
- SEO basics: per-page `<title>`/description, og tags, sitemap.

## Repo, identity, and safety

- New **public** repo `emrickk/iamanping` (personal account; work accounts
  stay separate). Local checkout: `Personal Website/Portfolio/iamanping-site/`
  (the `iamanping.com/` folder remains the untouched archive).
- Repo-local git identity `Emrick <emrickk@users.noreply.github.com>` (set).
  Fresh history; no work-email-authored commits; public-repo hygiene as on the
  blog (no secrets, no PII beyond what the site itself publishes).
- Pushes only per Anping's push protocol: explicit double confirmation
  containing the word "push".
- iCloud caveat: the checkout lives in iCloud-synced Documents; keep writes
  small/batched (site is tiny, low risk).
- Identity linkage accepted: Anping consciously accepted that a public
  `emrickk/iamanping` repo links the emrickk account to his real name.

## Deployment and DNS cutover

Phased, mirroring `2026-07-14-theneverless-domain-cutover.md` (blog repo):

1. **Build & verify locally** (`npm run build` + preview). Note: without the
   custom domain, a project site would serve under
   `emrickk.github.io/iamanping/`; to avoid base-path churn, the Pages custom
   domain is set to `iamanping.com` from the first deploy and verification
   before DNS relies on local preview.
2. **Deploy**: GitHub Actions (`withastro/action`), Pages source = Actions.
3. **DNS**: add `iamanping.com` zone to Cloudflare (existing account),
   create records — 4 GitHub Pages A records on apex (185.199.108–111.153),
   `www` CNAME → `emrickk.github.io`, **all DNS-only/grey** — plus anti-spoof
   TXTs (`v=spf1 -all`, DMARC reject; no email on this domain). Then switch
   nameservers at GoDaddy from wixdns.net to the assigned Cloudflare pair.
4. **Activate**: set custom domain in repo Pages settings, wait for cert,
   enable Enforce HTTPS. Verify: apex 200 over HTTPS, www → apex 301,
   http → https 301, canonical/og/sitemap on the new domain.
5. **Decommission Wix**: after live verification, Anping cancels the Wix
   premium plan (owner action; keep the Wix account until confirmed).
   GoDaddy registration untouched.

## Launch gates

1. `npm run build` passes.
2. `npm run check-links` passes: every `blogUrl` in `site-content.ts` returns
   HTTP 200. **This gates launch on the parallel session's case studies
   (Aiyou, 360, Missing Children) being live on the blog.** If they are not
   live at cutover time, options are (a) wait, or (b) temporarily point those
   cards at the blog's projects/PM category — Anping decides then.
3. Visual fidelity check against screenshots/archive.
4. Post-cutover verification per §Deployment step 4.

## Out of scope (explicitly deferred)

- Resume button / CV hosting (until a real, web-safe CV is provided).
- Contact form (Formspree-style service can be added later).
- Bilingual toggle; dark mode.
- Any changes to blog content or the blog repo.
- Redirect mapping for old Wix article URLs (low traffic; Cloudflare redirect
  rules can be added later if wanted).

## Open items

- Exact blog slugs for all 9 articles + project case studies (resolve from
  blog repo at implementation; enforced by link checker).
- Contact/"Let's talk" nav placement (match Wix raw HTML).
- LinkedIn profile URL (extract from archive/live site during implementation).
