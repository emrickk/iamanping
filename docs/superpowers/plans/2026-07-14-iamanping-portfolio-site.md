# iamanping.com Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild iamanping.com as a hand-rolled 4-page Astro static site on GitHub Pages, faithfully recreating the current Wix design, then cut DNS over from Wix.

**Architecture:** Plain Astro (no theme, no UI framework), one typed data file driving Projects/Articles pages, all deep content linking to https://theneverless.com. Deployed via GitHub Actions to a new public repo `emrickk/iamanping`; DNS moves to Cloudflare (grey-cloud), nameservers flip at GoDaddy away from Wix.

**Tech Stack:** Astro 5, @astrojs/sitemap, @fontsource/poppins (self-hosted), Node ≥ 23 (native TS import for scripts), GitHub Actions + Pages, Cloudflare DNS.

**Spec:** `docs/superpowers/specs/2026-07-14-iamanping-portfolio-site-design.md` (approved). Read it first — it contains the visual specification and all decisions.

**Working directory:** `/Users/anping.wang/Documents/Stuff/AI Space/Personal Website/Portfolio/iamanping-site/` (repo already initialized, git identity already set to `Emrick <emrickk@users.noreply.github.com>` — verify with `git config user.name` before committing; NEVER commit with a work email).

**Content archive (read-only source):** `/Users/anping.wang/Documents/Stuff/AI Space/Personal Website/Portfolio/iamanping.com/` — referred to below as `$ARCHIVE`.

**Push rule:** NEVER `git push` without Anping's explicit double confirmation containing the word "push" (his standing protocol). Local commits are always fine.

---

## Resolved facts (do not re-derive)

- Blog post URL shape: `https://theneverless.com/posts/<slug>/`
- LinkedIn: `https://www.linkedin.com/in/anpingwang/`
- Accent blue: `#0050FF`; grays `#727272` (secondary), `#111` body; white bg; Poppins 400/600/700.
- Profile photo in archive: `$ARCHIVE/images/80f892_1ec10782ba8547e68225c0f46fdc5ff9~mv2.jpeg`
- 5 project thumbnails referenced by `$ARCHIVE/raw/page_projects.html` (media IDs, mapping to projects resolved in Task 6):
  `80f892_56f14e0d…`, `80f892_6861eac4…`, `80f892_745d17ef…`, `80f892_b09d092a…`, `80f892_b6dc28b6…`
- Article → blog slug mapping (all LIVE, verified in blog repo `src/content/posts/`):

| # | Title (render verbatim) | Date | Blog slug |
|---|---|---|---|
| 1 | Don’t Make Me Think (About My Job): Sincerity, Expertise, and B2B Product Design | 2025-08-17 | `dont-make-me-think-about-my-job` |
| 2 | Balancing Capability and Product Compromise in Light Customization | 2024-06-01 | `light-customization-tradeoffs` |
| 3 | Product Methodology Systemization Playbook | 2024-05-01 | `product-methodology-playbook` |
| 4 | Alibaba.com Seller Ecosystem and Decision-Making Observation | 2023-12-01 | `alibaba-seller-ecosystem` |
| 5 | Product Discussions | 2023-11-01 | `product-discussions` |
| 6 | Disruptive Technology Company User Research 101 | 2023-01-12 | `tusimple-user-research-101` |
| 7 | Forming Fast Product Problem-solving Iterations | 2023-01-03 | `fast-product-iterations` |
| 8 | Product Management for Autonomous Driving Platform | 2022-07-01 | `autonomous-driving-platform-pm` |
| 9 | Leaving Comments? | 2021-03-01 | `leaving-comments` |

- Project → blog target mapping:

| Project | Blog slug | Status |
|---|---|---|
| Aiyou | `aiyou` (PLACEHOLDER — confirm against blog repo at Task 15) | pending |
| WeChat Red Packet Assistant | `wechat-red-packet-assistant` | live |
| Revitalizing 360 Mobile Security | `reviving-360-mobile-security` (PLACEHOLDER) | pending |
| Missing Children Alert System | `missing-children-alert-system` (PLACEHOLDER) | pending |
| TuSimple | `tusimple-pm-methodology` | live |

Pending slugs are being created by a parallel blog-migration session; `pending: true` entries are exempt from the link checker until the launch gate (Task 15).

