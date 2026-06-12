import { SITE_URL as BASE_URL } from "@/lib/seo";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio/", "/studio/*", "/api/"]
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL
  };
}
