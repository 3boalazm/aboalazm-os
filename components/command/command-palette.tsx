"use client";

/**
 * COMMAND PALETTE — Ctrl/⌘ + K. The OS already has a terminal (Ctrl + `);
 * this is its quick-launcher: jump to any page or reel, or switch language,
 * without touching the nav. Static index — no network on open.
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { localeHref, type Locale } from "@/lib/locale";
import { REELS } from "@/features/reels/reels.data";

type Item = { id: string; group: [string, string]; label: [string, string]; hint?: string; run: () => void; keywords?: string };

const PAGES: [href: string, en: string, ar: string, kw?: string][] = [
  ["/", "Home", "الرئيسية"],
  ["/work", "Work", "الأعمال", "portfolio projects case studies"],
  ["/services", "Services", "الخدمات"],
  ["/services/brand-identity", "Brand identity", "الهوية البصرية", "logo branding"],
  ["/services/websites", "Websites & stores", "المواقع والمتاجر", "web ecommerce"],
  ["/services/systems", "Business systems", "أنظمة التشغيل", "erp dashboard automation"],
  ["/pricing", "Pricing", "الأسعار", "tiers packages cost"],
  ["/process", "Process — the 38-day method", "المنهج — 38 يوم", "timeline phases"],
  ["/reels", "Reels", "ريلز", "video"],
  ["/writing", "Writing", "المقالات", "blog articles"],
  ["/about", "About", "عن الاستوديو"],
  ["/for-hiring", "For hiring teams", "للتوظيف", "cv resume recruiter"],
  ["/labs", "Labs", "المعمل", "tools experiments"],
  ["/resources", "Resources", "الموارد", "downloads"],
  ["/books", "Library", "المكتبة"],
  ["/partnership", "Partnership & support", "الشراكة والدعم"],
  ["/contact", "Book a discovery call", "احجز مكالمة اكتشاف", "contact start project hire"],
];

export function CommandPalette() {
  const { lang, setLang } = useLang();
  const router = useRouter();
  const ar = lang === "ar";
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    setQ("");
    setCursor(0);
  }, []);

  const items = React.useMemo<Item[]>(() => {
    const go = (href: string) => () => router.push(localeHref(href, lang));
    const pages: Item[] = PAGES.map(([href, en, arr, kw]) => ({
      id: href,
      group: ["Go to", "انتقل إلى"],
      label: [en, arr],
      hint: href,
      keywords: kw,
      run: go(href),
    }));
    const reels: Item[] = REELS.map((r) => ({
      id: `reel:${r.slug}`,
      group: ["Reels", "ريلز"],
      label: [r.title.en, r.title.ar],
      hint: "▶",
      keywords: r.topics.join(" "),
      run: go(`/reels?r=${r.slug}`),
    }));
    const langs: Item[] = (["en", "ar", "ms"] as Locale[])
      .filter((l) => l !== lang)
      .map((l) => ({
        id: `lang:${l}`,
        group: ["Actions", "أوامر"],
        label: l === "ar" ? ["Switch to Arabic", "العربية"] : l === "ms" ? ["Switch to Bahasa Melayu", "الملايو"] : ["Switch to English", "الإنجليزية"],
        hint: l.toUpperCase(),
        keywords: "language لغة bahasa",
        run: () => setLang(l),
      }));
    const actions: Item[] = [
      {
        id: "terminal",
        group: ["Actions", "أوامر"],
        label: ["Open the terminal", "افتح الترمينال"],
        hint: "Ctrl `",
        keywords: "console cli",
        run: () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "`", ctrlKey: true, bubbles: true })),
      },
      ...langs,
    ];
    return [...pages, ...reels, ...actions];
  }, [lang, router, setLang]);

  const results = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((it) => `${it.label[0]} ${it.label[1]} ${it.hint ?? ""} ${it.keywords ?? ""}`.toLowerCase().includes(needle));
  }, [items, q]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("smooth-scroll:stop"));
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.dispatchEvent(new Event("smooth-scroll:start"));
    };
  }, [open]);

  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) return null;

  const run = (it: Item | undefined) => {
    if (!it) return;
    close();
    it.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[cursor]);
    }
  };

  let lastGroup = "";
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ar ? "بحث وأوامر" : "Search and commands"}
      className="fixed inset-0 z-[110] flex items-start justify-center bg-black/55 px-2 pt-[12vh] backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onKeyDown={onKeyDown}
    >
      <div dir={ar ? "rtl" : "ltr"} className="glass w-full max-w-[36rem] overflow-hidden rounded-panel shadow-panel">
        <div className="flex items-center gap-2 border-b border-border-subtle px-2 py-1.5">
          <span aria-hidden className="font-mono text-label text-accent">⌘K</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            placeholder={ar ? "ابحث عن صفحة، ريل، أو أمر…" : lang === "ms" ? "Cari halaman, reel atau arahan…" : "Search pages, reels, commands…"}
            aria-controls="cmdk-list"
            className="w-full bg-transparent py-1 text-body text-text-primary placeholder:text-text-tertiary !outline-none focus:outline-none"
          />
          <kbd className="rounded-card border border-border-default px-1 font-mono text-micro text-text-tertiary">ESC</kbd>
        </div>
        <ul id="cmdk-list" ref={listRef} role="listbox" data-lenis-prevent className="max-h-[52vh] overflow-y-auto p-1">
          {results.length === 0 ? (
            <li className="px-2 py-3 text-body-sm text-text-tertiary">{ar ? "مفيش نتيجة." : "No match."}</li>
          ) : (
            results.map((it, i) => {
              const group = it.group[ar ? 1 : 0];
              const head = group !== lastGroup;
              lastGroup = group;
              return (
                <React.Fragment key={it.id}>
                  {head ? (
                    <li role="presentation" className="px-2 pb-0.5 pt-1.5 font-mono text-micro uppercase tracking-[0.12em] text-text-ghost">
                      {group}
                    </li>
                  ) : null}
                  <li role="option" aria-selected={i === cursor} data-index={i}>
                    <button
                      type="button"
                      onClick={() => run(it)}
                      onMouseMove={() => setCursor(i)}
                      className={`flex w-full items-center justify-between gap-3 rounded-card px-2 py-1 text-start text-body-sm transition-colors ${
                        i === cursor ? "bg-accent/15 text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      <span>{it.label[ar ? 1 : 0]}</span>
                      <span dir="ltr" className="flex items-center gap-1 font-mono text-micro text-text-tertiary">
                        {it.hint}
                        {i === cursor ? <Icon name="arrow-right" /> : null}
                      </span>
                    </button>
                  </li>
                </React.Fragment>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
