# SEO audit — nrf.is

_Audited: 2026-10-09 (live site https://nrf.is, then fixes verified on localhost)_

## Summary
- Findings: 0 critical, 3 high, 5 medium, 2 low
- Fixed in code (not yet deployed): 8
- Blockers needing user decision: 1 (deploy)

## Verified healthy (live, 2026-10-09)
- http → https and www → apex: 301 to https://nrf.is/
- Unknown URL returns 404 (not soft 404)
- Trailing slash on posts: 308 to the no-slash URL (canonical form)
- `robots.txt` allows all content and points to the sitemap
- Posts: unique title + description, self canonical, BlogPosting + BreadcrumbList JSON-LD, one H1, `lang="en"`, all images have `alt`
- `/studio` sends `noindex`

## Findings

### A1 — No canonical tag outside posts
- **Priority:** high · **Category:** canonical
- **Affected:** home, 5 categories, archive (+ pages), author, about, contact, privacy (~12 URLs)
- **Evidence:** no `<link rel="canonical">` in live HTML for /, /category/itineraries-road-trips, /archive, /author/erika-sand, /about. The layout set `canonical: settings?.url`, which isn't a valid Next.js metadata key, so nothing was output
- **Fix:** `pageMetadata()` helper in `lib/seo.js` sets `alternates.canonical` per page; invalid key removed from `app/(website)/layout.tsx`
- **Status:** fixed (local) · **Verified:** localhost, all page types show exactly one self-referencing canonical

### A2 — Same title on home, archive and about ("NRF.is")
- **Priority:** high · **Category:** metadata
- **Evidence:** live `<title>NRF.is</title>` on /, /archive, /about, /archive?page=2
- **Fix:** explicit titles: "Iceland Travel Guide: Itineraries, Sights & Tips | NRF.is", "All Iceland Travel Guides", "About NRF.is: Who Writes Our Iceland Guides"; paginated archive adds ", Page N"
- **Status:** fixed (local) · **Verified:** localhost

### A3 — Category titles were lowercased slugs
- **Priority:** high · **Category:** metadata
- **Evidence:** live `<title>itineraries road trips | NRF.is</title>`; generic site description
- **Fix:** `getCategoryBySlug()` (new GROQ `categoryquery`); title "<Category>: Iceland Travel Guides", description from the Sanity category `description`, shown as the header subtitle too; BreadcrumbList JSON-LD added
- **Status:** fixed (local) · **Verified:** localhost /category/itineraries-road-trips

### A4 — One generic description on every non-post page
- **Priority:** medium · **Category:** metadata
- **Fix:** unique descriptions per page type (home, archive, category, author, about, contact, privacy, affiliate disclosure)
- **Status:** fixed (local)

### A5 — og:url and twitter:title inherited from the layout
- **Priority:** medium · **Category:** metadata
- **Evidence:** layout `openGraph.url = SITE_URL` and `twitter.title = "NRF.is"` applied to every page without its own values
- **Fix:** removed from the layout; `pageMetadata()` sets og:title/description/url/image and twitter title/description per page. Posts get `og:type=article`, published/modified time, author, section
- **Status:** fixed (local)

### A6 — Sitemap missing categories, author and legal pages; lastmod = publish date
- **Priority:** medium · **Category:** indexation
- **Evidence:** live sitemap had 40 URLs (home, about, contact, archive + 36 posts)
- **Fix:** `app/sitemap.ts` adds 5 categories (lastmod = newest post in the category), author, affiliate-disclosure, privacy; posts use `_updatedAt`. Paginated archive pages are intentionally left out
- **Status:** fixed (local) · **Verified:** localhost sitemap = 48 URLs

### A7 — Post with no excerpt has no meta description
- **Priority:** medium · **Category:** metadata
- **Affected:** /post/iceland-s-eu-referendum-why-the-land-of-fire-and-ice-is-keeping-brussels-at-bay (agent-published, 530 words, 0 H2)
- **Fix:** `summarize()` fallback from the opening paragraphs, for both meta and BlogPosting JSON-LD. Content fix (write a real excerpt) listed in the content map
- **Status:** fixed (local)

### A8 — robots.txt did not cover `/studio` itself
- **Priority:** low · **Category:** indexation
- **Evidence:** `Disallow: /studio/` doesn't match `/studio`, which returned 200 (it is `noindex`, so low impact)
- **Fix:** `Disallow: /studio`
- **Status:** fixed (local)

### A9 — Thin posts relative to the SERPs
- **Priority:** medium · **Category:** content
- **Evidence:** 20 of 36 posts are 860–1,080 words with 4–6 H2s; the competing pages for priority keywords are long, structured guides (see keyword-research.md)
- **Fix:** refresh priority posts (content-map.md)
- **Status:** open

### A10 — Duplicate-intent post pairs
- **Priority:** low (now) · **Category:** content / cannibalization
- **Evidence:** two posts each for Silfra, South Coast, Northern Lights, Westfjords
- **Fix:** see cannibalization register in content-map.md
- **Status:** open

## Not yet checked
- Core Web Vitals / Lighthouse on the live site (do after deploy, since the monetization blocks change the post template)
- Search Console coverage and indexing status (no access)
- Internal link graph (Phase 4)

## Blocked items
| ID | Blocker | Needs | Owner |
| --- | --- | --- | --- |
| A1–A8 | Fixes are local only | Commit + push / Vercel deploy approval | user |
