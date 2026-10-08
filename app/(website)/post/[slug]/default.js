import Image from "next/image";
import Link from "next/link";
import Container from "@/components/container";
import { notFound } from "next/navigation";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

import CategoryLabel from "@/components/blog/category";
import AuthorCard from "@/components/blog/authorCard";
import { RuneFlourish } from "@/components/ui/runes";
import AffiliateDisclosure from "@/components/monetize/AffiliateDisclosure";
import { AFFILIATE_BLOCK_TYPES, hasAffiliateLinks } from "@/lib/monetize/content";
import { planFor } from "@/lib/monetize/topics";
import TourWidget from "@/components/monetize/TourWidget";
import TicketList from "@/components/monetize/TicketList";
import StayCta from "@/components/monetize/StayCta";
import TravelEssentials from "@/components/monetize/TravelEssentials";
import FlightPrices from "@/components/monetize/FlightPrices";

export default function Post(props) {
  const { loading, post } = props;

  const slug = post?.slug;

  if (!loading && !slug) {
    notFound();
  }

  const imageProps = post?.mainImage ? urlForImage(post?.mainImage) : null;

  // Posts without hand-placed partner blocks get a set picked from their topic.
  const hasManualWidget = post?.body?.some(block =>
    AFFILIATE_BLOCK_TYPES.includes(block._type)
  );
  const plan = post && !hasManualWidget ? planFor(post) : null;

  const AuthorimageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;

  return (
    <>
      {/* Full-bleed masthead: the post's own photograph, title laid over it. */}
      <header className="relative -mt-20 isolate overflow-hidden">
        {imageProps ? (
          <Image
            src={imageProps.src}
            alt={post.mainImage?.alt || post.title || "Thumbnail"}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-gradient-to-br from-aurora-deep via-night to-plum-deep"
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 scrim-full" />
        <RuneFlourish side="right" className="opacity-50" />

        <div className="container mx-auto max-w-screen-md px-8 pb-16 pt-40 text-center sm:pb-24 sm:pt-48 xl:px-5">
          <CategoryLabel
            categories={post.categories}
            nomargin
            className="flex flex-wrap justify-center gap-x-5 gap-y-1"
          />

          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            {post.title}
          </h1>

          <div className="mt-8 flex justify-center text-mist-dim">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                {AuthorimageProps && (
                  <Link href={`/author/${post.author.slug.current}`}>
                    <Image
                      src={AuthorimageProps.src}
                      alt={post?.author?.name}
                      className="rounded-full object-cover"
                      fill
                      sizes="40px"
                    />
                  </Link>
                )}
              </div>
              <div className="text-left">
                <p className="text-sm text-mist">
                  <Link
                    href={`/author/${post.author.slug.current}`}
                    className="transition-colors hover:text-bronze">
                    {post.author.name}
                  </Link>
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-mist-dim">
                  <time dateTime={post?.publishedAt || post._createdAt}>
                    {format(
                      parseISO(post?.publishedAt || post._createdAt),
                      "MMMM dd, yyyy"
                    )}
                  </time>
                  <span className="text-mist-dim/40">&bull;</span>
                  <span>{post.estReadingTime || "5"} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Container>
        <article className="mx-auto max-w-screen-md">
          {hasAffiliateLinks(post.body) && <AffiliateDisclosure />}
          <div className="prose prose-invert prose-nrf mx-auto my-3">
            {post.body && <PortableText value={post.body} slug={post.slug?.current} />}
          </div>

          {plan && (
            <>
              {plan.tiqets ? (
                <TicketList
                  heading={plan.heading}
                  query={plan.tiqets}
                  slug={post.slug?.current}
                  placement="auto"
                />
              ) : (
                <TourWidget
                  heading={plan.heading}
                  viator={plan.viator}
                  slug={post.slug?.current}
                  placement="auto"
                />
              )}
              {plan.stay && (
                <StayCta
                  placeName={plan.stay.name}
                  lat={plan.stay.lat}
                  lng={plan.stay.lng}
                  slug={post.slug?.current}
                  placement="auto_stay"
                />
              )}
              {plan.flights && (
                <FlightPrices slug={post.slug?.current} placement="auto_flights" />
              )}
              <TravelEssentials
                items={plan.essentials}
                slug={post.slug?.current}
                placement="auto_essentials"
              />
            </>
          )}

          <div className="mb-12 mt-14 flex justify-center">
            <Link href="/" className="btn-outline group">
              <ArrowLongLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              View all posts
            </Link>
          </div>

          {post.author && <AuthorCard author={post.author} />}
        </article>
      </Container>
    </>
  );
}

const MainImage = ({ image }) => {
  return (
    <div className="mb-12 mt-12 ">
      <Image {...urlForImage(image)} alt={image.alt || "Thumbnail"} />
      <figcaption className="text-center ">
        {image.caption && (
          <span className="text-sm italic text-mist-dim">{image.caption}</span>
        )}
      </figcaption>
    </div>
  );
};
