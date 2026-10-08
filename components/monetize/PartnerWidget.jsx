"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wrapper for partner script widgets (Travelpayouts tpscr.com embeds) that
 * are too rich to rebuild natively. The script only loads when needed:
 *  - load="click":   after the reader presses the button. Use for widgets that
 *                    set cookies or storage (consent by explicit request).
 *  - load="visible": when the box scrolls into view. Only for widgets checked
 *                    to set no cookies or storage.
 */
export default function PartnerWidget({
  src,
  load = "click",
  buttonLabel = "Show",
  note,
  minHeight = 200
}) {
  const [active, setActive] = useState(false);
  const box = useRef(null);
  const mount = useRef(null);

  // "visible": start loading shortly before the box enters the viewport.
  useEffect(() => {
    if (load !== "visible" || active || !box.current) return;
    const observer = new IntersectionObserver(
      entries => entries.some(e => e.isIntersecting) && setActive(true),
      { rootMargin: "300px" }
    );
    observer.observe(box.current);
    return () => observer.disconnect();
  }, [load, active]);

  useEffect(() => {
    const el = mount.current;
    if (!active || !el || !src) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.charset = "utf-8";
    el.appendChild(script);
    if (load === "click") {
      const campaign = new URL(src).searchParams.get("campaign_id");
      window.goatcounter?.count?.({ path: `aff/widget/${campaign}`, title: "Widget opened", event: true });
    }
    return () => {
      el.innerHTML = "";
    };
  }, [active, src, load]);

  if (!src) return null;

  if (load === "click" && !active) {
    return (
      <div className="flex flex-col items-start gap-3">
        <button type="button" onClick={() => setActive(true)} className="btn-outline">
          {buttonLabel}
        </button>
        {note && <p className="text-xs text-mist-dim">{note}</p>}
      </div>
    );
  }

  return (
    <div ref={box} className="w-full" style={{ minHeight }}>
      <div ref={mount} />
    </div>
  );
}
