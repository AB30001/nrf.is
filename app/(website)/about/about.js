import Container from "@/components/container";
import { urlForImage } from "@/lib/sanity/image";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import Image from "next/image";
import Link from "next/link";
import { RuneFlourish } from "@/components/ui/runes";
import AboutImg from "@/public/img/design/about.jpg";

export default function About({ about }) {
  const imageProps = about?.image ? urlForImage(about.image) : null;

  return (
    <>
      {/* Masthead — the Sanity image when there is one, otherwise a stock
          Iceland photograph so the page never opens on a bare heading. */}
      <header className="relative -mt-20 isolate overflow-hidden">
        {imageProps ? (
          <Image
            src={imageProps.src}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
            placeholder={about?.image?.blurDataURL ? "blur" : "empty"}
            blurDataURL={about?.image?.blurDataURL}
          />
        ) : (
          <Image
            src={AboutImg}
            alt=""
            aria-hidden="true"
            priority
            placeholder="blur"
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 scrim-full" />
        <RuneFlourish side="left" className="opacity-50" />

        <div className="container mx-auto max-w-screen-md px-8 pb-20 pt-40 text-center sm:pb-24 sm:pt-48 xl:px-5">
          <p className="kicker">About</p>
          <h1 className="mt-4 font-serif text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {about?.title || "About"}
          </h1>
          {about?.subtitle && (
            <p className="mx-auto mt-5 max-w-xl text-[0.975rem] leading-relaxed text-mist-dim">
              {about.subtitle}
            </p>
          )}
        </div>
      </header>

      <Container>
        {about?.body && (
          <div className="prose prose-invert prose-nrf mx-auto mt-12 max-w-screen-md">
            <PortableText value={about.body} />
          </div>
        )}

        {!about && (
          <div className="prose prose-invert prose-nrf mx-auto mt-12 max-w-screen-md text-center">
            <p>No content yet — add it in the Sanity Studio.</p>
          </div>
        )}

        <div className="mx-auto mt-14 max-w-screen-md text-center">
          <Link href="/contact" className="btn-bronze">
            Get in touch
          </Link>
        </div>
      </Container>
    </>
  );
}
