import Container from "@/components/container";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your data: cookie-free analytics, the contact form and affiliate links.`,
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <Container alt className="py-16">
      <div className="prose prose-invert prose-nrf mx-auto max-w-screen-md">
        <h1 className="font-serif font-normal text-frost-light">
          Privacy Policy
        </h1>
        <p>Last updated: October 2026</p>

        <h2>Who we are</h2>
        <p>
          {SITE_NAME} is the site you are currently viewing. This site does
          not require registration and does not collect personal data beyond
          what is described below.
        </p>

        <h2>Contact form</h2>
        <p>
          When you submit the contact form, your name, email address, and
          message are sent directly to us via{" "}
          <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer">
            Web3Forms
          </a>
          . This data is used solely to respond to your enquiry and is not
          stored in any database, shared with third parties, or used for
          marketing purposes.
        </p>

        <h2>Analytics</h2>
        <p>
          We use{" "}
          <a href="https://www.goatcounter.com" target="_blank" rel="noopener noreferrer">
            GoatCounter
          </a>
          , a privacy-friendly analytics service, to see how many people visit
          the site and which pages they read. It does not use cookies, does not
          store anything in your browser, and does not track you across
          websites or build a profile of you. Because of that, we do not show a
          cookie banner.
        </p>
        <p>GoatCounter only stores anonymous, aggregated counts, such as:</p>
        <ul>
          <li>which pages were viewed, and which website referred the visitor</li>
          <li>browser and operating system (for example, Firefox on Windows)</li>
          <li>country, worked out from the IP address</li>
          <li>language and screen width</li>
        </ul>
        <p>
          Your IP address and full browser User-Agent are only used to work out
          these figures and are not stored. To avoid counting the same visitor
          repeatedly, GoatCounter keeps a randomly generated ID in server
          memory for up to 8 hours; it is never written to a database. This
          data is anonymous and cannot be linked back to you. It is not shared
          with third parties and is stored on servers in Finland and Germany.
          See{" "}
          <a
            href="https://www.goatcounter.com/privacy"
            target="_blank"
            rel="noopener noreferrer">
            GoatCounter&apos;s privacy policy
          </a>{" "}
          for details.
        </p>

        <h2>Affiliate links</h2>
        <p>
          Some links on this site are affiliate links to travel partners
          (Stay22, Travelpayouts, Viator and Tiqets), which pay us a small
          commission if you book through them. Partner offers are shown as
          plain links, no partner cookies are set unless you open one of the
          tools described below, and we do not share any personal data with
          partners. When you click a
          partner link, the partner&apos;s website may set its own cookies to
          credit the booking to us. That is covered by the partner&apos;s
          privacy policy. See our{" "}
          <a href="/affiliate-disclosure">Affiliate Disclosure</a> for
          details. We count clicks on partner links in GoatCounter, the same
          anonymous way as page views.
        </p>
        <p>
          Two partner tools load content from our partners&apos; servers. The
          car rental search box (Localrent, via Travelpayouts) loads when you
          scroll to it; it sets no cookies, but like any web request it shares
          your IP address and the page address with them. The full car
          catalogue and the hotel map load only when you press their buttons,
          and may set cookies on your device once you do.
        </p>

        <h2>Your rights (GDPR)</h2>
        <p>
          Under GDPR you have the right to access, correct, or request
          deletion of any personal data we hold about you. To exercise these
          rights, contact us via the{" "}
          <a href="/contact">contact page</a>.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy occasionally. Any changes will be
          reflected on this page.
        </p>
      </div>
    </Container>
  );
}
