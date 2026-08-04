import Image from "next/image";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";
import Link from "next/link";

export default function AuthorCard({ author }) {
  const imageProps = author?.image ? urlForImage(author.image) : null;

  return (
    <div className="ornament-frame mt-3 bg-basalt px-8 py-9 sm:px-10 sm:py-10">
      <div className="flex flex-wrap items-start sm:flex-nowrap sm:space-x-7">
        <div className="relative mt-1 h-24 w-24 flex-shrink-0">
          {imageProps && (
            <Link href={`/author/${author.slug.current}`}>
              <Image
                src={imageProps.src}
                alt={author.name}
                className="rounded-full object-cover"
                fill
                sizes="96px"
              />
            </Link>
          )}
        </div>
        <div className="mt-5 sm:mt-0">
          <p className="kicker">Written by</p>
          <h3 className="mt-2 font-serif text-2xl font-normal tracking-tight text-frost-light">
            {author.name}
          </h3>

          <div className="prose prose-sm prose-invert prose-nrf mt-3 max-w-none">
            {author.bio && <PortableText value={author.bio} />}
          </div>

          <Link
            href={`/author/${author.slug.current}`}
            className="group mt-5 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-bronze transition-colors hover:text-bronze-light">
            View Profile
            <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
          </Link>
        </div>
      </div>
    </div>
  );
}
