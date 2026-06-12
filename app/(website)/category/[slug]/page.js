import Container from "@/components/container";
import PostList from "@/components/postlist";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  getPostsByCategory
} from "@/lib/sanity/client";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map(({ category }) => ({ slug: category }));
}

export async function generateMetadata({ params }) {
  return { title: params.slug.replace(/-/g, " ") };
}

export default async function CategoryPage({ params }) {
  const posts = await getPostsByCategory(params.slug);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const categoryTitle = posts[0]?.categories?.find(
    c => c.slug?.current === params.slug
  )?.title || params.slug.replace(/-/g, " ");

  return (
    <Container>
      <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl">
        {categoryTitle}
      </h1>
      <p className="mb-10 text-center text-gray-500 dark:text-gray-400">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
        {posts.map(post => (
          <PostList key={post._id} post={post} aspect="square" />
        ))}
      </div>
    </Container>
  );
}
