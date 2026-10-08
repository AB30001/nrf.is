# Travel Blog Monetization Playbook

How to add affiliate revenue to a travel blog: hotels, tours, attraction tickets, flights, car rental, eSIM, insurance and airport transfers. It was built and tested on **NRF.is** (Iceland, Next.js 14 + Sanity). This document is written so another agent can repeat it on a different blog without any earlier context.

- **Working code to copy:** `~/.claude/skills/blog-monetization/template/` (a snapshot of NRF.is), or the NRF.is repo itself: `C:\Users\diska\Documents\GitHub\nrf.is\nrf.is-frontend`.
- **Edits to existing files:** `template/patches/*.diff` (git diffs from NRF.is). Use them as a guide; apply them by hand.
- **Secrets:** never in this file, the skill or a commit. They live in NRF.is `.env.local` and are the same for every site. Copy them from there, or ask the user.

_Last updated: 2026-10-09_

---

## 0. Before you start (agent checklist)

1. Read this whole file, then `SKILL.md` in the skill folder.
2. Inspect the target repo: framework and router, CMS, post template, how links in article text are rendered, analytics, footer, privacy page, and whether the site uses a cookie banner.
3. Ask the user only for what you can't find out yourself:
   - **The site's Travelpayouts project ID (`trs`).** Every site needs its own: Travelpayouts dashboard → Projects → add the site.
   - The destination (country or region) and the site currency, if they aren't obvious from the content.
   - Confirmation to commit, push, or run `sanity deploy`. Never do these without it.
4. The user does **not** want new affiliate accounts. Use only the accounts below. Anything else must come **through Travelpayouts**.
5. Build locally, verify (§9), show the user on localhost, then wait for approval to ship.

---

## 1. Partners and what each one is for

Each partner has one job, so a page never shows two competing offers for the same thing.

| Need | Partner | How it's integrated | Tracking |
|---|---|---|---|
| Hotels and stays | **Stay22** (sends readers to Booking.com, Expedia, Hotels.com, Vrbo, Agoda: "roam" picks the best one per reader) | Plain "Allez" links (no script) + a map iframe that loads on click | `aid` + `campaign` |
| Guided tours, day trips | **Viator** | Partner API v2: cards rendered on the server, cached 24h | `pid`/`mcid` already in the API's URLs + `campaign` |
| Attraction tickets (lagoons, museums, observation decks) | **Tiqets**, content from the Tiqets API, **tracked through Travelpayouts** | Server-rendered list | tp.media link (`sub_id`) |
| Flight search | **Kiwi.com** through Travelpayouts (Aviasales as fallback) | Native search form; server route creates the tracked link | tp.media (`sub_id`) |
| Flight prices ("from €84") | **Aviasales** through Travelpayouts | Server-rendered list from the Data API | tp.media (`sub_id`) |
| Car rental | **Localrent** through Travelpayouts | Localrent's own widgets: search form (loads when scrolled into view) + full catalogue (loads on click) | built into the widget (`trs` / `shmarker`) |
| eSIM | **Saily** through Travelpayouts (Airalo and Yesim also available) | Card linking to the brand page | tp.media (`sub_id`) |
| Travel insurance | **EKTA** through Travelpayouts | Card | tp.media (`sub_id`) |
| Airport transfer | **Welcome Pickups** through Travelpayouts | Card | tp.media (`sub_id`) |

**Tiqets vs Viator:** Tiqets for "a ticket to a place", Viator for "a trip with a guide or vehicle".

---

## 2. Accounts and IDs

### Shared by every site

| Partner | Public IDs (safe in code) | Secret env var (server only) |
|---|---|---|
| Stay22 | `aid` = `devitymb` | `STAY22_API_KEY` (only for the Reporting API) |
| Travelpayouts | **marker = `735778`** (the account ID) | `TRAVELPAYOUTS_API_TOKEN` |
| Viator | `pid=P00273833`, `mcid=42383` | `VIATOR_API_KEY` |
| Tiqets | none (tracked via Travelpayouts) | `TIQETS_API_TOKEN` (content API only) |

### Different for every site

- **`TRAVELPAYOUTS_TRS`**: the site's Travelpayouts project ID. NRF.is = `535987`.
- **`siteKey`**: a short prefix for tracking labels (NRF.is = `nrf`).
- The destination IDs (§8).

