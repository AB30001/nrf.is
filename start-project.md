# Master Rebrand & Content Seed Prompt — Next.js + Sanity Blog Template

Use this prompt when starting a new project from this template. Fill in the
INPUTS table, then work through the phases in order. The codebase has
already been stripped of any previous client's branding — every place that
needs a new value is marked with a `[BRACKETED_PLACEHOLDER]`. Your job is to
replace every placeholder, seed real content, and verify nothing is left
over.

Do not stop until a final codebase scan returns zero matches for every
placeholder token below, for `example.com`, and for any leftover demo
content from `scripts/seed-example.mjs`.

---

### ROLE

You are taking over a clean Next.js 14 + Sanity CMS v3 blog template
(Stablo-style) and turning it into a specific client site. The template has
no previous brand's footprints — only generic placeholders and demo/example
content. You will: replace all placeholders with the new brand, seed real
content into Sanity, get local dev running, and verify SEO/crawl readiness
for production.

### INPUTS YOU WILL RECEIVE

| Placeholder | Description |
| :--- | :--- |
| `[SITE_NAME]` | New site/brand name |
| `[SITE_DOMAIN]` | New production domain, e.g. `https://example.com` |
| `[SITE_TAGLINE]` | Short tagline shown in OG image and footer |
| `[SITE_DESCRIPTION]` | Meta description (~150–160 chars) |
| `[SEO_KEYWORD_1/2/3...]` | Target SEO keywords |
| `[LOCALE]` | OpenGraph locale, e.g. `en_US`, `lt_LT` |
| `[SANITY_PROJECT_ID]` | New Sanity project ID |
| `[SANITY_ORG_ID]` | New Sanity organization ID (manual step in sanity.io/manage) |
| `[GITHUB_REPO_URL]` | New repo URL (if applicable) |
| `[WEB3FORMS_KEY]` | Web3Forms access key for the contact form |
| `[GENERATE_NEW_SECRET]` | New revalidation secret (`openssl rand -hex 32`) |
| Content brief | List of post/page topics to seed — see PHASE 4 |

---

### REPOSITORY STRUCTURE

Two folders may exist side by side:

- **`template-frontend`** — Next.js site + embedded Sanity Studio at `/studio`.
  This is the **primary** project — it's what gets deployed to production.
- **`template`** — standalone Sanity Studio (same schema, runs on port 3333
  via `sanity dev`). Optional; useful for editing content without running
  the Next.js app.

Both must point at the **same** `[SANITY_PROJECT_ID]` and dataset.

---

### PHASE 1 — FILE-BY-FILE REBRAND CHECKLIST

Go through every file below and replace placeholders. Search for
`[SITE_NAME]`, `[SITE_TAGLINE]`, `[SITE_DESCRIPTION]`, `[SEO_KEYWORD_*]`,
`[SANITY_PROJECT_ID]`, `[GENERATE_NEW_SECRET]`, `[WEB3FORMS_KEY]`, and
`example.com` across the repo to find every spot — the list below is the
complete set as of this template version, but always re-search in case the
template has drifted.

**`template-frontend/`**

1. **`lib/seo.js`** — the single source of truth for SEO. Update:
   - `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_KEYWORDS`
   - `SITE_URL` reads `NEXT_PUBLIC_SITE_URL` from env (set in `.env.local`, no code change needed)
   - Everything else (`app/(website)/layout.tsx`, `app/sitemap.ts`,
     `app/robots.ts`, `app/opengraph-image.tsx`, the post page, footer,
     navbar, contact form, privacy page) imports from here — updating this
     file propagates the brand almost everywhere automatically.

2. **`public/img/logo.png`** — replace with the new logo file. Delete any
   other old logo/icon assets you find in `public/`.

