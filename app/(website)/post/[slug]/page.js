import PostPage from "./default";
import { getAllPostsSlugs, getPostBySlug } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import JsonLd from "@/components/json-ld";
import {
  absoluteUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  pageMetadata,
  summarize
} from "@/lib/seo";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.src
    : absoluteUrl("/opengraph-image");

  return pageMetadata({
    title: post.title,
    // A few agent-published posts have no excerpt; fall back to the opening text.
    description: post.excerpt || summarize(post.body),
    path: `/post/${post.slug?.current}`,
    image: imageUrl,
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt || post._createdAt,
      modifiedTime: post._updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      section: post.categories?.[0]?.title
    }
  });
}

export default async function PostDefault({ params }) {
  const post = await getPostBySlug(params.slug);

  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.src
    : absoluteUrl("/opengraph-image");

  const articleJsonLd = buildArticleJsonLd(post, imageUrl);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Archive", path: "/archive" },
    { name: post.title, path: `/post/${post.slug?.current}` }
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PostPage post={post} />
    </>
  );
}

