import type { GlobalConfig } from "payload";
import { revalidateSiteAfterGlobalChange } from "@/lib/revalidate";

export const Settings: GlobalConfig = {
  slug: "settings",
  admin: {
    group: "Site Content",
  },
  hooks: {
    // The About page reads the CV link from here; it had no hook while pages re-rendered every 60 s.
    afterChange: [revalidateSiteAfterGlobalChange],
  },
  fields: [
    {
      type: "collapsible",
      label: "Contact",
      fields: [
        { name: "email", type: "email" },
        { name: "phone", type: "text" },
        { name: "location", type: "text" },
      ],
    },
    {
      type: "collapsible",
      label: "Social Links",
      fields: [
        { name: "linkedin", type: "text" },
        { name: "github", type: "text" },
        { name: "behance", type: "text" },
        { name: "dribbble", type: "text" },
        { name: "x", label: "X / Twitter", type: "text" },
      ],
    },
    {
      type: "collapsible",
      label: "Files",
      fields: [{ name: "cv", label: "CV (PDF)", type: "upload", relationTo: "media" }],
    },
    {
      type: "collapsible",
      label: "Default SEO",
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" },
        { name: "ogImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
