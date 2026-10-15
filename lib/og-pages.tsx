import { ImageResponse } from "next/og";
import type { ReactNode, CSSProperties } from "react";
import {
  C, F_EN, F_AR, F_BODY, OG_SIZE, OG_CONTENT_TYPE, Shell, Stage, Pic, Chip, Label,
  flex, col, ogImgs, ogImg, ogFonts,
} from "@/lib/og-kit";

/**
 * PER-PAGE SHARE CARDS — one entry per route. Each route's
 * `opengraph-image.tsx` is a 6-line file that calls `ogImage("<id>")`.
 *
 * The right-hand visual is bespoke per page so a shared link tells you what
 * the page *is* before you click it (pricing ladder, 38-day timeline,
 * browser windows, token sliders …). Copy mirrors each page's own <title> /
 * description; numbers come from lib/offers.ts so they cannot drift.
 */

export { OG_SIZE, OG_CONTENT_TYPE };

export type OgPageId =
  | "home" | "work"  | "work-ui" | "about" | "for-hiring" | "services"
  | "pricing" | "process" | "why" | "agreement" | "contact"
  | "capabilities" | "labs" | "resources" | "books" | "writing" | "portfolio";

interface PageDef {
  idx: string;
  eyebrow: string;
  tagAr: string;
  title: string[];
  desc: string;
  route: string;
  alt: string;
  visual: () => Promise<ReactNode>;
}

/* ───────────────────────── shared bits ───────────────────────── */

const PAD = 24;

function Dot({ color, size = 10 }: { color: string; size?: number }) {
  return <div style={flex({ width: size, height: size, borderRadius: 999, background: color })} />;
}

function Bar({ w, h = 8, color = C.line, r = 4 }: { w: number | string; h?: number; color?: string; r?: number }) {
  return <div style={flex({ width: w, height: h, borderRadius: r, background: color })} />;
}

function Cap({ children }: { children: ReactNode }) {
  return (
    <div
      style={flex({
        position: "absolute", left: 10, bottom: 10, fontFamily: F_EN, fontSize: 11, letterSpacing: "0.12em",
        textTransform: "uppercase", color: C.text, background: "rgba(8,7,16,0.78)", padding: "5px 9px", borderRadius: 6,
      })}
    >
      {children}
    </div>
  );
}

function Win({
  w, h, label, src, style,
}: { w: number; h: number; label: string; src: string; style?: CSSProperties }) {
  return (
    <div
      style={col({
        width: w, height: h, borderRadius: 14, overflow: "hidden", background: C.panel,
        border: `1px solid ${C.line}`, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", ...style,
      })}
    >
      <div style={flex({ height: 32, alignItems: "center", gap: 7, padding: "0 12px", background: "#1B1830", borderBottom: `1px solid ${C.line}` })}>
        <Dot color="#FF5F57" size={9} /><Dot color="#FEBC2E" size={9} /><Dot color="#28C840" size={9} />
        <div style={flex({ marginLeft: 8, height: 18, flex: 1, borderRadius: 9, background: "rgba(255,255,255,0.07)", alignItems: "center", padding: "0 10px", fontFamily: F_EN, fontSize: 10, letterSpacing: "0.1em", color: C.text3, textTransform: "uppercase" })}>
          {label}
        </div>
      </div>
      <div style={flex({ flex: 1 })}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={src} width="100%" height="100%" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : null}
      </div>
    </div>
  );
}

/* ───────────────────────── visuals ───────────────────────── */

