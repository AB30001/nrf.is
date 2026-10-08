"use client";

import { useState } from "react";
import { MapIcon } from "@heroicons/react/24/outline";

/**
 * Stay22 map behind a click: nothing from Stay22 loads (and no third-party
 * cookies are set) until the reader asks for the map.
 */
export default function StayMap({ src, placeName }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-outline">
        <MapIcon className="h-4 w-4" aria-hidden="true" />
        Show on map
      </button>
    );
  }

  return (
    <iframe
      src={src}
      title={`Places to stay near ${placeName}`}
      loading="lazy"
      className="mt-6 block h-[420px] w-full border border-basalt-light"
    />
  );
}