> **Mistake to avoid:** an old note called `535987` a marker. It is NRF.is's **project ID**; the marker is `735778`. The Links API errors tell them apart: "invalid marker" means a wrong marker, and "invalid traffic source" means a wrong or missing `trs`.

### `.env.local` for a new site

```
STAY22_API_KEY=<copy from NRF.is>
NEXT_PUBLIC_STAY22_AID=devitymb
TRAVELPAYOUTS_API_TOKEN=<copy from NRF.is>
NEXT_PUBLIC_TRAVELPAYOUTS_MARKER=735778
TRAVELPAYOUTS_TRS=<this site's project ID>
VIATOR_API_KEY=<copy from NRF.is>
TIQETS_API_TOKEN=<copy from NRF.is>
NEXT_PUBLIC_TIQETS_PARTNER=
```
Add the same variables to the Vercel project (Production + Preview), or the live site will only show fallback links.

### Travelpayouts brands

Links follow one fixed format, so the code builds them itself with no API call per page view:

```
https://tp.media/r?campaign_id=<C>&marker=735778&p=<P>&sub_id=<label>&trs=<site trs>&u=<encoded brand URL>
```

| Brand | campaign_id / p | Used for |
|---|---|---|
| aviasales | 100 / 4114 | flight price list, flight search fallback |
| kiwi | 111 / 4136 | flight search (links must be created through the API for each search, see §4) |
| tiqets | 89 / 2074 | ticket list |
| localrent | 87 / 2043 | car card + widgets |
| saily | 629 / 8979 | eSIM card |
| airalo | 541 / 8310 | alternative eSIM |
| ekta | 225 / 5869 | insurance card |
| welcomepickups | 627 / 8919 | transfer card |

These values are stored in `TP_BRANDS` in `lib/monetize/links.ts` and are the same for every site. A **new project must be subscribed** to each brand: run `node scripts/monetize-links.mjs` to see which ones are. As of 2026-10-08, project 535987 is **not** subscribed to Discover Cars or GetYourGuide.

---

## 3. Hard rules

1. **No partner script loads on page load if it sets cookies or storage.** The site stays free of cookie banners.
   - Our own components render partner data on the server as plain HTML links.
   - Partner script widgets: before using one, download it and search it for `document.cookie`, `localStorage`, `sessionStorage` and `$cookie`. If it sets nothing, it may load **when scrolled into view** (`PartnerWidget load="visible"`), and the privacy policy must mention it. If it sets anything, it loads **only on click** (`load="click"`).
   - Never paste a raw `<script>` from a partner into a page.
2. **Secrets stay on the server.** Read them only in `lib/monetize/providers/*` and API routes (`import "server-only"`). Check: `grep -rl "tqat-\|stay22_\|exp-api" .next/static` finds nothing.
3. **Affiliate links:** `rel="sponsored nofollow noopener"` (no `noreferrer`, because partners check the referring site), `target="_blank"`, and `data-aff` / `data-aff-label` for click tracking. Article links to partner domains get this automatically, even if the editor forgot.
4. **Disclosure sits next to the links:** every partner block ends with the small `AffiliateNote` line. **The user rejected a banner at the top of posts as ugly.** A one-line top notice appears only when the article text itself contains partner links. Every site needs an `/affiliate-disclosure` page, linked in the footer, plus a privacy-policy section.
5. **A failing partner never breaks a page:** 3-second timeout, errors return `[]` or `null`, and blocks fall back to a tracked search link or render nothing.
6. **Never show an untracked link.** `tpLink()` returns null without `trs`, and Tiqets cards rank last unless they are tracked.
7. At most **3 partner blocks** at the end of a post. Show title, image, price and rating only; never copy partner descriptions.

---

## 4. What gets built