- Project card copy renders **verbatim** from `$ARCHIVE/content/pages/projects.txt` (strip U+200B zero-width spaces). Home hero copy from `$ARCHIVE/content/pages/home.txt`.

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro` (placeholder)

- [ ] **Step 1: Write config files**

`package.json`:
```json
{
  "name": "iamanping",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "node --test tests/",
    "check-links": "node scripts/check-links.mjs",
    "check-links:strict": "node scripts/check-links.mjs --strict"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.2.1",
    "@fontsource/poppins": "^5.1.0",
    "astro": "^5.0.0"
  }
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://iamanping.com',
  integrations: [sitemap()],
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict"
}
```

`.gitignore`:
```
node_modules/
dist/
.astro/
.DS_Store
```

`src/pages/index.astro` (placeholder, replaced in Task 7):
```astro
---
---
<html lang="en"><head><title>Anping Wang</title></head><body><h1>placeholder</h1></body></html>
```

- [ ] **Step 2: Install and build**

Run: `npm install && npm run build`
Expected: build completes, `dist/index.html` exists. (npm may warn about Node version; Node ≥ 20 required by Astro 5, ≥ 23 needed later for scripts.)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/pages/index.astro
git commit -m "chore: scaffold Astro project" -- package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/pages/index.astro
```

---

### Task 2: Typed content data with validation test

**Files:**
- Create: `tests/data.test.mjs`, `src/data/site-content.ts`

- [ ] **Step 1: Write the failing test**

`tests/data.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects, articles, site } from '../src/data/site-content.ts';

test('site basics', () => {
  assert.equal(site.linkedin, 'https://www.linkedin.com/in/anpingwang/');
  assert.ok(site.blogBase.startsWith('https://theneverless.com'));
});

test('5 projects, all fields present', () => {
  assert.equal(projects.length, 5);
  for (const p of projects) {
    assert.ok(p.title.length > 0);
    assert.ok(p.paragraphs.length >= 1);
    assert.match(p.blogUrl, /^https:\/\/theneverless\.com\/posts\/[a-z0-9-]+\/$/);
    assert.ok(p.image.endsWith('.png') || p.image.endsWith('.jpeg'));
    assert.equal(typeof p.pending, 'boolean');
  }
});

test('9 articles, dated, sorted newest first', () => {
  assert.equal(articles.length, 9);
  for (const a of articles) {
    assert.ok(a.title.length > 0);
    assert.match(a.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(a.blogUrl, /^https:\/\/theneverless\.com\/posts\/[a-z0-9-]+\/$/);
  }
  const dates = articles.map((a) => a.date);
  assert.deepEqual(dates, [...dates].sort().reverse());
});

test('no zero-width characters in copy', () => {
  const all = JSON.stringify({ projects, articles });
  assert.ok(!all.includes('​'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find `../src/data/site-content.ts`. (If Node errors on TS import, the local Node is < 23 — run with `node --experimental-strip-types --test tests/` and update the `test` script accordingly.)

- [ ] **Step 3: Write the data file**

`src/data/site-content.ts` — copy verbatim from `$ARCHIVE/content/pages/{home,projects}.txt` (strip U+200B); article rows from the Resolved-facts table:
```ts
export const site = {
  name: 'Anping Wang',
  role: 'Product Manager',
  tagline: 'Product Management and Design',
  linkedin: 'https://www.linkedin.com/in/anpingwang/',
  blogBase: 'https://theneverless.com',
  bio: [
    "Passionate about user enjoyment and efficiency, I've worked on autonomous driving, AI, and gaming products, focusing on operations and user growth.",
    'Check out my projects to see how I grew my app from 0 to 200,000 DAUs.',
  ],
};

export interface Project {
  title: string;
  paragraphs: string[];
  image: string;
  blogUrl: string;
  pending: boolean;
}

const post = (slug: string) => `${site.blogBase}/posts/${slug}/`;

