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
        { name: "value", type: "text", required: true },
        { name: "en", type: "text", required: true },
        { name: "ar", type: "text", required: true },
        { name: "subEn", type: "text" },
        { name: "subAr", type: "text" },
        { name: "pending", type: "checkbox", defaultValue: true },
      ],
    },
    {
      name: "alaCarte",
      type: "array",
      admin: {
        description:
          "À la carte service groups (business cards, social posts, web builds, retainers). PROCESS and PAYMENT (the 38-day methodology and payment-terms text) stay in lib/offers.ts as static code for now — they're policy/process copy, not pricing that changes with the market, so editing them via dashboard wasn't prioritized in this pass.",
      },
      fields: [
        biField("group", true),
        {
          name: "rows",
          type: "array",
          fields: [
            biField("service", true),
            biField("details", true),
            { name: "price", type: "text", required: true },
          ],
        },
      ],
    },
  ],
};
