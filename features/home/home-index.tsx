"use client";

import type { CSSProperties } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import "./home-index.css";

type Chapter = {
  id: string;
  href: string;
  en: string;
  ar: string;
  ms: string;
  color: string;
};

const CHAPTERS: Chapter[] = [
  { id: "01", href: "#selected-work", en: "Brand systems", ar: "أنظمة البراند", ms: "Sistem jenama", color: "var(--color-accent)" },
  { id: "02", href: "#home-digital-products", en: "Digital products", ar: "المنتجات الرقمية", ms: "Produk digital", color: "var(--color-live)" },
  { id: "03", href: "#home-process", en: "How it works", ar: "طريقة العمل", ms: "Cara kerja", color: "var(--color-proof)" },
  { id: "04", href: "#home-writing", en: "Ideas & field notes", ar: "أفكار وملاحظات", ms: "Idea & catatan", color: "var(--color-creative)" },
];

export function HomeIndex() {
  const { lang } = useLang();
  const title = lang === "ar" ? "اختر مسارك" : lang === "ms" ? "PILIH LALUAN" : "CHOOSE A THREAD";

  return (
    <nav className="home-index container-wide" aria-label={title}>
      <div className="home-index__eyebrow">
        <span>{lang === "ar" ? "فهرس سريع" : lang === "ms" ? "INDEKS PANTAS" : "A QUICK INDEX"}</span>
        <span aria-hidden className="home-index__rule" />
        <span className="home-index__hint">{title}</span>
      </div>
      <ul className="home-index__list">
        {CHAPTERS.map((chapter) => (
          <li key={chapter.id}>
            <a
              className="home-index__link"
              href={chapter.href}
              style={{ "--chapter-accent": chapter.color } as CSSProperties}
            >
              <span className="home-index__number">{chapter.id}</span>
              <span className="home-index__name">
                {lang === "ar" ? chapter.ar : lang === "ms" ? chapter.ms : chapter.en}
              </span>
              <Icon name="arrow-down" size={13} className="home-index__arrow" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
