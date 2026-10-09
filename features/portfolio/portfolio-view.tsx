"use client";

/**
 * PORTFOLIO VIEW — OBSIDIAN ATELIER edition (the landscape deck).
 * 14 slides · 1600×900px each (exact 16:9) · screen == print == PDF.
 *
 * Lives in its own route group (app/(print)) with a dedicated root layout
 * that does NOT load the site chrome. All content from ./data.ts.
 * Layout rules: every slide content zone is a flex column with pinned
 * top/bottom areas and ≥24px vertical slack (verified against the real
 * font metrics) — text drift can never clip a slide again.
 */

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  IDENTITY, COVER, PROFILE, PROJECTS, CONTACT, SLIDES,
  type Project,
} from "./data";
import { usePdfExport } from "./pdf-export";
import "./portfolio.css";

const TOTAL = SLIDES.total;
const SHEET_W = 1600;
/** at/below this width the deck reflows into stacked cards (keep in sync with portfolio.css) */
const MOBILE_MAX = 700;

/* chapter accents, tuned for the dark slide surface (data keeps the
   brand-true original in `accent`; `accentBright` is the screen-safe
   variant used for numerals, dots and keylines) */
const acc = (p: Project) => p.accentBright ?? p.accent;

/* ── primitives ─────────────────────────────────────────────────────── */

function Sheet({
  id, sec, children,
}: {
  id: string; sec: string; children?: React.ReactNode;
}) {
  const n = SLIDES.byId[id] ?? 0;
  return (
    <section className="fol-sheet" id={`folio-${id}`} data-slide={n}>
      <div className="fol-chrome-t">
        <span className="ct-name">MUSTAFA ABOALAZM — PORTFOLIO 2026</span>
        <span className="ct-sec">{sec}</span>
        <span>{String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}</span>
      </div>
      <div className="fol-chrome-b">
        <span>aboalazm.com · behance.net/aboalazm</span>
        <span>AL OBOUR · 30.1936° N 31.4603° E</span>
        <span>{IDENTITY.version}</span>
      </div>
      <div className="fol-content">{children}</div>
    </section>
  );
}

function Frame({ img, cap, no, pos, fit, bg, className, style }: {
  img: string; cap: string; no?: string; pos?: string;
  fit?: "contain"; bg?: string;
  className?: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`fol-frame${fit ? " fol-frame--contain" : ""}${className ? ` ${className}` : ""}`}
      style={{
        backgroundImage: `url("${img}")`,
        ...(pos ? { backgroundPosition: pos } : null),
        ...(bg ? { backgroundColor: bg } : null),
        ...style,
      }}
      role="img"
      aria-label={cap}
    >
      {no ? <span className="fno">{no}</span> : null}
      <span className="cap">{cap}</span>
    </div>
  );
}

function Avatar({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="fol-avatar" src="/images/work/icon.png" alt="" width={size} height={size} style={{ width: size, height: size }} />
  );
}

/* ── 01 · COVER ─────────────────────────────────────────────────────── */

