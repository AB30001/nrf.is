import Container from "@/components/container";
import { SITE_NAME } from "@/lib/seo";

export const metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}`
};

export default function PrivacyPage() {
  return (
    <Container alt className="py-16">
      <div className="prose prose-invert prose-nrf mx-auto max-w-screen-md">
        <h1 className="font-serif font-normal text-frost-light">
          Privacy Policy
        </h1>
        <p>Last updated: September 2026</p>

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
