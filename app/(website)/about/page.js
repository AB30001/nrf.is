import { getAbout } from "@/lib/sanity/client";
import About from "./about";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  absoluteTitle: "About NRF.is: Who Writes Our Iceland Guides",
  description:
    "Who writes NRF.is and how we research our Iceland travel guides, itineraries and trip-planning advice.",
  path: "/about"
});

export default async function AboutPage() {
  const about = await getAbout();
  return <About about={about} />;
}

