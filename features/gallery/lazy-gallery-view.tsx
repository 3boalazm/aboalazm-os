"use client";

/**
 * The Brand Wall is opt-in on /work and /work/design (the default view is the
 * index), so its code is split out and only downloaded when someone asks for it.
 * `preloadGalleryView` lets the toggle warm the chunk on hover / focus / touch so
 * opening the wall does not wait on the network.
 */
import dynamic from "next/dynamic";

export const preloadGalleryView = () => import("./gallery-view");

export const LazyGalleryView = dynamic(() => preloadGalleryView().then((m) => m.GalleryView), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="min-h-[40vh]" />,
});
