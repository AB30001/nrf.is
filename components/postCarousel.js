"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { urlForImage } from "@/lib/sanity/image";

/**
 * Horizontally scrolling post rail that deliberately overflows the right edge
 * of the viewport, with a `1 / 4 ⟶` counter beneath it.
 *
 * Native scroll-snap does the work, so touch/trackpad dragging and keyboard
 * scrolling all behave normally; the arrow is an enhancement on top.
 */
export default function PostCarousel({ posts = [] }) {
  const railRef = useRef(null);
  const [index, setIndex] = useState(0);

  const readIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const item = rail.firstElementChild;
    if (!item) return;
    // Item pitch includes the flex gap, so measure against the next sibling.
    const pitch = item.nextElementSibling
      ? item.nextElementSibling.offsetLeft - item.offsetLeft
      : item.offsetWidth;
    if (!pitch) return;
    const next = Math.round(rail.scrollLeft / pitch);
    setIndex(Math.min(Math.max(next, 0), posts.length - 1));
  }, [posts.length]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    rail.addEventListener("scroll", readIndex, { passive: true });
    window.addEventListener("resize", readIndex);
    return () => {
      rail.removeEventListener("scroll", readIndex);
      window.removeEventListener("resize", readIndex);
    };
  }, [readIndex]);

  const advance = () => {
    const rail = railRef.current;
    if (!rail) return;
    const item = rail.firstElementChild;
    if (!item) return;
    const pitch = item.nextElementSibling
      ? item.nextElementSibling.offsetLeft - item.offsetLeft
      : item.offsetWidth;
    const atEnd = index >= posts.length - 1;
    rail.scrollTo({
      left: atEnd ? 0 : (index + 1) * pitch,
      behavior: "smooth"
    });
  };

  if (posts.length === 0) return null;

  return (
    <div className="min-w-0">
      <ul
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
        {posts.map(post => {
          const imageProps = post?.mainImage
            ? urlForImage(post.mainImage)
            : null;

          return (
            <li
              key={post._id}
              className="w-[16rem] shrink-0 snap-start sm:w-[19rem] lg:w-[21rem]">
              <Link
                href={`/post/${post.slug.current}`}
                className="group block">
                {/* Warm paper mount around the photo, echoing the reference. */}
                <div className="bg-[#e9e6df] p-2.5 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:-translate-y-1.5">
                  <div className="relative aspect-[4/5] overflow-hidden bg-basalt">
                    {imageProps ? (
                      <Image
                        src={imageProps.src}
                        alt={post.mainImage?.alt || post.title}
                        fill
                        sizes="(max-width: 640px) 60vw, 340px"
                        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        {...(post.mainImage?.blurDataURL && {
                          placeholder: "blur",
                          blurDataURL: post.mainImage.blurDataURL
                        })}
                      />
                    ) : (
                      <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-basalt-lighter">
                        <PhotoIcon />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-5 font-serif text-lg leading-snug text-frost-light transition-colors duration-300 group-hover:text-bronze-light">
                  {post.title}
                </h3>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex items-center gap-6">
        <span className="font-serif text-sm tabular-nums text-mist-dim">
          <span className="text-frost-light">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="px-1.5 text-mist-dim/50">/</span>
          {String(posts.length).padStart(2, "0")}
        </span>

        <button
          type="button"
          onClick={advance}
          aria-label="Next post"
          className="group inline-flex items-center text-mist-dim transition-colors duration-300 hover:text-bronze">
          <span className="mr-3 h-px w-10 bg-current transition-all duration-300 group-hover:w-14" />
          <ArrowLongRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
