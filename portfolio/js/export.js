/* ═══════════════════════════════════════════════════════════════════════
   EXPORT — exact A4 PDF from the fixed sheets.
   ───────────────────────────────────────────────────────────────────────
   Pipeline: html2canvas rasterizes each .sheet at scale 2 (≈192dpi)
   → JPEG q0.92 → jsPDF A4 (210×297mm), one page per sheet, in order.

   All images are data URIs (assets/img.js) so the canvas is never
   tainted — export works offline, from file://, in any Chromium/Firefox.

   Fonts are awaited explicitly before capture so glyphs never rasterize
   with a fallback face.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const btnExport = $("#btn-export");
  const btnPrint = $("#btn-print");
  const overlay = $("#progress");
  const bar = $("#progress-bar");
  const lbl = $("#progress-page");
  const btnCancel = $("#progress-cancel");

  let exporting = false;
  let cancelled = false;

  /* ── vendor lazy-load (classic scripts, sequential) ─────────────────── */
  function loadScript(src) {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = () => rej(new Error("Failed to load " + src));
      document.head.appendChild(s);
    });
  }

  /* ── fonts must be ready before rasterizing ─────────────────────────── */
  async function ensureFonts() {
    if (!document.fonts) return;
    await document.fonts.ready;
    const faces = [
      '900 10px "GC Epicpro"', '400 10px "GC Epicpro"',
      '700 10px "Thmanyah Serif Display"', '900 10px "Thmanyah Serif Display"',
      '400 10px "Montserrat"', '700 10px "Montserrat"',
      '400 10px "IBM Plex Sans Arabic"', '700 10px "IBM Plex Sans Arabic"',
      '500 10px "JetBrains Mono"',
    ];
    await Promise.all(faces.map((f) => document.fonts.load(f, "ABابج12").catch(() => {})));
    await new Promise((r) => setTimeout(r, 120)); // settle layout
  }

  /* ── main export ────────────────────────────────────────────────────── */
  async function exportPDF() {
    if (exporting) return;
    exporting = true;
    cancelled = false;
    overlay.hidden = false;
    bar.style.width = "0%";
    lbl.textContent = "LOADING LIBRARIES…";
    const prevZoom = document.body.style.zoom;
    document.body.style.zoom = "";

    try {
      await loadScript("assets/vendor/html2canvas.min.js");
      await loadScript("assets/vendor/jspdf.umd.min.js");
      await ensureFonts();

      const sheets = window.__SHEETS;
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
      pdf.setProperties({
        title: "Mustafa Aboalazm — Portfolio 2026",
        subject: "Senior Brand Identity Designer — Brand Identity, Design Systems & Visual Governance",
        author: "Mustafa Aboalazm",
        keywords: "portfolio, brand identity, design systems, bilingual, Aboalazm, Code & Canvas",
        creator: "Aboalazm OS — Portfolio Edition",
      });

      /*
       * Export from an isolated fixed-size clone.
       * The live portfolio can be zoomed/responsive and some sheets contain
       * absolute positioning. Capturing the live node directly lets those
       * viewport transforms leak into html2canvas and produce shifted text.
       * A detached 794×1123 clone gives the rasterizer the exact A4 canvas.
       */
      const exportHost = document.createElement("div");
      exportHost.setAttribute("aria-hidden", "true");
      Object.assign(exportHost.style, {
        position: "fixed",
        left: "-10000px",
        top: "0",
        width: "794px",
        height: "1123px",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: "-1",
        zoom: "1",
        transform: "none",
      });
      document.body.appendChild(exportHost);

      try {
        for (let i = 0; i < sheets.length; i++) {
        if (cancelled) return finish(null);

        lbl.textContent = `PAGE ${i + 1}/${sheets.length}`;
        bar.style.width = `${((i + 1) / sheets.length) * 92}%`;

        const sheet = sheets[i];
        const clone = sheet.cloneNode(true);
        clone.style.width = "794px";
        clone.style.height = "1123px";
        clone.style.margin = "0";
        clone.style.transform = "none";
        clone.style.zoom = "1";
        clone.style.boxShadow = "none";
        exportHost.replaceChildren(clone);

        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const images = Array.from(clone.querySelectorAll("img"));
        await Promise.all(images.map(async (img) => {
          try {
            if (!img.complete) await new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            });
            if (img.decode) await img.decode().catch(() => {});
          } catch {}
        }));

        const canvas = await html2canvas(clone, {
          scale: 2,
          useCORS: false,
          allowTaint: false,
          backgroundColor: "#080710",
          logging: false,
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
          scrollX: 0,
          scrollY: 0,
          onclone: (doc) => {
            doc.documentElement.style.width = "794px";
            doc.documentElement.style.height = "1123px";
            doc.body.style.width = "794px";
            doc.body.style.minWidth = "794px";
            doc.body.style.margin = "0";
            doc.body.style.zoom = "1";
            doc.body.style.transform = "none";
          },
        });

        const img = canvas.toDataURL("image/jpeg", 0.95);
        if (i > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(img, "JPEG", 0, 0, 210, 297, undefined, "FAST");
        canvas.width = canvas.height = 0;
        exportHost.replaceChildren();
        await new Promise((r) => setTimeout(r, 10));
      }
      } finally {
        exportHost.remove();
      }

      bar.style.width = "100%";
      lbl.textContent = "SAVING…";
      pdf.save("Mustafa-Aboalazm-Portfolio-2026.pdf");
      finish(true);
    } catch (err) {
      console.error("[export]", err);
      lbl.textContent = "EXPORT FAILED — TRY PRINT INSTEAD (CTRL+P)";
      setTimeout(() => finish(false), 2600);
    }

    function finish() {
      setTimeout(() => {
        overlay.hidden = true;
        document.body.style.zoom = prevZoom;
        exporting = false;
      }, cancelled ? 0 : 500);
    }
  }

  /* ── dock wiring ────────────────────────────────────────────────────── */
  btnExport.addEventListener("click", exportPDF);
  btnCancel.addEventListener("click", () => { cancelled = true; overlay.hidden = true; exporting = false; });
  btnPrint.addEventListener("click", () => window.print());

  document.querySelectorAll("#dock [data-goto]").forEach((b) => {
    b.addEventListener("click", () => {
      const map = { cover: "pg-cover", work: "pg-pj-code-canvas-dev", offers: "pg-offers", contact: "pg-contact" };
      const el = document.getElementById(map[b.dataset.goto]);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ── fit-to-width (screen only; export neutralizes zoom) ────────────── */
  function fit() {
    if (exporting) return;
    const w = document.documentElement.clientWidth;
    document.body.style.zoom = w < 830 ? String(Math.max(0.35, (w - 16) / 810)) : "";
  }
  window.addEventListener("resize", fit, { passive: true });
  fit();
})();
