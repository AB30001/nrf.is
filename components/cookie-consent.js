"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCookieConsent,
  setCookieConsent
} from "@/lib/cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (getCookieConsent()) return;
    setVisible(true);
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  function choose(value) {
    setCookieConsent(value);
    setEntered(false);
    window.setTimeout(() => setVisible(false), 220);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className={`fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6 transition-all duration-300 ease-out ${
        entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}>
      <div className="mx-auto flex max-w-screen-lg flex-col gap-5 border border-basalt-lighter bg-night-900/95 px-5 py-5 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:flex-row sm:items-center sm:gap-8 sm:px-7 sm:py-6">
        <div className="min-w-0 flex-1">
          <p id="cookie-consent-title" className="kicker">
            Cookie preferences
          </p>
          <p
            id="cookie-consent-desc"
            className="mt-2 text-sm leading-relaxed text-mist-dim">
            We use cookies to improve your experience and measure how the site
            is used. Essential cookies keep the site working; optional cookies
            are only set if you accept. Read more in our{" "}
            <Link
              href="/privacy"
              className="text-bronze underline decoration-bronze/40 underline-offset-2 transition-colors hover:text-bronze-light">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="btn-outline w-full px-6 py-3 sm:w-auto">
            Decline all
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="btn-bronze w-full px-6 py-3 sm:w-auto">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
