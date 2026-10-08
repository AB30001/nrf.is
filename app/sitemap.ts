import {
  getAllAuthors,
  getAllPosts,
  getCategoriesForSitemap
} from "@/lib/sanity/client";
import { SITE_URL as BASE_URL } from "@/lib/seo";
import { MetadataRoute } from "next";

// Every indexable, canonical URL. Paginated archive pages are left out: they
// are reachable from /archive and only list posts that are already here.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, authors] = await Promise.all([
    getAllPosts(),
    getCategoriesForSitemap(),
    getAllAuthors()
  ]);

  const latestPost = posts[0]
    ? new Date(posts[0]._updatedAt || posts[0].publishedAt || posts[0]._createdAt)
    : new Date();

  const postEntries: MetadataRoute.Sitemap = posts
    .filter(post => post?.slug?.current)
    .map(post => ({
      url: `${BASE_URL}/post/${post.slug.current}`,
      lastModified: new Date(post._updatedAt || post.publishedAt || post._createdAt),
      changeFrequency: "monthly",
      priority: 0.8
    }));

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter(category => category.lastModified)
    .map(category => ({
      url: `${BASE_URL}/category/${category.slug}`,
      lastModified: new Date(category.lastModified),
      changeFrequency: "weekly",
      priority: 0.7
    }));

  const authorEntries: MetadataRoute.Sitemap = authors
    .filter(author => author.slug)
    .map(author => ({
      url: `${BASE_URL}/author/${author.slug}`,
      lastModified: latestPost,
      changeFrequency: "monthly",
      priority: 0.4
    }));

  const page = (path: string, priority: number, lastModified = latestPost) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority
  });

  return [
    { ...page("", 1.0), changeFrequency: "daily" },
    { ...page("/archive", 0.8), changeFrequency: "daily" },
    ...postEntries,
    ...categoryEntries,
    ...authorEntries,
    page("/about", 0.5),
    page("/contact", 0.3),
    page("/affiliate-disclosure", 0.2),
    page("/privacy", 0.2)
  ];
}
