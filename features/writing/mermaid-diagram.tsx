"use client";

/**
 * MERMAID DIAGRAM — renders a `diagram` block from a Post's richText.
 *
 * Mermaid is loaded once from CDN via a <script> tag instead of being
 * bundled: it's ~2MB of parser that only /writing/[slug] pages with
 * diagrams ever need, and a runtime script tag keeps it out of every
 * webpack/turbopack chunk entirely. On failure (offline, CDN blocked)
 * the raw definition is shown in a <pre> so the content never
 * disappears — degraded, not broken.
 */
import { useEffect, useRef, useState } from "react";

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
        w.mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
          fontFamily: "inherit",
          flowchart: { htmlLabels: true, curve: "basis" },
        });
        resolve(w.mermaid);
      };
      script.onerror = () => reject(new Error("mermaid CDN unreachable"));
      document.head.appendChild(script);
    });
  }
  return loaderPromise;
}

let renderSeq = 0;

export function MermaidDiagram({ code, caption }: { code: string; caption?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    renderSeq += 1;
    const id = `mmd-${renderSeq}`;

    loadMermaid()
      .then((mermaid) => mermaid.render(id, code))
      .then(({ svg }) => {
        if (!cancelled && hostRef.current) hostRef.current.innerHTML = svg;
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <figure className="mt-6">
      <div className="overflow-x-auto rounded-md border border-border-subtle bg-surface-1 p-4">
        {failed ? (
          <pre className="whitespace-pre-wrap font-mono text-micro text-text-tertiary" dir="ltr">
            {code}
          </pre>
        ) : (
          <div ref={hostRef} className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full" dir="ltr" />
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 max-w-[68ch] font-mono text-micro text-text-tertiary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