| Component | Partner | Shows | Where it appears |
|---|---|---|---|
| `TourWidget` + `OfferCards` | Viator (+ Tiqets) | 3 tour cards: photo, rating, duration, free-cancellation badge, "from €X" | End of posts (automatic), `tourWidget` block |
| `TicketList` | Tiqets via TP | Horizontal ticket list: photo, city · bestseller, tagline, old and new price | Ticket topics (automatic), homepage, `ticketList` block |
| `StayCta` + `StayMap` | Stay22 | "Places to stay near X" button + map that loads on click | End of posts (automatic), `stayBox` block |
| `FlightSearch` | Kiwi via TP | From / To (with suggestions), dates, passengers → real Kiwi results in a new tab | Homepage, inside `FlightPrices`, `flightSearch` block |
| `FlightPrices` | Aviasales via TP | Search box + cheapest return fares from 5 cities | Planning posts (automatic), `flightPrices` block |
| `CarRental` + `PartnerWidget` | Localrent via TP | Localrent search form (scroll-in) + "Browse all cars" catalogue (click) | Self-drive posts (inside `TravelEssentials`), homepage, `carRental` block |
| `TravelEssentials` | TP brands | Car / eSIM / insurance / transfer cards; on self-drive posts the car card becomes the live car search | End of posts (automatic), homepage, `essentialsBox` block |
| `PlanYourTrip` | all | Homepage section: flight search, car rental, top attractions, essentials, "Find a place to stay" | Homepage |
| `AffiliateNote`, `AffiliateDisclosure` | — | Disclosure line under each block / top notice | Automatic |

**Server routes:**
- `app/api/go/flights/route.js` asks the TP Links API to create a Kiwi link (the first answer is "processing"; success after about 1.3–2.5 s), keeps checking for up to 4 s, then falls back to Aviasales and redirects with a 302. It validates its input and keeps the token on the server.
- `app/api/places/route.js` proxies the TP city/airport autocomplete (`autocomplete.travelpayouts.com/places2`), so the reader's browser never calls a third party. Cached for a day.

**Automatic placement:** a post with no hand-placed partner block gets a set chosen by `planFor(post)` in `topics.ts`. It matches keywords in the slug and title, and picks:
- **Tours or tickets:** the matching topic's search terms.
- **Stays:** a place with coordinates.
- **Essentials:** a list such as car / eSIM / insurance.
- **Flights or stays:** planning posts get flights instead of stays, so a post never has more than 3 blocks.

**Studio blocks** (in the Sanity `blockContent` schema): `tourWidget`, `ticketList`, `stayBox`, `flightPrices`, `flightSearch`, `essentialsBox`, `carRental`. Editors can place any of them inside an article. Placing one turns off the automatic set for that post.

**Click tracking:** one delegated listener in the analytics component (GoatCounter on NRF.is) counts `aff/{provider}/{label}` events. The flight search and widget-open buttons count their own events.

---

## 5. Files

Copy these from `template/` without changes:

```
lib/monetize/{campaign,content,fetcher,links,types}.ts
lib/monetize/providers/{viator,tiqets,travelpayouts,flightSearch}.ts
components/monetize/*.jsx
app/api/go/flights/route.js, app/api/places/route.js
app/(website)/affiliate-disclosure/page.js     ← review the wording (partner list, site name)
scripts/monetize-links.mjs
```

**Edit these for each site:**

| File | What to change |
|---|---|
| `lib/monetize/config.ts` | `siteKey`, `currency`, `destination` (name, default lat/lng, `viatorDestId`, `tiqetsCountryId`, `flightDestIata`, `flightOrigins`), providers on/off |
| `lib/monetize/topics.ts` | Keyword → offer rules **written from the site's real post slugs** (list them from the CMS first). Each topic: heading, Viator search, optional Tiqets query, stay place with coordinates. Also the essentials rules and the flights rule |
| `lib/monetize/essentials.json` | Card wording + brand + destination URL (e.g. `saily.com/esim-<country>/`, a Localrent country page). Brands must be subscribed |
| `lib/monetize/widgets.ts` | Localrent widget `src` URLs with the site's `trs` and the destination's Localrent `country=`/`city=` IDs |
| `components/monetize/*` | Tailwind class names are NRF.is design tokens (`basalt`, `bronze`, `mist`, `frost`, `kicker`, `btn-bronze`, `btn-outline`). Map them to the target site's design system. Hard-coded Iceland text: `CarRental` intro, `StayCta` text, `PlanYourTrip` subtitle, `FlightPrices` "→ Reykjavík", `FlightSearch` `DEFAULT_TO`, `TicketList` `seeAllUrl` |

**Edits to existing files** (see `template/patches/`):

| Patch | What it does |
|---|---|
| `post-template.diff` | Disclosure notice, passes `slug` to PortableText, renders the automatic set after the article |
| `portabletext.diff` | Partner links forced to sponsored + `data-aff`; renderers for the 7 Studio blocks; `PortableText` takes `slug` |
| `sanity-blockContent.diff` | The 7 Studio block schemas (add them to **every** schema copy the site has) |
| `goatcounter.diff` | Delegated affiliate click listener |
| `footer.diff` | "Affiliate Disclosure" link |
| `homepage.diff` | `<PlanYourTrip />` section |
| `privacy.diff` | Affiliate links + partner widgets paragraphs |
| `env-example.diff` | Variable names |

