import Container from "@/components/container";
import PostList from "@/components/postlist";
import PageHeader from "@/components/ui/pageHeader";
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
    <>
      <PageHeader
        className="-mt-20"
        kicker="Category"
        title={categoryTitle}
        subtitle={`${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
      />

      <Container large alt className="pb-24 pt-4">
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          {posts.map(post => (
            <PostList key={post._id} post={post} aspect="custom" />
          ))}
        </div>
      </Container>
    </>
  );
}
