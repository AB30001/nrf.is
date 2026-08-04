import { cx } from "@/utils/all";

/**
 * Kicker + display-serif heading pair used at the top of every major section.
 *
 * `as` lets a caller promote it to the page's <h1> without changing the look —
 * only one h1 per page, the rest stay h2.
 */
export default function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  as: Tag = "h2",
  size = "md",
  className,
  children
}) {
  const centered = align === "center";

  return (
    <div
      className={cx(
        centered && "mx-auto text-center",
        centered && "max-w-2xl",
        className
      )}>
      {kicker && <p className="kicker">{kicker}</p>}

      <Tag
        className={cx(
          "font-serif font-normal leading-[1.12] tracking-tight text-frost-light",
          kicker && "mt-4",
          size === "lg"
            ? "text-4xl sm:text-5xl lg:text-6xl"
            : size === "sm"
            ? "text-2xl sm:text-3xl"
            : "text-3xl sm:text-4xl lg:text-[2.75rem]"
        )}>
        {title}
      </Tag>

      {subtitle && (
        <p
          className={cx(
            "mt-5 text-[0.975rem] leading-relaxed text-mist-dim",
            !centered && "max-w-xl"
          )}>
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
