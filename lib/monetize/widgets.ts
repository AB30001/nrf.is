/**
 * Travelpayouts script widgets (tpscr.com), rendered through PartnerWidget.
 * Copied from the TP widget builder with this site's trs/shmarker, then set to
 * the destination. Localrent IDs: Iceland = country 116, Keflavík Airport =
 * city 120921, Reykjavík = 59441 (from localrent.com/api/v2/countries and the
 * /en/iceland/ page). Empty src = hidden.
 */
export const widgets = {
  // Localrent "Rental Cars Search Form" (promo 4322): ~90 KB, sets no cookies
  // or storage, so it loads when scrolled into view.
  carSearch:
    "https://tpscr.com/content?trs=535987&shmarker=735778&powered_by=true&country=116&city=120921&lang=en&width=100&background=light&logo=true&header=true&gearbox=false&cars=false&border=true&footer=true&campaign_id=87&promo_id=4322",

  // Localrent "White Label Widget" (promo 2466): the full car catalogue. It
  // sets cookies and localStorage, so it only loads on click.
  carCatalog:
    "https://tpscr.com/content?trs=535987&shmarker=735778&locale=en&country=116&city=120921&powered_by=true&campaign_id=87&promo_id=2466"
};
