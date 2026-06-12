import Container from "@/components/container";
import { urlForImage } from "@/lib/sanity/image";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import Image from "next/image";
import Link from "next/link";

export default function About({ about }) {
  const imageProps = about?.image ? urlForImage(about.image) : null;

  return (
    <Container>
      <div className="mx-auto max-w-screen-md text-center">
        <h1 className="text-brand-primary mb-3 mt-2 text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
          {about?.title || "About"}
        </h1>
        {about?.subtitle && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {about.subtitle}
          </p>
        )}
      </div>

      {imageProps && (
        <div className="relative mx-auto mt-10 aspect-video max-w-screen-md overflow-hidden rounded-xl">
          <Image
            src={imageProps.src}
            alt={about?.image?.alt || about?.title || "About"}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            placeholder={about?.image?.blurDataURL ? "blur" : "empty"}
            blurDataURL={about?.image?.blurDataURL}
          />
        </div>
      )}

      {about?.body && (
        <div className="prose mx-auto mt-12 max-w-screen-md dark:prose-invert prose-a:text-blue-600">
          <PortableText value={about.body} />
        </div>
      )}

      {!about && (
        <div className="prose mx-auto mt-12 max-w-screen-md text-center dark:prose-invert">
          <p>No content yet — add it in the Sanity Studio.</p>
        </div>
      )}

      <div className="mx-auto mt-10 max-w-screen-md text-center">
        <Link
          href="/contact"
          className="rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700">
          Get in touch
        </Link>
      </div>
    </Container>
  );
}