export const projects: Project[] = [
  {
    title: 'Aiyou',
    paragraphs: [
      'To top up or not to top up? This can be a challenging decision for low-income gamers. Aiyou, an Android assistance application, aims to address this issue.',
      'I founded Aiyou and, together with my team, grew it into an application boasting over 2 million users.',
    ],
    image: '/images/aiyou.png',
    blogUrl: post('aiyou'),
    pending: true,
  },
  {
    title: 'WeChat Red Packet Assistant',
    paragraphs: [
      'Grabbing red packets on WeChat has become a new tradition in China during Chinese New Year. We developed a small tool to make it even more enjoyable.',
      'This feature reached over 20 million users.',
    ],
    image: '/images/red-packet.png',
    blogUrl: post('wechat-red-packet-assistant'),
    pending: false,
  },
  {
    title: 'Revitalizing 360 Mobile Security',
    paragraphs: [
      'As a 6-year-old application, 360 MS experienced a decline in active users. I led my team in revitalizing the application through a comprehensive redesign.',
      'This effort boosted MAUs by over 6 million and increased the Day-2 retention rate by 6%.',
    ],
    image: '/images/360-security.png',
    blogUrl: post('reviving-360-mobile-security'),
    pending: true,
  },
  {
    title: 'Missing Children Alert System',
    paragraphs: [
      'The very first Amber-like system in China. I am grateful that I was part of the team to build it.',
    ],
    image: '/images/missing-children.png',
    blogUrl: post('missing-children-alert-system'),
    pending: true,
  },
  {
    title: 'TuSimple',
    paragraphs: [
      "Although my team's efforts at TuSimple are truly exceptional, I am unable to share them publicly.",
      'However, please feel free to explore my methodologies on autonomous driving product management and user research.',
    ],
    image: '/images/tusimple.png',
    blogUrl: post('tusimple-pm-methodology'),
    pending: false,
  },
];

export interface Article {
  title: string;
  date: string;
  blogUrl: string;
}

export const articles: Article[] = [
  { title: 'Don’t Make Me Think (About My Job): Sincerity, Expertise, and B2B Product Design', date: '2025-08-17', blogUrl: post('dont-make-me-think-about-my-job') },
  { title: 'Balancing Capability and Product Compromise in Light Customization', date: '2024-06-01', blogUrl: post('light-customization-tradeoffs') },
  { title: 'Product Methodology Systemization Playbook', date: '2024-05-01', blogUrl: post('product-methodology-playbook') },
  { title: 'Alibaba.com Seller Ecosystem and Decision-Making Observation', date: '2023-12-01', blogUrl: post('alibaba-seller-ecosystem') },
  { title: 'Product Discussions', date: '2023-11-01', blogUrl: post('product-discussions') },
  { title: 'Disruptive Technology Company User Research 101', date: '2023-01-12', blogUrl: post('tusimple-user-research-101') },
  { title: 'Forming Fast Product Problem-solving Iterations', date: '2023-01-03', blogUrl: post('fast-product-iterations') },
  { title: 'Product Management for Autonomous Driving Platform', date: '2022-07-01', blogUrl: post('autonomous-driving-platform-pm') },
  { title: 'Leaving Comments?', date: '2021-03-01', blogUrl: post('leaving-comments') },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/data.test.mjs src/data/site-content.ts
git commit -m "feat: typed site content data with validation tests" -- tests/data.test.mjs src/data/site-content.ts
```

---

### Task 3: Link checker script

**Files:**
- Create: `scripts/check-links.mjs`

- [ ] **Step 1: Write the script**

Default mode skips `pending: true` projects; `--strict` checks everything (launch gate).

```js
import { projects, articles, site } from '../src/data/site-content.ts';

const strict = process.argv.includes('--strict');
const targets = [
  site.linkedin,
  ...projects.filter((p) => strict || !p.pending).map((p) => p.blogUrl),
  ...articles.map((a) => a.blogUrl),
];

let failures = 0;
for (const url of targets) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow' });
    const ok = res.status === 200 || (url.includes('linkedin.com') && res.status === 999);
    console.log(`${ok ? 'OK ' : 'FAIL'} ${res.status} ${url}`);
    if (!ok) failures++;
  } catch (err) {
    console.log(`FAIL ERR ${url} (${err.message})`);
    failures++;
  }
}
console.log(failures === 0 ? '\nAll links OK' : `\n${failures} broken link(s)`);
process.exit(failures === 0 ? 0 : 1);
```

(LinkedIn returns 999 for bots — treat as reachable.)

- [ ] **Step 2: Run in default mode**

Run: `npm run check-links`
Expected: exit 0 — LinkedIn + 2 live project URLs + all 9 article URLs return OK. If any article URL fails, the slug mapping is wrong: check the blog repo `Personal Website/Personal Blog/blog/src/content/posts/` and fix `site-content.ts`, do NOT delete the check.

- [ ] **Step 3: Run strict mode to confirm it catches pending**

Run: `npm run check-links:strict; echo "exit=$?"`
Expected: exit 1 with FAILs only on the 3 pending placeholder URLs.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-links.mjs
git commit -m "feat: external link checker with pending-aware strict mode" -- scripts/check-links.mjs
```

