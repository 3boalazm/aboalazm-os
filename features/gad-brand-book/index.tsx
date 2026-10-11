import { GadBrandBook } from "./gad-brand-book";
import { BrandBookPanelHeader } from "./panel-header";

/**
 * The GAD brand book as a panel of the GAD case study (id="brand-book").
 * Same shell as the case-study panels so the sidebar rail can track it, but
 * not `data-panel`: that attribute triggers a blur-in on the whole element,
 * which is wasteful on a panel this tall.
 */
export function GadBrandBookPanel({ index = "04" }: { index?: string }) {
  return (
    <section id="brand-book" className="flex scroll-mt-16 flex-col gap-4 border-t border-border-subtle py-8">
      <BrandBookPanelHeader index={index} />
      <div className="mt-4 overflow-hidden rounded-panel border border-border-subtle">
        <GadBrandBook />
      </div>
    </section>
  );
}
