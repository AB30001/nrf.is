/**
 * Picks offers for a post that has no hand-placed widget, from keywords in its
 * slug and title. First match wins, so specific topics go above broad ones.
 * Site-specific: each new site gets its own lists (see travel-monetize.md §8).
 */
export type Place = { name: string; lat: number; lng: number };

export type Topic = {
  heading: string;
  viator?: string; // Viator free-text search; "" = featured tours
  tiqets?: string; // Tiqets query; when set, tickets can lead
  stay?: Place; // where the Stay22 box points; defaults to Reykjavík
};

export type Essential = "car" | "esim" | "insurance" | "transfer";

export type Plan = Omit<Topic, "stay"> & {
  stay: Place | null; // null when flights take the third slot
  essentials: Essential[];
  flights: boolean;
};

const REYKJAVIK: Place = { name: "Reykjavík", lat: 64.1466, lng: -21.9426 };
const VIK: Place = { name: "Vík", lat: 63.4186, lng: -19.006 };

const TOPICS: [RegExp, Topic][] = [
  [/blue.?lagoon/, { heading: "Blue Lagoon tickets", tiqets: "Blue Lagoon", viator: "Blue Lagoon", stay: { name: "the Blue Lagoon", lat: 63.8804, lng: -22.4495 } }],
  [/sky.?lagoon|hot.?spring|geothermal/, { heading: "Lagoon & hot spring tickets", tiqets: "lagoon", viator: "hot springs" }],
  [/silfra|snorkel/, { heading: "Silfra snorkeling tours", viator: "Silfra snorkeling", stay: { name: "Þingvellir", lat: 64.2559, lng: -21.1299 } }],
  [/golden.?circle/, { heading: "Golden Circle tours", viator: "Golden Circle", stay: { name: "Selfoss", lat: 63.9331, lng: -20.9971 } }],
  [/northern.?lights|aurora/, { heading: "Northern Lights tours", viator: "Northern Lights", stay: { name: "Hella", lat: 63.8353, lng: -20.3995 } }],
  [/puffin|bird/, { heading: "Puffin & bird-watching tours", viator: "puffin" }],
  [/whale/, { heading: "Whale watching tours", viator: "whale watching", stay: { name: "Húsavík", lat: 66.0449, lng: -17.3389 } }],
  [/jokulsarlon|glacier|diamond.?beach/, { heading: "Glacier lagoon & ice cave tours", viator: "Jokulsarlon glacier lagoon", stay: { name: "Jökulsárlón", lat: 64.0485, lng: -16.1794 } }],
  [/volcano|eruption|reykjanes/, { heading: "Volcano tours", viator: "volcano", stay: { name: "Reykjanesbær", lat: 63.9998, lng: -22.5583 } }],
  [/snaefellsnes/, { heading: "Snæfellsnes tours", viator: "Snaefellsnes", stay: { name: "Grundarfjörður", lat: 64.9241, lng: -23.2587 } }],
  [/westfjords/, { heading: "Westfjords tours", viator: "Westfjords", stay: { name: "Ísafjörður", lat: 66.0749, lng: -23.1350 } }],
  [/horse/, { heading: "Icelandic horse riding tours", viator: "horse riding" }],
  [/food|dish|taste/, { heading: "Food tours in Reykjavík", viator: "food tour Reykjavik" }],
  [/south.?coast|black.?sand|reynisfjara|waterfall/, { heading: "South Coast tours", viator: "South Coast", stay: VIK }],
  [/winter|january|december/, { heading: "Winter tours in Iceland", viator: "ice cave" }],
  [/folklore|elves|troll/, { heading: "Folklore & walking tours", viator: "Reykjavik walking tour" }],
  [/reykjavik/, { heading: "Things to do in Reykjavík", tiqets: "Reykjavik", viator: "Reykjavik" }],
  [/day.?trip/, { heading: "Day trips from Reykjavík", viator: "day trip from Reykjavik" }],
  [/ring.?road|itinerary|road.?trip/, { heading: "Multi-day Iceland tours", viator: "Ring Road" }]
];

const DEFAULT_TOPIC: Topic = { heading: "Popular tours in Iceland", viator: "" };

// Self-drive topics lead with car rental, planning topics with eSIM and
// insurance, city topics with the airport transfer.
const ESSENTIALS: [RegExp, Essential[]][] = [
  [/car|driv|road.?trip|ring.?road|itinerary|golden.?circle|south.?coast|westfjords|snaefellsnes|waterfall/, ["car", "esim", "insurance"]],
  [/pack|best.?time|month|january|winter|tips|safe|season/, ["esim", "insurance", "car"]],
  [/reykjavik|blue.?lagoon|day.?trip|food|folklore/, ["transfer", "esim", "car"]]
];
const DEFAULT_ESSENTIALS: Essential[] = ["car", "esim", "insurance"];

const FLIGHTS = /best.?time|month|january|winter|northern.?lights|aurora|season/;

function normalise(post: { slug?: { current?: string }; title?: string }) {
  return `${post.slug?.current || ""} ${post.title || ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Jökulsárlón -> jokulsarlon
    .replace(/[^a-z0-9]+/g, " ");
}

/** Everything the automatic post-end block shows for this post. */
export function planFor(post: { slug?: { current?: string }; title?: string }): Plan {
  const text = normalise(post);
  const topic = TOPICS.find(([re]) => re.test(text))?.[1] ?? DEFAULT_TOPIC;
  const flights = FLIGHTS.test(text);
  return {
    ...topic,
    // At most 3 partner blocks per post: tours, essentials, then stays or flights.
    stay: flights ? null : topic.stay || REYKJAVIK,
    essentials: ESSENTIALS.find(([re]) => re.test(text))?.[1] ?? DEFAULT_ESSENTIALS,
    flights
  };
}
