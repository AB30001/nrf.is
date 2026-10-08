import { monetize } from "./config";

/**
 * Tracking label for one placement: {siteKey}_{slug}_{placement}.
 * Underscores only — Stay22 splits labels on hyphens — and capped at 64 chars.
 */
export function campaignLabel(slug?: string, placement?: string) {
  return [monetize.siteKey, slug, placement]
    .filter(Boolean)
    .join("_")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 64);
}
