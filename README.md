# NRF.is

A Next.js 14 + Sanity CMS v3 blog site (Stablo-style) for NRF.is — your guide
to the Land of Fire and Ice. Includes an embedded Sanity Studio at `/studio`.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site, and
[http://localhost:3000/studio](http://localhost:3000/studio) for the CMS.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=     # Sanity project ID
SANITY_STUDIO_PROJECT_ID=          # same project ID, used by the embedded Studio
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_REVALIDATE_SECRET=          # generate with: openssl rand -hex 32
NEXT_PUBLIC_SITE_URL=https://nrf.is
NEXT_PUBLIC_WEB3FORMS_KEY=         # from web3forms.com, used by the contact form
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=  # optional
```

## Seeding demo content

The companion Sanity Studio project (`../template`) includes
`scripts/seed-example.mjs`, which seeds a handful of generic demo categories,
posts, an author, and an about page:

```bash
pnpm seed-content
```

Adapt this script's content when starting a new project (see
`start-project.md`).

## SEO

Shared SEO constants and JSON-LD builders live in [`lib/seo.js`](./lib/seo.js):

- `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_KEYWORDS`
- `absoluteUrl(path)`
- `buildWebsiteJsonLd()`, `buildArticleJsonLd(post, imageUrl)`, `buildBreadcrumbJsonLd(items)`
- `baseOpenGraph(overrides)`
- `googleVerification()`

[`components/json-ld.js`](./components/json-ld.js) is a small reusable
`<script type="application/ld+json">` component used to inject the above.

`app/sitemap.ts` and `app/robots.ts` both read `SITE_URL` from this module.

## On-demand revalidation

[`app/api/revalidate/route.js`](./app/api/revalidate/route.js) exposes a POST
webhook that revalidates the homepage, archive, sitemap, and the affected
post/category page whenever content changes in Sanity.

Configure a webhook in [sanity.io/manage](https://sanity.io/manage):

- URL: `https://nrf.is/api/revalidate`
- Trigger on: create, update, delete of `post` and `category` documents
- Secret: same value as `SANITY_REVALIDATE_SECRET`

## Project structure

```
app/
  (website)/        # public site routes (home, archive, post, category, about, contact, privacy)
  (sanity)/studio/   # embedded Sanity Studio
  api/revalidate/    # revalidation webhook
  sitemap.ts, robots.ts, icon.svg, opengraph-image.tsx
components/          # navbar, footer, blog UI, json-ld
lib/
  sanity/            # Sanity client, queries, schemas, config
  seo.js             # shared SEO constants + JSON-LD builders
```

## Local dev troubleshooting

If `npm run dev` fails with `Cannot find module 'next/dist/bin/next'`, or you
see stale content after switching Sanity projects:

```bash
pnpm install
rm -rf .next
pnpm dev
```
