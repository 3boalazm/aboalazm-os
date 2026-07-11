"use client";

/* Renders inside the (site) route group's layout (Nav/Footer/providers
 * already mounted). See features/errors/not-found-content.tsx for the
 * actual page, shared with the top-level app/not-found.tsx fallback. */

import { NotFoundContent } from "@/features/errors/not-found-content";

export default function NotFound() {
  return <NotFoundContent />;
}
