import Image from "next/image";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import { notFound } from "next/navigation";
import {
  getAllAuthorsSlugs,
  getAuthorPostsBySlug
} from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";

export async function generateStaticParams() {
  return await getAllAuthorsSlugs();
}

export async function generateMetadata({ params }) {
  const data = await getAuthorPostsBySlug(params.slug);
  const author = data?.[0]?.author;
  if (!author) return {};
  return { title: `Posts by ${author.name}` };
}

export default async function AuthorPage({ params }) {
  const posts = await getAuthorPostsBySlug(params.slug);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const author = posts[0].author;
  const imageProps = author?.image ? urlForImage(author.image) : null;

  return (
    <Container>
      <div className="flex flex-col items-center mb-10">
        {imageProps && (
          <div className="relative h-20 w-20 mb-4">
            <Image
              src={imageProps.src}
              alt={author.name}
              className="rounded-full object-cover"
              fill
              sizes="80px"
            />
          </div>
        )}
        <h1 className="text-3xl font-semibold tracking-tight dark:text-white">
          {author.name}
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
        {posts.map(post => (
          <PostList key={post._id} post={post} aspect="square" />
        ))}
      </div>
    </Container>
  );
}
