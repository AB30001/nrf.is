"use client";

import { Suspense, useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

const GOATCOUNTER_ENDPOINT = "https://nrfis.goatcounter.com/count";
const GOATCOUNTER_SCRIPT = "https://gc.zgo.at/count.js";

let lastCounted = null;

// count.js only counts the initial page load. The App Router navigates
// client-side, so `no_onload` turns that off and every view is reported here
// instead. The path is passed explicitly because count.js would otherwise read
// the canonical <link>, which can still belong to the previous page mid-navigation.
// Skips repeats so a remount can't double-count the same view.
function countPageview() {
  const path = window.location.pathname + window.location.search;
  if (path === lastCounted || !window.goatcounter?.count) return;
  lastCounted = path;
  window.goatcounter.count({ path });
}

// Affiliate clicks are counted as GoatCounter events: aff/{provider}/{label}.
// One delegated listener covers links rendered anywhere, now or later.
// auxclick catches middle-click "open in new tab".
function countAffiliateClick(event) {
  const link = event.target.closest?.("a[data-aff]");
  if (!link || !window.goatcounter?.count) return;
  const { aff, affLabel } = link.dataset;
  window.goatcounter.count({
    path: ["aff", aff, affLabel || window.location.pathname.replace(/^\//, "")]
      .filter(Boolean)
      .join("/"),
    title: link.hostname,
    event: true
  });
}

function AffiliateClickTracker() {
  useEffect(() => {
    document.addEventListener("click", countAffiliateClick);
    document.addEventListener("auxclick", countAffiliateClick);
    return () => {
      document.removeEventListener("click", countAffiliateClick);
      document.removeEventListener("auxclick", countAffiliateClick);
    };
  }, []);

  return null;
}

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Runs before count.js has loaded on the first render; onReady below covers
  // that view once the script is in.
  useEffect(() => {
    countPageview();
  }, [pathname, searchParams]);

  return null;
}

/**
 * GoatCounter analytics: cookie-free and anonymous, so it needs no consent
 * banner. count.js ignores localhost, so nothing is sent from `next dev`.
 */
export default function GoatCounter() {
  return (
    <>
      {/* useSearchParams needs a Suspense boundary so static pages stay static. */}
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
      <AffiliateClickTracker />
      <Script
        src={GOATCOUNTER_SCRIPT}
        data-goatcounter={GOATCOUNTER_ENDPOINT}
        data-goatcounter-settings='{"no_onload": true}'
        strategy="afterInteractive"
        onReady={countPageview}
      />
    </>
  );
}
