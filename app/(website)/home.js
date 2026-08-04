import Link from "next/link";
import Image from "next/image";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import PostCarousel from "@/components/postCarousel";
import SectionHeading from "@/components/ui/sectionHeading";
import { RuneFlourish } from "@/components/ui/runes";
import { urlForImage } from "@/lib/sanity/image";
import { SITE_DESCRIPTION } from "@/lib/seo";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import HeroImg from "@/public/img/design/hero.jpg";
import AuroraImg from "@/public/img/design/aurora-band.jpg";
import MidnightImg from "@/public/img/design/midnight-sun.jpg";

export default function Home({ posts = [], categories = [] }) {
  if (!posts || posts.length === 0) return null;

  const featured = posts.slice(0, 6);
  // Six tiles exactly fill the 4x2 mosaic once the text panel takes the two
  // cells in the last column — any other count leaves an orphan row.
  const mosaic = posts.slice(6, 12);
  const latest = posts.slice(12);

  return (
    <>
      <Hero categories={categories} />
      <FeaturedRail posts={featured} />
      <Mosaic posts={mosaic} />
      <MidnightBand />
      <Latest posts={latest} />
    </>
  );
}

/* --------------------------------------------------------------------------
   Hero — full-bleed aurora photograph with the category bar floating over its
   lower edge, mirroring the reference design's booking bar.
   -------------------------------------------------------------------------- */
