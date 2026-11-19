import type { CollectionConfig } from "payload";
import { revalidateSiteAfterChange, revalidateSiteAfterDelete } from "@/lib/revalidate";

/**
 * MEDIA — every uploaded image/file in the system routes through here
 * (case study galleries, project thumbnails, team photos, CV, OG images).
 * Storage adapter (local disk here / Vercel Blob in production) is wired
 * in payload.config.ts, not here — this file only defines the shape.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Portfolio",
    useAsTitle: "alt",
    description: "Image library — always fill alt/altAr for accessibility.",
  },
  access: {
    read: () => true, // public site needs to render these images
  },
  hooks: {
    // Pages keep a 24 h render TTL; a replaced image or edited alt text must show at once.
    afterChange: [revalidateSiteAfterChange],
    afterDelete: [revalidateSiteAfterDelete],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "altAr",
      type: "text",
      admin: { description: "Arabic alt text" },
    },
  ],
  upload: {
    // Payload auto-captures width/height/mimeType/filesize on upload —
    // no need to store those manually (GalleryImage.w/h in the old types
    // become redundant once media is a real relationship).
    mimeTypes: ["image/*", "application/pdf"],
  },
};
