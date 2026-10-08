import { format, parseISO } from "date-fns";
import { monetize } from "@/lib/monetize/config";
import { campaignLabel } from "@/lib/monetize/campaign";
import { affiliateProps } from "@/lib/monetize/links";
import { cheapestFare } from "@/lib/monetize/providers/travelpayouts";
import AffiliateNote from "./AffiliateNote";
import FlightSearch from "./FlightSearch";

const CITY = {
  LON: "London",
  NYC: "New York",
  PAR: "Paris",
  BER: "Berlin",
  AMS: "Amsterdam",
  CPH: "Copenhagen",
  OSL: "Oslo",
  BOS: "Boston",
  DUB: "Dublin",
  MAD: "Madrid"
};

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDates(fare) {
  const out = format(parseISO(fare.departureAt), "d MMM");
  return fare.returnAt
    ? `${out} – ${format(parseISO(fare.returnAt), "d MMM")}`
    : out;
}

/**
 * Flight search box plus the cheapest return fares to the destination from a
 * few big cities (Aviasales data). The search box shows even without fares.
 */
export default async function FlightPrices({
  origins = monetize.destination.flightOrigins,
  heading,
  slug,
  placement = "flights"
}) {
  const label = campaignLabel(slug, placement);
  const fares = (
    await Promise.all(origins.map(o => cheapestFare(o, label)))
  ).filter(Boolean);

  return (
    <section
      aria-label={heading || "Cheap flights"}
      data-monetize="flights"
      className="not-prose my-14 border-t border-basalt-light pt-10">
      <p className="kicker">Getting there</p>
      <h2 className="mt-2 font-serif text-2xl font-normal text-frost-light sm:text-3xl">
        {heading ||
          `Cheapest flights to ${monetize.destination.name}`}
      </h2>

      <div className="mt-6">
        <FlightSearch slug={slug} placement={`${placement}_search`} />
      </div>

      {fares.length > 0 && (
        <ul className="mt-8 divide-y divide-basalt-light border-y border-basalt-light">
          {fares.map(fare => (
            <li key={fare.origin}>
              <a
                href={fare.url}
                {...affiliateProps("travelpayouts", label)}
                className="group flex items-center justify-between gap-4 py-4 transition-colors">
                <span>
                  <span className="block text-mist transition-colors group-hover:text-frost-light">
                    {CITY[fare.origin] || fare.origin} → Reykjavík
                  </span>
                  <span className="text-xs text-mist-dim">
                    Return · {formatDates(fare)}
                  </span>
                </span>
                <span className="whitespace-nowrap text-sm text-mist-dim">
                  from{" "}
                  <span className="text-lg font-semibold text-bronze">
                    {formatPrice(fare.price, fare.currency)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {fares.length > 0 && (
        <AffiliateNote>
          {" "}
          · Fares found recently on Aviasales and may change.
        </AffiliateNote>
      )}
    </section>
  );
}
