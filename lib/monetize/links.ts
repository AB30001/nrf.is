import { monetize, type Provider } from "./config";

// Pure link builders — no network calls, safe on server and client.

export const AFFILIATE_REL = "sponsored nofollow noopener";

function withParams(url: string, params: Record<string, string | number | undefined>) {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") u.searchParams.set(key, String(value));
  }
  return u.toString();
}

type Stay22Options = {
  address?: string;
  lat?: number;
  lng?: number;
  hotelname?: string;
  checkin?: string; // YYYY-MM-DD
  checkout?: string; // YYYY-MM-DD
  adults?: number;
  campaign?: string;
  // Stay22 picks the best OTA per user with "roam"; force one only for testing.
  provider?: "roam" | "booking" | "expedia" | "hotelscom" | "vrbo" | "agoda";
};

// Coordinates win over address on Stay22's side; with neither, use the site default.
function stay22Location(opts: Stay22Options) {
  const { destination } = monetize;
  const point =
    opts.lat !== undefined && opts.lng !== undefined
      ? { lat: opts.lat, lng: opts.lng }
      : opts.address
        ? {}
        : { lat: destination.lat, lng: destination.lng };
  return { address: opts.address || destination.name, ...point };
}

/** Stay22 Allez link: sends the user to the best accommodation site for them. */
export function stay22Link({ provider = "roam", ...opts }: Stay22Options = {}) {
  return withParams(`https://www.stay22.com/allez/${provider}`, {
    aid: monetize.stay22.aid,
    ...stay22Location(opts),
    hotelname: opts.hotelname,
    checkin: opts.checkin,
    checkout: opts.checkout,
    adults: opts.adults,
    currency: monetize.currency,
    campaign: opts.campaign
  });
}

/** Stay22 map embed (iframe src), styled with the site's bronze accent. */
export function stay22MapSrc(opts: Stay22Options = {}) {
  return withParams("https://www.stay22.com/embed/gm", {
    aid: monetize.stay22.aid,
    ...stay22Location(opts),
    zoom: 11,
    currency: monetize.currency,
    maincolor: "b5854f",
    campaign: opts.campaign
  });
}

/** Viator product URL from the API (already carries pid/mcid) plus our label. */
export function viatorLink(productUrl: string, campaign?: string) {
  return withParams(productUrl, { campaign });
}

/** Viator search results — the fallback when the API returns nothing. */
export function viatorSearchLink(text: string, campaign?: string) {
  return withParams("https://www.viator.com/searchResults/all", {
    text,
    pid: monetize.viator.pid,
    mcid: monetize.viator.mcid,
    medium: "link",
    campaign
  });
}

/**
 * Travelpayouts brands: campaign_id and p are fixed per brand (the same for
 * every site); only `trs` changes per site. Values as returned by the Links
 * API on 2026-10-08 — re-check with `node scripts/monetize-links.mjs`.
 */
export const TP_BRANDS = {
  aviasales: { campaign_id: 100, p: 4114 },
  tiqets: { campaign_id: 89, p: 2074 },
  localrent: { campaign_id: 87, p: 2043 },
  saily: { campaign_id: 629, p: 8979 },
  airalo: { campaign_id: 541, p: 8310 },
  ekta: { campaign_id: 225, p: 5869 },
  welcomepickups: { campaign_id: 627, p: 8919 }
} as const;

export type TpBrand = keyof typeof TP_BRANDS;

export function travelpayoutsReady() {
  const { marker, trs } = monetize.travelpayouts;
  return Boolean(marker && trs && monetize.providers.travelpayouts);
}

/** Tracked tp.media link to a brand page, or null when Travelpayouts isn't set up. */
export function tpLink(brand: TpBrand, url: string, subId?: string) {
  if (!travelpayoutsReady()) return null;
  const { marker, trs } = monetize.travelpayouts;
  return withParams("https://tp.media/r", {
    campaign_id: TP_BRANDS[brand].campaign_id,
    marker,
    p: TP_BRANDS[brand].p,
    sub_id: subId,
    trs,
    u: url
  });
}

/** Tiqets is tracked through Travelpayouts, or with a direct partner value. */
export function tiqetsTracked() {
  return travelpayoutsReady() || Boolean(monetize.tiqets.partner);
}

/** Tracked Tiqets product link: via Travelpayouts when set up, else direct. */
export function tiqetsLink(productUrl: string, campaign?: string) {
  return (
    tpLink("tiqets", productUrl, campaign) ||
    withParams(productUrl, { partner: monetize.tiqets.partner })
  );
}

const PROVIDER_HOSTS: [Provider, RegExp][] = [
  ["stay22", /(^|\.)stay22\.com$/],
  ["viator", /(^|\.)viator\.com$/],
  ["tiqets", /(^|\.)tiqets\.com$/],
  ["travelpayouts", /(^|\.)(tp\.media|tp\.st|travelpayouts\.com|aviasales\.com)$/]
];

/** Which partner a URL belongs to, or null for ordinary links. */
export function detectProvider(href?: string): Provider | null {
  if (!href) return null;
  try {
    const host = new URL(href).hostname;
    return PROVIDER_HOSTS.find(([, re]) => re.test(host))?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Props for any outbound affiliate anchor: opens in a new tab, marked
 * sponsored, and tagged for the GoatCounter click listener.
 */
export function affiliateProps(provider: Provider | "partner", label?: string) {
  return {
    target: "_blank",
    rel: AFFILIATE_REL,
    "data-aff": provider,
    "data-aff-label": label || undefined
  };
}
