import "server-only";

const DAY = 60 * 60 * 24;

/**
 * Partner API fetch: cached by Next for a day, 3s timeout, and never throws —
 * a failing partner returns null so the widget falls back to a plain link.
 */
export async function partnerFetch<T = any>(
  url: string,
  init: RequestInit = {},
  revalidate = DAY
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(3000),
      next: { revalidate }
    });
    if (!res.ok) {
      console.warn(`[monetize] ${url} -> HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[monetize] ${url} -> ${(error as Error).message}`);
    return null;
  }
}
