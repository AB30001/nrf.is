import { NextResponse } from "next/server";

/**
 * City/airport suggestions for the flight search box, proxied so visitors'
 * browsers never call a third party (and results are cached a day).
 * GET /api/places?term=osl
 */
export async function GET(request) {
  const term = (request.nextUrl.searchParams.get("term") || "").trim().slice(0, 40);
  if (term.length < 2) return NextResponse.json([]);

  const url = new URL("https://autocomplete.travelpayouts.com/places2");
  url.search = new URLSearchParams({ term, locale: "en" }).toString();
  url.searchParams.append("types[]", "city");
  url.searchParams.append("types[]", "airport");

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 },
      signal: AbortSignal.timeout(3000)
    });
    const places = res.ok ? await res.json() : [];
    return NextResponse.json(
      places.slice(0, 7).map(p => ({
        code: p.code,
        name: p.name,
        city: p.city_name || p.name,
        country: p.country_name,
        type: p.type
      })),
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch {
    return NextResponse.json([]);
  }
}
