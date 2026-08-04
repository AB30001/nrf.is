import { Suspense } from "react";
import Container from "@/components/container";
import Archive from "./archive";
import Loading from "@/components/loading";
import PageHeader from "@/components/ui/pageHeader";

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