**Other stacks:**
- **No Sanity:** skip the Studio blocks; the automatic placement still works.
- **Not GoatCounter:** move the click listener into whatever analytics the site uses, or drop it.
- **Pages Router:** the server-component pattern needs `getStaticProps`/ISR instead.

---

## 6. Runbook for a new site

1. **Inspect** the repo (§0). List the published post slugs from the CMS.
2. **IDs:** get the site's `trs` from the user. Fill in `.env.local` (§2). Run `node scripts/monetize-links.mjs` and note which brands are subscribed.
3. **Destination lookups** (§8): Viator destination ID, Tiqets country/city IDs, Localrent country/city IDs, IATA city code, coordinates for the main base and the topic places.
4. **Copy** the files from `template/`.
5. **Configure** `config.ts`, `topics.ts`, `essentials.json`, `widgets.ts` (§5).
6. **Integrate**: apply the patches by hand to the target's post template, link renderer, schema, analytics, footer, homepage, privacy page.
7. **Restyle** the components to the target design.
8. **Verify** (§9) and show the user on localhost: a post of each type, plus the homepage.
9. **Ship only with approval**: commit, push, Vercel env vars, `sanity deploy`.
10. Write down what was done and what's open in that repo's copy of this file (or a short `MONETIZATION.md`).

---

## 7. Choosing offers by site type

| Site type | Lead with | Notes |
|---|---|---|
| Road-trip country (Iceland, Norway, NZ) | Car rental + Stay22 | Tours second |
| City break (Rome, Paris, Barcelona) | Tiqets tickets + Viator | Stay22 per neighbourhood. Flight prices are weaker |
| Beach / island | Stay22 + transfers | Viator boat trips |
| Long-haul / adventure | Flight search + insurance + eSIM | Viator multi-day tours |

---

## 8. Destination lookups

