import SectionHeading from "@/components/ui/sectionHeading";
import { stay22Link, affiliateProps } from "@/lib/monetize/links";
import { campaignLabel } from "@/lib/monetize/campaign";
import FlightSearch from "./FlightSearch";
import TicketList from "./TicketList";
import TravelEssentials from "./TravelEssentials";
import CarRental from "./CarRental";

/**
 * Homepage "deals" band: flight search, best-selling attraction tickets and
 * the travel essentials (car, eSIM, insurance, transfer).
 */
export default function PlanYourTrip() {
  const stayLabel = campaignLabel("home", "stay");

  return (
    <section aria-label="Plan your trip" className="bg-night-800 py-24">
      <div className="container mx-auto max-w-screen-xl px-8 xl:px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="Plan your trip"
            title="Book the essentials"
            subtitle="Flights, tickets, a car and mobile data: the things worth sorting before you land at Keflavík."
          />
          <a
            href={stay22Link({ address: "Reykjavík", campaign: stayLabel })}
            {...affiliateProps("stay22", stayLabel)}
            className="btn-outline">
            Find a place to stay
          </a>
        </div>

        <div className="mt-12">
          <FlightSearch slug="home" placement="search" />
        </div>

        <CarRental heading="Rent a car" />


        <div className="grid gap-x-12 lg:grid-cols-2">
          <TicketList
            heading="Top attractions"
            kicker="Bestsellers"
            count={4}
            slug="home"
            placement="tickets"
          />
          <TravelEssentials
            items={["esim", "insurance", "transfer", "car"]}
            columns={2}
            carSearch={false}
            slug="home"
            placement="essentials"
          />
        </div>
      </div>
    </section>
  );
}
