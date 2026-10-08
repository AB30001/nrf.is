# SEO progress — nrf.is

_Last updated: 2026-10-09_
**Current phase:** 3/5 done in code; deploy pending → next: Phase 6 (content refreshes) and Phase 4 (internal links)
**Next review:** 2026-10-16

## Phases

### Phase 0 — Scope and access
- [x] Canonical domain and protocol/host confirmed (https://nrf.is)
- [x] Target country and language confirmed (US / English, decision recorded below)
- [x] Primary conversion goal confirmed (affiliate bookings)
- [~] Domain history established (aged/reused: DA 35; prior use unknown, archive.org offline)
- [!] Search Console and analytics access: not available to the agent (owner: user)
- [x] CMS and publication workflow understood, including the automated pipeline
- [x] Existing SEO documents and uncommitted work reviewed (monetization work is uncommitted)
- [x] `site-brief.md` written

### Phase 1 — Baseline measurement
- [x] Mangools quota and plan caps recorded with date
- [x] `location_id` 2840 and `language_id` 1000 recorded
- [x] Existing Mangools request history checked (no prior Iceland/US research)
- [x] Indexable page inventory built (36 posts, 5 categories, 1 author, archive, 4 static pages)
- [x] Current rankings baseline: 30 US keywords, positions 58–94 (Mangools competitor keywords)
- [x] Domain authority baseline captured
- [ ] Core Web Vitals / performance baseline (do after deploy)
- [x] Baseline table below

### Phase 2 — Crawl and indexation integrity
- [x] robots.txt reviewed (fixed `/studio`)
- [x] noindex/nofollow audited (only /studio is noindex)
- [x] Canonical tags correct, absolute, self-referencing (fixed, local)
- [x] No canonical conflicts with redirects/pagination (archive pages self-canonical)
- [x] Redirects: http/www 301, trailing slash 308
- [x] Sitemap lists only canonical indexable URLs (expanded to 48, local)
- [x] Sitemap referenced from robots.txt
- [x] One host
- [x] Trailing-slash behaviour consistent
- [x] 404 returns 404
- [x] Pagination handled deliberately
- [-] hreflang (single locale)

**Gate:** passed on localhost (rendered HTML checked per page type). Must be re-checked on production after deploy.

### Phase 3 — Keyword research and clustering
- [x] Seeds grounded in topic
- [~] Candidates expanded; keyword IDs not yet captured (needed only for the Mangools list; recover with `full: true` within 24h of 2026-10-09)
- [x] Irrelevant terms excluded
- [x] Clustered by intent
- [x] SERPs validated for 5 finalists
- [x] Each cluster has one target URL
- [x] Cannibalization checked (4 pairs, see content map)
- [~] Portfolio saved to `keyword-research.md`; Mangools list not created (needs approval: writes to the account)
- [x] Unknown metrics labeled unknown

### Phase 4 — Architecture and internal linking
- [ ] Not started

### Phase 5 — On-page templates and structured data
- [x] Title template unique per page
- [x] Meta descriptions per page type
- [x] One h1 per page
- [x] OG/Twitter complete with absolute URLs
- [x] lang="en"
- [x] Structured data: WebSite + Organization (all), BlogPosting + BreadcrumbList (posts), BreadcrumbList (categories)
- [x] Author, publish and modified date exposed (JSON-LD + og article tags)
- [x] Images have alt; partner images have dimensions
- [ ] Performance check after deploy
- [ ] Accessibility spot check

### Phase 6 — Content production
- [x] Content map drafted
- [ ] Briefs and Sanity drafts for P1 refreshes (awaiting go-ahead)

### Phase 7 — Off-page and links
- [ ] Not started (backlink profile review recommended: inherited links on an aged domain)

### Phase 8 — Tracking
- [ ] Not started (SERPWatcher tracking after deploy, needs approval)

## Baseline
| Metric | Value | Source | Measured |
| --- | --- | --- | --- |
| Domain Authority (Moz) | 35 | Mangools SiteProfiler | 2026-10-09 |
| Page Authority (home) | 32 | Mangools SiteProfiler | 2026-10-09 |
| Citation Flow / Trust Flow | 28 / 24 | Mangools SiteProfiler (Majestic) | 2026-10-09 |
| Referring IPs | 114 | Mangools SiteProfiler | 2026-10-09 |
| Ranking keywords (US) | 30, positions 58–94, none in top 50 | Mangools competitor keywords | 2026-10-09 |
| Sitemap URLs (live) | 40 | curl https://nrf.is/sitemap.xml | 2026-10-09 |
| Pages with canonical (live) | posts only | rendered HTML | 2026-10-09 |
| GSC impressions, last 3 months | 2,121 total; Jul 177 → **Aug 1,547 → Sep 349 → Oct 1–6: 48** (declining, ~5–10/day now) | GSC export `gsc-2026-10-09/` | 2026-10-09 |
| GSC clicks, last 3 months | 1 (home page) | GSC | 2026-10-09 |
| GSC avg position | ~67 desktop / ~67 mobile | GSC | 2026-10-09 |
| Posts with any impressions | 21 of 36 (most posts from 2026-09-23 on have none) | GSC Pages | 2026-10-09 |
| Top clusters by impressions | puffins 594 (avg pos 77), black sand/Reynisfjara 499 (71), hot springs 259 (75) | GSC Queries | 2026-10-09 |
| Countries (impressions) | US 534, UK 330, CA 321, IE 252, IS 134 → English worldwide | GSC Countries | 2026-10-09 |
| Core Web Vitals | not measured | — | — |

## Changes shipped
| Date | Change | Page types | Expected metric | Verified | Outcome |
| --- | --- | --- | --- | --- | --- |
| 2026-10-09 (deployed 1d0a619) | `pageMetadata()` helper: canonical, titles, descriptions, OG/Twitter per page | all | Correct canonicalization; better titles/CTR on home, categories, archive | localhost + live HTML | |
| 2026-10-09 (deployed 1d0a619) | Category titles/descriptions from Sanity + breadcrumbs | category | Category pages indexable with descriptive titles | localhost | |
| 2026-10-09 (deployed 1d0a619) | Sitemap 40 → 48 URLs, `_updatedAt` lastmod | sitemap | Categories discovered/crawled | localhost | |
| 2026-10-09 (deployed 1d0a619) | Meta/JSON-LD description fallback for posts without excerpt | post | No empty descriptions | localhost | |
| 2026-10-09 (deployed 1d0a619) | robots `Disallow: /studio` | robots | — | localhost | |

## Open work
| Item | Priority | Owner | Blocked by |
| --- | --- | --- | --- |
| ~~Deploy template fixes~~ done 2026-10-09 (Netlify, commit 1d0a619) | — | — | — |
| Refresh P1 posts as Sanity drafts (best time, waterfalls, 7-day itinerary, Reykjavík) | high | agent | go-ahead |
| Merge the two Silfra posts + 301 | medium | agent | approval (URL change) |
| Internal linking pass (Phase 4) | medium | agent | — |
| SERP check + brief: "things to do in iceland" pillar, Kerid crater | medium | agent | — |
| Mangools keyword list + SERPWatcher tracking | medium | agent | approval (account writes), deploy |
| Search Console access / export | medium | user | — |
| Backlink profile review (aged domain) | low | agent | — |

## Decisions log
| Date | Decision | Reason |
| --- | --- | --- |
| 2026-10-09 | Target market US (2840), English | English site; US is the largest English-speaking source market for Iceland; user did not specify |
| 2026-10-09 | Refresh existing posts before creating new ones | All 30 rankings are at positions 58–94; posts are thin vs SERPs; DA 35 can compete on KD 11–24 terms |
| 2026-10-09 | Paginated archive pages: self-canonical, not in sitemap | Google guidance for paginated series; posts already listed individually |
| 2026-10-09 | Refresh order changed after GSC: puffins, black sand beaches, hot springs first, then best time / waterfalls / itinerary / Reykjavík | GSC shows Google already tests these three posts (1,352 of 2,121 impressions); improving them is the fastest path to page 1–3 |
| 2026-10-09 | Write for English speakers worldwide; keep US as the Mangools research market | GSC: US only 25% of impressions, UK/CA/IE together 43% |

## GSC notes (2026-10-09)
- Impression spike 18–21 Aug (avg position ~50), then decline. Site changes then: redesign 4 Aug, cookie banner 22 Aug (removed 18 Sep). No evidence these caused the drop; the pattern matches a new site's early test period ending, with thin content.
- 15 posts have zero impressions: likely not indexed. **Ask the user for GSC → Indexing → Pages** (crawled/discovered – not indexed) and request indexing for priority URLs after the refreshes.
- The cross-site "link-path" posts (Norway / Oslo topics) have no impressions and dilute the site's topical focus; review whether they belong on nrf.is.
- Near-page-1 queries: "south iceland itinerary" #1, "how to get from reykjavik to blue lagoon" #2, "most dangerous beach in iceland" #3, "secret lagoon" / "forest lagoon" #3, "why is iceland the safest country in the world" #7 (1 impression each).
