import Image from "next/image";
import { cx } from "@/utils/all";
import HeaderImg from "@/public/img/design/page-header.jpg";
import { RuneFlourish } from "@/components/ui/runes";

/**
 * Shared masthead for interior listing pages (archive, category, author).
 * Full-bleed photo, heavy scrim, kicker + display-serif title over it.
 */
export default function PageHeader({
  kicker,
  title,
  subtitle,
  children,
  className
}) {
  return (
    <header className={cx("relative isolate overflow-hidden", className)}>
      <Image
        src={HeaderImg}
        alt=""
        aria-hidden="true"
        priority
        placeholder="blur"
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-night/80 scrim-bottom"
      />
      <RuneFlourish side="right" className="opacity-60" />

      <div className="container mx-auto max-w-screen-lg px-8 pb-16 pt-32 text-center sm:pb-20 sm:pt-40 xl:px-5">
        {kicker && <p className="kicker">{kicker}</p>}
        <h1 className="mt-4 font-serif text-4xl font-normal leading-[1.12] tracking-tight text-frost-light sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-[0.975rem] leading-relaxed text-mist-dim">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
