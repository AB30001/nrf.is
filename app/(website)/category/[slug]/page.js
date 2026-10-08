import Container from "@/components/container";
import PostList from "@/components/postlist";
import PageHeader from "@/components/ui/pageHeader";
import { notFound } from "next/navigation";
import JsonLd from "@/components/json-ld";
import {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategory
} from "@/lib/sanity/client";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map(({ category }) => ({ slug: category }));
}

export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  return pageMetadata({
    title: `${category.title}: Iceland Travel Guides`,
    description:
      category.description ||
      `Iceland travel guides about ${category.title.toLowerCase()} from NRF.is.`,
    path: `/category/${params.slug}`
  });
}

export default async function CategoryPage({ params }) {
  const [posts, category] = await Promise.all([
    getPostsByCategory(params.slug),
    getCategoryBySlug(params.slug)
  ]);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const categoryTitle = category?.title || params.slug.replace(/-/g, " ");
  const count = `${posts.length} ${posts.length === 1 ? "guide" : "guides"}`;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: categoryTitle, path: `/category/${params.slug}` }
        ])}
      />
      <PageHeader
        className="-mt-20"
        kicker="Category"
        title={categoryTitle}
        subtitle={category?.description ? `${category.description} ${count}.` : count}
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
