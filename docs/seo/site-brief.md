# Site brief — nrf.is

_Last updated: 2026-10-09_

## Identity
- Canonical origin: https://nrf.is (http and www 301 to it; verified 2026-10-09)
- Site topic: Iceland travel guide: itineraries, natural sights, activities, practical planning, culture
- Products / services: none of its own; editorial content
- Audience: English-speaking travellers planning an Iceland trip, mainly first-timers
- Monetization: affiliate links (Stay22 hotels, Viator tours, Tiqets tickets, Travelpayouts flights / car rental / eSIM / insurance / transfers). Built locally 2026-10-08, **not yet deployed**. See `travel-monetize.md`
- Primary conversion goal: clicks to partner bookings (tours, stays, car rental) from planning-stage readers
- Secondary goals: organic traffic growth; topical authority on Iceland trip planning

## Market
- Target country: United States (Mangools location_id: 2840). Decision 2026-10-09: the site is English and the US is the largest English-speaking source market for Iceland. Revisit if analytics show a different split
- Language: English (Mangools language_id: 1000)
- Secondary markets (not researched yet): United Kingdom (2826), Canada

## Domain history
- Status: **aged / previously used domain** (DA 35 and 114 referring IPs on a site whose first commit is 2026-06-12)
- Prior use: unknown. The Internet Archive was offline on 2026-10-09. Re-check `web.archive.org/web/*/nrf.is` before choosing new topics
- Implications: inherited authority helps; check the backlink profile for off-topic or spammy links (Phase 7)

## Stack
- Framework / hosting: Next.js 14 app router on Vercel (inferred from config)
- CMS / content source: Sanity (project in `.env.local`), dataset public
- Publication workflow: posts written in Sanity Studio and published via scripts (`nrf.is/scripts/*.mjs`) and the `article-writer` / `seo-blog-write-and-publish` skills
- Automated content pipeline: yes. Agent-written posts are published through Sanity scripts, including cross-site "link-path" posts (e.g. Norway / Oslo pieces)
- Indexable page types: home, post (`/post/[slug]`), category (`/category/[slug]`), author (`/author/[slug]`), archive (`/archive`, paginated via `?page=`), about, contact, privacy, affiliate-disclosure (new)

## Access
- Search Console: **unknown**. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is set, so a property likely exists. Ask the user for access or exports
- Analytics: GoatCounter (`nrfis.goatcounter.com`), cookie-free; access not confirmed
- Mangools plan: basic / combo. On 2026-10-09: related-keywords 86/100, serps 100/100, sp-overview 20/20, tracked keywords 221

## Constraints
- YMYL topic: no (travel). Safety/driving advice should still cite official sources (road.is, safetravel.is, vedur.is)
- Things that must not change: post URLs (`/post/<slug>`); cookie-free setup (no consent banner)
