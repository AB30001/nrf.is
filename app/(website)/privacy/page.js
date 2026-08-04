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
        <p>Last updated: June 2026</p>

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

        <h2>Cookies</h2>
        <p>
          This site does not use tracking cookies or analytics. No personal
          data is collected through cookies.
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
