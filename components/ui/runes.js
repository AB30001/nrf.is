import { cx } from "@/utils/all";

/**
 * Decorative Norse line art used as low-opacity background texture.
 *
 * Everything here is inline SVG drawn from primitives — no image weight, and it
 * inherits `currentColor` so each placement can tint it to the section palette.
 * Purely ornamental, so every instance is hidden from assistive tech.
 */

const STAVE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/** A vegvísir-style wayfinder: eight staves radiating from a common centre. */
export function Vegvisir({ className }) {
  const R = 92; // stave length from centre
  const fork = 13; // half-width of the arrow fork at each tip
  const bar = 17; // half-width of the crossbar

  return (
    <svg
      viewBox="-120 -120 240 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}>
      <circle r="112" opacity="0.35" />
      <circle r="104" opacity="0.2" />
      <circle r="26" opacity="0.4" />

      {STAVE_ANGLES.map(angle => (
        <g key={angle} transform={`rotate(${angle})`}>
          {/* main stave */}
          <line y1="-24" y2={-R} />
          {/* arrow fork at the tip */}
          <line x1={-fork} y1={-R + fork} x2="0" y2={-R} />
          <line x1={fork} y1={-R + fork} x2="0" y2={-R} />
          {/* crossbars */}
          <line x1={-bar} y1={-R * 0.66} x2={bar} y2={-R * 0.66} />
          <line x1={-bar * 0.6} y1={-R * 0.44} x2={bar * 0.6} y2={-R * 0.44} />
          {/* tip node */}
          <circle cy={-R - 8} r="3.5" />
        </g>
      ))}
    </svg>
  );
}

/** Concentric ringed sigils — the motif bleeding off the edge of the map section. */
export function RuneCircles({ className }) {
  const sigils = [
    { cx: -60, cy: -55, r: 46 },
    { cx: 52, cy: 8, r: 62 },
    { cx: -28, cy: 76, r: 34 }
  ];

  return (
    <svg
      viewBox="-140 -140 280 280"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}>
      {sigils.map(({ cx, cy, r }) => (
        <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
          <circle r={r} opacity="0.55" />
          <circle r={r * 0.62} opacity="0.4" />
          <circle r={r * 0.2} opacity="0.7" />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <line
              key={a}
              transform={`rotate(${a})`}
              y1={-r * 0.2}
              y2={-r}
              opacity="0.5"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/**
 * Positions a rune motif as an absolutely-placed background flourish.
 * `side` picks which edge it bleeds off.
 */
export function RuneFlourish({
  variant = "vegvisir",
  side = "left",
  className
}) {
  const Motif = variant === "circles" ? RuneCircles : Vegvisir;

  return (
    <div
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none lg:block",
        side === "left" ? "-left-24 xl:-left-16" : "-right-24 xl:-right-16",
        className
      )}>
      <Motif className="h-[26rem] w-[26rem] text-frost/[0.07] xl:h-[32rem] xl:w-[32rem]" />
    </div>
  );
}
