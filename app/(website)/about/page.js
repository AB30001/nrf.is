import { getAbout } from "@/lib/sanity/client";
import About from "./about";

export default async function AboutPage() {
  const about = await getAbout();
  return <About about={about} />;
}

