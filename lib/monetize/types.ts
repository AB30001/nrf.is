/** One bookable product from Viator or Tiqets, normalised for OfferCards. */
export type Offer = {
  provider: "viator" | "tiqets";
  id: string;
  title: string;
  image?: string;
  priceFrom?: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  durationMinutes?: number;
  freeCancellation?: boolean;
  // Extra detail for list layouts (Tiqets only, for now).
  city?: string;
  tagline?: string;
  badge?: string; // e.g. "Bestseller"
  wasPrice?: number;
  discountPercent?: number;
  url: string; // final tracked URL
};
