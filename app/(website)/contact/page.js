import { getSettings } from "@/lib/sanity/client";
import Contact from "./contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with the NRF.is team about our Iceland travel guides.",
  path: "/contact"
});

export default async function ContactPage() {
  const settings = await getSettings();
  return <Contact settings={settings} />;
}

