import "server-only";
import { monetize } from "../config";
import { partnerFetch } from "../fetcher";
import { viatorLink } from "../links";
import type { Offer } from "../types";

const BASE = "https://api.viator.com/partner";

function headers() {
  return {
    "exp-api-key": process.env.VIATOR_API_KEY || "",
    Accept: "application/json;version=2.0",
    "Accept-Language": monetize.locale,
    "Content-Type": "application/json"
  };
}

// Cover image closest to 480px wide — big enough for a card, small to load.
function pickImage(images: any[] = []) {
  const cover = images.find(img => img.isCover) || images[0];
  const variants: any[] = cover?.variants || [];
  return (
    variants.find(v => v.width === 480) ||
    [...variants].sort((a, b) => Math.abs(a.width - 480) - Math.abs(b.width - 480))[0]
  )?.url;
}

function toOffer(p: any, campaign?: string): Offer {
  const reviews = p.reviews || {};
  const duration = p.duration || {};
  return {
    provider: "viator",
    id: p.productCode,
    title: p.title,
    image: pickImage(p.images),
    priceFrom: p.pricing?.summary?.fromPrice,
    currency: p.pricing?.currency || monetize.currency,
    rating: reviews.combinedAverageRating ?? reviews.sources?.[0]?.averageRating,
    reviewCount: reviews.totalReviews ?? reviews.sources?.[0]?.totalCount,
    durationMinutes: duration.fixedDurationInMinutes ?? duration.variableDurationFromMinutes,
    freeCancellation: p.flags?.includes("FREE_CANCELLATION"),
    url: viatorLink(p.productUrl, campaign)
  };
}

/**
 * Tours in the site's destination. With a search term, uses free-text search;
 * without one, Viator's featured ordering (popular, well-reviewed tours).
 */
export async function searchViator(
  term: string | undefined,
  { count = 3, campaign }: { count?: number; campaign?: string } = {}
): Promise<Offer[]> {
  if (!process.env.VIATOR_API_KEY || !monetize.providers.viator) return [];
  const destination = String(monetize.destination.viatorDestId);
  // Ask for a few extra so unpriced or unrated products can be dropped.
  const pagination = { start: 1, count: count + 3 };

  const data = term
    ? await partnerFetch(`${BASE}/search/freetext`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          searchTerm: term,
          productFiltering: { destination },
          searchTypes: [{ searchType: "PRODUCTS", pagination }],
          currency: monetize.currency
        })
      }).then(d => d?.products?.results)
    : await partnerFetch(`${BASE}/products/search`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          filtering: { destination },
          sorting: { sort: "DEFAULT" },
          pagination,
          currency: monetize.currency
        })
      }).then(d => d?.products);

  return (data || [])
    .filter((p: any) => p.productUrl && p.pricing?.summary?.fromPrice)
    .map((p: any) => toOffer(p, campaign))
    .slice(0, count);
}
