"use client";

/**
 * PDF EXPORT — exact 16:9 from the fixed slides.
 * html2canvas rasterizes each .fol-sheet at scale 2 (3200×1800) → JPEG →
 * jsPDF custom 16:9 pages (297×167mm) in order. Vendor libs lazy-load from
 * /portfolio-vendor/* on first export; all slide images are same-origin
 * (/images/work/*) so the canvas is never tainted. Fonts are awaited
 * before capture.
 */

import { useCallback, useRef, useState } from "react";

type ExportState = "idle" | "working" | "saving" | "error";

declare global {
  interface Window {
    html2canvas?: (el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
    jspdf?: { jsPDF: new (opts: Record<string, unknown>) => PdfDoc };
  }
}

interface PdfDoc {
  setProperties(props: Record<string, string>): void;
  addImage(data: string, fmt: string, x: number, y: number, w: number, h: number, alias?: unknown, compression?: string): void;
  addPage(format: number[], orientation: string): void;
  save(name: string): void;
}

const SHEET_W = 1600;
const SHEET_H = 900;
/** 16:9 page, fits the classic 297mm presentation width */
const PAGE_W = 297;
const PAGE_H = 167.06;

function loadScript(src: string): Promise<void> {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => res();
    s.onerror = () => rej(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function ensureFonts(): Promise<void> {
  if (!document.fonts) return;
  await document.fonts.ready;
  const faces = [
    '900 10px "GC Epicpro"', '400 10px "GC Epicpro"',
    '700 10px "Thmanyah Serif Display"', '900 10px "Thmanyah Serif Display"',
    '400 10px "Fol Montserrat"', '700 10px "Fol Montserrat"',
    '400 10px "Fol Plex Arabic"', '700 10px "Fol Plex Arabic"',
    '500 10px "Fol Mono"',
  ];
  await Promise.all(faces.map((f) => document.fonts.load(f, "ABابج12").catch(() => undefined)));
  await new Promise((r) => setTimeout(r, 120));
}

export function usePdfExport(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [state, setState] = useState<ExportState>("idle");
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("");
  const cancelled = useRef(false);

  const cancel = useCallback(() => {
    cancelled.current = true;
    setState("idle");
  }, []);

  const start = useCallback(async () => {
    if (state === "working" || state === "saving") return;
    cancelled.current = false;
    setState("working");
    setProgress(0);
    setLabel("LOADING LIBRARIES…");

    try {
      await loadScript("/portfolio-vendor/html2canvas.min.js");
      await loadScript("/portfolio-vendor/jspdf.umd.min.js");
      await ensureFonts();

      const html2canvas = window.html2canvas;
      const jsPDFCtor = window.jspdf?.jsPDF;
      if (!html2canvas || !jsPDFCtor) throw new Error("vendor libs missing");

      const container = containerRef.current;
      const sheets = container ? Array.from(container.querySelectorAll<HTMLElement>(".fol-sheet")) : [];
      if (sheets.length === 0) throw new Error("no sheets found");

      const pdf = new jsPDFCtor({ unit: "mm", format: [PAGE_W, PAGE_H], orientation: "landscape", compress: true });
      pdf.setProperties({
        title: "Mustafa Aboalazm — Portfolio 2026",
        subject: "Systemic Identity Architect — Selected Works 16:9 presentation deck",
        author: "Mustafa Aboalazm",
        keywords: "portfolio, brand identity, design systems, bilingual, Aboalazm, Code & Canvas",
        creator: "Aboalazm OS — Portfolio Deck",
      });

      const prevZoom = container?.style.zoom ?? "";
      if (container) container.style.zoom = "";

      for (let i = 0; i < sheets.length; i++) {
        if (cancelled.current) {
          if (container) container.style.zoom = prevZoom;
          setState("idle");
          return;
        }
        setLabel(`SLIDE ${i + 1}/${sheets.length}`);
        setProgress(Math.round(((i + 1) / sheets.length) * 92));
        const sheet = sheets[i];
        if (!sheet) continue;

        const canvas = await html2canvas(sheet, {
          scale: 2,
          useCORS: false,
          allowTaint: false,
          backgroundColor: "#14110b",
          logging: false,
          width: SHEET_W,
          height: SHEET_H,
          windowWidth: SHEET_W,
          windowHeight: SHEET_H,
          scrollX: 0,
          scrollY: 0,
        });

        const img = canvas.toDataURL("image/jpeg", 0.92);
        if (i > 0) pdf.addPage([PAGE_W, PAGE_H], "landscape");
        pdf.addImage(img, "JPEG", 0, 0, PAGE_W, PAGE_H, undefined, "FAST");
        canvas.width = 0;
        canvas.height = 0;
        await new Promise((r) => setTimeout(r, 10));
      }

      if (container) container.style.zoom = prevZoom;
      setState("saving");
      setLabel("SAVING…");
      setProgress(100);
      pdf.save("Mustafa-Aboalazm-Portfolio-2026.pdf");
      setTimeout(() => setState("idle"), 900);
    } catch (err) {
      console.error("[portfolio:export]", err);
      setState("error");
      setLabel("EXPORT FAILED — TRY PRINT INSTEAD (CTRL+P)");
      setTimeout(() => setState("idle"), 3500);
    }
  }, [state, containerRef]);

  return { state, progress, label, start, cancel };
}
