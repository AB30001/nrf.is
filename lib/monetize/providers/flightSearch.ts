import "server-only";
import { monetize } from "../config";
import { tpLink } from "../links";

export type FlightQuery = {
  from: string; // IATA city or airport code
  to: string;
  depart: string; // YYYY-MM-DD
  return?: string; // YYYY-MM-DD
  adults: number;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Tracked Kiwi.com search link. Kiwi deep links must be minted by the
 * Travelpayouts Links API per search (they answer "processing" for a second
 * or two first), so this polls until `deadlineMs`, then gives up with null.
 */
export async function kiwiSearchLink(q: FlightQuery, subId?: string, deadlineMs = 4000) {
  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  const { marker, trs } = monetize.travelpayouts;
  if (!token || !marker || !trs) return null;

  const kiwi = new URL("https://www.kiwi.com/deep");
  kiwi.search = new URLSearchParams({
    from: q.from,
    to: q.to,
    departure: q.depart,
    ...(q.return ? { return: q.return } : {}),
    adults: String(q.adults),
    lang: "en",
    currency: monetize.currency
  }).toString();

  const body = JSON.stringify({
    trs: Number(trs),
    marker: Number(marker),
    shorten: false,
    links: [{ url: kiwi.toString(), ...(subId ? { sub_id: subId } : {}) }]
  });

  const deadline = Date.now() + deadlineMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch("https://api.travelpayouts.com/links/v1/create", {
        method: "POST",
        headers: { "X-Access-Token": token, "Content-Type": "application/json" },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(Math.max(deadline - Date.now(), 1))
      });
      const link = (await res.json())?.result?.links?.[0];
      if (link?.code === "success" && link.partner_url) return link.partner_url as string;
      if (link?.code !== "processing") {
        console.warn("[monetize] kiwi link failed:", link?.message || res.status);
        return null;
      }
    } catch (error) {
      console.warn("[monetize] kiwi link error:", (error as Error).message);
      return null;
    }
    await sleep(700);
  }
  return null;
}

/** Tracked Aviasales search link: instant, used when Kiwi is slow or fails. */
export function aviasalesSearchLink(q: FlightQuery, subId?: string) {
  // Path format: FROM + DDMM + TO + [DDMM return] + adults, e.g. LON1501REK21011
  const ddmm = (iso: string) => iso.slice(8, 10) + iso.slice(5, 7);
  const path = `${q.from}${ddmm(q.depart)}${q.to}${q.return ? ddmm(q.return) : ""}${q.adults}`;
  return tpLink("aviasales", `https://www.aviasales.com/search/${path}`, subId);
}
