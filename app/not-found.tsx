import Link from "next/link";
import Container from "@/components/container";
import { Vegvisir } from "@/components/ui/runes";

export default function NotFound() {
  return (
    <div className="relative isolate overflow-hidden bg-night">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-aurora-deep/40 via-night to-night"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <Vegvisir className="h-[34rem] w-[34rem] text-frost/[0.05]" />
      </div>

      <Container alt className="flex flex-col items-center justify-center py-40 text-center">
        <p className="kicker">Error 404</p>
        <h1 className="mt-5 font-serif text-4xl font-normal leading-tight tracking-tight text-frost-light sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-mist-dim">
          This page doesn&apos;t exist — it may have moved or been removed.
        </p>
        <Link href="/" className="btn-bronze mt-10">
          Back to home
        </Link>
      </Container>
    </div>
  );
}
