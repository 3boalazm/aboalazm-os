import type { Field, GlobalConfig } from "payload";

/**
 * OFFERS — global (singleton), mirrors lib/offers.ts `TIERS`.
 * The old type used `Bi = readonly [en, ar]` tuples for every bilingual
 * string. Payload has no tuple field, so each `Bi` becomes a small
 * `{ en, ar }` group — same data, editor-friendly shape.
 */
const biField = (name: string, required = false): Field => ({
  name,
  type: "group",
  fields: [
    { name: "en", type: "text", required },
    { name: "ar", type: "text", required },
  ],
});

export const Offers: GlobalConfig = {
  slug: "offers",
  admin: {
    group: "Site Content",
  },
  fields: [
    {
      name: "tiers",
      type: "array",
      fields: [
        biField("tag", true),
        biField("name", true),
        { name: "price", type: "text", required: true },
        biField("priceNote", true),
        biField("bestFor", true),
        biField("duration", true),
        { name: "payment", type: "text", required: true },
        { name: "recommended", type: "checkbox", defaultValue: false },
        biField("includesHead", true),
        {
          name: "includes",
          type: "array",
          fields: [{ name: "en", type: "text" }, { name: "ar", type: "text" }],
        },
        {
          name: "excludes",
          type: "array",
          fields: [{ name: "en", type: "text" }, { name: "ar", type: "text" }],
        },
      ],
    },
    {
      name: "investmentValue",
      type: "array",
      admin: {
        description:
          "Feeds the /pricing InvestmentValue section. Leave `pending` on until real measurement data replaces the placeholder — the UI shows a footnote whenever pending is true.",
      },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "labelAr", type: "text" },
        { name: "value", type: "text", required: true },
        { name: "pending", type: "checkbox", defaultValue: true },
      ],
    },
  ],
};