3. **`app/icon.svg`** — replace the placeholder circle with the new favicon
   mark (e.g. the brand's initial letter in brand colors).

4. **`app/opengraph-image.tsx`** — uses `SITE_NAME` from `lib/seo.js`
   automatically. Replace the remaining `[SITE_TAGLINE]` string with the
   real tagline, and adjust colors/styling to match the brand.

5. **`app/(website)/layout.tsx`** — already wired to `lib/seo.js` (metadata,
   OpenGraph, sitewide JSON-LD via `buildWebsiteJsonLd()`). Update `locale`
   in `baseOpenGraph()` calls if not `en_US`. Set `lang` in `app/layout.tsx`
   to `[LOCALE]`'s language code if not English.

6. **`app/sitemap.ts`** / **`app/robots.ts`** — already read `SITE_URL` from
   `lib/seo.js`. No changes needed beyond `lib/seo.js` + env var.

7. **`components/navbar.js`, `components/navbaralt.js`** — replace
   `[SITE_NAME]` alt text / fallback spans (logo alt text — only used when
   no logo is set in Sanity Settings).

8. **`components/footer.js`** — replace `[SITE_TAGLINE]`. Copyright name
   comes from the Sanity `settings.copyright` field, falling back to
   `SITE_NAME`.

9. **`app/(website)/contact/contact.js`** — already wired to `SITE_NAME` for
   `from_name`, `subject`, and heading. Just confirm `NEXT_PUBLIC_WEB3FORMS_KEY`
   is set in `.env.local`.

10. **`app/(website)/post/[slug]/page.js`** — already builds
    `Article`/`BlogPosting` + `BreadcrumbList` JSON-LD and metadata via
    `lib/seo.js`. No changes needed beyond `lib/seo.js` + env var.

11. **`app/(website)/privacy/page.js`** — already uses `SITE_NAME`. Review
    the body copy and adjust if the new site has different data-handling
    practices (e.g. analytics, cookies).

12. **`sanity.config.ts`** (embedded studio) — replace `title: "[SITE_NAME]"`.

13. **`package.json`** — `name` field can stay `template-frontend` or be
    renamed to match the project slug. `seed-content` script path assumes
    `../template/scripts/seed-example.mjs` exists — update if the seed
    script moves or is renamed during PHASE 4.

14. **`.env.local`** (create from `.env.local.example`):
    ```
    NEXT_PUBLIC_SANITY_PROJECT_ID=[SANITY_PROJECT_ID]
    SANITY_STUDIO_PROJECT_ID=[SANITY_PROJECT_ID]
    NEXT_PUBLIC_SANITY_DATASET=production
    SANITY_REVALIDATE_SECRET=[GENERATE_NEW_SECRET]
    NEXT_PUBLIC_SITE_URL=[SITE_DOMAIN]
    NEXT_PUBLIC_WEB3FORMS_KEY=[WEB3FORMS_KEY]
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
    ```

15. **`README.md`** — replace `[SITE_NAME]` and rewrite any
    project-specific notes (deploy target, special setup steps).

**`template/`** (standalone Studio, if present)

16. **`sanity.config.ts`** / **`sanity.cli.ts`** — replace `[SITE_NAME]` and
    `[SANITY_PROJECT_ID]`, or set `SANITY_STUDIO_PROJECT_ID` in the
    environment.

17. **`README.md`** — replace `[SITE_NAME]`.

---

### PHASE 2 — SEO MODULE (already exists — just configure)

`lib/seo.js` and `components/json-ld.js` already provide:

- `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_KEYWORDS`
- `absoluteUrl(path)`
- `buildWebsiteJsonLd()` — injected sitewide in `app/(website)/layout.tsx`
- `buildArticleJsonLd(post, imageUrl)` + `buildBreadcrumbJsonLd(items)` —
  used on `app/(website)/post/[slug]/page.js`
- `baseOpenGraph(overrides)`
- `googleVerification()` — reads `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

Your only task here is to fill in the constants at the top of `lib/seo.js`
and set `[LOCALE]` if not `en_US`. Do not duplicate these helpers elsewhere.

---

### PHASE 3 — ON-DEMAND REVALIDATION (already exists — just configure)

`app/api/revalidate/route.js` already implements the webhook handler:
validates `SANITY_REVALIDATE_SECRET`, revalidates `/`, `/archive`,
`/sitemap.xml`, and the affected `/post/[slug]` or `/category/[slug]`.

After deploying, configure a webhook in
[sanity.io/manage](https://sanity.io/manage) for project
`[SANITY_PROJECT_ID]`:

- URL: `[SITE_DOMAIN]/api/revalidate`
- Trigger on: create, update, delete of `post` and `category` documents
- Secret: same value as `SANITY_REVALIDATE_SECRET`

---

### PHASE 4 — SANITY CONTENT SEEDING

`template/scripts/seed-example.mjs` (or `template-frontend`'s
`pnpm seed-content`, which runs the same script) currently seeds **placeholder
demo content**: 3 generic categories (Guides, News, Reviews), one "Demo
Author", a placeholder about page, and 4 placeholder posts using
`picsum.photos/seed/demo-*` images.

To seed real content for this project:

1. Either edit `seed-example.mjs` in place, or copy it to a new file (e.g.
   `seed-<project>.mjs`) and update the `seed-content` script path in both
   `package.json` files.
2. Replace the categories, author, about page, and posts arrays with the
   real content brief for this project (provided separately).
3. Test all image URLs before running — broken image URLs will fail the
   upload step partway through.
4. Run `pnpm seed-content` (from `template-frontend`) or `npm run
   seed-content` (from `template`) against `[SANITY_PROJECT_ID]`.
5. Delete the placeholder demo content if it was seeded into the real
   project by mistake (see PHASE 6).

---

### PHASE 5 — LOCAL DEV FIX

If `npm run dev` / `pnpm dev` fails with
`Cannot find module 'next/dist/bin/next'`:

```bash
cd template-frontend
pnpm install
pnpm dev
```

**Common mistakes:**
- Wrong directory: running in `template` (standalone Studio) instead of
  `template-frontend`.
- Corrupted `node_modules`: delete and reinstall with `pnpm install`.

**Clear stale cache if old content persists locally:**

```bash
rm -rf .next
pnpm dev
```

---

### PHASE 6 — SANITY PROJECT ISOLATION

If this project was cloned from a previous client's working copy:

- Confirm `.env.local`, `sanity.config.ts`, and `sanity.cli.ts` (in both
  folders) all point at `[SANITY_PROJECT_ID]` — not a previous project's ID.
- If the new Sanity project still has old/demo content from a previous
  seed, delete those documents (via Studio UI or a small cleanup script)
  before going live.
- Delete `.next` and rebuild after switching project IDs.
- On the host (Vercel/Netlify): update env vars and redeploy.

---

### PHASE 7 — FINAL VERIFICATION (MANDATORY)

**A. Placeholder scan — must return ZERO results**

Search the entire codebase (excluding `node_modules`, `.next`, `dist`,
`.sanity`) for:
- `[SITE_NAME]`, `[SITE_TAGLINE]`, `[SITE_DESCRIPTION]`, `[SEO_KEYWORD_`
- `[SANITY_PROJECT_ID]`, `[GENERATE_NEW_SECRET]`, `[WEB3FORMS_KEY]`
- `example.com`
- `picsum.photos/seed/demo-` (placeholder seed images — unless intentionally kept)

**B. Sanity content check**
- Confirm post/category/author counts and titles match the real content
  brief only. No demo posts (`post-demo-*`) remain in the dataset.

**C. SEO smoke test (after deploy or local build)**
- `GET /robots.txt` → sitemap URL uses `[SITE_DOMAIN]`
- `GET /sitemap.xml` → all real posts + categories listed, no demo slugs
- View source on a post page → `BlogPosting`/`Article` + `BreadcrumbList`
  JSON-LD present, with correct `[SITE_NAME]`/`[SITE_DOMAIN]`
- OG image renders the new site name and tagline

**D. Visual check**
- Logo renders in navbar (file + alt text)
- Favicon correct in browser tab
- Studio title at `/studio` shows `[SITE_NAME]`
- Contact form submits with `from_name` = `[SITE_NAME]`

---

### PHASE 8 — PRODUCTION DEPLOY CHECKLIST

**Environment variables (Vercel/Netlify)**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=[SANITY_PROJECT_ID]
SANITY_STUDIO_PROJECT_ID=[SANITY_PROJECT_ID]
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_REVALIDATE_SECRET=[GENERATE_NEW_SECRET]
NEXT_PUBLIC_SITE_URL=[SITE_DOMAIN]
NEXT_PUBLIC_WEB3FORMS_KEY=[WEB3FORMS_KEY]
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

**Sanity (manual, in sanity.io/manage)**
- Project: `[SANITY_PROJECT_ID]` (org: `[SANITY_ORG_ID]`)
- Settings document: title, URL, copyright, description, logo
- Webhook → `[SITE_DOMAIN]/api/revalidate`

---

### DEFINITION OF DONE

- Zero results for the PHASE 7A placeholder scan.
- `lib/seo.js` constants filled in; `buildWebsiteJsonLd`,
  `buildArticleJsonLd`, `buildBreadcrumbJsonLd` render correctly.
- Sitemap includes all real pages, categories, posts — no demo content.
- `/api/revalidate` webhook configured and tested.
- Sanity `settings`, `about`, `author`, `category`, `post` documents updated
  with real content; placeholder demo documents removed.
- Logo renders in navbar; favicon correct; OG image shows `[SITE_NAME]` +
  `[SITE_TAGLINE]`.
- `pnpm install` + `pnpm dev` works in `template-frontend`.
- `README.md` reflects the new brand and any project-specific notes.

### ANTI-PATTERNS — DO NOT

- Leave any `[BRACKETED_PLACEHOLDER]` or `example.com` in committed code.
- Duplicate SEO/JSON-LD logic outside `lib/seo.js` — extend it instead.
- Seed posts without testing image URLs first.
- Leave placeholder demo content (`post-demo-*`, "Demo Author") in the
  production dataset.
- Commit `.env.local` secrets to git.
- Declare done without running the PHASE 7A placeholder scan.
