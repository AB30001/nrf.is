import Link from "next/link";

/** The disclosure line every partner block carries, next to its links. */
export default function AffiliateNote({ children }) {
  return (
    <p className="mt-5 text-xs text-mist-dim">
      We may earn a commission if you book, at no extra cost to you.{" "}
      <Link
        href="/affiliate-disclosure"
        className="underline underline-offset-2 transition-colors hover:text-bronze">
        Learn more
      </Link>
      {children}
    </p>
  );
}
