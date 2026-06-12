import { getSettings, getTopCategories } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import { urlForImage } from "@/lib/sanity/image";
import Navbar from "@/components/navbar";
import JsonLd from "@/components/json-ld";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  baseOpenGraph,
  buildWebsiteJsonLd,
  googleVerification
} from "@/lib/seo";

async function sharedMetaData(params) {
  const settings = await getSettings();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings?.title || SITE_NAME,
      template: `%s | ${SITE_NAME}`
    },
    description: settings?.description || SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: [{ name: SITE_NAME }],
    canonical: settings?.url,
    openGraph: baseOpenGraph({
      images: [
        {
          url: urlForImage(settings?.openGraphImage)?.src || "/opengraph-image",
          width: 1200,
          height: 630
        }
      ]
    }),
    twitter: {
      title: settings?.title || SITE_NAME,
      card: "summary_large_image"
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    verification: {
      google: googleVerification()
    }
  };
}

export async function generateMetadata({ params }) {
  return await sharedMetaData(params);
}

export default async function Layout({ children, params }) {
  const settings = await getSettings();
  const categories = await getTopCategories();
  return (
    <>
      <JsonLd data={buildWebsiteJsonLd()} />
      <Navbar {...settings} categories={categories} />

      <div>{children}</div>

      <Footer {...settings} />
    </>
  );
}
// enable revalidate for all pages in this layout
export const revalidate = false;
