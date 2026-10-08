import Link from "next/link";
import Container from "@/components/container";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Affiliate Disclosure",
  description: `How ${SITE_NAME} earns money from affiliate links to hotels, tours, tickets and travel services.`,
  path: "/affiliate-disclosure"
});

export default function AffiliateDisclosurePage() {
  return (
    <Container alt className="py-16">
      <div className="prose prose-invert prose-nrf mx-auto max-w-screen-md">
        <h1 className="font-serif font-normal text-frost-light">
          Affiliate Disclosure
        </h1>
        <p>Last updated: October 2026</p>

        <p>
          {SITE_NAME} is free to read. To keep it that way, some links on this
          site are affiliate links. If you click one and then book a hotel,
          tour, ticket or other travel service, the company you book with may
          pay us a small commission. <strong>You pay the same price</strong>{" "}
          as you would going to that company directly.
        </p>

        <h2>Who we work with</h2>
        <ul>
          <li>
            <strong>Stay22</strong>: accommodation links that take you to
            Booking.com, Expedia, Hotels.com, Vrbo or Agoda.
          </li>
          <li>
            <strong>Travelpayouts</strong>: flights, car rental, eSIMs, travel
            insurance and airport transfers from a range of travel brands.
          </li>
          <li>
            <strong>Viator</strong>: guided tours and day trips.
          </li>
          <li>
            <strong>Tiqets</strong>: entry tickets to attractions, museums and
            lagoons.
          </li>
        </ul>

        <h2>How we choose what to recommend</h2>
        <p>
          Our guides are written first and monetized second. We recommend
          places, tours and services because we think they are worth your time
          and money, not because of the commission. Partners do not pay for
          placement and do not review or approve what we write. Prices shown on
          this site come from our partners, are updated regularly, and may
          change. Always check the final price before you book.
        </p>

        <h2>How affiliate links are marked</h2>
        <p>
          Articles that contain affiliate links say so at the top. Affiliate
          links open in a new tab and are marked as sponsored for search
          engines.
        </p>

        <h2>Cookies and privacy</h2>
        <p>
          {SITE_NAME} itself does not set cookies. Partner tools that could set
          cookies, such as the full car catalogue and the hotel map, load only
          when you press their buttons. When you click an affiliate link, the
          partner&apos;s website may set its own cookies so the booking can be
          credited to us. That happens on their site and is covered by their
          privacy policy.
          See our <Link href="/privacy">Privacy Policy</Link> for details.
        </p>

        <h2>Questions</h2>
        <p>
          If anything here is unclear, get in touch through the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </Container>
  );
}