Run these with the secrets taken from `.env.local` (don't paste the tokens into files).

```bash
# Viator destination IDs (country and city)
curl -s -H "exp-api-key: $VIATOR_API_KEY" -H "Accept: application/json;version=2.0" -H "Accept-Language: en-US" \
  https://api.viator.com/partner/destinations | grep -o '{"destinationId":[0-9]*,"name":"<Place>","type":"[A-Z]*"'

# Tiqets: country ID (page through /countries, page_size ≤ 100), then cities
curl -s -H "Authorization: Token $TIQETS_API_TOKEN" "https://api.tiqets.com/v2/countries?page_size=100&page=1"
curl -s -H "Authorization: Token $TIQETS_API_TOKEN" "https://api.tiqets.com/v2/cities?page_size=100&country_id=<id>"

# Localrent: country ID + city IDs, then city names / airport flag
curl -s -A "Mozilla/5.0" https://www.localrent.com/api/v2/countries        # [{id, title, city_ids}]
curl -s -A "Mozilla/5.0" https://www.localrent.com/en/<country-slug>/ | grep -o 'window.searchJson = .\{0,2000\}'

# IATA city code
curl -s "https://autocomplete.travelpayouts.com/places2?term=<city>&locale=en&types[]=city"
```

NRF.is values: Viator Iceland 55 / Reykjavík 905 · Tiqets Iceland 50108 / Reykjavík 22 · Localrent Iceland 116 / Keflavík Airport 120921 / Reykjavík 59441 · IATA REK (airport KEF) · Reykjavík 64.1466, −21.9426.

---

## 9. Verification

- `next build` passes. On Windows, first make sure no old `next dev` process still holds port 3000 (stopping a background task can leave `node` running; find it with `Get-NetTCPConnection -LocalPort 3000`), or the build fails with missing-module errors.
- Count blocks per post in `.next/server/app/post/*.html` (`data-monetize="…"`): at most 3 per post, the expected types present.
- **Outage test:** `VIATOR_API_KEY=bad TIQETS_API_TOKEN=bad pnpm build` succeeds and pages show fallback links.
- No secrets in `.next/static`.
- Flight search: `curl -w "%{time_total} %{redirect_url}" "http://localhost:3000/api/go/flights?from=LON&to=<IATA>&depart=<future date>&adults=1&label=test"` gives a 302 to `tp.media … campaign_id=111` in about 1–3 s.
- Third-party widgets only render in a real browser. Headless Edge needs no install: `msedge.exe --headless=new --user-data-dir=%TEMP%\edge-profile --window-size=1300,9000 --virtual-time-budget=25000 --screenshot=out.png <url>`. The tall window triggers scroll-in loaders. Crop the image and look at it.
- Partner sites (Stay22, Viator, Saily, TP help pages) return 403 to curl and WebFetch (bot protection). That doesn't mean a link is broken; check in a real browser or with a web search.

---

## 10. Gotchas

- Viator `products/search` sorted by `TRAVELER_RATING` surfaces obscure private tours; use `sorting.sort: "DEFAULT"`. Free-text search needs `productFiltering.destination` as a **string**.
- Tiqets: the default order is already popularity. Use `sale_status === "available"`; `cancellation.policy` is `"never"` or `"before_date"`; `promo_label` holds "bestseller".
- Stay22 campaign labels: underscores only (hyphens split a label in two).
- Tailwind only generates class names that appear literally in the code; don't build them as strings (`sm:grid-cols-${n}`).
- The Kiwi widget script from Travelpayouts is ~400 KB and uses sessionStorage, Sentry and IP geolocation. That's why the flight search is native.
- The Localrent White Label widget sets cookies and localStorage (click only). The Localrent Search Form sets none, but pings `tpo.gg` (scroll-in, mentioned in the privacy policy).
- Topic regexes: check them against every real slug. For example, a generic `lagoon` rule caught the Jökulsárlón *glacier* lagoon post.

---

## 11. NRF.is status (2026-10-09)

Built and verified locally. **Not committed or deployed.**

**Done:**
- All components in §4, the 7 Studio blocks and the homepage section.
- Disclosure page, privacy text and click tracking.

**Open:**
- Commit, push and Vercel env vars (needs the user's OK).
- `sanity deploy` for the standalone Studio (needs the user's OK).
- Hub pages `/tours`, `/where-to-stay`, `/iceland-car-rental`.
- A post-level "no offers" switch.
- A monthly revenue report (Stay22 Reporting API + TP statistics).
- NRF.is has two Sanity schema copies (`nrf.is/schemaTypes` and `nrf.is-frontend/lib/sanity/schemas`), kept in sync by hand.

---

## Appendix: API reference

| API | Base | Auth | Notes |
|---|---|---|---|
| Stay22 Allez | `https://www.stay22.com/allez/roam` | `aid` param | `lat`, `lng`, `address`, `checkin`, `checkout`, `adults`, `currency`, `campaign` |
| Stay22 Map | `https://www.stay22.com/embed/gm` | `aid` | `lat`, `lng`, `address`, `zoom`, `maincolor` (hex, no #), `campaign`. Click-to-load iframe |
| Stay22 Reporting | `https://api.stay22.com/v1/reporting/transactions` | `X-API-KEY` | `startDate`, `endDate`, `dateFilter`, `format=json`, `limit≤500` |
| Viator v2 | `https://api.viator.com/partner` | `exp-api-key`, `Accept: application/json;version=2.0`, `Accept-Language` | `GET /destinations`, `POST /search/freetext`, `POST /products/search` |
| Tiqets v2 | `https://api.tiqets.com/v2` | `Authorization: Token …` | `GET /products?country_id&city_id&query&lang&currency&page_size≤100`, `/countries`, `/cities` |
| TP Links | `POST https://api.travelpayouts.com/links/v1/create` | `X-Access-Token` | `{trs, marker (numbers), shorten, links:[{url, sub_id}]}`, ≤10 links per request, 100 requests/min |
| TP fares | `https://api.travelpayouts.com/aviasales/v3/prices_for_dates` | `X-Access-Token` | `origin`, `destination`, `currency`, `sorting=price`, `one_way`, `limit`. `link` is relative to aviasales.com |
| TP autocomplete | `https://autocomplete.travelpayouts.com/places2` | none | `term`, `locale`, `types[]=city&types[]=airport` |
| Localrent | `https://www.localrent.com/api/v2/countries` | none | Location IDs for the widgets |

Sources: [Stay22 docs](https://dev.stay22.com/docs) · [Viator Partner API](https://docs.viator.com/partner-api/) · [Tiqets API program](https://www.tiqets.com/partner-program/api-program/) · [Travelpayouts Links API](https://support.travelpayouts.com/hc/en-us/articles/25289759198226-API-for-Travelpayouts-partner-links)
