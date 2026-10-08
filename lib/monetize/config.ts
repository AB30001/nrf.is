/**
 * Per-site monetization settings — the only file that changes between sites.
 * See travel-monetize.md. Public tracking IDs come from NEXT_PUBLIC_ env vars;
 * API secrets are read only inside lib/monetize/providers (server-only).
 */
export const monetize = {
  // Prefix for every campaign / sub_id label, so dashboards split revenue per site.
  siteKey: "nrf",
  currency: "EUR",
  locale: "en-US",

  destination: {
    name: "Iceland",
    // Default point for Stay22 links (Reykjavík).
    lat: 64.1466,
    lng: -21.9426,
    viatorDestId: 55, // Iceland (Reykjavik = 905)
    tiqetsCountryId: 50108, // Iceland (Reykjavík city = 22)
    flightDestIata: "REK", // Travelpayouts city code (KEF airport)
    flightOrigins: ["LON", "NYC", "PAR", "BER", "AMS"]
  },

  providers: {
    stay22: true,
    travelpayouts: true,
    viator: true,
    tiqets: true
  },

  // Public tracking IDs have defaults so links stay tracked even if a deploy
  // is missing the env vars. API secrets have no defaults.
  stay22: {
    aid: process.env.NEXT_PUBLIC_STAY22_AID || "devitymb"
  },

  viator: {
    // Viator's own affiliate IDs; the API already bakes these into productUrl.
    pid: "P00273833",
    mcid: "42383"
  },

  tiqets: {
    // From the Tiqets affiliate portal. Until it is set, Tiqets links are untracked.
    partner: process.env.NEXT_PUBLIC_TIQETS_PARTNER || ""
  },

  travelpayouts: {
    // Account ID (shared by all sites) and this site's project ID ("trs").
    marker: process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER || "735778",
    trs: process.env.TRAVELPAYOUTS_TRS || "535987"
  }
} as const;

export type Provider = "stay22" | "viator" | "tiqets" | "travelpayouts";
