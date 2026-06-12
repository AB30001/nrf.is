import PostPage from "./default";
import { getAllPostsSlugs, getPostBySlug } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import JsonLd from "@/components/json-ld";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.src
    : absoluteUrl("/opengraph-image");

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: absoluteUrl(`/post/${post.slug?.current}`)
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: imageUrl, width: 1200, height: 630 }]
    }
  };
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

