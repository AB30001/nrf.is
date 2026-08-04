import HomePage from "./home";
import { getAllPosts, getTopCategories } from "@/lib/sanity/client";

export default async function IndexPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getTopCategories()
  ]);
  return <HomePage posts={posts} categories={categories} />;
}