async function vHome() {
  const i = await ogImgs({
    a: ["/images/work/cc-logo-hero.jpg", 460],
    b: ["/images/work/nile-pharma/npf-card.jpg", 460],
    c: ["/images/work/reflection/refl-card.jpg", 460],
    d: ["/images/work/gad/gad-card.jpg", 460],
    icon: ["/images/work/icon.png", 160],
  });
  return (
    <Stage style={{ padding: PAD }}>
      <div style={flex({ gap: 16, flex: 1 })}>
        <div style={col({ gap: 16, flex: 1 })}>
          <Pic src={i.a} w="100%" h={226} radius={18} />
          <Pic src={i.b} w="100%" h={170} radius={18} />
        </div>
        <div style={col({ gap: 16, flex: 1, marginTop: 34 })}>
          <Pic src={i.c} w="100%" h={170} radius={18} />
          <Pic src={i.d} w="100%" h={226} radius={18} />
        </div>
      </div>
      <div style={flex({ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: "linear-gradient(0deg, rgba(8,7,16,0.95), rgba(8,7,16,0))" })} />
      <div style={flex({ position: "absolute", left: PAD, bottom: 18, alignItems: "center", gap: 12 })}>
        <div style={flex({ width: 34, height: 34, borderRadius: 999, overflow: "hidden", border: `2px solid ${C.accent}` })}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          {i.icon ? <img src={i.icon} width="100%" height="100%" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
        </div>
        <Label color={C.text2} size={12}>Selected systems · AR / EN</Label>
      </div>
    </Stage>
  );
}

async function vWork() {
  const i = await ogImgs({
    a: ["/images/work/nile-erp-thumb.jpg", 360], b: ["/images/work/gad/gad-card.jpg", 360],
    c: ["/images/work/reflection/refl-card.jpg", 360], d: ["/images/work/code-canvas-dev/cc-dev-thumb.jpg", 360],
    e: ["/images/work/farm-thumb.jpg", 360], f: ["/images/work/zad-thumb.jpg", 360],
  });
  /* The console/product shots carry their own titles, and a 1.78 image cover-
     cropped into a 1.34 tile cut them mid-word ("le Pharma ERP"). Anything
     with type inside it is therefore shown whole; the two photographs stay
     cover-cropped. */
  const tiles: [string, string, string, "cover" | "contain"][] = [
    ["01", i.a, "Nile ERP", "contain"], ["02", i.b, "GAD Institute", "cover"], ["03", i.c, "Reflection", "cover"],
    ["04", i.d, "Code & Canvas", "contain"], ["05", i.e, "Farm", "contain"], ["06", i.f, "ZAD", "contain"],
  ];
  return (
    <Stage style={{ padding: PAD }}>
      <div style={flex({ flexWrap: "wrap", gap: 14, flex: 1 })}>
        {tiles.map(([n, src, name, fit]) => (
          <div key={n} style={flex({ width: 206, height: 154, position: "relative" })}>
            <Pic src={src} w="100%" h="100%" radius={16} pos="left center" fit={fit} />
            <div style={flex({ position: "absolute", left: 10, top: 10, fontFamily: F_EN, fontSize: 13, color: C.text, background: "rgba(8,7,16,0.78)", padding: "4px 9px", borderRadius: 6 })}>{n}</div>
            <Cap>{name}</Cap>
          </div>
        ))}
      </div>
    </Stage>
  );
}


async function vWorkUi() {
  const i = await ogImgs({ a: ["/images/work/nile-erp-thumb.jpg", 640], b: ["/images/work/farm-thumb.jpg", 640], c: ["/images/work/zad-thumb.jpg", 640] });
  return (
    <Stage>
      <div style={flex({ position: "absolute", left: 18, top: 26 })}>
        <Win w={330} h={236} label="Live · Nile ERP" src={i.a} />
      </div>
      <div style={flex({ position: "absolute", right: 16, top: 150 })}>
        <Win w={330} h={236} label="Live · Farm" src={i.b} />
      </div>
      <div style={flex({ position: "absolute", left: 40, bottom: 22 })}>
        <Win w={290} h={190} label="Live · ZAD" src={i.c} />
      </div>
      <div style={flex({ position: "absolute", right: 28, bottom: 28, alignItems: "center", gap: 10, background: C.accent, color: C.bg, padding: "10px 16px", borderRadius: 999, fontFamily: F_EN, fontSize: 14, letterSpacing: "0.1em" })}>
        OPEN LIVE →
      </div>
    </Stage>
  );
}

async function vAbout() {
  const i = await ogImgs({ icon: ["/images/work/icon.png", 420] });
  const stats: [string, string][] = [["09", "YEARS"], ["20+", "CLIENTS"], ["AR·EN", "BILINGUAL"]];
  return (
    <Stage style={{ padding: 28, alignItems: "center", justifyContent: "space-between" }}>
      <div style={flex({ marginTop: 6, width: 226, height: 226, borderRadius: 999, border: `4px solid ${C.accent}`, overflow: "hidden", boxShadow: "0 0 80px rgba(255,107,71,0.35)" })}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        {i.icon ? <img src={i.icon} width="100%" height="100%" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
      </div>
      <div style={col({ alignItems: "center", gap: 8 })}>
        <div style={flex({ fontFamily: F_EN, fontSize: 32, letterSpacing: "-0.01em" })}>MUSTAFA ABOALAZM</div>
        <Label color={C.text2} size={13}>Senior Brand Identity Designer</Label>
      </div>
      <div style={flex({ width: "100%", gap: 12 })}>
        {stats.map(([n, l]) => (
          <div key={l} style={col({ flex: 1, alignItems: "center", gap: 6, padding: "14px 6px", borderRadius: 16, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.03)" })}>
            <div style={flex({ fontFamily: F_EN, fontSize: 30, color: C.accent })}>{n}</div>
            <Label size={11}>{l}</Label>
          </div>
        ))}
      </div>
      <div style={flex({ gap: 8, justifyContent: "center" })}>
        <Chip tone="accent">Code & Canvas</Chip>
        <Chip>Co-founder</Chip>
        <Chip>Al Obour</Chip>
      </div>
    </Stage>
  );
}

async function vHiring() {
  const i = await ogImgs({ icon: ["/images/work/icon.png", 200] });
  return (
    <Stage style={{ padding: 28, justifyContent: "space-between" }}>
      <div style={flex({ justifyContent: "space-between", alignItems: "center" })}>
        <Label color={C.accent} size={14}>Candidate dossier</Label>
        <Label size={12}>REF · 2026</Label>
      </div>
      <div style={flex({ alignItems: "center", gap: 18 })}>
        <div style={flex({ width: 92, height: 92, borderRadius: 999, border: `3px solid ${C.accent}`, overflow: "hidden" })}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          {i.icon ? <img src={i.icon} width="100%" height="100%" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
        </div>
        <div style={col({ gap: 8 })}>
          <div style={flex({ fontFamily: F_EN, fontSize: 26 })}>Mustafa Aboalazm</div>
          <Label color={C.text2} size={12}>Senior Brand Identity Designer</Label>
        </div>
      </div>
      <div style={flex({ alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 16, background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.4)" })}>
        <Dot color={C.mint} size={14} />
        <div style={col({ gap: 4 })}>
          <Label color={C.mint} size={12}>Open to roles</Label>
          <div style={flex({ fontFamily: F_EN, fontSize: 20 })}>Gulf · Remote</div>
        </div>
      </div>
      <div style={flex({ flexWrap: "wrap", gap: 10 })}>
        <Chip>Brand identity</Chip><Chip>Design systems</Chip><Chip>Bilingual AR / EN</Chip>
        <Chip>Guidelines</Chip><Chip>Healthcare</Chip><Chip>Food</Chip>
      </div>
      <div style={flex({ justifyContent: "space-between", paddingTop: 14, borderTop: `1px solid ${C.line}` })}>
        <Label size={12}>9+ years in design</Label>
        <Label size={12}>Cairo · GMT+3</Label>
      </div>
    </Stage>
  );
}

async function vServices() {
  const rows: [string, string][] = [
    ["01", "Brand identity & strategy"], ["02", "Design systems"], ["03", "Web"],
    ["04", "Print & packaging"], ["05", "Art direction"],
  ];
  return (
    <Stage style={{ padding: 28, justifyContent: "space-between" }}>
      <Label color={C.accent} size={14}>Five services · one studio</Label>
      <div style={col({ gap: 12 })}>
        {rows.map(([n, name], idx) => (
          <div
            key={n}
            style={flex({
              alignItems: "center", gap: 18, padding: "16px 20px", borderRadius: 16,
              border: `1px solid ${idx === 0 ? "rgba(255,107,71,0.55)" : C.line}`,
              background: idx === 0 ? "rgba(255,107,71,0.1)" : "rgba(255,255,255,0.025)",
            })}
          >
            <div style={flex({ fontFamily: F_EN, fontSize: 16, color: idx === 0 ? C.accent : C.text3, width: 30 })}>{n}</div>
            <div style={flex({ flex: 1, fontFamily: F_EN, fontSize: 21, color: C.text })}>{name}</div>
            <div style={flex({ fontFamily: F_EN, fontSize: 20, color: idx === 0 ? C.accent : C.text3 })}>→</div>
          </div>
        ))}
      </div>
      <div style={flex({ gap: 8, alignItems: "center" })}>
        <Dot color={C.accent} size={8} /><Label size={12}>No handoff gaps</Label>
      </div>
    </Stage>
  );
}

async function vPricing() {
  const tiers: { n: string; name: string; price: string; note: string; hot?: boolean }[] = [
    { n: "01", name: "Logo Design", price: "$199", note: "7–10 days" },
    { n: "02", name: "Brand Identity Essentials", price: "$697", note: "3–4 weeks", hot: true },
    { n: "03", name: "Full Brand System", price: "$1,497", note: "5–7 weeks" },
  ];
  return (
    <Stage style={{ padding: 28, justifyContent: "space-between" }}>
      <div style={flex({ justifyContent: "space-between", alignItems: "center" })}>
        <Label color={C.accent} size={14}>Three tiers</Label>
        <Label size={12}>USD · stated upfront</Label>
      </div>
      <div style={col({ gap: 14 })}>
        {tiers.map((t) => (
          <div
            key={t.n}
            style={flex({
              alignItems: "center", justifyContent: "space-between", padding: t.hot ? "22px 22px" : "18px 22px",
              borderRadius: 18, position: "relative",
              border: `1px solid ${t.hot ? "rgba(255,107,71,0.7)" : C.line}`,
              background: t.hot ? "rgba(255,107,71,0.1)" : "rgba(255,255,255,0.03)",
              boxShadow: t.hot ? "0 0 50px rgba(255,107,71,0.18)" : "none",
            })}
          >
            <div style={col({ gap: 6, maxWidth: 210 })}>
              <Label color={t.hot ? C.accent : C.text3} size={12}>Tier {t.n}{t.hot ? " · Recommended" : ""}</Label>
              <div style={flex({ fontFamily: F_EN, fontSize: 19, lineHeight: 1.15 })}>{t.name}</div>
            </div>
            <div style={col({ alignItems: "flex-end", gap: 4 })}>
              <div style={flex({ fontFamily: F_EN, fontSize: 38, letterSpacing: "-0.02em", color: t.hot ? C.accent : C.text })}>{t.price}</div>
              <Label size={11}>{t.note}</Label>
            </div>
          </div>
        ))}
      </div>
      <Label size={12}>From $199 · negotiable</Label>
    </Stage>
  );
}

async function vProcess() {
  // proportional to the day ranges in lib/offers.ts PROCESS (6 · 4 · 18 · 11 working days)
  const ph: { n: string; name: string; d: number; color: string }[] = [
    { n: "01", name: "Discover", d: 6, color: C.cyan },
    { n: "02", name: "Strategy", d: 4, color: C.mint },
    { n: "03", name: "Design", d: 18, color: C.pink },
    { n: "04", name: "Deliver", d: 11, color: C.violet },
  ];
  const total = 39;
  const W = 428;
  return (
    <Stage style={{ padding: 28, justifyContent: "space-between" }}>
      <div style={flex({ justifyContent: "space-between", alignItems: "center" })}>
        <Label color={C.accent} size={14}>4 phases · 4 gates</Label>
        <Label size={12}>Sign-off</Label>
      </div>
      <div style={flex({ alignItems: "flex-end", gap: 14 })}>
        <div style={flex({ fontFamily: F_EN, fontSize: 168, lineHeight: 0.85, letterSpacing: "-0.05em" })}>38</div>
        <div style={col({ gap: 6, paddingBottom: 10 })}>
          <div style={flex({ fontFamily: F_EN, fontSize: 38, lineHeight: 1 })}>DAYS</div>
          <Label size={12}>Brief → handover</Label>
        </div>
      </div>
      <div style={col({ gap: 12 })}>
        <div style={flex({ gap: 4, width: W })}>
          {ph.map((p) => (
            <div key={p.n} style={col({ width: Math.round(((W - 12) * p.d) / total), gap: 8 })}>
              <div style={flex({ height: 14, borderRadius: 7, background: p.color })} />
              <div style={flex({ fontFamily: F_EN, fontSize: 11, color: p.color, letterSpacing: "0.1em" })}>{p.n}</div>
            </div>
          ))}
        </div>
        <div style={flex({ flexWrap: "wrap", gap: 8 })}>
          {ph.map((p) => (
            <div key={p.n} style={flex({ alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, border: `1px solid ${C.line}` })}>
              <Dot color={p.color} size={9} />
              <div style={flex({ fontFamily: F_EN, fontSize: 13, letterSpacing: "0.06em", color: C.text2 })}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

async function vWhy() {
  const outs: [string, string][] = [["WEB", C.cyan], ["PRINT", C.mint], ["SOCIAL", C.pink], ["AR / EN", C.violet]];
  return (
    <Stage style={{ padding: 28, alignItems: "center", justifyContent: "space-between" }}>
      <Label color={C.accent} size={14}>One source · every output</Label>
      <div style={col({ alignItems: "center", width: "100%" })}>
        <div style={flex({ padding: "20px 34px", borderRadius: 20, background: C.accent, color: C.bg, fontFamily: F_EN, fontSize: 28, letterSpacing: "-0.01em", boxShadow: "0 0 60px rgba(255,107,71,0.4)" })}>
          THE SYSTEM
        </div>
        <div style={flex({ width: 2, height: 36, background: C.line })} />
        <div style={flex({ width: 360, height: 2, background: C.line })} />
        <div style={flex({ width: 360, justifyContent: "space-between" })}>
          {outs.map(([n]) => (
            <div key={n} style={flex({ width: 2, height: 30, background: C.line })} />
          ))}
        </div>
        <div style={flex({ width: "100%", gap: 10, justifyContent: "center" })}>
          {outs.map(([n, c]) => (
            <div key={n} style={flex({ flex: 1, justifyContent: "center", padding: "14px 4px", borderRadius: 14, border: `1px solid ${c}`, background: "rgba(255,255,255,0.03)", fontFamily: F_EN, fontSize: 14, letterSpacing: "0.08em", color: c })}>
              {n}
            </div>
          ))}
        </div>
      </div>
      <div style={flex({ gap: 10, alignItems: "center", color: C.text3, fontFamily: F_EN, fontSize: 13, letterSpacing: "0.14em" })}>
        <div style={flex({ textDecoration: "line-through" })}>FILES</div>
        <div style={flex({ color: C.text2 })}>→</div>
        <div style={flex({ color: C.text })}>SYSTEMS</div>
      </div>
    </Stage>
  );
}


async function vAgreement() {
  const ph = ["Discovery call", "Kickoff & onboarding", "Discovery & research", "Brand strategy", "Concept development", "Full brand design", "Refinement & revisions", "Final delivery"];
  return (
    <Stage style={{ padding: 26, justifyContent: "space-between" }}>
      <div style={flex({ justifyContent: "space-between", alignItems: "center" })}>
        <Label color={C.accent} size={14}>Work-flow agreement</Label>
        <Label size={12}>8 phases</Label>
      </div>
      <div style={col({ gap: 7 })}>
        {ph.map((p, i) => (
          <div key={p} style={flex({ alignItems: "center", gap: 14, padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.lineSoft}` })}>
            <div style={flex({ width: 18, height: 18, borderRadius: 5, alignItems: "center", justifyContent: "center", background: C.accent })}><div style={flex({ width: 9, height: 5, marginTop: -2, borderLeft: `2px solid ${C.bg}`, borderBottom: `2px solid ${C.bg}`, transform: "rotate(-45deg)" })} /></div>
            <div style={flex({ fontFamily: F_EN, fontSize: 12, color: C.text3, width: 24 })}>{String(i + 1).padStart(2, "0")}</div>
            <div style={flex({ fontFamily: F_BODY, fontSize: 16, color: C.text })}>{p}</div>
          </div>
        ))}
      </div>
      <div style={col({ gap: 8 })}>
        <div style={flex({ gap: 6 })}>
          <div style={flex({ flex: 1, height: 28, borderRadius: 8, background: C.accent, alignItems: "center", justifyContent: "center", color: C.bg, fontFamily: F_EN, fontSize: 13, letterSpacing: "0.1em" })}>50% AT KICKOFF</div>
          <div style={flex({ flex: 1, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center", fontFamily: F_EN, fontSize: 13, letterSpacing: "0.1em" })}>50% AT DELIVERY</div>
        </div>
      </div>
    </Stage>
  );
}

async function vContact() {
  const rows: [string, string, string, string][] = [
    ["@", "Email", "m1aboalazm@gmail.com", C.accent],
    ["W", "WhatsApp", "Message directly", C.mint],
    ["in", "LinkedIn", "linkedin.com/in/aboalazm", C.cyan],
    ["Be", "Behance", "behance.net/aboalazm", C.violet],
  ];
  return (
    <Stage style={{ padding: 28, justifyContent: "space-between" }}>
      <Label color={C.accent} size={14}>Four ways in</Label>
      <div style={col({ gap: 12 })}>
        {rows.map(([ic, name, val, c]) => (
          <div key={name} style={flex({ alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 16, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.03)" })}>
            <div style={flex({ width: 44, height: 44, borderRadius: 999, alignItems: "center", justifyContent: "center", border: `1.5px solid ${c}`, color: c, fontFamily: F_EN, fontSize: 16 })}>{ic}</div>
            <div style={col({ gap: 3, flex: 1, minWidth: 0 })}>
              <div style={flex({ fontFamily: F_EN, fontSize: 19 })}>{name}</div>
              <div style={flex({ fontFamily: F_BODY, fontSize: 14, color: C.text3 })}>{val}</div>
            </div>
            <div style={flex({ fontFamily: F_EN, fontSize: 18, color: c })}>→</div>
          </div>
        ))}
      </div>
      <div style={flex({ gap: 10, alignItems: "center" })}>
        <Dot color={C.mint} size={10} />
        <Label color={C.text2} size={12}>Replies within 2 working days · Cairo time</Label>
      </div>
    </Stage>
  );
}

async function vCapabilities() {
  const sl: [string, string, number, string][] = [["SPACING", "8px", 0.4, C.cyan], ["RADIUS", "20px", 0.62, C.mint], ["TYPE SCALE", "1.25", 0.5, C.pink]];
  return (
    <Stage style={{ padding: 28, justifyContent: "space-between" }}>
      <div style={flex({ justifyContent: "space-between", alignItems: "center" })}>
        <Label color={C.accent} size={14}>Design tokens · live</Label>
        <div style={flex({ gap: 6 })}><Dot color={C.cyan} size={9} /><Dot color={C.mint} size={9} /><Dot color={C.pink} size={9} /></div>
      </div>
      <div style={col({ gap: 18 })}>
        {sl.map(([n, v, p, c]) => (
          <div key={n} style={col({ gap: 9 })}>
            <div style={flex({ justifyContent: "space-between" })}>
              <Label color={C.text2} size={12}>{n}</Label>
              <div style={flex({ fontFamily: F_EN, fontSize: 14, color: c })}>{v}</div>
            </div>
            <div style={flex({ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", position: "relative" })}>
              <div style={flex({ width: `${p * 100}%`, height: 8, borderRadius: 4, background: c })} />
              <div style={flex({ position: "absolute", left: `${p * 100}%`, top: -6, marginLeft: -10, width: 20, height: 20, borderRadius: 999, background: C.text, border: `3px solid ${c}` })} />
            </div>
          </div>
        ))}
      </div>
      <div style={col({ gap: 14, padding: 20, borderRadius: 20, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.04)" })}>
        <div style={flex({ gap: 8, alignItems: "center" })}><Bar w={36} h={36} r={18} color={C.accent} /><div style={col({ gap: 6 })}><Bar w={120} h={10} color="rgba(255,255,255,0.7)" /><Bar w={80} h={8} /></div></div>
        <Bar w="100%" h={8} /><Bar w="86%" h={8} />
        <div style={flex({ alignSelf: "flex-start", padding: "8px 18px", borderRadius: 20, background: C.accent, color: C.bg, fontFamily: F_EN, fontSize: 12, letterSpacing: "0.1em" })}>RECALCULATED</div>
      </div>
    </Stage>
  );
}

async function vLabs() {
  const lines: [string, string][] = [
    ["$", "brand-os init --lang ar,en"], ["ok", "tokens synced · 148"], ["ok", "contrast check · AA pass"],
    ["$", "prompt-system run audit"], ["..", "positioning draft · 3 variants"], ["ok", "guidelines exported"],
  ];
  return (
    <Stage>
      <div style={flex({ height: 40, alignItems: "center", gap: 8, padding: "0 16px", background: "#1B1830", borderBottom: `1px solid ${C.line}` })}>
        <Dot color="#FF5F57" size={10} /><Dot color="#FEBC2E" size={10} /><Dot color="#28C840" size={10} />
        <div style={flex({ marginLeft: 12, fontFamily: F_EN, fontSize: 12, letterSpacing: "0.12em", color: C.text3 })}>LABS · R&D</div>
      </div>
      <div style={col({ padding: "26px 26px", gap: 16, flex: 1 })}>
        {lines.map(([p, t], i) => (
          <div key={i} style={flex({ gap: 14, alignItems: "center", fontSize: 19 })}>
            <div style={flex({ width: 26, color: p === "$" ? C.accent : p === "ok" ? C.mint : C.text3, fontFamily: F_EN, fontSize: 15 })}>{p}</div>
            <div style={flex({ fontFamily: F_BODY, color: p === "$" ? C.text : C.text2 })}>{t}</div>
          </div>
        ))}
        <div style={flex({ gap: 14, alignItems: "center" })}>
          <div style={flex({ width: 26, color: C.accent, fontFamily: F_EN, fontSize: 15 })}>$</div>
          <div style={flex({ width: 12, height: 24, background: C.accent })} />
        </div>
      </div>
    </Stage>
  );
}

async function vResources() {
  const t = ["Brand OS Canvas", "Brand Audit", "Discovery", "Positioning", "Architecture", "Design System", "Governance", "AI Operations"];
  const colors = [C.accent, C.cyan, C.mint, C.pink, C.violet, C.cyan, C.mint, C.pink];
  return (
    <Stage style={{ padding: 24 }}>
      <div style={flex({ flexWrap: "wrap", gap: 12, flex: 1 })}>
        {t.map((n, i) => (
          <div key={n} style={col({ width: 200, height: 110, justifyContent: "space-between", padding: "14px 16px", borderRadius: 16, border: `1px solid ${i === 0 ? "rgba(255,107,71,0.6)" : C.line}`, background: i === 0 ? "rgba(255,107,71,0.1)" : "rgba(255,255,255,0.03)" })}>
            <div style={flex({ justifyContent: "space-between", alignItems: "center" })}>
              <div style={flex({ fontFamily: F_EN, fontSize: 14, color: colors[i] })}>{String(i + 1).padStart(2, "0")}</div>
              <Dot color={colors[i]!} size={8} />
            </div>
            <div style={flex({ fontFamily: F_EN, fontSize: 18, lineHeight: 1.1 })}>{n}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

async function vBooks() {
  const books: { t: string; sub: string; g: string; w: number }[] = [
    { t: "BASICS OF DESIGN", sub: "Book 01", g: `linear-gradient(100deg, ${C.violet}, #2B1B5A)`, w: 400 },
    { t: "MARKETING FUNDAMENTALS", sub: "Book 02", g: `linear-gradient(100deg, ${C.accent}, #7A2A16)`, w: 428 },
    { t: "VISUAL IDENTITY", sub: "Book 03", g: `linear-gradient(100deg, ${C.cyan}, #124A4A)`, w: 380 },
  ];
  return (
    <Stage style={{ padding: 26, justifyContent: "space-between" }}>
      <div style={flex({ justifyContent: "space-between", alignItems: "center" })}>
        <Label color={C.accent} size={14}>Three books</Label>
        <Label size={12}>Staged reading</Label>
      </div>
      <div style={col({ gap: 14 })}>
        {books.map((b, i) => (
          <div key={b.t} style={flex({ width: b.w, marginLeft: i === 1 ? 0 : i === 0 ? 14 : 34, height: 120, borderRadius: "8px 16px 16px 8px", background: b.g, padding: "0 24px", alignItems: "center", justifyContent: "space-between", boxShadow: "0 18px 40px rgba(0,0,0,0.5), inset 10px 0 0 rgba(0,0,0,0.22)" })}>
            <div style={col({ gap: 8 })}>
              <Label color="rgba(255,255,255,0.78)" size={11}>{b.sub} · Aboalazm OS</Label>
              <div style={flex({ fontFamily: F_EN, fontSize: b.t.length > 18 ? 22 : 28, lineHeight: 1.05, letterSpacing: "-0.02em", whiteSpace: "nowrap" })}>{b.t}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={flex({ alignItems: "center", gap: 10 })}>
        <Dot color={C.accent} size={8} /><Label size={12}>Interactive · bilingual-ready</Label>
      </div>
    </Stage>
  );
}

async function vWriting() {
  return (
    <Stage style={{ padding: 30, justifyContent: "space-between" }}>
      <div style={flex({ justifyContent: "space-between", alignItems: "flex-start" })}>
        <div style={flex({ fontFamily: F_AR, fontSize: 150, lineHeight: 0.9, letterSpacing: "-0.03em" })}>
          A<span style={{ color: C.accent }}>a</span>
        </div>
        <Label size={12}>Documents</Label>
      </div>
      <div style={col({ gap: 22 })}>
        {([["01", "92%", "70%"], ["02", "78%", "58%"], ["03", "86%", "64%"]] as [string, string, string][]).map(([n, a, b]) => (
          <div key={n} style={flex({ gap: 16, alignItems: "flex-start", paddingTop: 16, borderTop: `1px solid ${C.line}` })}>
            <div style={flex({ fontFamily: F_EN, fontSize: 14, color: C.accent, width: 28 })}>{n}</div>
            <div style={col({ gap: 10, flex: 1 })}>
              <Bar w={a} h={14} color="rgba(255,255,255,0.78)" r={7} />
              <Bar w={b} h={9} r={5} />
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

async function vPortfolio() {
  const i = await ogImgs({ box: ["/images/work/nile-pharma/npf-business-card-box.jpg", 520] });
  const slide = (extra: CSSProperties, front = false) => (
    <div style={col({ position: "absolute", width: 420, height: 236, borderRadius: 10, background: "#14110b", border: "1px solid rgba(242,236,223,0.16)", boxShadow: "0 28px 70px rgba(0,0,0,0.6)", overflow: "hidden", ...extra })}>
      {front ? (
        <div style={flex({ flex: 1, padding: 16, gap: 12 })}>
          <div style={col({ flex: 1, justifyContent: "space-between" })}>
            <div style={flex({ fontFamily: F_EN, fontSize: 8, letterSpacing: "0.14em", color: "rgba(242,236,223,0.5)" })}>MUSTAFA ABOALAZM — PORTFOLIO 2026</div>
            <div style={col({ fontFamily: F_EN, fontSize: 30, lineHeight: 0.95, letterSpacing: "-0.03em", color: "#f2ecdf" })}>
              <div style={flex({})}>SELECTED</div>
              <div style={flex({})}>WORKS <span style={{ color: "#ff5233", marginLeft: 8 }}>’26</span></div>
            </div>
            <div style={flex({ fontFamily: F_EN, fontSize: 8, letterSpacing: "0.14em", color: "rgba(242,236,223,0.5)" })}>BRAND IDENTITY SYSTEMS · AR / EN</div>
          </div>
          <Pic src={i.box} w={140} h="100%" radius={10} />
        </div>
      ) : null}
    </div>
  );
  return (
    <Stage>
      {slide({ left: 54, top: 34, transform: "rotate(-5deg)", opacity: 0.55 })}
      {slide({ left: 36, top: 96, transform: "rotate(-1.5deg)", opacity: 0.8 })}
      {slide({ left: 20, top: 170 }, true)}
      <div style={flex({ position: "absolute", right: 24, top: 28, alignItems: "center", gap: 8 })}>
        <Chip tone="accent">14 slides · 16:9</Chip>
      </div>
      <div style={flex({ position: "absolute", left: 24, bottom: 26, gap: 10 })}>
        <Chip>5 chapters</Chip><Chip>PDF · Print</Chip>
      </div>
    </Stage>
  );
}

/* ───────────────────────── registry ───────────────────────── */

export const OG_PAGES: Record<OgPageId, PageDef> = {
  home: {
    idx: "00", eyebrow: "Portfolio", tagAr: "هوية بصرية بتتبني كنظام", route: "/",
    title: ["Identity,", "built as a", "system."],
    desc: "Mustafa Aboalazm — Senior Brand Identity Designer. Arabic + English, 9+ years in design.",
    alt: "Mustafa Aboalazm — Senior Brand Identity Designer & Visual Systems Specialist", visual: vHome,
  },
  work: {
    idx: "01", eyebrow: "Selected work", tagAr: "أعمالي", route: "/work",
    title: ["Selected", "cases."],
    desc: "Identity systems and digital products — the problem, what shipped, and the outcome.",
    alt: "Work — selected brand identity and product cases", visual: vWork,
  },  "work-ui": {
    idx: "03", eyebrow: "UI / UX showcase", tagAr: "واجهات ومنتجات", route: "/work-ui",
    title: ["Interfaces,", "live."],
    desc: "A focused index of interface and product work — every entry links to the real, running site.",
    alt: "UI/UX showcase — live previews of interface and product work", visual: vWorkUi,
  },
  about: {
    idx: "04", eyebrow: "About", tagAr: "عن مصطفى", route: "/about",
    title: ["Designer,", "systems", "thinker."],
    desc: "Senior Brand Identity Designer and co-founder of Code & Canvas, based in Al Obour, Egypt.",
    alt: "About Mustafa Aboalazm — Senior Brand Identity Designer", visual: vAbout,
  },
  "for-hiring": {
    idx: "05", eyebrow: "For hiring teams", tagAr: "للشركات والتوظيف", route: "/for-hiring",
    title: ["For hiring", "teams."],
    desc: "Candidate dossier: 9+ years in design, 4+ focused on brand identity, across healthcare, food and consumer brands.",
    alt: "For hiring teams — candidate dossier, open to roles across the Gulf and remote", visual: vHiring,
  },
  services: {
    idx: "06", eyebrow: "Services", tagAr: "الخدمات", route: "/services",
    title: ["Strategy,", "identity,", "systems."],
    desc: "Five services, one studio, no handoff gaps.",
    alt: "Services — brand identity, design systems, web, print and art direction", visual: vServices,
  },
  pricing: {
    idx: "07", eyebrow: "Pricing", tagAr: "التسعير", route: "/pricing",
    title: ["No hidden", "fees."],
    desc: "Three transparent tiers, from a $199 logo to a full brand system. Stated upfront.",
    alt: "Pricing — three tiers from $199, stated upfront", visual: vPricing,
  },
  process: {
    idx: "08", eyebrow: "Method / process", tagAr: "المنهجية", route: "/process",
    title: ["The 38-day", "method."],
    desc: "Four phases, four gates — written sign-off at every step, refined over 9+ years.",
    alt: "Process — the 38-day, four-phase method", visual: vProcess,
  },
  why: {
    idx: "09", eyebrow: "Why", tagAr: "ليه النظام؟", route: "/why",
    title: ["Systems,", "not files."],
    desc: "Strategy before design, one source for every output, bilingual architecture built to scale.",
    alt: "Why — the case for systemic identity", visual: vWhy,
  },
  agreement: {
    idx: "11", eyebrow: "Agreement", tagAr: "اتفاق العمل", route: "/agreement",
    title: ["Work-flow", "agreement."],
    desc: "Eight phases, transparent terms and tiered payment splits — stated upfront.",
    alt: "Agreement — eight phases, transparent terms, tiered payments", visual: vAgreement,
  },
  contact: {
    idx: "12", eyebrow: "Contact", tagAr: "تواصل معي", route: "/contact",
    title: ["Let's", "talk."],
    desc: "Email, WhatsApp, LinkedIn or Behance — or send a brief. Replies within two working days.",
    alt: "Contact — start the conversation", visual: vContact,
  },
  capabilities: {
    idx: "13", eyebrow: "Capabilities", tagAr: "إمكانياتي", route: "/capabilities",
    title: ["Live token", "playground."],
    desc: "Drag the studio's real design tokens and watch a real layout recalculate. Zero design drift.",
    alt: "Capabilities — live design token playground", visual: vCapabilities,
  },
  labs: {
    idx: "14", eyebrow: "Labs", tagAr: "المعمل", route: "/labs",
    title: ["Labs &", "R&D."],
    desc: "AI workflows, brand-OS experiments, prompt systems and internal tools — tested before they become frameworks.",
    alt: "Labs — the research and experimentation layer behind Aboalazm OS", visual: vLabs,
  },
  resources: {
    idx: "15", eyebrow: "Resources", tagAr: "المصادر", route: "/resources",
    title: ["Knowledge", "base."],
    desc: "Eight connected frameworks for building brands with clarity, consistency and scale.",
    alt: "Resources — eight connected brand frameworks", visual: vResources,
  },
  books: {
    idx: "16", eyebrow: "Library", tagAr: "المكتبة", route: "/books",
    title: ["Interactive", "design", "library."],
    desc: "Books on design and branding, rebuilt as staged, interactive reading experiences.",
    alt: "Library — interactive design books", visual: vBooks,
  },
  writing: {
    idx: "17", eyebrow: "Writing", tagAr: "كتابات", route: "/writing",
    title: ["Notes from", "the system."],
    desc: "Working documents on identity, tokens and the craft of bilingual design.",
    alt: "Writing — notes from the system", visual: vWriting,
  },
  portfolio: {
    idx: "26", eyebrow: "Portfolio deck 2026", tagAr: "بورتفوليو", route: "/portfolio",
    title: ["Selected", "Works ’26."],
    desc: "A 14-slide, 16:9 deck — five brand chapters in Arabic + English. View, print or download as PDF.",
    alt: "Portfolio 2026 — Selected Works, a 14-slide 16:9 presentation deck", visual: vPortfolio,
  },
};

export const ogAlt = (id: OgPageId) => OG_PAGES[id].alt;

export async function ogImage(id: OgPageId) {
  const p = OG_PAGES[id];
  const visual = await p.visual();
  return new ImageResponse(
    (
      <Shell idx={p.idx} eyebrow={p.eyebrow} tagAr={p.tagAr} title={p.title} desc={p.desc} route={p.route}>
        {visual}
      </Shell>
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}

export { ogImg };
