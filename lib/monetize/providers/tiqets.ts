import "server-only";
import { monetize } from "../config";
import { partnerFetch } from "../fetcher";
import { tiqetsLink } from "../links";
import type { Offer } from "../types";

const BASE = "https://api.tiqets.com/v2";

function toOffer(p: any, campaign?: string): Offer {
  return {
    provider: "tiqets",
    id: p.id,
    title: p.title,
    image: p.images?.[0]?.large,
    priceFrom: p.price,
    currency: p.currency || monetize.currency,
    rating: p.ratings?.total ? p.ratings.average : undefined,
    reviewCount: p.ratings?.total || undefined,
    freeCancellation: p.cancellation?.policy && p.cancellation.policy !== "never",
    city: p.city_name,
    tagline: p.tagline,
    badge: p.promo_label ? p.promo_label.replace(/_/g, " ") : undefined,
    wasPrice: p.prediscount_price > p.price ? p.prediscount_price : undefined,
    discountPercent: p.discount_percentage || undefined,
    url: tiqetsLink(p.product_url, campaign)
  };
}

/** Attraction tickets in the site's destination country. */
export async function searchTiqets(
  query: string | undefined,
  { count = 3, cityId, campaign }: { count?: number; cityId?: number; campaign?: string } = {}
): Promise<Offer[]> {
  if (!process.env.TIQETS_API_TOKEN || !monetize.providers.tiqets) return [];
  const params = new URLSearchParams({
    lang: "en",
    currency: monetize.currency,
    page_size: String(count + 3),
    country_id: String(monetize.destination.tiqetsCountryId)
  });
  if (query) params.set("query", query);
  if (cityId) params.set("city_id", String(cityId));

  const data = await partnerFetch(`${BASE}/products?${params}`, {
    headers: { Authorization: `Token ${process.env.TIQETS_API_TOKEN}` }
  });

  return (data?.products || [])
    .filter((p: any) => p.product_url && p.price && p.sale_status === "available")
    .map((p: any) => toOffer(p, campaign))
    .slice(0, count);
}
