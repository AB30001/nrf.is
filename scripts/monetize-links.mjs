// Checks this site's Travelpayouts setup against the Links API:
//  - is the project (TRAVELPAYOUTS_TRS) subscribed to each brand we link to?
//  - do the campaign_id / p values in lib/monetize/links.ts (TP_BRANDS) still match?
//
// Usage: node scripts/monetize-links.mjs   (reads .env.local)
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter(line => /^[A-Z0-9_]+=/.test(line))
    .map(line => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).trim()])
);
const token = env.TRAVELPAYOUTS_API_TOKEN;
const marker = Number(env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER);
const trs = Number(env.TRAVELPAYOUTS_TRS);
if (!token || !marker || !trs) {
  console.error("Set TRAVELPAYOUTS_API_TOKEN, NEXT_PUBLIC_TRAVELPAYOUTS_MARKER and TRAVELPAYOUTS_TRS in .env.local");
  process.exit(1);
}

// One known-good page per brand in TP_BRANDS.
const SAMPLES = {
  aviasales: "https://www.aviasales.com/",
  tiqets: "https://www.tiqets.com/en/",
  localrent: "https://www.localrent.com/en/",
  saily: "https://saily.com/",
  airalo: "https://www.airalo.com/",
  ekta: "https://ektatraveling.com/",
  welcomepickups: "https://www.welcomepickups.com/",
  // Not in TP_BRANDS yet; listed to see if the project can switch to them.
  discovercars: "https://www.discovercars.com/",
  getyourguide: "https://www.getyourguide.com/",
  klook: "https://www.klook.com/",
  yesim: "https://www.yesim.app/"
};

const linksTs = readFileSync(new URL("../lib/monetize/links.ts", import.meta.url), "utf8");
const known = Object.fromEntries(
  [...linksTs.matchAll(/(\w+): \{ campaign_id: (\d+), p: (\d+) \}/g)].map(([, b, c, p]) => [
    b,
    { campaign_id: Number(c), p: Number(p) }
  ])
);

const entries = Object.entries(SAMPLES);
const rows = [];
for (let i = 0; i < entries.length; i += 10) {
  const batch = entries.slice(i, i + 10);
  const res = await fetch("https://api.travelpayouts.com/links/v1/create", {
    method: "POST",
    headers: { "X-Access-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify({ trs, marker, shorten: false, links: batch.map(([, url]) => ({ url })) })
  });
  const data = await res.json();
  if (!data.result) {
    console.error("Links API error:", data);
    process.exit(1);
  }
  data.result.links.forEach((link, j) => {
    const brand = batch[j][0];
    const params = link.partner_url ? new URL(link.partner_url).searchParams : null;
    const live = params && { campaign_id: Number(params.get("campaign_id")), p: Number(params.get("p")) };
    const ours = known[brand];
    let status = link.code === "success" ? "subscribed" : link.message;
    if (ours && live && (ours.campaign_id !== live.campaign_id || ours.p !== live.p)) {
      status += `  ⚠ TP_BRANDS has ${ours.campaign_id}/${ours.p}, API says ${live.campaign_id}/${live.p}`;
    }
    rows.push({ brand, "in TP_BRANDS": ours ? "yes" : "", status });
  });
}
console.log(`Travelpayouts project ${trs}, marker ${marker}`);
console.table(rows);
