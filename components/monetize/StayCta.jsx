import { campaignLabel } from "@/lib/monetize/campaign";
import { affiliateProps, stay22Link, stay22MapSrc } from "@/lib/monetize/links";
import AffiliateNote from "./AffiliateNote";
import StayMap from "./StayMap";

/** "Where to stay" panel: one Stay22 link (best booking site per reader) + map. */
export default function StayCta({
  placeName,
  lat,
  lng,
  heading,
  showMap = true,
  slug,
  placement = "stay"
}) {
  const label = campaignLabel(slug, placement);
  const point = { address: placeName, lat, lng, campaign: label };

  return (
    <section
      aria-label={heading || `Where to stay near ${placeName}`}
      data-monetize="stay"
      className="not-prose my-14 border-t border-basalt-light pt-10">
      <p className="kicker">Where to stay</p>
      <h2 className="mt-2 font-serif text-2xl font-normal text-frost-light sm:text-3xl">
        {heading || `Places to stay near ${placeName}`}
      </h2>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-mist-dim">
        Compare hotels, guesthouses and cabins across Booking.com, Expedia,
        Vrbo and more. Book early in summer: rooms outside Reykjavík sell out.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={stay22Link(point)}
          {...affiliateProps("stay22", label)}
          className="btn-bronze">
          See places to stay →
        </a>
        {showMap && <StayMap src={stay22MapSrc(point)} placeName={placeName} />}
      </div>

      <AffiliateNote />
    </section>
  );
}
