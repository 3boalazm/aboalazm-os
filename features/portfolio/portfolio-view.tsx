"use client";

/**
 * PORTFOLIO VIEW — the fixed A4 edition rendered as React.
 * 29 sheets · 794×1123px each (exact A4 @96dpi) · screen == print == PDF.
 *
 * Lives in its own route group (app/(print)) with a dedicated root layout
 * that does NOT load the site chrome — the A4 fidelity is the product here.
 * All content from ./data.ts (ported from the repo's own content files).
 */

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  IDENTITY, COVER, MANIFESTO, IDENTITY_SYSTEM, CAPABILITIES, WORDWALL,
  NUMBERS, TIMELINE, PROJECTS, PROCESS, PAYMENT, TIERS, ALACARTE, CLOSING,
  SECTIONS, PAGE_PLAN,
  type Project,
} from "./data";
import { usePdfExport } from "./pdf-export";
import "./portfolio.css";

/* ── small helpers ────────────────────────────────────────────────────── */

function hexA(hex: string, a: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`; /* legacy form — html2canvas-safe */
}

function glowStyle(color: string, css: React.CSSProperties): React.CSSProperties {
  return {
    background: `radial-gradient(circle, ${hexA(color, 0.16)} 0%, ${hexA(color, 0)} 68%)`,
    ...css,
  };
}

const TOTAL = PAGE_PLAN.total;

function Sheet({
  id, sec, page, children, className,
}: {
  id: string; sec: string; page: number; className?: string; children?: React.ReactNode;
}) {
  return (
    <section className={`fol-sheet${className ? ` ${className}` : ""}`} id={`folio-${id}`} data-page={page}>
      <div className="fol-chrome-t">
        <span className="ct-name">MUSTAFA ABOALAZM</span>
        <span className="ct-sec">{sec}</span>
        <span>{String(page).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}</span>
      </div>
      <div className="fol-chrome-b">
        <span>aboalazm.com <span className="cb-dot">·</span> behance.net/aboalazm</span>
        <span>AL OBOUR · 30.1936° N 31.4603° E</span>
        <span>PORTFOLIO {IDENTITY.version.split("·")[0]?.trim() ?? ""}</span>
      </div>
      {children}
    </section>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="fol-content">{children}</div>;
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="fol-kicker">{children}</div>;
}

function Avatar({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="fol-avatar" src="/images/work/icon.png" alt="" width={size} height={size} style={{ width: size, height: size }} />
  );
}

/* ══ FRONT PAGES ═════════════════════════════════════════════════════ */

function CoverPage() {
  return (
    <Sheet id="cover" sec="COVER — الغلاف" page={1}>
      <div className="fol-glow" style={glowStyle("#FF6B47", { width: 560, height: 560, left: -160, top: -140 })} />
      <div className="fol-glow" style={glowStyle("#7850C8", { width: 640, height: 640, right: -200, bottom: -180 })} />
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>{COVER.kicker} <span className="ar">الإصدار الأول</span></Kicker>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 24, alignItems: "start", marginTop: 40 }}>
            <div>
              <h1 style={{ fontFamily: "var(--f-disp)", fontWeight: 900, fontSize: 92, lineHeight: 0.94, letterSpacing: "-0.03em" }}>
                MUSTAFA<br />ABOALAZM
                <span style={{ display: "inline-block", verticalAlign: "top", fontFamily: "var(--f-mono)", fontWeight: 700, fontSize: 15, letterSpacing: "0.2em", color: "var(--obsidian)", background: "var(--coral)", borderRadius: 6, padding: "8px 10px 6px", marginLeft: 10, transform: "translateY(14px)" }}>OS</span>
              </h1>
              <p className="fol-serif-i fol-accent" style={{ fontSize: 27, marginTop: 22 }}>{IDENTITY.role}</p>
              <p className="fol-lead" style={{ maxWidth: "44ch", marginTop: 14 }}>{COVER.lede}</p>
              <p className="fol-ar-body" style={{ maxWidth: "40ch", marginTop: 6 }}>{COVER.ledeAr}</p>
            </div>
            <div style={{ position: "relative", paddingTop: 8 }}>
              <Avatar size={200} />
              <div style={{ position: "absolute", left: 0, bottom: -120, fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-32)", lineHeight: 2.1 }}>
                30.1936° N<br />31.4603° E<br />AL OBOUR · EGYPT<br /><span className="fol-accent">WORKS WORLDWIDE</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div className="fol-g4" style={{ gap: 0 }}>
            {COVER.metrics.map((m) => (
              <div key={m.l} className="fol-stat" style={{ borderTop: "2px solid var(--coral)", padding: "16px 14px 0 0" }}>
                <div className="stat-n" style={{ fontSize: 44 }}>{m.n}<span className="suf">{m.suf}</span></div>
                <div className="stat-l">{m.l}</div>
                <div className="stat-c">{m.c}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 26, paddingTop: 12, borderTop: "1px solid var(--line-1)" }}>
            <span className="fol-micro">SELECTED WORK 2019 — 2026 · 13 PROJECTS</span>
            <span className="fol-micro fol-accent">{IDENTITY.version}</span>
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

function IndexPage() {
  return (
    <Sheet id="index" sec="INDEX — الفهرس" page={2}>
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>TABLE OF CONTENTS <span className="ar">الفهرس</span></Kicker>
          <h2 className="fol-d2" style={{ marginTop: 14 }}>Index<span className="fol-accent">.</span></h2>

          <div className="fol-g2" style={{ marginTop: 22, gridTemplateColumns: "1.05fr 1fr", gap: 36, flex: 1 }}>
            <div>
              {SECTIONS.map((sec) => (
                <div key={sec.key} className="fol-ix-row">
                  <span className="ix-no">{sec.no}</span>
                  <span className="ix-en">{sec.en}</span>
                  <span className="ix-ar">{sec.ar}</span>
                  <span className="ix-pg">{String(sec.pg).padStart(2, "0")}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="fol-micro" style={{ paddingBottom: 10, borderBottom: "1px solid var(--line-2)", color: "var(--coral)" }}>06 · SELECTED WORK — 13 PROJECTS</p>
              {PROJECTS.map((p) => (
                <div key={p.slug} className="fol-ix-sub">
                  <span className="s-no">{p.idx.replace("P.", "")}</span>
                  <span className="s-name">{p.name} <span className="s-cat">· {p.category}</span></span>
                  <span className="s-pg">{String(PAGE_PLAN.projPage[p.slug]).padStart(2, "0")}</span>
                </div>
              ))}
              <div className="fol-chiprow" style={{ marginTop: 18 }}>
                <span className="fol-chip fol-chip--acc">BRAND IDENTITY ×7</span>
                <span className="fol-chip fol-chip--acc">DEVELOPMENT ×6</span>
                <span className="fol-chip">5 FULL CASE FILES</span>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

function ManifestoPage() {
  const M = MANIFESTO;
  return (
    <Sheet id="manifesto" sec="MANIFESTO — البيان" page={3}>
      <div className="fol-ghost">01</div>
      <div className="fol-glow" style={glowStyle("#FF6B47", { width: 520, height: 520, right: -140, top: 60 })} />
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>MANIFESTO <span className="ar">البيان</span></Kicker>

          <div style={{ marginTop: 34 }}>
            <p className="fol-serif-i" style={{ fontSize: 40, color: "var(--ink-48)" }}>{M.quiet}</p>
            <h2 className="fol-d1" style={{ fontSize: 76, marginTop: 4 }}>{M.loud}</h2>
            <p className="fol-ar-disp" style={{ fontSize: 24, marginTop: 16, direction: "rtl", textAlign: "left", color: "var(--ink-68)" }}>
              {M.quietAr} <span className="fol-accent">{M.loudAr}</span>
            </p>
          </div>

          <p className="fol-lead" style={{ maxWidth: "58ch", marginTop: 24 }}>{M.lead}</p>

          <div style={{ marginTop: 26 }}>
            <p className="fol-micro" style={{ marginBottom: 10 }}>{M.chainNote}</p>
            <div className="fol-flow">
              {M.chain.map((n, i) => (
                <span key={n} style={{ display: "contents" }}>
                  <span className={`f-node${i === 0 || i === M.chain.length - 1 ? " f-node--hot" : ""}`}>{n}</span>
                  {i < M.chain.length - 1 && <span className="f-arr">→</span>}
                </span>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div>
            <p className="fol-micro" style={{ marginBottom: 8 }}>THE DOCTRINE — المبادئ</p>
            {M.doctrine.map((d, i) => (
              <div key={d.t} className="fol-lrow" style={{ gridTemplateColumns: "52px 1fr" }}>
                <span className="lno">0{i + 1}</span>
                <span>
                  <span className="lmain">{d.t}</span>
                  <div className="lsub" style={{ maxWidth: "64ch" }}>{d.d}</div>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

function IdentityPage() {
  const I = IDENTITY_SYSTEM;
  return (
    <Sheet id="identity" sec="IDENTITY SYSTEM — نظام الهوية" page={4}>
      <div className="fol-ghost">02</div>
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>THE IDENTITY <span className="ar">الهوية</span></Kicker>
          <h2 className="fol-d2" style={{ marginTop: 12 }}>One system, worn by <span className="fol-serif-i fol-accent">everything</span>.</h2>
          <p className="fol-lead" style={{ maxWidth: "60ch", marginTop: 10 }}>{I.lead}</p>

          <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 20 }}>
            <Avatar size={92} />
            <div style={{ flex: 1 }}>
              <p className="fol-d3">MUSTAFA ABOALAZM</p>
              <p className="fol-micro" style={{ marginTop: 4 }}>{IDENTITY.role} · {IDENTITY.roleAr}</p>
            </div>
          </div>

          <div className="fol-g4" style={{ marginTop: 18 }}>
            {I.colors.map((c) => (
              <div key={c.name} className="fol-swatch">
                <div className="sw-color" style={{ background: c.hex }} />
                <div className="sw-meta">
                  <div className="sw-name">{c.name}</div>
                  <div className="sw-hex">{c.hex} · {c.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            <span className="fol-micro">{I.spectrumNote}</span>
            <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {I.spectrum.map((hex) => (
                <span key={hex} style={{ width: 22, height: 10, borderRadius: 999, background: hex, display: "inline-block", outline: "1px solid var(--line-1)" }} />
              ))}
            </span>
          </div>

          <div style={{ marginTop: 20, flex: 1 }}>
            {I.type.map((t) => (
              <div key={t.name} className="fol-spec-row">
                <span className={`spec-aa${t.cls ? ` ${t.cls}` : ""}`}>{t.aa}</span>
                <span>
                  <div className="spec-name">{t.name}</div>
                  <div className="spec-use">{t.use}</div>
                </span>
                <span className="fol-micro">TOKEN OK</span>
              </div>
            ))}
          </div>

          {[I.facts.slice(0, 3), I.facts.slice(3)].map((row, ri) => (
            <div key={ri} className="fol-g3" style={{ marginTop: ri === 0 ? 18 : 10, gap: 10 }}>
              {row.map((f) => (
                <div key={f.k} style={{ borderTop: "1px solid var(--line-2)", paddingTop: 8 }}>
                  <div className="fol-micro fol-accent">{f.k}</div>
                  <div className="fol-body-sm" style={{ marginTop: 4, fontSize: 9.5 }}>{f.v}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Content>
    </Sheet>
  );
}

function CapabilitiesPage() {
  return (
    <Sheet id="capabilities" sec="CAPABILITIES — القدرات" page={5}>
      <div className="fol-ghost">03</div>
      <div className="fol-glow" style={glowStyle("#48CCCC", { width: 480, height: 480, left: -160, bottom: -100 })} />
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>CAPABILITIES // SYSTEMS <span className="ar">القدرات</span></Kicker>
          <h2 className="fol-d2" style={{ marginTop: 12, maxWidth: "20ch" }}>Hold the tokens. Watch the system <span className="fol-serif-i fol-accent">hold</span>.</h2>

          <div className="fol-g2" style={{ marginTop: 22, flex: 1 }}>
            {CAPABILITIES.map((cap) => (
              <div key={cap.no} style={{ border: "1px solid var(--line-1)", borderRadius: 12, background: "var(--surface-1)", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="fol-micro fol-accent">{cap.no}</span>
                  <span className="fol-micro">{cap.ar}</span>
                </div>
                <div className="fol-d3">{cap.en}</div>
                <ul style={{ listStyle: "none" }}>
                  {cap.items.map((it) => (
                    <li key={it} className="fol-body-sm" style={{ padding: "4px 0 4px 14px", position: "relative", borderBottom: "1px dashed var(--line-1)" }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--coral)", fontFamily: "var(--f-mono)", fontSize: 8 }}>→</span> {it}
                    </li>
                  ))}
                </ul>
                <div style={{ flex: 1 }} />
                <div className="fol-chiprow">{cap.stack.map((s) => <span key={s} className="fol-chip">{s}</span>)}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, borderTop: "1px solid var(--line-2)", paddingTop: 14 }}>
            <p className="fol-micro" style={{ marginBottom: 10 }}>TOOLING — {WORDWALL.length}+ INSTRUMENTS · ONE OPERATING SYSTEM</p>
            <div className="fol-wordwall">{WORDWALL.map((w) => <span key={w} className="w">{w}</span>)}</div>
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

function NumbersPage() {
  const N = NUMBERS;
  return (
    <Sheet id="numbers" sec="BY THE NUMBERS — بالأرقام" page={6}>
      <div className="fol-ghost">04</div>
      <div className="fol-glow" style={glowStyle("#FF6B47", { width: 620, height: 620, left: 140, top: -180 })} />
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>BY THE NUMBERS <span className="ar">بالأرقام</span></Kicker>

          <div className="fol-g3" style={{ marginTop: 40 }}>
            {N.hero.map((m) => (
              <div key={m.l} className="fol-stat fol-big-metric">
                <div className="stat-n" style={{ fontSize: 88 }}>{m.pre}{m.n}<span className="suf">{m.suf}</span></div>
                <div className="stat-l" style={{ fontSize: 13 }}>{m.l}</div>
                <div className="stat-c">{m.c}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <div className="fol-g4">
            {N.support.map((m) => (
              <div key={m.l} className="fol-stat" style={{ borderTop: "1px solid var(--line-2)", paddingTop: 14 }}>
                <div className="stat-n" style={{ fontSize: 52 }}>{m.pre}{m.n}<span className="suf">{m.suf}</span></div>
                <div className="stat-l">{m.l}</div>
                <div className="stat-c">{m.c}</div>
                <div className="stat-c fol-accent" style={{ fontFamily: "var(--f-ar)", letterSpacing: 0 }}>{m.ar}</div>
              </div>
            ))}
          </div>

          <p className="fol-micro" style={{ marginTop: 22 }}>MEASURED IN OUTCOMES, NOT COMPLIMENTS — الأرقام من مشاريع حقيقية</p>
        </div>
      </Content>
    </Sheet>
  );
}

function TimelinePage() {
  return (
    <Sheet id="timeline" sec="CAREER — المسيرة" page={7}>
      <div className="fol-ghost">05</div>
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>CAREER LEDGER <span className="ar">المسيرة المهنية</span></Kicker>
          <h2 className="fol-d2" style={{ marginTop: 12 }}>Nine years turning identity<br />into <span className="fol-serif-i fol-accent">infrastructure</span>.</h2>

          <div style={{ marginTop: 26, flex: 1 }}>
            {TIMELINE.map((t) => (
              <div key={t.yr + t.org} className="fol-tl-row">
                <span className="tl-yr">{t.yr}</span>
                <span>
                  <div className="tl-role">{t.role}</div>
                  <div className="tl-org">{t.org}</div>
                </span>
                <span className="tl-note">{t.note}</span>
              </div>
            ))}
          </div>

          <div className="fol-g2" style={{ gap: 10 }}>
            <div style={{ borderTop: "1px solid var(--line-2)", paddingTop: 10 }}>
              <div className="fol-micro fol-accent">EDUCATION</div>
              <div className="fol-body-sm" style={{ marginTop: 4 }}>B.Sc. — Al-Azhar University · 2017–2024</div>
            </div>
            <div style={{ borderTop: "1px solid var(--line-2)", paddingTop: 10 }}>
              <div className="fol-micro fol-accent">TRAINING</div>
              <div className="fol-body-sm" style={{ marginTop: 4 }}>MSP · Youth Scope · AYB · Bedaya · Resalah</div>
            </div>
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

/* ══ WORK PAGES ══════════════════════════════════════════════════════ */

function ProjectHeroPage({ p }: { p: Project }) {
  const pageNo = PAGE_PLAN.projPage[p.slug] ?? 0;
  return (
    <Sheet id={`pj-${p.slug}`} sec={`WORK ${p.idx} — ${p.name}`} page={pageNo}>
      <div className="fol-glow" style={glowStyle(p.glow, { width: 520, height: 520, left: -140, bottom: -160 })} />

      {p.kind === "plate" ? (
        <div
          className="fol-pj-plate"
          style={{
            background: `linear-gradient(180deg, ${hexA(p.glow, 0.10)}, rgba(8, 7, 16, 0) 55%), radial-gradient(circle at 50% 42%, ${hexA(p.glow, 0.30)}, rgba(8, 7, 16, 0) 70%), var(--surface-1)`,
          }}
        >
          <div style={{ fontFamily: "var(--f-disp)", fontWeight: 900, fontSize: (p.plateWords?.join("").length ?? 0) > 9 ? 66 : 96, lineHeight: 0.95, letterSpacing: "-0.02em", textAlign: "center" }}>
            {p.plateWords?.map((w, i) => (
              <span key={w}>
                <span style={{ color: i === 0 ? p.glow : "var(--ink)" }}>{w}</span>
                {i < (p.plateWords?.length ?? 0) - 1 && <br />}
              </span>
            ))}
          </div>
          <div className="fol-micro" style={{ letterSpacing: "0.3em" }}>{p.plateSub}</div>
        </div>
      ) : (
        <div className="fol-pj-img" style={{ backgroundImage: `url("${p.img}")` }} />
      )}

      <span className="fol-tag">{p.category}</span>

      <div className="fol-pj-body">
        <p className="fol-pj-idx">{p.idx} / 13 · {p.discipline} · {p.year}</p>
        <h2 className="fol-pj-title">{p.name}</h2>
        <div className="fol-pj-title-ar">{p.nameAr}</div>
        <div className="fol-pj-meta">
          {p.stack.map((s) => <span key={s} className="fol-chip">{s}</span>)}
          {p.live && (<><span className="sep" /><span className="fol-chip fol-chip--acc">LIVE · {p.live}</span></>)}
        </div>
        <div className="fol-pj-outcome">
          <span><span className="po-label">OUTCOME&nbsp;&nbsp;</span><span className="po-val">{p.outcome}</span></span>
          <span className="po-ar">{p.outcomeAr}</span>
        </div>
      </div>
    </Sheet>
  );
}

function ProjectDetailPage({ p }: { p: Project }) {
  const pageNo = (PAGE_PLAN.projPage[p.slug] ?? 0) + 1;
  return (
    <Sheet id={`pjd-${p.slug}`} sec={`CASE FILE ${p.idx} — ${p.name}`} page={pageNo}>
      <div className="fol-glow" style={glowStyle(p.glow, { width: 480, height: 480, right: -150, top: -140 })} />
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className="fol-pjd-head">
            <div>
              <p className="fol-micro fol-accent">{p.idx} · CASE FILE — ملف المشروع</p>
              <h2 className="fol-d3" style={{ marginTop: 6 }}>{p.name}</h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="fol-micro">{p.year}</p>
              <p className="fol-micro" style={{ marginTop: 4 }}>{p.discipline}</p>
            </div>
          </div>

          <p className="fol-body-sm" style={{ marginTop: 12, maxWidth: "78ch" }}>{p.brief}</p>

          <div className="fol-pjd-kpis">
            {p.kpis?.map((k) => (
              <div key={k.l} className="fol-stat">
                <div className="stat-n" style={{ fontSize: 44 }}>{k.n}</div>
                <div className="stat-l" style={{ fontSize: 10 }}>{k.l}</div>
                <div className="stat-c">{k.c}</div>
              </div>
            ))}
          </div>

          <div className="fol-pjd-gal">
            {p.gallery?.map((g) => (
              <div key={g.img} className={`fol-imgcard${g.full ? " fol-imgcard--full" : ""}`} style={{ backgroundImage: `url("${g.img}")` }}>
                <span className="cap">{g.cap}</span>
              </div>
            ))}
          </div>

          <div className="fol-pjd-tokens">
            {p.tokens?.map((t) => (
              <div key={t.t} className="tok">
                <div className="fol-micro tk1">{t.t} · {t.v}</div>
                <div className="fol-micro tk2">{t.r}</div>
              </div>
            ))}
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

/* ══ TAIL PAGES ══════════════════════════════════════════════════════ */

function LedgerPage() {
  return (
    <Sheet id="ledger" sec="PROJECT LEDGER — سجل المشاريع" page={PAGE_PLAN.ledger}>
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>07 · THE ENGINEERING LEDGER <span className="ar">سجل المشاريع</span></Kicker>
          <h2 className="fol-d2" style={{ marginTop: 12 }}>Every engagement,<br />recorded as a <span className="fol-serif-i fol-accent">system</span>.</h2>

          <table className="fol-ledger-t" style={{ marginTop: 24 }}>
            <thead>
              <tr><th>NO</th><th>PROJECT</th><th>DISCIPLINE</th><th>STACK</th><th>OUTCOME</th><th>YEAR</th></tr>
            </thead>
            <tbody>
              {PROJECTS.map((p) => (
                <tr key={p.slug}>
                  <td className="td-no">{p.idx}</td>
                  <td className="td-name">{p.name}<br /><span style={{ fontFamily: "var(--f-ar)", fontWeight: 400, fontSize: 9, color: "var(--ink-32)" }}>{p.nameAr}</span></td>
                  <td>{p.discipline}</td>
                  <td className="td-mono">{p.stack.join(" · ")}</td>
                  <td>{p.outcome}</td>
                  <td className="td-mono">{p.year}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "2px solid var(--coral)", paddingTop: 12 }}>
            <span className="fol-micro">13 ENGAGEMENTS · 2019 → 2026 · PHARMA / FOOD / HEALTHCARE / EDU / NGO / GOV / COMMERCE / AGRITECH</span>
            <span className="fol-micro fol-accent">LEDGER CLOSED</span>
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

function ProcessPage() {
  return (
    <Sheet id="process" sec="PROCESS — المنهجية" page={PAGE_PLAN.process}>
      <div className="fol-ghost">08</div>
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>08 · THE PROCESS <span className="ar">المنهجية</span></Kicker>
          <h2 className="fol-d2" style={{ marginTop: 12 }}>38 days, <span className="fol-serif-i fol-accent">four gates</span>,<br />zero guesswork.</h2>

          <div className="fol-g4" style={{ marginTop: 24 }}>
            {PROCESS.map((ph) => (
              <div key={ph.n} className="fol-phase">
                <div className="ph-n">{ph.n}</div>
                <div className="ph-name">{ph.en}</div>
                <div className="ph-ar">{ph.ar}</div>
                <div className="ph-body">{ph.body}</div>
                <div style={{ flex: 1 }} />
                <div className="ph-days">{ph.days}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ border: "1px solid var(--line-1)", borderRadius: 12, padding: "18px 20px", background: "var(--surface-1)" }}>
            <p className="fol-micro fol-accent" style={{ marginBottom: 10 }}>PAYMENT STRUCTURE — هيكل الدفع</p>
            <div className="fol-g2" style={{ gap: 14 }}>
              <div className="fol-body-sm" style={{ fontWeight: 600, color: "var(--ink)", fontSize: 10 }}>{PAYMENT.t1}</div>
              <div className="fol-body-sm" style={{ fontWeight: 600, color: "var(--ink)", fontSize: 10 }}>{PAYMENT.t23}</div>
            </div>
            <p className="fol-micro" style={{ marginTop: 12 }}>{PAYMENT.methods} · <span style={{ fontFamily: "var(--f-ar)", letterSpacing: 0 }}>{PAYMENT.methodsAr}</span></p>
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

function OffersPage() {
  return (
    <Sheet id="offers" sec="OFFERS — العروض" page={PAGE_PLAN.offers}>
      <div className="fol-ghost">09</div>
      <div className="fol-glow" style={glowStyle("#FF6B47", { width: 520, height: 520, right: -160, bottom: -140 })} />
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>09 · INVESTMENT <span className="ar">العروض</span></Kicker>
          <h2 className="fol-d2" style={{ marginTop: 12 }}>Pick the <span className="fol-serif-i fol-accent">tier</span>. Keep the doctrine.</h2>

          <div className="fol-g3" style={{ marginTop: 20 }}>
            {TIERS.map((t) => (
              <div key={t.tag} className={`fol-tier${t.rec ? " fol-tier--rec" : ""}`}>
                {t.rec && <span className="fol-tag" style={{ borderRadius: "0 12px 0 12px" }}>RECOMMENDED</span>}
                <span className="t-tag">{t.tag}</span>
                <span className="t-name">{t.name}</span>
                <span className="t-price">{t.price}</span>
                <div className="t-row"><span>BEST FOR</span><span>{t.bestFor}</span></div>
                <div className="t-row"><span>DURATION</span><span>{t.duration}</span></div>
                <div className="t-row"><span>PAYMENT</span><span>{t.payment}</span></div>
                <ul className="t-inc">{t.inc.map((x) => <li key={x}>{x}</li>)}</ul>
                <div style={{ flex: 1 }} />
                {t.exc
                  ? <p className="fol-micro" style={{ color: "var(--ink-32)" }}>{t.exc}</p>
                  : <p className="fol-micro fol-accent">FULL SYSTEM · GOVERNED</p>}
              </div>
            ))}
          </div>

          <div className="fol-g2" style={{ marginTop: 16, gap: 12 }}>
            {ALACARTE.map((g) => (
              <div key={g.g} className="fol-alac">
                <div className="al-head">{g.g}</div>
                {g.rows.map((r) => (
                  <div key={r.s} className="al-row">
                    <span><span className="al-svc">{r.s}</span><span className="al-det">{r.d}</span></span>
                    <span className="al-price">{r.p}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

function ContactPage() {
  const C = CLOSING;
  return (
    <Sheet id="contact" sec="CONTACT — التواصل" page={PAGE_PLAN.contact}>
      <div className="fol-glow" style={glowStyle("#FF6B47", { width: 700, height: 700, left: -200, bottom: -260 })} />
      <div className="fol-glow" style={glowStyle("#7850C8", { width: 480, height: 480, right: -140, top: -120 })} />
      <Content>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Kicker>10 · START A PROJECT <span className="ar">ابدأ مشروعك</span></Kicker>

          <div style={{ marginTop: 38 }}>
            <p className="fol-serif-i" style={{ fontSize: 34, color: "var(--ink-48)" }}>{C.quiet}</p>
            <h2 className="fol-d1" style={{ fontSize: 64 }}>{C.loud}</h2>
            <p className="fol-ar-disp" style={{ fontSize: 20, marginTop: 14, direction: "rtl", textAlign: "left", color: "var(--ink-68)" }}>
              {C.quietAr} <span className="fol-accent">{C.loudAr}</span>
            </p>
            <p className="fol-lead" style={{ maxWidth: "52ch", marginTop: 16 }}>{C.lead}</p>
            <p className="fol-ar-body" style={{ maxWidth: "52ch", marginTop: 4 }}>{C.leadAr}</p>
          </div>

          <div style={{ flex: 1 }} />

          <div>
            {IDENTITY.links.map((l) => (
              <div key={l.label} className="fol-contact-row">
                <span className="c-label">{l.label}</span>
                <span className="c-val">{l.value}</span>
              </div>
            ))}
            <div className="fol-contact-row">
              <span className="c-label">EMAIL</span>
              <span className="c-val">{IDENTITY.email}</span>
            </div>
            <div className="fol-contact-row">
              <span className="c-label">BASE</span>
              <span className="c-val">{IDENTITY.location}<span className="c-ar">{IDENTITY.locationAr}</span></span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 26, paddingTop: 16, borderTop: "2px solid var(--coral)" }}>
            <Avatar size={110} />
            <div style={{ flex: 1 }}>
              <p className="fol-d3" style={{ fontSize: 22 }}>MUSTAFA ABOALAZM</p>
              <p className="fol-micro" style={{ marginTop: 4 }}>SYSTEMIC IDENTITY ARCHITECT · CO-FOUNDER, CODE &amp; CANVAS</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="fol-micro fol-accent">END OF FILE</p>
              <p className="fol-micro" style={{ marginTop: 4 }}>{IDENTITY.version}</p>
            </div>
          </div>
        </div>
      </Content>
    </Sheet>
  );
}

/* ══ THE VIEW ════════════════════════════════════════════════════════ */

export function PortfolioView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const { state, progress, label, start, cancel } = usePdfExport(pagesRef);
  const [zoom, setZoom] = useState<string>("");

  /* fit-to-width on small screens (never while exporting) */
  useEffect(() => {
    const fit = () => {
      if (state === "working") return;
      const w = document.documentElement.clientWidth;
      setZoom(w < 830 ? String(Math.max(0.35, (w - 16) / 810)) : "");
    };
    fit();
    window.addEventListener("resize", fit, { passive: true });
    return () => window.removeEventListener("resize", fit);
  }, [state]);

  const sheets = useMemo(() => {
    const list: React.ReactNode[] = [
      <CoverPage key="cover" />,
      <IndexPage key="index" />,
      <ManifestoPage key="manifesto" />,
      <IdentityPage key="identity" />,
      <CapabilitiesPage key="capabilities" />,
      <NumbersPage key="numbers" />,
      <TimelinePage key="timeline" />,
    ];
    PROJECTS.forEach((p) => {
      list.push(<ProjectHeroPage key={`pj-${p.slug}`} p={p} />);
      if (p.hasDetail) list.push(<ProjectDetailPage key={`pjd-${p.slug}`} p={p} />);
    });
    list.push(<LedgerPage key="ledger" />);
    list.push(<ProcessPage key="process" />);
    list.push(<OffersPage key="offers" />);
    list.push(<ContactPage key="contact" />);
    return list;
  }, []);

  const jump = useCallback((id: string) => {
    document.getElementById(`folio-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div id="folio" ref={rootRef}>
      <div className="fol-viewport" style={{ zoom }}>
        <div className="fol-pages" ref={pagesRef}>
          {sheets}
        </div>
      </div>

      {/* toolbar */}
      <nav className="fol-toolbar" aria-label="Portfolio controls">
        <Link href="/" className="tb-back">← ABOALAZM OS</Link>
        <span className="tb-sep" aria-hidden />
        <button className="tb-btn" onClick={() => jump("cover")}>COVER</button>
        <button className="tb-btn" onClick={() => jump("pj-code-canvas-dev")}>WORK</button>
        <button className="tb-btn" onClick={() => jump("offers")}>OFFERS</button>
        <span className="tb-sep" aria-hidden />
        <button className="tb-btn" onClick={() => window.print()}>PRINT · طباعة</button>
        <button className="tb-btn tb-btn--accent" onClick={start} disabled={state === "working"}>
          {state === "working" ? "RENDERING…" : "↓ PDF · تحميل"}
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
