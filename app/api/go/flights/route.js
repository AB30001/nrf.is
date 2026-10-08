import { NextResponse } from "next/server";
import { campaignLabel } from "@/lib/monetize/campaign";
import { aviasalesSearchLink, kiwiSearchLink } from "@/lib/monetize/providers/flightSearch";

export const dynamic = "force-dynamic";

const IATA = /^[A-Z]{3}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Flight search box target: mints a tracked Kiwi.com search link server-side
 * (the API token never reaches the browser) and redirects to it. Falls back to
 * Aviasales if Kiwi doesn't answer in time.
 * GET /api/go/flights?from=OSL&to=REK&depart=2026-11-10&return=2026-11-17&adults=1&label=...
 */
export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const q = {
    from: (params.get("from") || "").toUpperCase(),
    to: (params.get("to") || "").toUpperCase(),
    depart: params.get("depart") || "",
    return: params.get("return") || undefined,
    adults: Math.min(Math.max(parseInt(params.get("adults") || "1", 10) || 1, 1), 9)
  };
  const valid =
    IATA.test(q.from) &&
    IATA.test(q.to) &&
    DATE.test(q.depart) &&
    (!q.return || (DATE.test(q.return) && q.return >= q.depart));
  if (!valid) {
    return NextResponse.json({ error: "Invalid flight search" }, { status: 400 });
  }

  // Only accept labels shaped like ours, so the sub_id can't be abused.
  const label = /^[a-z0-9_]{1,64}$/.test(params.get("label") || "")
    ? params.get("label")
    : campaignLabel("search");

  const url = (await kiwiSearchLink(q, label)) || aviasalesSearchLink(q, label);
  if (!url) {
    return NextResponse.json({ error: "Flight search unavailable" }, { status: 503 });
  }
  return NextResponse.redirect(url, 302);
}
