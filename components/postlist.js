import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CategoryLabel from "@/components/blog/category";

export default function PostList({
  post,
  aspect,
  minimal,
  pathPrefix,
  preloadImage,
  fontSize,
  fontWeight
}) {
  const imageProps = post?.mainImage ? urlForImage(post.mainImage) : null;
  const AuthorimageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;

  const href = `/post/${pathPrefix ? `${pathPrefix}/` : ""}${
    post.slug.current
  }`;

  return (
    <article
      className={cx(
        "group relative",
        minimal && "grid gap-8 md:grid-cols-2 md:items-center"
      )}>
      <div className="relative overflow-hidden bg-basalt">
        <Link
          className={cx(
            "relative block",
            aspect === "landscape"
              ? "aspect-video"
              : aspect === "custom"
              ? "aspect-[5/4]"
              : "aspect-video md:aspect-square"
          )}
          href={href}>
          {imageProps ? (
            <>
              <Image
                src={imageProps.src}
                {...(post.mainImage.blurDataURL && {
                  placeholder: "blur",
                  blurDataURL: post.mainImage.blurDataURL
                })}
                alt={post.mainImage.alt || post.title || "Thumbnail"}
                priority={preloadImage ? true : false}
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
              {/* Keeps the bronze label legible over bright photos. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90"
              />
            </>
          ) : (
            <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-basalt-lighter">
              <PhotoIcon />
            </span>
          )}
        </Link>

        {/* Thin bronze rule that draws in on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-0 bg-bronze transition-[width] duration-700 ease-out group-hover:w-full"
        />
      </div>

      <div className={cx(minimal && "flex items-center")}>
        <div className="w-full">
          <CategoryLabel
            categories={post.categories}
            nomargin={minimal}
            className={cx(
              "flex flex-wrap gap-x-4 gap-y-1",
              !minimal && "mt-5"
            )}
          />

          <h2
            className={cx(
              "font-serif font-normal leading-snug tracking-tight text-frost-light",
              fontSize === "large"
                ? "text-2xl"
                : minimal
                ? "text-3xl"
                : "text-xl",
              fontWeight === "normal" && "line-clamp-2",
              "mt-3"
            )}>
            <Link
              href={href}
              className="transition-colors duration-300 hover:text-bronze-light">
              {post.title}
            </Link>
          </h2>

          <div className="hidden">
            {post.excerpt && (
              <p className="mt-2 line-clamp-3 text-sm text-mist-dim">
                <Link href={href}>{post.excerpt}</Link>
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center space-x-3 text-mist-dim">
            <Link href={`/author/${post?.author?.slug?.current}`}>
              <div className="flex items-center gap-2.5">
                <div className="relative h-5 w-5 flex-shrink-0">
                  {post?.author?.image && (
                    <Image
                      src={AuthorimageProps.src}
                      alt={post?.author?.name}
                      className="rounded-full object-cover"
                      fill
                      sizes="20px"
                    />
                  )}
                </div>
                <span className="truncate text-xs transition-colors duration-300 hover:text-bronze">
                  {post?.author?.name}
                </span>
              </div>
            </Link>
            <span className="text-mist-dim/40">&bull;</span>
            <time
              className="truncate text-xs"
              dateTime={post?.publishedAt || post._createdAt}>
              {format(
                parseISO(post?.publishedAt || post._createdAt),
                "MMMM dd, yyyy"
              )}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
}