function CoverSlide() {
  return (
    <Sheet id="cover" sec="COVER — الغلاف">
      <div className="fol-cover-grid">
        <div className="fol-cover-left">
          <div className="fol-kicker">{COVER.kicker}</div>
          <h1 className="fol-disp fol-cover-title">
            {COVER.titleA}<br />{COVER.titleB} <span className="yr">’26</span>
          </h1>
          <p className="fol-lead fol-cover-lede">{COVER.lede}</p>
          <p className="fol-ar-body fol-cover-ledear">{COVER.ledeAr}</p>
          <div className="fol-cover-name">
            <Avatar size={88} />
            <div>
              <div className="nm">{IDENTITY.name}</div>
              <div className="rl">{IDENTITY.role} · {IDENTITY.roleAr}</div>
            </div>
          </div>
          <div className="fol-cover-meta">
            {COVER.meta.map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
        <Frame img={COVER.photo} cap={COVER.photoCap} no="★" className="fol-cover-photo" />
      </div>
    </Sheet>
  );
}

/* ── 02 · INDEX ─────────────────────────────────────────────────────── */

function IndexSlide() {
  return (
    <Sheet id="index" sec="INDEX — الفهرس">
      <div className="fol-kicker">TABLE OF CONTENTS <span className="ar">الفهرس</span></div>
      <div className="fol-index-head">
        <h2 className="fol-disp t">Five chapters<span className="fol-red">.</span></h2>
        <span className="c">EACH CHAPTER — DIVIDER + FRAMES</span>
      </div>
      <div className="fol-index-rows">
        {PROJECTS.map((p) => (
          <div key={p.slug} className="fol-index-row">
            <span className="no">{p.no}</span>
            <span className="nm">
              <i style={{ background: acc(p) }} />
              <b>{p.name}</b>
            </span>
            <span className="ar">{p.nameAr}</span>
            <span className="cat">{p.category}</span>
            <span className="yr">{p.year}</span>
            <span className="pg"><b>{String(SLIDES.byId[`ch-${p.slug}`]).padStart(2, "0")}</b>–{String(SLIDES.byId[`frames-${p.slug}`]).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
      <div className="fol-index-foot fol-micro">
        <span>{String(TOTAL).padStart(2, "0")} SLIDES · 05 CHAPTERS · 2019 → 2026</span>
        <span>AR / EN — ONE DOCTRINE</span>
      </div>
    </Sheet>
  );
}

/* ── 03 · PROFILE ───────────────────────────────────────────────────── */

function ProfileSlide() {
  return (
    <Sheet id="profile" sec="PROFILE — الملف">
      <div className="fol-prof">
        <div className="fol-kicker">THE ARCHITECT <span className="ar">المعماري</span></div>
        <h2 className="fol-disp fol-prof-state">
          {PROFILE.statement}<br /><span className="hot">{PROFILE.statementHot}</span>
        </h2>
        <p className="fol-ar-disp fol-prof-ar">{PROFILE.statementAr}</p>
        <div className="fol-prof-grid">
          <div className="fol-prof-left">
            <p className="fol-prof-p">{PROFILE.paragraph}</p>
            <div className="fol-chiprow fol-prof-chips">
              {PROFILE.chips.map((c) => <span key={c} className="fol-chip">{c}</span>)}
            </div>
          </div>
          <div className="fol-prof-side">
            <p className="fol-micro">BY THE NUMBERS — بالأرقام</p>
            <div className="fol-stat-grid">
              {PROFILE.stats.map((s) => (
                <div key={s.l} className="fol-stat">
                  <div className="n">{s.n}<span className="suf">{s.suf}</span></div>
                  <div className="l">{s.l}</div>
                  <div className="c">{s.c}</div>
                </div>
              ))}
            </div>
            <div className="fol-prof-who">
              <Avatar size={64} />
              <div>
                <div className="nm">{IDENTITY.name}</div>
                <div className="fol-micro" style={{ marginTop: 6 }}>{IDENTITY.location} — {IDENTITY.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ── CHAPTER · divider + frames ─────────────────────────────────────── */

function ChapterSlide({ p }: { p: Project }) {
  return (
    <Sheet id={`ch-${p.slug}`} sec={`CHAPTER ${p.no} — ${p.name}`}>
      <div className="fol-ch-grid">
        <div className="fol-ch-left">
          <div className="fol-ch-no" style={{ color: acc(p) }}>{p.no}</div>
          <div className="fol-ch-cat" style={{ color: acc(p) }}>{p.category} · {p.categoryAr}</div>
          <h2 className="fol-disp fol-ch-name">{p.name}</h2>
          <div className="fol-ar-disp fol-ch-ar">{p.nameAr}</div>
          <div className="fol-ch-meta">
            <span className="yr">{p.year}</span>
            <span className="sc">{p.scope.join(" · ")}</span>
          </div>
          <p className="fol-ch-brief">{p.brief}</p>
          <div className="fol-ch-outcome" style={{ borderTopColor: acc(p) }}>
            <div className="k">OUTCOME — النتيجة</div>
            <div className="v">{p.outcome}</div>
            <div className="a">{p.outcomeAr}</div>
          </div>
        </div>
        <Frame img={p.hero.img} cap={p.hero.cap} no={p.no} pos={p.hero.pos} fit={p.hero.fit} bg={p.hero.bg} className="fol-ch-hero" />
      </div>
    </Sheet>
  );
}

function FramesSlide({ p }: { p: Project }) {
  return (
    <Sheet id={`frames-${p.slug}`} sec={`FRAMES ${p.no} — ${p.name}`}>
      <div className="fol-fr-head">
        <span className="no">{p.no}</span>
        <span className="nm">{p.name}</span>
        <span className="tag">SELECTED FRAMES — لقطات مختارة</span>
      </div>
      <div className="fol-fr-grid">
        {p.frames.map((f, i) => (
          <Frame key={f.img} img={f.img} cap={f.cap} pos={f.pos} fit={f.fit} bg={f.bg} no={`${p.no}.${i + 1}`} />
        ))}
      </div>
      <div className="fol-fr-foot">
        <div className="oc"><small>OUTCOME — النتيجة</small>{p.outcome}</div>
        <div className="oca">{p.outcomeAr}</div>
        <div className="fol-swatches">
          {p.tokens.map((t) => (
            <span key={t.hex} className="fol-sw">
              <i style={{ background: t.hex }} />
              <b>{t.name}<span>{t.hex}</span></b>
            </span>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/* ── 14 · CONTACT ───────────────────────────────────────────────────── */

function ContactSlide() {
  return (
    <Sheet id="contact" sec="CONTACT — التواصل">
      <div className="fol-ct">
        <div className="fol-kicker">{CONTACT.kicker}</div>
        <h2 className="fol-disp fol-ct-title">
          {CONTACT.titleA}<br /><span className="hot">{CONTACT.titleB}</span>
        </h2>
        <div className="fol-ct-grid">
          <div className="fol-ct-left">
            <p className="fol-ar-disp fol-ct-ar">{CONTACT.titleAr}</p>
            <p className="fol-ct-note">{CONTACT.note}</p>
            <span className="fol-ct-mail">{IDENTITY.email}</span>
          </div>
          <div className="fol-ct-side">
            {IDENTITY.links.map((l) => (
              <div key={l.label} className="fol-ct-row">
                <span className="k">{l.label}</span>
                <span className="v">{l.value}</span>
              </div>
            ))}
            <div className="fol-ct-row">
              <span className="k">BASE</span>
              <span className="v">{IDENTITY.location}</span>
            </div>
            <div className="fol-ct-end">
              <Avatar size={56} />
              <div>
                <div className="t">END OF DECK</div>
                <div className="s">{IDENTITY.name} · {IDENTITY.version}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ── THE VIEW ───────────────────────────────────────────────────────── */

export function PortfolioView() {
  const pagesRef = useRef<HTMLDivElement>(null);
  const { state, progress, label, start, cancel } = usePdfExport(pagesRef);
  const [zoom, setZoom] = useState<string>("");
  const [at, setAt] = useState(1);
  const [narrow, setNarrow] = useState(false);
  const exporting = state === "working" || state === "saving";
  /* phones get the stacked card layout (CSS, ≤700px) — never while exporting */
  const mobile = narrow && !exporting;

  /* fit-to-width on narrow screens (never while exporting) */
  useEffect(() => {
    const fit = () => {
      if (state === "working" || state === "saving") return;
      const w = document.documentElement.clientWidth;
      const phone = w <= MOBILE_MAX;
      setNarrow(phone);
      setZoom(phone ? "" : w < SHEET_W + 48 ? String(Math.max(0.2, (w - 24) / (SHEET_W + 16))) : "");
    };
    fit();
    window.addEventListener("resize", fit, { passive: true });
    return () => window.removeEventListener("resize", fit);
  }, [state]);

  /* current-slide readout + progress hairline */
  useEffect(() => {
    const bar = document.getElementById("folio-progress");
    const onScroll = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(".fol-sheet"));
      const mid = window.innerHeight / 2;
      let cur = 1;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid) cur = i + 1;
      });
      setAt(cur);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ids = useMemo(() => SLIDES.order.map((s) => s.id), []);

  const go = useCallback((n: number) => {
    const id = ids[Math.min(ids.length, Math.max(1, n)) - 1];
    if (id) document.getElementById(`folio-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [ids]);

  /* presentation keys: ←/→ · space · home/end */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (state === "working") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(at + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        go(at - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        go(1);
      } else if (e.key === "End") {
        e.preventDefault();
        go(TOTAL);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [at, go, state]);

  const jump = useCallback((id: string) => {
    document.getElementById(`folio-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div id="folio" className={mobile ? "is-mobile" : undefined}>
      <div className="fol-progressline" aria-hidden><i id="folio-progress" /></div>

      <div className="fol-viewport" style={{ zoom }}>
        <div className="fol-pages" ref={pagesRef}>
          <CoverSlide />
          <IndexSlide />
          <ProfileSlide />
          {PROJECTS.map((p) => (
            <span key={p.slug} style={{ display: "contents" }}>
              <ChapterSlide p={p} />
              <FramesSlide p={p} />
            </span>
          ))}
          <ContactSlide />
        </div>
      </div>

      {/* toolbar */}
      <nav className="fol-toolbar" aria-label="Portfolio controls">
        <Link href="/" className="tb-back">← ABOALAZM OS</Link>
        <span className="tb-sep" aria-hidden />
        <button className="tb-btn" onClick={() => jump("cover")}>COVER</button>
        <button className="tb-btn" onClick={() => jump("ch-code-canvas")}>WORK</button>
        <button className="tb-btn" onClick={() => jump("contact")}>CONTACT</button>
        <span className="tb-sep" aria-hidden />
        <span className="tb-count"><b>{String(at).padStart(2, "0")}</b> / {String(TOTAL).padStart(2, "0")}</span>
        <span className="tb-sep" aria-hidden />
        <button className="tb-btn tb-print" onClick={() => window.print()}>PRINT · طباعة</button>
        <button className="tb-btn tb-btn--acc" onClick={start} disabled={state === "working" || state === "saving"}>
          {state === "working" || state === "saving" ? "RENDERING…" : "↓ PDF · تحميل"}
        </button>
      </nav>

      {/* export progress */}
      {state !== "idle" && (
        <div className="fol-progress" role="status" aria-live="polite">
          <div className="fp-card">
            <p className="fp-title">
              {state === "working" ? "RENDERING PDF · جاري التصدير" : state === "error" ? "EXPORT FAILED" : "SAVING…"}
            </p>
            <div className="fp-track"><div id="fp-bar" style={{ width: `${progress}%` }} /></div>
            <p className="fp-meta">
              {label} — {state === "working" ? "keep this tab focused · سيب التاب مفتوح" : state === "error" ? "try PRINT instead · Ctrl+P" : "downloaded"}
            </p>
            {state === "working" && (
              <button className="fp-cancel" onClick={cancel}>CANCEL · إلغاء</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
