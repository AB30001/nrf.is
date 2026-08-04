import Image from "next/image";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import PageHeader from "@/components/ui/pageHeader";
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
    <>
      <PageHeader
        className="-mt-20"
        kicker="Author"
        title={author.name}
        subtitle={`${posts.length} ${posts.length === 1 ? "post" : "posts"}`}>
        {imageProps && (
          <div className="relative mx-auto mt-8 h-20 w-20">
            <Image
              src={imageProps.src}
              alt={author.name}
              className="rounded-full object-cover"
              fill
              sizes="80px"
            />
          </div>
        )}
      </PageHeader>

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
