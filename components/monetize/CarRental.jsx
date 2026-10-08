import { widgets } from "@/lib/monetize/widgets";
import { travelpayoutsReady } from "@/lib/monetize/links";
import AffiliateNote from "./AffiliateNote";
import PartnerWidget from "./PartnerWidget";

/**
 * Car rental block (Localrent via Travelpayouts): the search form loads as it
 * scrolls into view; the full car catalogue loads only on request.
 */
export default function CarRental({
  heading = "Rent a car in Iceland",
  text = "Most of Iceland is only reachable by car. Compare local rental companies, from small cars to 4x4s for the highlands, with pick-up at Keflavík Airport or in Reykjavík.",
  showCatalog = true,
  embedded = false // inside another block: no section chrome
}) {
  if (!travelpayoutsReady() || !widgets.carSearch) return null;

  const body = (
    <>
      <div className={embedded ? "" : "mt-6"}>
        <PartnerWidget src={widgets.carSearch} load="visible" minHeight={150} />
      </div>
      {showCatalog && widgets.carCatalog && (
        <div className="mt-5">
          <PartnerWidget
            src={widgets.carCatalog}
            load="click"
            buttonLabel="Browse all cars"
            minHeight={640}
            note="Loads the full Localrent catalogue with prices, photos and filters."
          />
        </div>
      )}
    </>
  );

  if (embedded) return body;

  return (
    <section
      aria-label={heading}
      data-monetize="car"
      className="not-prose my-14 border-t border-basalt-light pt-10">
      <p className="kicker">Getting around</p>
      <h2 className="mt-2 font-serif text-2xl font-normal text-frost-light sm:text-3xl">
        {heading}
      </h2>
      {text && <p className="mt-3 max-w-prose text-sm leading-relaxed text-mist-dim">{text}</p>}
      {body}
      <AffiliateNote />
    </section>
  );
}
