import IframePreview from "./previews/iframe";
import TablePreview from "./previews/table";

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default {
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    {
      title: "Block",
      type: "block",
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: "Normal", value: "normal" },
        // {title: 'H1', value: 'h1'},
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" }
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" }
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" }
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            name: "internalLink",
            type: "object",
            title: "Internal link",
            fields: [
              {
                name: "reference",
                type: "reference",
                title: "Reference",
                to: [
                  { type: "post" }
                  // other types you may want to link to
                ]
              }
            ]
          },
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url"
              },
              {
                title: "rel",
                name: "rel",
                type: "string",
                description: "Controls how search engines treat this link",
                options: {
                  list: [
                    { title: "Follow (default)", value: "" },
                    { title: "Nofollow", value: "nofollow" },
                    { title: "Sponsored / Affiliate", value: "sponsored" },
                    { title: "Nofollow + Sponsored", value: "nofollow sponsored" }
                  ]
                }
              },
              {
                title: "Open in new tab",
                name: "blank",
                type: "boolean"
              }
            ]
          }
        ]
      }
    },
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.

    {
      type: "image",
      options: { hotspot: true }
    },
    {
      type: "code"
    },
    {
      type: "object",
      name: "embed",
      title: "Embed",
      fields: [
        {
          name: "url",
          type: "url",
          description:
            "Enter the URL to Embed \r\n(eg: https://youtube.com/embed/xxx or https://open.spotify.com/embed/track/xxxx)"
        },
        {
          name: "height",
          type: "number",
          description:
            "Enter Required Height for this Embed. Leave it blank for 16:9 ratio."
        }
      ],
      components: {
        preview: IframePreview
      },
      preview: {
        select: { url: "url", height: "height" }
      }
    },
    {
      name: "tables",
      title: "Table",
      type: "object",
      fields: [
        {
          name: "table",
          title: "Add Table",
          description:
            "The first row will be treated as the header. If you want to skip, just leave the first row empty.",
          type: "table"
        }
      ],
      components: {
        preview: TablePreview
      },
      preview: {
        select: { table: "table" }
      }
    },
    {
      // Partner offers (Viator tours / Tiqets tickets). Placing one replaces
      // the automatic block the site adds at the end of the post.
      name: "tourWidget",
      title: "Tours & tickets (affiliate)",
      type: "object",
      fields: [
        { name: "heading", type: "string", title: "Heading", initialValue: "Recommended tours" },
        {
          name: "searchTerm",
          type: "string",
          title: "Viator search",
          description: 'What tours to show, e.g. "Golden Circle". Leave empty for popular tours.'
        },
        {
          name: "ticketQuery",
          type: "string",
          title: "Tiqets search",
          description: 'Attraction tickets to mix in, e.g. "Sky Lagoon". Optional.'
        },
        {
          name: "provider",
          type: "string",
          title: "Source",
          initialValue: "auto",
          options: {
            list: [
              { title: "Both (auto)", value: "auto" },
              { title: "Viator only", value: "viator" },
              { title: "Tiqets only", value: "tiqets" }
            ],
            layout: "radio"
          }
        },
        {
          name: "count",
          type: "number",
          title: "Number of cards",
          initialValue: 3,
          validation: Rule => Rule.min(1).max(6)
        }
      ],
      preview: {
        select: { heading: "heading", searchTerm: "searchTerm", ticketQuery: "ticketQuery" },
        prepare: ({ heading, searchTerm, ticketQuery }) => ({
          title: `🎟 ${heading || "Tours & tickets"}`,
          subtitle:
            [searchTerm && `Viator: ${searchTerm}`, ticketQuery && `Tiqets: ${ticketQuery}`]
              .filter(Boolean)
              .join(" · ") || "Popular tours"
        })
      }
    },
    {
      // Stay22: one link to the best booking site per reader, plus a map.
      name: "stayBox",
      title: "Where to stay (affiliate)",
      type: "object",
      fields: [
        {
          name: "placeName",
          type: "string",
          title: "Place",
          description: 'Shown as "Places to stay near …", e.g. "Vík".',
          validation: Rule => Rule.required()
        },
        { name: "lat", type: "number", title: "Latitude", description: "Optional, more precise than the name." },
        { name: "lng", type: "number", title: "Longitude" },
        { name: "heading", type: "string", title: "Heading (optional)" },
        { name: "showMap", type: "boolean", title: "Show map button", initialValue: true }
      ],
      preview: {
        select: { placeName: "placeName" },
        prepare: ({ placeName }) => ({ title: `🛏 Places to stay near ${placeName || "…"}` })
      }
    },
    {
      // Travelpayouts / Aviasales: cheapest return fares from big cities.
      name: "flightPrices",
      title: "Flight prices (affiliate)",
      type: "object",
      fields: [
        { name: "heading", type: "string", title: "Heading (optional)" },
        {
          name: "origins",
          type: "array",
          title: "From cities",
          description: "City codes, e.g. LON, NYC, PAR. Leave empty for the default list.",
          of: [{ type: "string" }],
          options: { layout: "tags" }
        }
      ],
      preview: {
        select: { origins: "origins" },
        prepare: ({ origins }) => ({
          title: "✈ Flight prices",
          subtitle: origins?.length ? origins.join(", ") : "Default cities"
        })
      }
    },
    {
      // Travelpayouts brands: car rental, eSIM, insurance, airport transfer.
      name: "essentialsBox",
      title: "Travel essentials (affiliate)",
      type: "object",
      fields: [
        {
          name: "items",
          type: "array",
          title: "Boxes",
          of: [{ type: "string" }],
          initialValue: ["car", "esim", "insurance"],
          options: {
            list: [
              { title: "Car rental", value: "car" },
              { title: "eSIM", value: "esim" },
              { title: "Travel insurance", value: "insurance" },
              { title: "Airport transfer", value: "transfer" }
            ]
          }
        }
      ],
      preview: {
        select: { items: "items" },
        prepare: ({ items }) => ({ title: "🧳 Travel essentials", subtitle: (items || []).join(", ") })
      }
    },
    {
      // Tiqets attraction tickets as a list (photo, tagline, price, discount).
      name: "ticketList",
      title: "Attraction tickets (affiliate)",
      type: "object",
      fields: [
        { name: "heading", type: "string", title: "Heading", initialValue: "Top attractions" },
        {
          name: "query",
          type: "string",
          title: "Tiqets search",
          description: 'e.g. "Sky Lagoon" or "museum". Leave empty for Iceland bestsellers.'
        },
        {
          name: "count",
          type: "number",
          title: "Number of tickets",
          initialValue: 4,
          validation: Rule => Rule.min(1).max(8)
        }
      ],
      preview: {
        select: { heading: "heading", query: "query" },
        prepare: ({ heading, query }) => ({
          title: `🎫 ${heading || "Attraction tickets"}`,
          subtitle: query ? `Tiqets: ${query}` : "Bestsellers"
        })
      }
    },
    {
      // Flight search box: opens real Kiwi.com results (Aviasales fallback).
      name: "flightSearch",
      title: "Flight search box (affiliate)",
      type: "object",
      fields: [{ name: "heading", type: "string", title: "Heading (optional)" }],
      preview: {
        select: { heading: "heading" },
        prepare: ({ heading }) => ({ title: `🔎 ${heading || "Flight search box"}` })
      }
    },
    {
      // Localrent (via Travelpayouts): car search form + optional full catalogue.
      name: "carRental",
      title: "Car rental search (affiliate)",
      type: "object",
      fields: [
        { name: "heading", type: "string", title: "Heading", initialValue: "Rent a car in Iceland" },
        { name: "text", type: "text", rows: 2, title: "Intro text (optional)" },
        {
          name: "showCatalog",
          type: "boolean",
          title: 'Show "Browse all cars" button',
          initialValue: true
        }
      ],
      preview: {
        select: { heading: "heading" },
        prepare: ({ heading }) => ({ title: `🚗 ${heading || "Car rental search"}` })
      }
    }
  ]
};
