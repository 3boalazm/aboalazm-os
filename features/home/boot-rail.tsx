"use client";

/**
 * BOOT RAIL — the signature of redesign v2. The home page is an OS loading
 * module by module: a coral bar fills the page edge as you scroll, and the
 * module names dock beside it, the current one extended. Desktop only (2xl);
 * blend-mode difference keeps it legible across obsidian, bone, plum and coral.
 */
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers/lang-provider";

const MODULES = [
  ["boot", "BOOT", "إقلاع"],
  ["offer", "OFFER", "العرض"],
  ["work", "WORK", "الأعمال"],
  ["watch", "WATCH", "شاهد"],
  ["method", "METHOD", "المنهج"],
  ["studio", "STUDIO", "الاستوديو"],
  ["start", "START", "ابدأ"],
] as const;

export function BootRail() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [active, setActive] = useState<string>("boot");
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = MODULES.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleY(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <span ref={bar} aria-hidden className="boot-rail__bar" style={{ transform: "scaleY(0)" }} />
      <nav className="boot-rail" aria-label={ar ? "أقسام الصفحة" : "Page modules"}>
        {MODULES.map(([id, en, arr], i) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
            <span>{String(i).padStart(2, "0")}</span>
            <span>{ar ? arr : en}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
