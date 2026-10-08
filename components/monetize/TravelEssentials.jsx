import essentials from "@/lib/monetize/essentials.json";
import { campaignLabel } from "@/lib/monetize/campaign";
import { affiliateProps, tpLink } from "@/lib/monetize/links";
import { widgets } from "@/lib/monetize/widgets";
import AffiliateNote from "./AffiliateNote";
import CarRental from "./CarRental";

// Literal class names so Tailwind generates them.
const COLUMNS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

/**
 * Car rental / eSIM / insurance / transfer boxes (Travelpayouts brands). Items
 * render only with a tracked link, so an unconfigured site shows nothing.
 * When car rental leads (self-drive posts), it becomes the live Localrent car
 * search instead of a card.
 */
export default function TravelEssentials({
  items = ["car", "esim", "insurance"],
  columns, // force a column count, e.g. 2 in a half-width layout
  carSearch = true,
  slug,
  placement = "essentials"
}) {
  const label = campaignLabel(slug, placement);
  const showCarSearch = carSearch && items[0] === "car" && Boolean(widgets.carSearch);
  const shown = items
    .filter(key => !(showCarSearch && key === "car"))
    .map(key => ({ key, ...essentials[key] }))
    .map(item => ({ ...item, link: item.brand && tpLink(item.brand, item.url, label) }))
    .filter(item => item.link);
  if (shown.length === 0 && !showCarSearch) return null;

  return (
    <section
      aria-label="Travel essentials"
      data-monetize="essentials"
      className="not-prose my-14 border-t border-basalt-light pt-10">
      <p className="kicker">Before you go</p>
      <h2 className="mt-2 font-serif text-2xl font-normal text-frost-light sm:text-3xl">
        {showCarSearch ? "Rent a car & travel essentials" : "Travel essentials"}
      </h2>

      {showCarSearch && (
        <div className="mt-6">
          <CarRental embedded />
        </div>
      )}

      {shown.length > 0 && (
        <ul className={`mt-6 grid gap-5 ${COLUMNS[columns || shown.length] || ""}`}>
          {shown.map(item => (
            <li key={item.key}>
              <a
                href={item.link}
                {...affiliateProps("travelpayouts", label)}
                className="group flex h-full flex-col border border-basalt-light bg-basalt p-5 transition-colors duration-300 hover:border-bronze/60">
                <h3 className="font-medium text-mist transition-colors group-hover:text-frost-light">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-dim">{item.text}</p>
                <span className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-bronze transition-colors group-hover:text-bronze-light">
                  {item.cta} →
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <AffiliateNote />
    </section>
  );
}