---

### Task 4: Global styles and fonts

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write the stylesheet**

```css
:root {
  --blue: #0050ff;
  --black: #000;
  --ink: #111;
  --gray: #727272;
  --bg: #fff;
  --maxw: 1080px;
}
* { box-sizing: border-box; }
html { font-size: 16px; }
body {
  margin: 0;
  font-family: 'Poppins', system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
  line-height: 1.75;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
.container { max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }
h1, h2, h3 { color: var(--black); line-height: 1.15; margin: 0; }
.display { font-size: clamp(56px, 10vw, 110px); font-weight: 700; }

.pill {
  display: inline-block;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 12px 30px;
  text-transform: uppercase;
}
.pill--outline { border: 1.5px solid var(--black); color: var(--black); }
.pill--outline:hover { background: var(--black); color: #fff; }
.pill--solid { background: var(--blue); color: #fff; border: 1.5px solid var(--blue); }
.pill--solid:hover { background: #0040cc; border-color: #0040cc; }

.accent { color: var(--blue); }
.muted { color: var(--gray); }
```

- [ ] **Step 2: Build to confirm CSS parses** (imported in Task 5; for now just commit)

```bash
git add src/styles/global.css
git commit -m "feat: global styles (Wix-faithful palette, pills, type scale)" -- src/styles/global.css
```

---

