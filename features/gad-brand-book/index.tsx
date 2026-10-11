import { GadBrandBook as Document } from "./gad-brand-book";
import { BrandBookPanelHeader } from "./panel-header";

/**
 * The GAD guidelines document, shown inside the case study's System panel
 * (the panel shell, label and animation belong to the case study). The
 * `#brand-book` anchor is what the old standalone URL redirects to.
 */
export function GadBrandBook() {
  return (
    <div id="brand-book" className="flex scroll-mt-16 flex-col gap-4">
      <BrandBookPanelHeader />
      <div className="mt-2 overflow-hidden rounded-panel border border-border-subtle">
        <Document />
      </div>
    </div>
  );
}
