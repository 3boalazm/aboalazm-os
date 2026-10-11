import { BLUE_LIGHT, RED, RED_TEXT } from "./tokens";

const IMG = "/images/work/gad";
const card = { background: "rgb(255 255 255 / 0.04)", border: "1px solid rgb(255 255 255 / 0.1)" };

/* Plain <img>: local SVG, and the don't-demos transform it with CSS. */
function Mark({ size, className = "", style }: { size: number; className?: string; style?: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${IMG}/gad-mark.svg`} alt="" width={size} height={size} className={className} style={{ width: size, height: size, ...style }} />
  );
}

function Sub({ n, title, children }: { n: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: RED_TEXT }}>{n}</p>
      <h5 className="text-2xl font-bold text-white">{title}</h5>
      {children && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">{children}</p>}
    </div>
  );
}

const MARK = 120; // px, symbol size in the clear-space diagram
const X = MARK / 2; // clear space = 0.5 × the symbol

function ClearSpace() {
  return (
    <div className="rounded-2xl bg-white p-8">
      <div
        className="relative mx-auto w-fit rounded-md"
        style={{ padding: X, border: `2px dashed ${RED}` }}
      >
        <Mark size={MARK} />
        {[
          "left-1/2 top-3 -translate-x-1/2",
          "bottom-3 left-1/2 -translate-x-1/2",
          "left-2 top-1/2 -translate-y-1/2",
          "right-2 top-1/2 -translate-y-1/2",
        ].map((pos) => (
          <span key={pos} className={`absolute rounded px-1.5 py-0.5 text-[11px] font-bold text-white ${pos}`} style={{ background: RED }}>0.5×</span>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-[#33424E]">x = height of the symbol</p>
    </div>
  );
}

function Sizing() {
  return (
    <div className="rounded-2xl bg-white p-8">
      <div className="grid grid-cols-10 gap-1" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="flex h-20 items-end justify-center rounded-md pb-2"
            style={{ background: i === 0 ? "rgb(0 88 149 / 0.16)" : "rgb(0 88 149 / 0.07)" }}
          >
            {i === 0 ? <Mark size={30} /> : <span className="text-[10px] text-[#33424E]">{i + 1}</span>}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-[#33424E]">Logo = 1/10 of the layout’s shorter side · margin 0.5×–1× of its height</p>
    </div>
  );
}

const DONTS: { label: string; render: () => React.ReactNode; plate?: React.CSSProperties }[] = [
  { label: "Do not rotate", render: () => <Mark size={64} style={{ transform: "rotate(18deg)" }} /> },
  { label: "Do not stretch or distort", render: () => <Mark size={64} style={{ transform: "scaleX(1.6)" }} /> },
  { label: "Do not crop", render: () => <Mark size={64} style={{ clipPath: "inset(0 34% 30% 0)" }} /> },
  {
    label: "Do not change the colours",
    // a green silhouette of the mark, via the SVG's own alpha as a mask
    render: () => (
      <span
        aria-hidden
        className="block"
        style={{ width: 64, height: 64, background: "#2E9E4F", mask: `url(${IMG}/gad-mark.svg) center/contain no-repeat`, WebkitMask: `url(${IMG}/gad-mark.svg) center/contain no-repeat` }}
      />
    ),
  },
  { label: "No shadows or effects", render: () => <Mark size={64} style={{ filter: "drop-shadow(5px 6px 3px rgb(0 0 0 / 0.55))" }} /> },
  {
    label: "No busy backgrounds",
    render: () => <Mark size={64} />,
    plate: { background: "repeating-linear-gradient(45deg,#e8e2d8 0 10px,#c9bfae 10px 20px)" },
  },
];

function Donts() {
  return (
    <ul className="grid grid-cols-2 gap-3 @2xl:grid-cols-3">
      {DONTS.map((d) => (
        <li key={d.label} className="relative flex h-44 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-white" style={d.plate}>
          <span aria-hidden className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: RED }}>✕</span>
          <span className="flex h-20 items-center justify-center">{d.render()}</span>
          <span className="rounded bg-white/85 px-2 text-center text-xs font-bold text-[#33424E]">{d.label}</span>
        </li>
      ))}
    </ul>
  );
}

type Rule = { t: string; src?: string };

// `src` marks rules quoted from the brand book; the rest extend it.
const DO: Rule[] = [
  { t: "Use the original logo artwork supplied by the GAD Brand Team", src: "p.12" },
  { t: "Keep the lock-up complete: symbol, GAD, and the name in English and Arabic", src: "p.12" },
  { t: "Use approved colours and proportions", src: "p.14" },
  { t: "Pair the symbol with the full logo for new audiences", src: "p.14" },
  { t: "Keep the 0.5× clear space on every side" },
];
const DONT: Rule[] = [
  { t: "Recreate, modify or realign any element of the logo", src: "p.12" },
  { t: "Lock up website URLs or other text with the logo", src: "p.12" },
  { t: "Translate the institute name beyond the approved Arabic and English", src: "p.12" },
  { t: "Add text to the symbol or modify it", src: "p.14" },
  { t: "Rotate, stretch, crop or recolour it; add shadows; use busy backgrounds" },
];

function List({ title, items, color, mark }: { title: string; items: Rule[]; color: string; mark: string }) {
  return (
    <div className="rounded-2xl p-7" style={card}>
      <h6 className="mb-4 text-sm font-bold uppercase tracking-widest" style={{ color }}>{title}</h6>
      <ul className="space-y-2.5">
        {items.map((r) => (
          <li key={r.t} className="flex gap-3 text-sm text-white/80">
            <span aria-hidden className="font-bold" style={{ color }}>{mark}</span>
            <span>
              {r.t}
              {r.src && <span className="ml-2 whitespace-nowrap rounded border border-white/20 px-1.5 py-0.5 text-[11px] text-white/70">book {r.src}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Usage rules: clear space, sizing, don'ts, do/don't. */
export function Usage() {
  return (
    <div className="space-y-20">
      <div className="grid items-start gap-10 @3xl:grid-cols-2">
        <div>
          <Sub n="A" title="Clear space — 0.5×">
            Keep the logo free of graphics, text and edges: 0.5× on every side, where x is the height of the heart-and-lungs symbol.
          </Sub>
          <ClearSpace />
        </div>
        <div>
          <Sub n="B" title="Sizing — 1 : 10">
            Split the layout into ten equal parts along its shorter side; the logo takes one. A 1920 × 1080 layout puts the logo at 108&nbsp;px tall.
          </Sub>
          <Sizing />
        </div>
      </div>
      <div>
        <Sub n="C" title="Never do this" />
        <Donts />
      </div>
      <div>
        <Sub n="D" title="Keep the heartbeat steady">
          Rules tagged <span className="rounded border border-white/20 px-1.5 py-0.5 text-[11px] text-white/70">book p.12</span> are quoted from the brand book; the rest extend it.
        </Sub>
        <div className="grid gap-4 @2xl:grid-cols-2">
          <List title="Do" items={DO} color={BLUE_LIGHT} mark="✓" />
          <List title="Don’t" items={DONT} color={RED_TEXT} mark="✕" />
        </div>
      </div>
    </div>
  );
}