function Hero({ categories }) {
  const quickLinks = categories
    .filter(cat => cat?.slug?.current)
    .slice(0, 4);

  return (
    <section className="relative -mt-20 isolate">
      <div className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <Image
          src={HeroImg}
          alt=""
          aria-hidden="true"
          priority
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scrim-full"
        />

        <div className="container mx-auto max-w-screen-lg px-8 pb-32 pt-28 text-center xl:px-5">
          <p className="kicker animate-fade-up">
            {SITE_DESCRIPTION.split(":")[0]}
          </p>
          <h1
            className="mt-6 animate-fade-up font-serif text-5xl font-normal leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "120ms" }}>
            The Land of
            <br />
            Fire and Ice
          </h1>
        </div>
      </div>

      {/* Quick-nav bar overlapping the hero's lower edge. It sits outside the
          clipped hero wrapper and is pulled up by half its own height, so the
          overflow-hidden that crops the photograph cannot cut it in half. */}
      <div className="relative z-10 -mt-14 px-6">
        <div className="container mx-auto max-w-screen-xl">
          <nav
            aria-label="Browse by category"
            className="grid grid-cols-2 gap-px border border-basalt-lighter bg-basalt-lighter shadow-2xl shadow-night/70 sm:grid-cols-3 lg:grid-cols-5">
            {quickLinks.map(cat => (
              <Link
                key={cat.slug.current}
                href={`/category/${cat.slug.current}`}
                className="group flex min-h-[7rem] flex-col justify-center bg-night px-5 py-5 transition-colors duration-300 hover:bg-basalt">
                <span className="kicker">Browse</span>
                <span className="mt-2 font-serif text-base leading-snug text-frost-light transition-colors duration-300 group-hover:text-bronze-light">
                  {cat.title}
                </span>
              </Link>
            ))}
            <Link
              href="/archive"
              className="flex min-h-[7rem] items-center justify-center gap-2 bg-bronze px-5 py-5 text-xs font-semibold uppercase tracking-[0.16em] text-night transition-colors duration-300 hover:bg-bronze-light">
              All Posts
              <ArrowLongRightIcon className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Featured — text left, overflowing photo rail right, over an aurora band.
   -------------------------------------------------------------------------- */
function FeaturedRail({ posts }) {
  if (posts.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-40 sm:pt-44">
      <Image
        src={AuroraImg}
        alt=""
        aria-hidden="true"
        placeholder="blur"
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-night via-aurora-deep/70 to-night"
      />
      <RuneFlourish side="left" />

      <div className="container mx-auto max-w-screen-xl px-8 xl:px-5">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <SectionHeading
            kicker="Featured"
            title={
              <>
                Stories from
                <br />
                the Ring Road
              </>
            }
            subtitle="Waterfalls, glacier lagoons, hot springs and the long dark nights under the northern lights — the guides our readers reach for first.">
            <Link href="/archive" className="btn-bronze mt-8">
              Read the guides
            </Link>
          </SectionHeading>

          {/* Negative right margin lets the rail bleed off the viewport edge. */}
          <div className="-mr-8 min-w-0 xl:-mr-24">
            <PostCarousel posts={posts} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Mosaic — edge-to-edge photo grid with one cell given over to a text panel.
   -------------------------------------------------------------------------- */
function Mosaic({ posts }) {
  if (posts.length === 0) return null;

  const lead = posts.slice(0, 3);
  const rest = posts.slice(3);

  return (
    <section className="relative bg-night">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {lead.map(post => (
          <MosaicTile key={post._id} post={post} />
        ))}

        {/* Text panel occupies one grid cell, as in the reference layout. */}
        <div className="col-span-2 flex items-center justify-center bg-basalt p-6 md:col-span-1 md:row-span-2">
          <div className="ornament-frame w-full px-7 py-10">
            <p className="kicker">The Guide</p>
            <h2 className="mt-4 font-serif text-3xl font-normal leading-tight tracking-tight text-frost-light">
              Explore
              <br />
              Iceland
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-mist-dim">
              {SITE_DESCRIPTION}
            </p>
            <Link
              href="/archive"
              className="group mt-7 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-bronze transition-colors hover:text-bronze-light">
              Browse all
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
            </Link>
          </div>
        </div>

        {rest.map(post => (
          <MosaicTile key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}

function MosaicTile({ post }) {
  const imageProps = post?.mainImage ? urlForImage(post.mainImage) : null;
  if (!imageProps) return null;

  return (
    <Link
      href={`/post/${post.slug.current}`}
      className="group relative aspect-square overflow-hidden bg-basalt">
      <Image
        src={imageProps.src}
        alt={post.mainImage?.alt || post.title}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.07]"
        {...(post.mainImage?.blurDataURL && {
          placeholder: "blur",
          blurDataURL: post.mainImage.blurDataURL
        })}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-night via-night/25 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95"
      />
      <span className="absolute inset-x-0 bottom-0 p-5">
        <span className="line-clamp-3 font-serif text-[0.95rem] leading-snug text-frost-light transition-colors duration-300 group-hover:text-bronze-light">
          {post.title}
        </span>
      </span>
    </Link>
  );
}

/* --------------------------------------------------------------------------
   Midnight band — full-bleed photograph with a floating centred heading.
   -------------------------------------------------------------------------- */
function MidnightBand() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative flex min-h-[70vh] items-start justify-center">
        <Image
          src={MidnightImg}
          alt=""
          aria-hidden="true"
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-night via-plum-deep/45 to-night"
        />

        <div className="container mx-auto max-w-screen-md px-8 py-20 text-center xl:px-5">
          <SectionHeading
            align="center"
            kicker="Summer in the north"
            title="Under the Midnight Sun"
            subtitle="From May to August the sun barely sets. Plan the long days — fjord villages, highland roads and puffin cliffs — with our seasonal guides."
          />
          <Link href="/archive" className="btn-outline mt-9">
            Plan your trip
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Latest — the standard card grid, plus the archive link.
   -------------------------------------------------------------------------- */
function Latest({ posts }) {
  if (posts.length === 0) return null;

  return (
    <Container large alt className="py-24">
      <SectionHeading kicker="Latest" title="Fresh from the field" />

      <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
        {posts.map(post => (
          <PostList key={post._id} post={post} aspect="custom" />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Link href="/archive" className="btn-bronze">
          View all Posts
        </Link>
      </div>
    </Container>
  );
}
