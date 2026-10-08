import { campaignLabel } from "@/lib/monetize/campaign";
import { affiliateProps, tpLink } from "@/lib/monetize/links";
import { searchTiqets } from "@/lib/monetize/providers/tiqets";
import AffiliateNote from "./AffiliateNote";

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 ? 2 : 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Attraction tickets as a horizontal list (photo left, details right), in the
 * style of the Tiqets widget but rendered here: no partner script, no cookies.
 */
export default async function TicketList({
  heading = "Top attractions in Iceland",
  kicker = "Skip the queue",
  query,
  cityId,
  count = 4,
  seeAllUrl = "https://www.tiqets.com/en/reykjavik-attractions-c22/",
  slug,
  placement = "tickets"
}) {
  const label = campaignLabel(slug, placement);
  const tickets = await searchTiqets(query, { count, cityId, campaign: label });
  if (tickets.length === 0) return null;
  const seeAll = seeAllUrl && tpLink("tiqets", seeAllUrl, label);

  return (
    <section
      aria-label={heading}
      data-monetize="tickets"
      className="not-prose my-14 border-t border-basalt-light pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="kicker">{kicker}</p>
          <h2 className="mt-2 font-serif text-2xl font-normal text-frost-light sm:text-3xl">
            {heading}
          </h2>
        </div>
        {seeAll && (
          <a
            href={seeAll}
            {...affiliateProps("tiqets", label)}
            className="text-xs font-medium uppercase tracking-[0.16em] text-bronze transition-colors hover:text-bronze-light">
            See all →
          </a>
        )}
      </div>

      <ul className="mt-6 space-y-4">
        {tickets.map(ticket => (
          <li key={ticket.id}>
            <a
              href={ticket.url}
              {...affiliateProps("tiqets", label)}
              className="group flex overflow-hidden border border-basalt-light bg-basalt transition-colors duration-300 hover:border-bronze/60">
              <div className="relative w-28 shrink-0 overflow-hidden bg-basalt-light sm:w-40">
                {ticket.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {ticket.discountPercent && (
                  <span className="absolute inset-x-0 bottom-0 bg-bronze py-1 text-center text-xs font-semibold text-night">
                    −{ticket.discountPercent}%
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-medium uppercase tracking-wider text-mist-dim">
                    {ticket.city}
                    {ticket.badge && (
                      <>
                        {" "}
                        · <span className="text-aurora-light">{ticket.badge}</span>
                      </>
                    )}
                  </p>
                  <h3 className="mt-1 text-[0.95rem] font-medium leading-snug text-mist transition-colors group-hover:text-frost-light">
                    {ticket.title}
                  </h3>
                  {ticket.tagline && (
                    <p className="mt-1 line-clamp-2 text-sm text-mist-dim">{ticket.tagline}</p>
                  )}
                  {ticket.rating && (
                    <p className="mt-2 text-xs text-mist-dim">
                      <span className="text-bronze">★</span> {ticket.rating.toFixed(1)} (
                      {ticket.reviewCount.toLocaleString("en-US")})
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-sm text-mist-dim sm:text-right">
                  from{" "}
                  {ticket.wasPrice && (
                    <s className="mr-1">{formatPrice(ticket.wasPrice, ticket.currency)}</s>
                  )}
                  <span className="block text-lg font-semibold text-bronze">
                    {formatPrice(ticket.priceFrom, ticket.currency)}
                  </span>
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <AffiliateNote> · Prices may change.</AffiliateNote>
    </section>
  );
}
