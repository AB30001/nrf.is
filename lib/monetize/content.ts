import { detectProvider } from "./links";

// Portable Text block types that render partner offers (stayBox onwards: Phase 3).
export const AFFILIATE_BLOCK_TYPES = [
  "tourWidget",
  "stayBox",
  "flightPrices",
  "essentialsBox",
  "ticketList",
  "flightSearch",
  "carRental"
];

type Block = {
  _type: string;
  markDefs?: { _type: string; href?: string; rel?: string }[];
};

export function isAffiliateLink(def: { href?: string; rel?: string }) {
  return Boolean(def.rel?.includes("sponsored") || detectProvider(def.href));
}

/**
 * True when the article text itself contains a partner link. Partner widgets
 * are left out: they carry their own disclosure line.
 */
export function hasAffiliateLinks(body?: Block[]) {
  if (!Array.isArray(body)) return false;
  return body.some(block =>
    block.markDefs?.some(def => def._type === "link" && isAffiliateLink(def))
  );
}
