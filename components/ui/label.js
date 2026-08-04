import { cx } from "@/utils/all";

/**
 * Small uppercase category label, and a `pill` variant used for counts.
 *
 * The palette is deliberately monochrome-bronze rather than per-category
 * colours — the `color` prop is still accepted so existing callers and Sanity
 * category colours keep working, it just no longer changes the hue.
 */
export default function Label(props) {
  const margin = props.nomargin;

  if (props.pill) {
    return (
      <div className="inline-flex h-6 shrink-0 items-center justify-center bg-basalt-light px-2.5 text-xs font-medium tabular-nums text-mist-dim">
        {props.children}
      </div>
    );
  }

  return (
    <span
      className={cx(
        "inline-block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-bronze transition-colors duration-300",
        !margin && "mt-5"
      )}>
      {props.children}
    </span>
  );
}
