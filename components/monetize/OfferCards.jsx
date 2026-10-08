import { affiliateProps } from "@/lib/monetize/links";

const PROVIDER_NAME = { viator: "Viator", tiqets: "Tiqets" };

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Math.ceil(amount));
}

function formatDuration(minutes) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 60 * 24) return `${+(minutes / 60).toFixed(1)} h`;
  const days = Math.round(minutes / (60 * 24));
  return `${days} day${days > 1 ? "s" : ""}`;
}

/** Grid of partner product cards. Every card is one tracked affiliate link. */
export default function OfferCards({ offers, label }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-3">
      {offers.map(offer => {
        const duration = formatDuration(offer.durationMinutes);
        return (
          <li key={`${offer.provider}-${offer.id}`}>
            <a
              href={offer.url}
              {...affiliateProps(offer.provider, label)}
              className="group flex h-full flex-col overflow-hidden border border-basalt-light bg-basalt transition-colors duration-300 hover:border-bronze/60">
              <div className="relative aspect-[3/2] overflow-hidden bg-basalt-light">
                {offer.image && (
                  // Partner CDN images are already sized; skipping next/image
                  // keeps them off the Vercel image-optimisation quota.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={offer.image}
                    alt={offer.title}
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={320}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {offer.freeCancellation && (
                  <span className="absolute left-2 top-2 bg-night/80 px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-aurora-light">
                    Free cancellation
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-[0.95rem] font-medium leading-snug text-mist transition-colors group-hover:text-frost-light">
                  {offer.title}
                </h3>

                <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-mist-dim">
                  {offer.rating && (
                    <span>
                      <span className="text-bronze">★</span>{" "}
                      {offer.rating.toFixed(1)}
                      {offer.reviewCount && (
                        <> ({offer.reviewCount.toLocaleString("en-US")})</>
                      )}
                    </span>
                  )}
                  {offer.rating && duration && <span aria-hidden="true">·</span>}
                  {duration && <span>{duration}</span>}
                </p>

                <div className="mt-auto flex items-end justify-between pt-4">
                  <p className="text-sm text-mist-dim">
                    from{" "}
                    <span className="text-lg font-semibold text-bronze">
                      {formatPrice(offer.priceFrom, offer.currency)}
                    </span>
                  </p>
                  <span className="text-[0.65rem] uppercase tracking-wider text-mist-dim/70">
                    {PROVIDER_NAME[offer.provider]}
                  </span>
                </div>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
