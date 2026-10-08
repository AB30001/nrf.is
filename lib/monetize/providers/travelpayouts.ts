import "server-only";
import { monetize } from "../config";
import { partnerFetch } from "../fetcher";
import { tpLink, travelpayoutsReady } from "../links";

export type Fare = {
  origin: string; // city code, e.g. LON
  price: number;
  currency: string;
  departureAt: string;
  returnAt?: string;
  url: string;
};

/**
 * Cheapest round trip from one origin to the site's destination (Aviasales
 * data, cached a day), linked through Travelpayouts with the label as sub_id.
 */
export async function cheapestFare(origin: string, campaign?: string): Promise<Fare | null> {
  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  if (!token || !travelpayoutsReady()) return null;

  const params = new URLSearchParams({
    origin,
    destination: monetize.destination.flightDestIata,
    currency: monetize.currency.toLowerCase(),
    sorting: "price",
    one_way: "false",
    limit: "1"
  });
  const data = await partnerFetch(
    `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params}`,
    { headers: { "X-Access-Token": token } }
  );
  const fare = data?.data?.[0];
  if (!fare?.link || !fare.price) return null;

  const url = tpLink("aviasales", new URL(fare.link, "https://www.aviasales.com").toString(), campaign);
  if (!url) return null;
  return {
    origin,
    price: fare.price,
    currency: monetize.currency,
    departureAt: fare.departure_at,
    returnAt: fare.return_at,
    url
  };
}
