import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/seo";
import upperFirst from "@/utils/upperFirst";
import Strip1 from "@/public/img/design/strip-1.jpg";
import Strip2 from "@/public/img/design/strip-2.jpg";
import Strip3 from "@/public/img/design/strip-3.jpg";
import Strip4 from "@/public/img/design/strip-4.jpg";
import Strip5 from "@/public/img/design/strip-5.jpg";
import Strip6 from "@/public/img/design/strip-6.jpg";
import Strip7 from "@/public/img/design/strip-7.jpg";
import Strip8 from "@/public/img/design/strip-8.jpg";

const STRIP = [Strip1, Strip2, Strip3, Strip4, Strip5, Strip6, Strip7, Strip8];

export default function Footer(props) {
  const categories = props?.categories || [];
  const social = Array.isArray(props?.social) ? props.social : [];

  return (
    <footer className="mt-24 border-t border-basalt-light bg-night-900">
      <PhotoStrip social={social} />

      <div className="container mx-auto max-w-screen-xl px-8 py-16 xl:px-5">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block" aria-label="NRF.is — home">
              <span className="font-serif text-2xl tracking-tight text-frost-light">
                {props?.title || SITE_NAME}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-dim">
              Your guide to the Land of Fire and Ice.
            </p>
            {props?.email && (
              <a
                href={`mailto:${props.email}`}
                className="mt-5 inline-block text-sm text-bronze transition-colors hover:text-bronze-light">
                {props.email}
              </a>
            )}
          </div>

          {/* Explore */}
          <nav className="md:col-span-3" aria-label="Footer">
            <h2 className="kicker">Explore</h2>
            <ul className="mt-5 space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "All Posts", href: "/archive" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" }
              ].map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-mist-dim transition-colors hover:text-bronze">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          {categories.length > 0 && (
            <nav className="md:col-span-4" aria-label="Categories">
              <h2 className="kicker">Categories</h2>
              <ul className="mt-5 space-y-3">
                {categories
                  .filter(cat => cat?.slug?.current)
                  .map(cat => (
                    <li key={cat._id || cat.slug.current}>
                      <Link
                        href={`/category/${cat.slug.current}`}
                        className="text-sm text-mist-dim transition-colors hover:text-bronze">
                        {cat.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-basalt-light pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-mist-dim/70">
            Copyright © {new Date().getFullYear()}{" "}
            {props?.copyright || SITE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <p className="text-xs text-mist-dim/70">
              Built by{" "}
              <a
                href="https://devhuset.no"
                target="_blank"
                rel="noopener"
                className="transition-colors hover:text-bronze">
                Devhuset
              </a>
            </p>
            <Link
              href="/privacy"
              className="text-xs text-mist-dim/70 transition-colors hover:text-bronze">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Edge-to-edge photo band. The images are decorative Iceland scenery, so they
 * are hidden from assistive tech; the label block carries whatever social
 * links the Sanity settings document provides.
 */
function PhotoStrip({ social }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[minmax(9rem,1fr)_repeat(8,1fr)]">
      <div className="col-span-2 flex flex-col items-center justify-center gap-3 bg-basalt px-6 py-8 text-center sm:col-span-4 lg:col-span-1">
        <p className="kicker leading-relaxed">
          {social.length > 0 ? "Follow along" : "Iceland, frame by frame"}
        </p>
        {social.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {social
              .filter(item => item?.url)
              .map((item, index) => (
                <li key={`${item.media}${index}`}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-mist-dim transition-colors hover:text-bronze">
                    {upperFirst(item.media || "Link")}
                  </a>
                </li>
              ))}
          </ul>
        )}
      </div>

      {STRIP.map((img, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="group relative aspect-square overflow-hidden">
          <Image
            src={img}
            alt=""
            placeholder="blur"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
            className="h-full w-full object-cover grayscale-[35%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        </div>
      ))}
    </div>
  );
}
