import Link from "next/link";
import Label from "@/components/ui/label";

export default function CategoryLabel({
  categories,
  nomargin = false,
  className
}) {
  // `categories?.length &&` used to leak a literal 0 into the markup when a
  // post had no categories; an explicit guard keeps the output clean.
  if (!categories?.length) return null;

  return (
    <div className={className || "flex flex-wrap gap-x-4 gap-y-1"}>
      {categories.map((category, index) => (
        <Link
          href={`/category/${category.slug.current}`}
          key={index}
          className="group/cat">
          <Label nomargin={nomargin} color={category.color}>
            <span className="group-hover/cat:text-bronze-light">
              {category.title}
            </span>
          </Label>
        </Link>
      ))}
    </div>
  );
}
