import { getAllPosts } from "@/lib/sanity/client";
import { SITE_URL as BASE_URL } from "@/lib/seo";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE_URL}/post/${post.slug.current}`,
    lastModified: new Date(post.publishedAt || post._createdAt),
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    ...postEntries
  ];
}