### Task 5: Base layout and navigation

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Nav.astro`
- Modify: `src/pages/index.astro` (use layout, still placeholder body)

- [ ] **Step 1: Write Nav.astro**

```astro
---
const { active } = Astro.props as { active: 'about' | 'projects' | 'articles' | 'contact' };
const items = [
  { id: 'about', label: 'About Me', href: '/' },
  { id: 'projects', label: 'Projects', href: '/projects/' },
  { id: 'articles', label: 'Articles', href: '/articles/' },
  { id: 'contact', label: "Let's Talk", href: '/contact/' },
];
---
<header class="container" style="display:flex; justify-content:space-between; align-items:center; padding-top:28px; padding-bottom:28px;">
  <a href="/" style="display:flex; align-items:center; gap:10px;">
    <span style="width:14px; height:14px; background:var(--blue); display:inline-block;" aria-hidden="true"></span>
    <span style="font-weight:700; font-size:18px; color:var(--black);">Anping Wang</span>
    <span class="muted" style="font-size:14px;">/&nbsp; Product Manager</span>
  </a>
  <nav aria-label="Main">
    <ul style="list-style:none; display:flex; gap:32px; margin:0; padding:0; font-size:15px;">
      {items.map((item) => (
        <li>
          <a
            href={item.href}
            aria-current={active === item.id ? 'page' : undefined}
            class={active === item.id ? 'accent' : undefined}
          >{item.label}</a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

- [ ] **Step 2: Write Base.astro**

```astro
---
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import { site } from '../data/site-content';

interface Props {
  title: string;
  description: string;
  active: 'about' | 'projects' | 'articles' | 'contact';
}
const { title, description, active } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content="website" />
  </head>
  <body>
    <Nav active={active} />
    <main class="container" style="padding-top:24px; padding-bottom:80px;">
      <slot />
    </main>
    <footer class="container muted" style="padding-top:24px; padding-bottom:32px; font-size:13px; display:flex; justify-content:space-between;">
      <span>© {new Date().getFullYear()} Anping Wang</span>
      <a href={site.linkedin} rel="me noopener" target="_blank">LinkedIn</a>
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Point placeholder index at the layout**

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Anping Wang — Product Management and Design" description="Portfolio of Anping Wang, product manager." active="about">
  <h1>placeholder</h1>
</Base>
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success; `dist/index.html` contains the nav, Poppins woff2 files bundled under `dist/_astro/`.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro src/components/Nav.astro src/pages/index.astro
git commit -m "feat: base layout with header nav, meta, and self-hosted Poppins" -- src/layouts/Base.astro src/components/Nav.astro src/pages/index.astro
```

---

### Task 6: Copy images from archive

**Files:**
- Create: `public/images/*` (6 files), `public/favicon.svg`

- [ ] **Step 1: Resolve thumbnail→project mapping from raw HTML**

Run (find which media ID belongs to which project by proximity in the page source):
```bash
cd "$ARCHIVE/raw"
for id in 56f14e0d 6861eac4 745d17ef b09d092a b6dc28b6; do
  echo "== $id"
  grep -o "[A-Za-z0-9 ']\{0,60\}\(Aiyou\|Red Packet\|360\|Missing Children\|TuSimple\)[A-Za-z0-9 ']\{0,60\}\|$id" page_projects.html | grep -B2 -A2 "$id" | head -6
done
```
If proximity grepping is inconclusive, open `page_projects.html` and locate each `<img>`'s surrounding section heading. Record the mapping before copying.

- [ ] **Step 2: Copy and rename**

```bash
cd "/Users/anping.wang/Documents/Stuff/AI Space/Personal Website/Portfolio/iamanping-site"
mkdir -p public/images
cp "$ARCHIVE/images/80f892_1ec10782ba8547e68225c0f46fdc5ff9~mv2.jpeg" public/images/anping.jpeg
cp "$ARCHIVE/images/<resolved-aiyou-id>" public/images/aiyou.png
cp "$ARCHIVE/images/<resolved-red-packet-id>" public/images/red-packet.png
cp "$ARCHIVE/images/<resolved-360-id>" public/images/360-security.png
cp "$ARCHIVE/images/<resolved-missing-children-id>" public/images/missing-children.png
cp "$ARCHIVE/images/<resolved-tusimple-id>" public/images/tusimple.png
```
If a thumbnail exceeds ~500 KB (the `6861eac4` one is 3891px wide), downscale to 1200px wide: `sips --resampleWidth 1200 public/images/<file>`.

- [ ] **Step 3: Favicon**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#0050FF"/></svg>
```

- [ ] **Step 4: Commit**

```bash
git add public/images public/favicon.svg
git commit -m "feat: profile photo, project thumbnails, favicon from archive" -- public/images public/favicon.svg
```

---

### Task 7: Home page (hero)

**Files:**
- Modify: `src/pages/index.astro` (replace placeholder)

- [ ] **Step 1: Write the hero per spec §Visual**

```astro
---
import Base from '../layouts/Base.astro';
import { site } from '../data/site-content';
---
<Base title="Anping Wang — Product Management and Design" description="Anping Wang — product manager for autonomous driving, AI, and gaming products. Projects, articles, and ways to get in touch." active="about">
  <div style="display:grid; grid-template-columns: 300px 1fr; gap:72px; align-items:start; padding-top:40px;">
    <aside style="border:1.5px solid var(--blue);">
      <div style="padding:36px 24px 28px; text-align:center;">
        <img src="/images/anping.jpeg" alt="Portrait of Anping Wang" width="140" height="140" style="border-radius:50%; margin:0 auto 24px; object-fit:cover;" />
        <p style="font-size:26px; font-weight:700; color:var(--black); line-height:1.25; margin:0;">Anping<br />Wang</p>
        <div style="width:28px; height:2px; background:var(--blue); margin:16px auto;" aria-hidden="true"></div>
        <p style="font-size:12px; letter-spacing:0.3em; margin:0; color:var(--ink);">Product Management and Design</p>
      </div>
      <div style="border-top:1.5px solid var(--blue); padding:12px; text-align:center;">
        <a href={site.linkedin} rel="me noopener" target="_blank" aria-label="Anping Wang on LinkedIn" style="font-weight:700; font-size:17px;">in</a>
      </div>
    </aside>
    <section>
      <h1 class="display">Hello</h1>
      <p style="font-size:24px; margin:8px 0 28px;">I'm Anping</p>
      <p style="margin:0 0 36px;">
        <a class="pill pill--outline" href={site.linkedin} rel="me noopener" target="_blank">LinkedIn</a>
        <a class="pill pill--solid" href="/projects/" style="margin-left:12px;">Projects</a>
      </p>
      {site.bio.map((para) => <p style="max-width:420px; margin:0 0 20px;">{para}</p>)}
    </section>
  </div>
</Base>

<style>
  @media (max-width: 760px) {
    div[style*='grid-template-columns'] { display: block !important; }
    aside { max-width: 300px; margin: 0 auto 40px; }
  }
</style>
```
Note: the scoped `<style>` media query targeting an inline-styled div is brittle — if it doesn't apply, refactor the grid into a class in `global.css` (`.hero-grid`) instead. Keep the visual result identical.

- [ ] **Step 2: Build and inspect against the screenshot**

Run: `npm run build && npm run preview` — open http://localhost:4321 and compare with Anping's screenshot (spec §Visual): blue-bordered card left with photo/name/rule/letter-spaced caption/"in" footer cell; giant Hello, "I'm Anping", outline LINKEDIN + solid blue PROJECTS pills, two bio paragraphs. Check mobile at 375px width.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: home page hero, faithful to Wix design" -- src/pages/index.astro
```

---

### Task 8: Projects page

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/pages/projects.astro`

- [ ] **Step 1: Write ProjectCard.astro**

```astro
---
import type { Project } from '../data/site-content';
const { project } = Astro.props as { project: Project };
---
<article style="display:grid; grid-template-columns: 320px 1fr; gap:40px; align-items:center; padding:40px 0; border-bottom:1px solid #ececec;">
  <img src={project.image} alt={`${project.title} screenshot`} width="320" loading="lazy" style="border:1px solid #ececec;" />
  <div>
    <h2 style="font-size:24px; font-weight:600; margin-bottom:12px;">{project.title}</h2>
    {project.paragraphs.map((para) => <p style="margin:0 0 12px; max-width:560px;">{para}</p>)}
    <a class="accent" href={project.blogUrl} style="font-weight:600;">Read More →</a>
  </div>
</article>

<style>
  @media (max-width: 760px) {
    article { display: block !important; }
    article img { margin-bottom: 20px; }
  }
</style>
```

- [ ] **Step 2: Write projects.astro**

```astro
---
import Base from '../layouts/Base.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { projects } from '../data/site-content';
---
<Base title="Projects — Anping Wang" description="Product projects by Anping Wang: Aiyou, WeChat Red Packet Assistant, 360 Mobile Security, Missing Children Alert System, and TuSimple." active="projects">
  <h1 style="font-size:40px; font-weight:700; margin:24px 0 8px;">Projects</h1>
  {projects.map((project) => <ProjectCard project={project} />)}
</Base>
```

- [ ] **Step 3: Build and compare against `$ARCHIVE/raw/page_projects.html` layout** (alternating/stacked card list; recreate, don't reinterpret — adjust image/text proportions if the raw page differs from this default).

Run: `npm run build && npm run preview`

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/projects.astro
git commit -m "feat: projects page with five case-study cards" -- src/components/ProjectCard.astro src/pages/projects.astro
```

---

### Task 9: Articles page

**Files:**
- Create: `src/components/ArticleRow.astro`, `src/pages/articles.astro`

- [ ] **Step 1: Write ArticleRow.astro**

```astro
---
import type { Article } from '../data/site-content';
const { article } = Astro.props as { article: Article };
const formatted = new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
});
---
<li style="border-bottom:1px solid #ececec;">
  <a href={article.blogUrl} style="display:flex; justify-content:space-between; gap:24px; align-items:baseline; padding:22px 0;">
    <span style="font-weight:600; font-size:18px;">{article.title}</span>
    <span class="muted" style="font-size:14px; white-space:nowrap;">{formatted} →</span>
  </a>
</li>
```

- [ ] **Step 2: Write articles.astro**

```astro
---
import Base from '../layouts/Base.astro';
import ArticleRow from '../components/ArticleRow.astro';
import { articles, site } from '../data/site-content';
---
<Base title="Articles — Anping Wang" description="Articles by Anping Wang on product management, user research, and B2B product design. Full posts on theneverless.com." active="articles">
  <h1 style="font-size:40px; font-weight:700; margin:24px 0 8px;">Articles</h1>
  <p class="muted" style="margin:0 0 16px;">Full articles live on <a class="accent" href={site.blogBase}>my blog</a>.</p>
  <ul style="list-style:none; margin:0; padding:0;">
    {articles.map((article) => <ArticleRow article={article} />)}
  </ul>
</Base>
```

- [ ] **Step 3: Build, preview, commit**

```bash
npm run build
git add src/components/ArticleRow.astro src/pages/articles.astro
git commit -m "feat: articles page linking to blog posts" -- src/components/ArticleRow.astro src/pages/articles.astro
```

---

### Task 10: Contact and 404 pages

**Files:**
- Create: `src/pages/contact.astro`, `src/pages/404.astro`

- [ ] **Step 1: Write contact.astro**

```astro
---
import Base from '../layouts/Base.astro';
import { site } from '../data/site-content';
---
<Base title="Let's Talk — Anping Wang" description="Get in touch with Anping Wang on LinkedIn." active="contact">
  <div style="padding-top:64px; max-width:560px;">
    <h1 class="display" style="font-size:clamp(40px, 7vw, 72px);">Let's talk</h1>
    <p style="margin:24px 0 36px;">The fastest way to reach me is LinkedIn — I read every message.</p>
    <a class="pill pill--solid" href={site.linkedin} rel="me noopener" target="_blank">Message me on LinkedIn</a>
  </div>
</Base>
```

- [ ] **Step 2: Write 404.astro**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Page not found — Anping Wang" description="This page does not exist." active="about">
  <div style="padding-top:64px;">
    <h1 class="display" style="font-size:clamp(40px, 7vw, 72px);">404</h1>
    <p style="margin:24px 0 36px;">That page doesn't exist. It may have lived on the old Wix site.</p>
    <a class="pill pill--outline" href="/">Back home</a>
  </div>
</Base>
```

- [ ] **Step 3: Build, preview both, commit**

```bash
npm run build
git add src/pages/contact.astro src/pages/404.astro
git commit -m "feat: contact and 404 pages" -- src/pages/contact.astro src/pages/404.astro
```

---

### Task 11: CNAME, robots.txt, sitemap verification

**Files:**
- Create: `public/CNAME`, `public/robots.txt`

- [ ] **Step 1: Write files**

`public/CNAME` (single line, no trailing whitespace):
```
iamanping.com
```

`public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://iamanping.com/sitemap-index.xml
```

- [ ] **Step 2: Build and verify dist**

Run: `npm run build && ls dist/CNAME dist/robots.txt dist/sitemap-index.xml && cat dist/CNAME`
Expected: all three exist; CNAME contains exactly `iamanping.com`.

- [ ] **Step 3: Commit**

```bash
git add public/CNAME public/robots.txt
git commit -m "feat: CNAME, robots.txt, sitemap wiring" -- public/CNAME public/robots.txt
```

---

### Task 12: Full local verification pass

- [ ] **Step 1: Tests + links + build**

Run: `npm test && npm run check-links && npm run build`
Expected: all pass (strict link mode is NOT expected to pass yet).

- [ ] **Step 2: Preview click-through**

Run `npm run preview`. Verify: all 4 pages + 404 render; nav active states correct on each page; every Read More/article row points at `theneverless.com/posts/...`; LinkedIn links open profile; no console errors; mobile layout at 375px.

- [ ] **Step 3: Fidelity check**

Compare home against Anping's screenshot and `$ARCHIVE/raw/page_home.html`; projects/articles against their raw pages. Fix discrepancies before proceeding. If any judgment call is ambiguous, screenshot and ask Anping rather than reinterpreting.

---

### Task 13: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: GitHub Pages deploy workflow" -- .github/workflows/deploy.yml
```

---

### Task 14: Create GitHub repo and first push — OWNER-GATED

⚠️ Everything in this task needs Anping: repo creation must happen under the **emrickk** personal account (NOT any work account), and pushing requires his push protocol (explicit double confirmation containing "push").

- [ ] **Step 1 (OWNER): Create repo** — Anping creates **public** repo `emrickk/iamanping` on github.com (no README/license/gitignore — empty). Agents must not use the local `gh` CLI for this (it is authenticated to a work account).

- [ ] **Step 2: Add remote via personal SSH alias**

```bash
git remote add origin git@github-personal:emrickk/iamanping.git
git remote -v
```

- [ ] **Step 3: Pre-push audit**

```bash
git log --format='%an %ae' | sort -u   # must show ONLY: Emrick emrickk@users.noreply.github.com
git ls-files | grep -iE 'env|secret|key|token' || echo clean
```
Expected: single pseudonym author; `clean`.

- [ ] **Step 4 (OWNER-GATED): Push** — only after Anping's protocol-compliant confirmation:

```bash
git push -u origin main
```

- [ ] **Step 5 (OWNER): Configure Pages** — repo Settings → Pages: Source = **GitHub Actions**; Custom domain = `iamanping.com` (will show DNS check pending until Task 15 — expected). Verify the Actions run from the push succeeded (build + deploy green).

---

### Task 15: DNS cutover (Cloudflare + GoDaddy) — OWNER-GATED

Mirrors the theneverless.com runbook (blog repo, `docs/superpowers/specs/2026-07-14-theneverless-domain-cutover.md`).

- [ ] **Step 1: Pre-flight — resolve pending blog slugs**

Check the blog repo for the three pending case studies (Aiyou, 360, Missing Children):
```bash
ls "/Users/anping.wang/Documents/Stuff/AI Space/Personal Website/Personal Blog/blog/src/content/posts/" | grep -iE 'aiyou|360|missing'
```
Update `src/data/site-content.ts` with real slugs, flip `pending: false`, run `npm run check-links:strict`. If they are NOT yet live on the blog: STOP and ask Anping — (a) wait, or (b) temporarily point those cards at `https://theneverless.com/posts/` category/index (his call per spec §Launch gates). Commit any data change; push needs protocol confirmation again.

- [ ] **Step 2 (OWNER): Add zone to Cloudflare** — Anping adds `iamanping.com` in his Cloudflare account. Cloudflare will import existing Wix records — delete the imported Wix A/CNAME records.

- [ ] **Step 3 (OWNER, agent-assisted): Create records — ALL grey-cloud (DNS only)**

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | 185.199.108.153 | DNS only |
| A | `@` | 185.199.109.153 | DNS only |
| A | `@` | 185.199.110.153 | DNS only |
| A | `@` | 185.199.111.153 | DNS only |
| CNAME | `www` | `emrickk.github.io` | DNS only |
| TXT | `@` | `v=spf1 -all` | — |
| TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;` | — |

- [ ] **Step 4 (OWNER): Switch nameservers at GoDaddy** — from `ns6/ns7.wixdns.net` to the pair Cloudflare assigns.

- [ ] **Step 5: Verify propagation**

```bash
dig +short NS iamanping.com          # → cloudflare nameservers
dig +short A iamanping.com           # → the four 185.199.x.153 IPs
dig +short CNAME www.iamanping.com   # → emrickk.github.io
```
(Repeat until propagated; TTL is short once Cloudflare answers.)

- [ ] **Step 6 (OWNER): Certificate + HTTPS** — in repo Pages settings, confirm the DNS check passes and the cert issues (minutes to ~1 h), then enable **Enforce HTTPS**.

- [ ] **Step 7: Live verification**

```bash
curl -sI https://iamanping.com/ | head -3            # HTTP/2 200
curl -sI https://www.iamanping.com/ | head -3        # 301 → https://iamanping.com/
curl -sI http://iamanping.com/ | head -3             # 301 → https
curl -s https://iamanping.com/ | grep -o '<link rel="canonical"[^>]*>'   # canonical = https://iamanping.com/
curl -s https://iamanping.com/sitemap-index.xml | head -2
npm run check-links:strict
```
All must pass.

---

### Task 16: Decommission Wix + wrap-up

- [ ] **Step 1 (OWNER): Cancel Wix premium plan** — only after Task 15 Step 7 passes. Keep the Wix account itself until billing confirms cancellation. GoDaddy registration untouched.

- [ ] **Step 2: Update project memory** — update `personal-blog-rebuild.md` (portfolio track complete: iamanping.com live on GitHub Pages, repo `emrickk/iamanping`, checkout at `Portfolio/iamanping-site/`, Wix cancelled) and `MEMORY.md` index hook.

- [ ] **Step 3: Commit any doc updates in the repo** (README with dev commands is optional but recommended: `npm install / dev / build / test / check-links`, push protocol note, archive location pointer).
