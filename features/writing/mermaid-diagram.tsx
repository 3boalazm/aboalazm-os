"use client";

/**
 * MERMAID DIAGRAM — renders a `diagram` block from a Post's richText,
 * styled after the Lovable "Editorial Brand Systems" reference:
 * a bordered Figure container with a mono label row ("FIGURE · NN"),
 * the diagram itself, and a mono uppercase caption underneath.
 *
 * THEME-AWARE: the seeded mermaid definitions carry light-mode classDef
 * colors (indigo/green/red/amber pastels). On dark mode we swap each
 * hex for its dark-palette twin before rendering, and re-render when
 * html[data-theme] changes — so diagrams stay legible on both themes.
 *
 * Mermaid is loaded once from CDN via a <script> tag instead of being
 * bundled (~2MB of parser only /writing/[slug] needs). On failure the
 * raw definition is shown in a <pre> — degraded, not broken.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { NativeDiagram, parseMermaid } from "./diagram";

const MERMAID_SRC = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";

type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, code: string) => Promise<{ svg: string }>;
};

let loaderPromise: Promise<MermaidApi> | null = null;

function loadMermaid(): Promise<MermaidApi> {
  const w = window as unknown as { mermaid?: MermaidApi };
  if (w.mermaid) return Promise.resolve(w.mermaid);
  if (!loaderPromise) {
    loaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = MERMAID_SRC;
      script.async = true;
      script.onload = () => {
        if (!w.mermaid) return reject(new Error("mermaid failed to attach"));
        resolve(w.mermaid);
      };
      script.onerror = () => reject(new Error("mermaid CDN unreachable"));
      document.head.appendChild(script);
    });
  }
  return loaderPromise;
}

/** Light-palette hex → dark-palette twin (Lovable token pairs). */
const DARK_SWAP: [string, string][] = [
  ["#EEF2FF", "#1E1B4B"], ["#4F46E5", "#818CF8"], ["#312E81", "#E0E7FF"],
  ["#ECFDF5", "#052E22"], ["#059669", "#34D399"], ["#064E3B", "#D1FAE5"],
  ["#FEF2F2", "#3B0D0D"], ["#DC2626", "#F87171"], ["#7F1D1D", "#FECACA"],
  ["#FFFBEB", "#3F2A05"], ["#D97706", "#FBBF24"], ["#78350F", "#FEF3C7"],
];

function themedCode(code: string, dark: boolean) {
  if (!dark) return code;
  let out = code;
  for (const [light, darkHex] of DARK_SWAP) {
    out = out.split(light).join(darkHex).split(light.toLowerCase()).join(darkHex);
  }
  return out;
}

function isDarkTheme() {
  // Site convention (theme-provider): default is dark; light mode sets
  // html[data-theme="light"].
  return document.documentElement.getAttribute("data-theme") !== "light";
}

let renderSeq = 0;

export function MermaidDiagram({
  code,
  caption,
  figureNo,
}: {
  code: string;
  caption?: string;
  figureNo?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  // Native renderer first — Lovable-style HTML/CSS nodes parsed from the
  // stored definition. Mermaid (CDN) is only the fallback for anything
  // the parser doesn't understand.
  const parsed = useMemo(() => {
    try {
      return parseMermaid(code);
    } catch {
      return null;
    }
  }, [code]);

  useEffect(() => {
    if (parsed) return; // native renderer handles it — skip mermaid
    let cancelled = false;

    const draw = () => {
      const dark = isDarkTheme();
      renderSeq += 1;
      const id = `mmd-${renderSeq}`;
      loadMermaid()
        .then((mermaid) => {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            fontFamily: "inherit",
            theme: "base",
            themeVariables: dark
              ? {
                  background: "transparent",
                  primaryColor: "#14121C",
                  primaryTextColor: "#EDEAE2",
                  primaryBorderColor: "#8A8578",
                  lineColor: "#8A8578",
                  textColor: "#EDEAE2",
                  fontSize: "16px",
                }
              : {
                  background: "transparent",
                  primaryColor: "#F1EDE6",
                  primaryTextColor: "#0B0A08",
                  primaryBorderColor: "#6B655B",
                  lineColor: "#6B655B",
                  textColor: "#0B0A08",
                  fontSize: "16px",
                },
            // useMaxWidth:false → natural-size SVG; CSS below stretches it
            // to fill the figure, so diagrams stop floating tiny inside a
            // big empty box.
            flowchart: { htmlLabels: true, curve: "basis", useMaxWidth: false, nodeSpacing: 40, rankSpacing: 55 },
          });
          return mermaid.render(id, themedCode(code, dark));
        })
        .then(({ svg }) => {
          if (!cancelled && hostRef.current) hostRef.current.innerHTML = svg;
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    };

    draw();

    // Re-render when the site theme flips.
    const observer = new MutationObserver((muts) => {
      if (muts.some((m) => m.attributeName === "data-theme")) draw();
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [code, parsed]);

  return (
    <figure className="my-12">
      <div className="border border-border-subtle bg-surface-1 p-6 md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
            Figure{figureNo ? ` · ${String(figureNo).padStart(2, "0")}` : ""}
          </span>
          <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-ghost">
            {parsed ? "SYSTEM FLOW" : "SVG"}
          </span>
        </div>
        {parsed ? (
          <NativeDiagram parsed={parsed} />
        ) : failed ? (
          <pre className="whitespace-pre-wrap font-mono text-micro text-text-tertiary" dir="ltr">
            {code}
          </pre>
        ) : (
          <div
            ref={hostRef}
            className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-[720px]"
            dir="ltr"
          />
        )}
      </div>
      {caption ? (
        <figcaption className="mt-4 max-w-[68ch] font-mono text-micro uppercase tracking-[0.1em] text-text-tertiary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
