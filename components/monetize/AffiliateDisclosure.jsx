import Link from "next/link";

/**
 * Notice for posts with affiliate links inside the article text. Partner
 * widgets carry their own line, so posts with only widgets don't need this.
 */
export default function AffiliateDisclosure() {
  return (
    <p className="mx-auto mb-6 max-w-screen-md text-xs text-mist-dim/80">
      Contains affiliate links, at no extra cost to you.{" "}
      <Link
        href="/affiliate-disclosure"
        className="underline underline-offset-2 transition-colors hover:text-bronze">
        Learn more
      </Link>
    </p>
  );
}
