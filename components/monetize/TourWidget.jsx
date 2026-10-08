import { monetize } from "@/lib/monetize/config";
import { campaignLabel } from "@/lib/monetize/campaign";
import { affiliateProps, tiqetsTracked, viatorSearchLink } from "@/lib/monetize/links";
import { searchViator } from "@/lib/monetize/providers/viator";
import { searchTiqets } from "@/lib/monetize/providers/tiqets";
import AffiliateNote from "./AffiliateNote";
import OfferCards from "./OfferCards";

/**
 * Tours (Viator) and tickets (Tiqets) for one topic. Server component: data
 * comes from the partner APIs, cached for a day. If both come back empty, it
 * degrades to a single tracked "browse" link instead of disappearing.
 *
 * provider: "auto" mixes both, "viator" or "tiqets" forces one.
 */
export default async function TourWidget({
  heading,
  viator,
  tiqets,
  provider = "auto",
  count = 3,
  slug,
  placement = "tours"
}) {
  const label = campaignLabel(slug, placement);
  const useViator = provider !== "tiqets";
  const useTiqets = provider === "tiqets" || (provider === "auto" && Boolean(tiqets));

  const [tours, tickets] = await Promise.all([
    useViator ? searchViator(viator, { count, campaign: label }) : [],
    useTiqets ? searchTiqets(tiqets, { count, campaign: label }) : []
  ]);

  // Tickets lead on ticket topics, but only while Tiqets clicks are tracked;
  // an untracked Tiqets card would earn nothing.
  const ticketsFirst = provider === "tiqets" || tiqetsTracked();
  const offers = (ticketsFirst ? [...tickets, ...tours] : [...tours, ...tickets]).slice(
    0,
    count
  );
  if (offers.length === 0 && !useViator) return null;

  const searchText = viator || tiqets || monetize.destination.name;
  const seeAll = viatorSearchLink(`${searchText} ${monetize.destination.name}`, label);

  return (
    <section
      aria-label={heading}
      data-monetize="tours"
      data-updated={new Date().toISOString().slice(0, 10)}
      className="not-prose my-14 border-t border-basalt-light pt-10">
      <p className="kicker">Book ahead</p>
      <h2 className="mt-2 font-serif text-2xl font-normal text-frost-light sm:text-3xl">
        {heading}
      </h2>

      {offers.length > 0 ? (
        <div className="mt-6">
          <OfferCards offers={offers} label={label} />
        </div>
      ) : null}

      {useViator && (
        <a
          href={seeAll}
          {...affiliateProps("viator", label)}
          className="mt-5 inline-block text-xs font-medium uppercase tracking-[0.16em] text-bronze transition-colors hover:text-bronze-light">
          {offers.length > 0 ? "See all on Viator" : `Browse ${heading.toLowerCase()} on Viator`} →
        </a>
      )}
      <AffiliateNote>{offers.length > 0 && " · Prices may change."}</AffiliateNote>
    </section>
  );
}
