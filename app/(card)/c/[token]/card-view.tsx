"use client";

import { useEffect, useState } from "react";
import type { CardAction, CardActionKind, SmartCard } from "@/lib/card/cards";

type Lang = 0 | 1;

const ICONS: Record<CardActionKind | "save" | "share", string> = {
  whatsapp: "M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm-3 5.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.6.7c-.1.2-.2.3 0 .6a6 6 0 0 0 2.9 2.500c.3.1.5.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.8.900c.2.1.4.2.4.3 0 .5-.2 1.3-.8 1.7-.6.4-1.4.6-2.9.1A9 9 0 0 1 8.4 12c-.7-1-.9-1.9-.9-2.5 0-.6.3-1 .5-1.300Z",
  call: "M6.5 3h3l1.5 4.5-2 1.500a12 12 0 0 0 6 6l1.5-2 4.5 1.500v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2Z",
  email: "M3 6h18v12H3V6Zm1.8 1.500L12 13l7.2-5.5",
  portfolio: "M4 5h16v14H4V5Zm0 4h16M8 13h5M8 16h8",
  linkedin: "M5 9h3v10H5V9Zm1.5-5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.400ZM10.5 9h2.900v1.400c.5-.9 1.6-1.7 3.2-1.7 3 0 3.4 2 3.4 4.500V19h-3v-5c0-1.3-.3-2.3-1.6-2.300S13.5 12.7 13.5 14v5h-3V9Z",
  behance: "M3 6h6c2 0 3.3 1 3.3 2.8 0 1.2-.6 2-1.5 2.4 1.3.3 2.1 1.4 2.1 2.8 0 2-1.5 3-3.6 3H3V6Zm2.5 2v2.500h3c.9 0 1.4-.5 1.4-1.300S9.4 8 8.5 8h-3Zm0 4.500V15h3.300c1 0 1.6-.4 1.6-1.3 0-.8-.6-1.2-1.6-1.200H5.500ZM15 7h5v1.200h-5V7Zm2.6 2.500c2.4 0 3.7 1.8 3.5 4.300h-5.300c.1 1 .8 1.6 1.8 1.6.8 0 1.3-.3 1.6-.900h1.800c-.4 1.5-1.7 2.5-3.4 2.5-2.2 0-3.7-1.5-3.7-3.8 0-2.2 1.5-3.7 3.7-3.700Zm-1.8 3h3.400c-.1-.9-.7-1.5-1.7-1.5-.9 0-1.5.6-1.7 1.500Z",
  location: "M12 3a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6Zm0 3.800a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.400Z",
  save: "M12 4v10m0 0-4-4m4 4 4-4M5 19h14",
  share: "M12 15V4m0 0L8 8m4-4 4 4M5 13v6h14v-6",
};
const STROKED = new Set(["email", "portfolio", "save", "share"]);

function Icon({ name }: { name: keyof typeof ICONS }) {
  const stroked = STROKED.has(name);
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill={stroked ? "none" : "currentColor"} stroke={stroked ? "currentColor" : "none"} strokeWidth={stroked ? 1.7 : 0} strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

const T = {
  save: ["Save contact", "حفظ جهة الاتصال"],
  share: ["Share", "مشاركة"],
  copied: ["Link copied", "تم نسخ الرابط"],
  connect: ["Connect", "تواصل"],
  elsewhere: ["Elsewhere", "روابط"],
  card: ["Card", "كارت"],
  active: ["Active", "مفعّل"],
  switchTo: ["عربي", "English"],
  foot: ["This page updates without reprinting the card.", "هذه الصفحة تتحدّث دون إعادة طباعة الكارت."],
} as const;

function external(action: CardAction) {
  return /^https?:/.test(action.href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export function CardView({ card }: { card: SmartCard }) {
  const [lang, setLang] = useState<Lang>(0);
  const [copied, setCopied] = useState(false);

  // Arabic phones get Arabic first; the server HTML stays English (static file).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("sc-lang");
      if (saved === "ar" || (!saved && navigator.language?.toLowerCase().startsWith("ar"))) setLang(1);
    } catch { /* private mode: keep the default */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang ? "ar" : "en";
    document.documentElement.dir = lang ? "rtl" : "ltr";
  }, [lang]);

  function toggleLang() {
    const next: Lang = lang ? 0 : 1;
    setLang(next);
    try { window.localStorage.setItem("sc-lang", next ? "ar" : "en"); } catch { /* ignore */ }
  }

  async function share() {
    const data = { title: card.name[lang], text: `${card.name[lang]} — ${card.role[lang]}`, url: window.location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { /* the visitor closed the share sheet */ }
  }

  return (
    <main className="sc" data-lang={lang ? "ar" : "en"}>
      <div className="sc-top">
        <span className="sc-serial"><i className="sc-dot" aria-hidden="true" />{T.card[lang]} {card.serial} · {T.active[lang]}</span>
        <button type="button" className="sc-lang" onClick={toggleLang} lang={lang ? "en" : "ar"}>{T.switchTo[lang]}</button>
      </div>

      <header className="sc-hero">
        {/* eslint-disable-next-line @next/next/no-img-element -- one 512px file; next/image would add an optimizer function run per scan */}
        <img className="sc-portrait" src={card.portrait} alt="" width={132} height={132} />
        <h1 className="sc-name">{card.name[lang]}</h1>
        <p className="sc-role">{card.role[lang]}</p>
        <p className="sc-tag">{card.tagline[lang]}</p>
        <p className="sc-loc">{card.location[lang]}</p>
      </header>

      <div className="sc-cta">
        <a className="sc-save" href={card.vcard} download={`${card.name[0].replace(/\s+/g, "-")}.vcf`}>
          <Icon name="save" />{T.save[lang]}
        </a>
        <button type="button" className="sc-share" onClick={share} aria-live="polite">
          <Icon name="share" />{copied ? T.copied[lang] : T.share[lang]}
        </button>
      </div>

      <section aria-label={T.connect[lang]}>
        <h2 className="sc-label">{T.connect[lang]}</h2>
        <ul className="sc-primary">
          {card.primary.map((action) => (
            <li key={action.kind}>
              <a href={action.href} {...external(action)}>
                <Icon name={action.kind} />
                <span>{action.label[lang]}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label={T.elsewhere[lang]}>
        <h2 className="sc-label">{T.elsewhere[lang]}</h2>
        <ul className="sc-links">
          {[...card.primary, ...card.links].map((action) => (
            <li key={action.kind}>
              <a href={action.href} {...external(action)}>
                <Icon name={action.kind} />
                <span className="sc-link-label">{action.label[lang]}</span>
                <span className="sc-link-value" dir="ltr">{action.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="sc-foot">
        <p>{T.foot[lang]}</p>
        <p className="sc-mono">{card.edition[lang]} · {card.serial}</p>
      </footer>
    </main>
  );
}
