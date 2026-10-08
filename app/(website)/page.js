import HomePage from "./home";
import { getAllPosts, getTopCategories } from "@/lib/sanity/client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  absoluteTitle: "Iceland Travel Guide: Itineraries, Sights & Tips | NRF.is",
  description:
    "Plan your Iceland trip: Ring Road itineraries, the best time to visit, waterfalls, hot springs, the Northern Lights and practical tips for driving and budgeting.",
  path: "/"
});

export default async function IndexPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getTopCategories()
  ]);
  return <HomePage posts={posts} categories={categories} />;
}
