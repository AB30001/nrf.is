import { Suspense } from "react";
import Container from "@/components/container";
import Archive from "./archive";
import Loading from "@/components/loading";
import PageHeader from "@/components/ui/pageHeader";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ searchParams }) {
  // Each page of the archive is its own canonical URL (Google's guidance for
  // paginated series); page 1 is plain /archive.
  const page = parseInt(searchParams?.page, 10) || 1;
  return pageMetadata({
    title: page > 1 ? `All Iceland Travel Guides, Page ${page}` : "All Iceland Travel Guides",
    description:
      "Every NRF.is guide to Iceland: itineraries, natural wonders, Reykjavík, activities and practical planning, newest first.",
    path: page > 1 ? `/archive?page=${page}` : "/archive"
  });
}

export const dynamic = "force-dynamic";

export const runtime = "edge";

export default async function ArchivePage({ searchParams }) {
  return (
    <>
      <PageHeader
        className="-mt-20"
        kicker="Every guide"
        title="Archive"
        subtitle="See all posts we have ever written."
      />

      <Container large alt className="relative pb-24 pt-4">
        <Suspense key={searchParams.page || "1"} fallback={<Loading />}>
          <Archive searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

// export const revalidate = 60;
