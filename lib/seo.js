/**
 * Shared SEO constants and JSON-LD builders.
 *
 * On a new rebrand, update the bracket placeholders below (or set the
 * matching env vars) — everything else in the app reads from here so SEO
 * stays consistent across metadata, sitemap, robots, and structured data.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nrf.is";
export const SITE_NAME = "NRF.is";
export const SITE_DESCRIPTION = "Your complete guide to Iceland: Ring Road itineraries, waterfalls, glaciers, hot springs, the Northern Lights, and practical travel tips for the Land of Fire and Ice.";
export const SITE_KEYWORDS = ["Iceland travel guide", "Iceland itinerary", "Ring Road Iceland", "things to do in Iceland", "Iceland travel tips"];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl("/img/logo.png")
    }
  };
}

export function buildArticleJsonLd(post, imageUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    datePublished: post.publishedAt || post._createdAt,
    dateModified: post._updatedAt || post.publishedAt || post._createdAt,
    author: {
      "@type": "Person",
      name: post.author?.name || SITE_NAME
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL
    },
    image: imageUrl || absoluteUrl("/opengraph-image"),
    url: absoluteUrl(`/post/${post.slug?.current}`)
  };
}

export function buildBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function baseOpenGraph(overrides = {}) {
  return {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    ...overrides
  };
}

export function googleVerification() {
  return process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;
}
