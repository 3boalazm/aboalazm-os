/* ═══════════════════════════════════════════════════════════════════════
   RENDER — builds every A4 sheet from window.DATA.
   Fixed 794×1123px pages = exact A4 @96dpi (print & PDF map 1:1).
   Page numbers are computed in one pre-pass, then the INDEX page
   (page 02) lists every section and project with its real page.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const D = window.DATA;
  const PROJECT_ORDER = ["nile-pharma", "gad-institute", "code-canvas", "ahmed-bedeer", "code-canvas-dev", "reflection", "esfc", "learn-in-arabic", "youth-scope", "nile-pharma-erp", "momo-collective", "zad", "farm-console"];
  D.projects.sort((a, b) => PROJECT_ORDER.indexOf(a.slug) - PROJECT_ORDER.indexOf(b.slug));
  D.projects.forEach((p, i) => { p.idx = "P." + String(i + 1).padStart(2, "0"); });
  const IMG = window.IMG || {};
  const $pages = document.getElementById("pages");

  /* ── helpers ────────────────────────────────────────────────────────── */
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function h(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function bg(el, key) {
    const src = IMG[key];
    if (src) el.style.backgroundImage = `url("${src}")`;
    else el.classList.add("is-missing");
    return el;
  }

  function glow(parent, color, css) {
    const g = h(`<div class="glow" style="background:radial-gradient(circle, ${hexA(color, 0.16)} 0%, ${hexA(color, 0.0)} 68%);"></div>`);
    Object.assign(g.style, css);
    parent.appendChild(g);
  }

  function hexA(hex, a) {
    const m = hex.replace("#", "");
    const r = parseInt(m.slice(0, 2), 16), g = parseInt(m.slice(2, 4), 16), b = parseInt(m.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`; /* legacy form — html2canvas gradient parser safe */
  }

  const CHROME_BOT = `
    <div class="chrome-bot">
      <span>aboalazm-os.vercel.app <span class="cb-dot">·</span> behance.net/aboalazm</span>
      <span>AL OBOUR · 30.1936° N 31.4603° E</span>
      <span>PORTFOLIO ${esc(D.identity.version.split("·")[0].trim())}</span>
    </div>`;

  function makeSheet(id, secLabel, pageNo) {
    const s = h(`
      <section class="sheet" id="pg-${id}" data-page="${pageNo}">
        <div class="chrome-top">
          <span class="ct-name">MUSTAFA ABOALAZM</span>
          <span class="ct-sec">${esc(secLabel)}</span>
          <span class="ct-no">${String(pageNo).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}</span>
        </div>
        ${CHROME_BOT}
      </section>`);
    $pages.appendChild(s);
    return s;
  }

  function content(sheet) {
    const c = h(`<div class="content"></div>`);
    sheet.appendChild(c);
    return c;
  }

  /* ── page-number pre-pass ───────────────────────────────────────────── */
  const FRONT = ["cover", "index"].length; // 2
  let cursor = FRONT + 1; // first work page
  const projPage = {};
  for (const p of D.projects) {
    projPage[p.slug] = cursor;
    cursor += 1 + (p.hasDetail ? 1 : 0);
  }
  const PG_LEDGER = cursor++, PG_PROCESS = cursor++, PG_OFFERS = cursor++, PG_CONTACT = cursor++;
  const TOTAL = PG_CONTACT;
  // fill total on every sheet (makeSheet reads TOTAL after pre-pass) — done above.

  const SECTIONS = [
    { key: "manifesto",    no: "01", en: "Manifesto",    ar: "البيان",        pg: 3 },
    { key: "identity",     no: "02", en: "Identity System", ar: "نظام الهوية", pg: 4 },
    { key: "capabilities", no: "03", en: "Capabilities", ar: "القدرات",       pg: 5 },
    { key: "numbers",      no: "04", en: "By the Numbers", ar: "بالأرقام",     pg: 6 },
    { key: "timeline",     no: "05", en: "Career Timeline", ar: "المسيرة",     pg: 7 },
    { key: "work",         no: "06", en: "Selected Work", ar: "الأعمال",       pg: 8 },
    { key: "ledger",       no: "07", en: "Project Ledger", ar: "سجل المشاريع", pg: PG_LEDGER },
    { key: "process",      no: "08", en: "Process",      ar: "المنهجية",      pg: PG_PROCESS },
    { key: "offers",       no: "09", en: "Offers",       ar: "العروض",        pg: PG_OFFERS },
    { key: "contact",      no: "10", en: "Contact",      ar: "التواصل",       pg: PG_CONTACT },
  ];

  /* ═══ 01 · COVER ═══════════════════════════════════════════════════ */
  function pageCover() {
    const s = makeSheet("cover", "COVER — الغلاف", 1);
    s.classList.add("p-cover");
    glow(s, "#FF6B47", { width: 560, height: 560, left: -160, top: -140 });
    glow(s, "#7850C8", { width: 640, height: 640, right: -200, bottom: -180 });

    const c = content(s);
    c.appendChild(h(`
      <div style="display:flex; flex-direction:column; height:100%;">
        <div class="kicker">${esc(D.cover.kicker)} <span class="ar">الإصدار الأول</span></div>

        <div class="cv-grid" style="margin-top:40px;">
          <div>
            <h1 class="d-hero cv-name">MUSTAFA<br>ABOALAZM<span class="cv-os">OS</span></h1>
            <p class="serif-i" style="font-size:27px; color:var(--coral); margin-top:22px;">${esc(D.identity.role)}</p>
            <p class="lead" style="max-width:44ch; margin-top:14px;">${esc(D.cover.lede)}</p>
            <p class="ar-body" style="max-width:40ch; margin-top:6px; direction:rtl; text-align:right;">${esc(D.cover.ledeAr)}</p>
          </div>
          <div class="cv-avatar-wrap">
            <div id="cv-av" class="avatar" style="width:200px; height:200px;"></div>
            <div class="cv-coords">30.1936° N<br>31.4603° E<br>AL OBOUR · EGYPT<br><span style="color:var(--coral)">WORKS WORLDWIDE</span></div>
          </div>
        </div>

        <div style="flex:1;"></div>

        <div class="g4" style="gap:0;">
          ${D.cover.metrics.map((m) => `
            <div class="stat" style="border-top:2px solid var(--coral); padding:16px 14px 0 0;">
              <div class="stat-n" style="font-size:44px;">${m.pre || ""}${esc(m.n)}<span class="suf">${esc(m.suf)}</span></div>
              <div class="stat-l">${esc(m.l)}</div>
              <div class="stat-c">${esc(m.c)}</div>
            </div>`).join("")}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:26px; padding-top:12px; border-top:1px solid var(--line-1);">
          <span class="micro">SELECTED WORK 2019 — 2026 · 13 PROJECTS</span>
          <span class="micro" style="color:var(--coral)">${esc(D.identity.version)}</span>
        </div>
      </div>`));

    bg(c.querySelector("#cv-av"), "avatar");
  }

  /* ═══ 02 · INDEX ═══════════════════════════════════════════════════ */
  function pageIndex() {
    const s = makeSheet("index", "PROFILE + INDEX — الملف والفهرس", 2);
    const c = content(s);
    c.appendChild(h(`
      <div style="display:flex; flex-direction:column; height:100%;">
        <div class="kicker">PROFILE + INDEX <span class="ar">الملف + الفهرس</span></div>
        <div style="display:grid; grid-template-columns:1.08fr .92fr; gap:34px; margin-top:18px;">
          <div>
            <p class="serif-i" style="font-size:30px; color:var(--ink-48);">I don't design brands.</p>
            <h2 class="d1" style="font-size:62px; margin-top:0;">I build <span class="serif-i accent">systems.</span></h2>
            <p class="lead" style="margin-top:14px; max-width:46ch;">Senior Brand Identity Designer building bilingual identity systems from strategy through governed applications — with digital products when the system needs to ship.</p>
            <p class="ar-body" style="margin-top:7px; max-width:46ch; direction:rtl; text-align:left;">مصمم هويات بصرية يبني أنظمة ثنائية اللغة من الاستراتيجية حتى التطبيقات، مع خبرة رقمية عندما يحتاج النظام أن يتحول إلى منتج.</p>
            <div class="g3" style="margin-top:20px; gap:10px;">
              <div class="stat" style="border-top:2px solid var(--coral); padding-top:10px;"><div class="stat-n" style="font-size:38px;">9<span class="suf">+</span></div><div class="stat-l">YEARS DESIGN</div></div>
              <div class="stat" style="border-top:2px solid var(--coral); padding-top:10px;"><div class="stat-n" style="font-size:38px;">4<span class="suf">+</span></div><div class="stat-l">YEARS IDENTITY</div></div>
              <div class="stat" style="border-top:2px solid var(--coral); padding-top:10px;"><div class="stat-n" style="font-size:38px;">20<span class="suf">+</span></div><div class="stat-l">CLIENTS / ORGS</div></div>
            </div>
          </div>
          <div>
            <p class="micro" style="color:var(--coral); padding-bottom:10px; border-bottom:1px solid var(--line-2);">01 · SELECTED WORK — 13 PROJECTS</p>
            ${D.projects.map((p) => `
              <div class="ix-sub">
                <span class="s-no">${esc(p.idx.replace("P.", ""))}</span>
                <span class="s-name">${esc(p.name)} <span class="s-cat">· ${esc(p.category)}</span></span>
                <span class="s-pg">${String(projPage[p.slug]).padStart(2, "0")}</span>
              </div>`).join("")}
          </div>
        </div>
        <div style="flex:1;"></div>
        <div style="border-top:1px solid var(--line-2); padding-top:14px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
          <div><div class="micro" style="color:var(--coral)">MY ROLE</div><div class="body-sm" style="margin-top:4px;">Strategy · Identity · Art Direction · Governance</div></div>
          <div><div class="micro" style="color:var(--coral)">PROOF</div><div class="body-sm" style="margin-top:4px;">Real systems, applications, and reported outcomes.</div></div>
          <div><div class="micro" style="color:var(--coral)">NEXT</div><div class="body-sm" style="margin-top:4px;">Start with a case study, then inspect the system behind it.</div></div>
        </div>
      </div>`));
  }

  /* ═══ 03 · MANIFESTO ═══════════════════════════════════════════════ */
  function pageManifesto() {
    const s = makeSheet("manifesto", "MANIFESTO — البيان", 3);
    s.appendChild(h(`<div class="ghost">01</div>`));
    glow(s, "#FF6B47", { width: 520, height: 520, right: -140, top: 60 });
    const c = content(s);
    const M = D.manifesto;
    c.appendChild(h(`
      <div style="display:flex; flex-direction:column; height:100%;">
        <div class="kicker">MANIFESTO <span class="ar">البيان</span></div>

        <div style="margin-top:34px;">
          <p class="serif-i" style="font-size:40px; color:var(--ink-48);">${esc(M.quiet)}</p>
          <h2 class="d1" style="font-size:76px; margin-top:4px;">${esc(M.loud)}</h2>
          <p class="ar-disp" style="font-size:24px; margin-top:16px; direction:rtl; text-align:left; color:var(--ink-68);">${esc(M.quietAr)} <span style="color:var(--coral)">${esc(M.loudAr)}</span></p>
        </div>

        <p class="lead" style="max-width:58ch; margin-top:24px;">${esc(M.lead)}</p>

        <div style="margin-top:26px;">
          <p class="micro" style="margin-bottom:10px;">${esc(M.chainNote)}</p>
          <div class="flow">
            ${M.chain.map((n, i) => `<span class="f-node ${i === 0 || i === M.chain.length - 1 ? "f-node--hot" : ""}">${esc(n)}</span>${i < M.chain.length - 1 ? '<span class="f-arr">→</span>' : ""}`).join("")}
          </div>
        </div>

        <div style="flex:1;"></div>

        <div>
          <p class="micro" style="margin-bottom:8px;">THE DOCTRINE — المبادئ</p>
          ${M.doctrine.map((d, i) => `
            <div class="lrow" style="grid-template-columns:52px 1fr;">
              <span class="lno">0${i + 1}</span>
              <span>
                <span class="lmain">${esc(d.t)}</span>
                <div class="lsub" style="max-width:64ch;">${esc(d.d)}</div>
              </span>
            </div>`).join("")}
        </div>
      </div>`));
  }

  /* ═══ 04 · IDENTITY SYSTEM ═════════════════════════════════════════ */
  function pageIdentity() {
    const s = makeSheet("identity", "IDENTITY SYSTEM — نظام الهوية", 4);
    s.appendChild(h(`<div class="ghost">02</div>`));
    const c = content(s);
    const I = D.identitySystem;
    const av = h(`<div class="avatar" style="width:92px; height:92px; flex:0 0 auto;"></div>`);
    bg(av, "avatar");

    c.appendChild(h(`<div style="display:flex; flex-direction:column; height:100%;">
      <div class="kicker">THE IDENTITY <span class="ar">الهوية</span></div>
      <h2 class="d2" style="margin-top:12px;">One system, worn by <span class="serif-i accent">everything</span>.</h2>
      <p class="lead" style="max-width:60ch; margin-top:10px;">${esc(I.lead)}</p>

      <div style="display:flex; gap:20px; align-items:center; margin-top:20px;">
        <div id="av-slot" style="flex:0 0 auto;"></div>
        <div style="flex:1;">
          <p class="d3">MUSTAFA ABOALAZM</p>
          <p class="micro" style="margin-top:4px;">${esc(D.identity.role)} · ${esc(D.identity.roleAr)}</p>
        </div>
      </div>

      <div class="g4" style="margin-top:18px;">
        ${I.colors.map((col) => `
          <div class="swatch">
            <div class="sw-color" style="background:${col.hex};"></div>
            <div class="sw-meta">
              <div class="sw-name">${esc(col.name)}</div>
              <div class="sw-hex">${col.hex} · ${esc(col.role)}</div>
            </div>
          </div>`).join("")}
      </div>

      <div style="display:flex; align-items:center; gap:10px; margin-top:12px;">
        <span class="micro">${esc(I.spectrumNote)}</span>
        <span class="chiprow">
          ${I.spectrum.map((hex) => `<span style="width:22px; height:10px; border-radius:999px; background:${hex}; display:inline-block; outline:1px solid var(--line-1);"></span>`).join("")}
        </span>
      </div>

      <div style="margin-top:20px; flex:1;">
        ${I.type.map((t) => `
          <div class="spec-row">
            <span class="spec-aa ${t.cls}" ${t.cls === "spec-aa--ar" ? 'style="font-size:38px"' : ""}>${esc(t.aa)}</span>
            <span>
              <div class="spec-name">${esc(t.name)}</div>
              <div class="spec-use">${esc(t.use)}</div>
            </span>
            <span class="micro">TOKEN OK</span>
          </div>`).join("")}
      </div>

      <div class="g3" style="margin-top:18px; gap:10px;">
        ${I.facts.slice(0, 3).map((f) => `<div style="border-top:1px solid var(--line-2); padding-top:8px;"><div class="micro" style="color:var(--coral)">${esc(f.k)}</div><div class="body-sm" style="margin-top:4px; font-size:9.5px;">${esc(f.v)}</div></div>`).join("")}
      </div>
      <div class="g3" style="margin-top:10px; gap:10px;">
        ${I.facts.slice(3).map((f) => `<div style="border-top:1px solid var(--line-2); padding-top:8px;"><div class="micro" style="color:var(--coral)">${esc(f.k)}</div><div class="body-sm" style="margin-top:4px; font-size:9.5px;">${esc(f.v)}</div></div>`).join("")}
      </div>
    </div>`));

    const slot = c.querySelector("#av-slot");
    slot.replaceWith(av);
  }

  /* ═══ 05 · CAPABILITIES ════════════════════════════════════════════ */
  function pageCapabilities() {
    const s = makeSheet("capabilities", "CAPABILITIES — القدرات", 5);
    s.appendChild(h(`<div class="ghost">03</div>`));
    glow(s, "#48CCCC", { width: 480, height: 480, left: -160, bottom: -100 });
    const c = content(s);
    c.appendChild(h(`<div style="display:flex; flex-direction:column; height:100%;">
      <div class="kicker">CAPABILITIES // SYSTEMS <span class="ar">القدرات</span></div>
      <h2 class="d2" style="margin-top:12px; max-width:20ch;">Hold the tokens. Watch the system <span class="serif-i accent">hold</span>.</h2>

      <div class="g2" style="margin-top:22px; flex:1;">
        ${D.capabilities.map((cap) => `
          <div style="border:1px solid var(--line-1); border-radius:12px; background:var(--surface-1); padding:20px; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
              <span class="micro" style="color:var(--coral)">${cap.no}</span>
              <span class="micro">${esc(cap.ar)}</span>
            </div>
            <div class="d3">${esc(cap.en)}</div>
            <ul style="list-style:none;">
              ${cap.items.map((it) => `<li class="body-sm" style="padding:4px 0 4px 14px; position:relative; border-bottom:1px dashed var(--line-1);"><span style="position:absolute; left:0; color:var(--coral); font-family:var(--f-mono); font-size:8px;">→</span> ${esc(it)}</li>`).join("")}
            </ul>
            <div style="flex:1;"></div>
            <div class="chiprow">${cap.stack.map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div>
          </div>`).join("")}
      </div>

      <div style="margin-top:20px; border-top:1px solid var(--line-2); padding-top:14px;">
        <p class="micro" style="margin-bottom:10px;">TOOLING — ${D.wordwall.length}+ INSTRUMENTS · ONE OPERATING SYSTEM</p>
        <div class="wordwall">${D.wordwall.map((w) => `<span class="w">${esc(w)}</span>`).join("")}</div>
      </div>
    </div>`));
  }

  /* ═══ 06 · NUMBERS ═════════════════════════════════════════════════ */
  function pageNumbers() {
    const s = makeSheet("numbers", "BY THE NUMBERS — بالأرقام", 6);
    s.appendChild(h(`<div class="ghost">04</div>`));
    glow(s, "#FF6B47", { width: 620, height: 620, left: 140, top: -180 });
    const c = content(s);
    const N = D.numbers;
    c.appendChild(h(`<div style="display:flex; flex-direction:column; height:100%;">
      <div class="kicker">BY THE NUMBERS <span class="ar">بالأرقام</span></div>

      <div class="g3" style="margin-top:40px;">
        ${N.hero.map((m) => `
          <div class="stat big-metric">
            <div class="stat-n" style="font-size:88px;">${esc(m.pre)}${esc(m.n)}<span class="suf">${esc(m.suf)}</span></div>
            <div class="stat-l" style="font-size:13px;">${esc(m.l)}</div>
            <div class="stat-c">${esc(m.c)}</div>
          </div>`).join("")}
      </div>

      <div style="flex:1;"></div>

      <div class="g4">
        ${N.support.map((m) => `
          <div class="stat" style="border-top:1px solid var(--line-2); padding-top:14px;">
            <div class="stat-n" style="font-size:52px;">${esc(m.pre)}${esc(m.n)}<span class="suf">${esc(m.suf)}</span></div>
            <div class="stat-l">${esc(m.l)}</div>
            <div class="stat-c">${esc(m.c)}</div>
            <div class="stat-c" style="color:var(--coral); font-family:var(--f-ar); letter-spacing:0;">${esc(m.ar || "")}</div>
          </div>`).join("")}
      </div>

      <p class="micro" style="margin-top:22px;">MEASURED IN OUTCOMES, NOT COMPLIMENTS — الأرقام من مشاريع حقيقية</p>
    </div>`));
  }

  /* ═══ 07 · TIMELINE ════════════════════════════════════════════════ */
  function pageTimeline() {
    const s = makeSheet("timeline", "CAREER — المسيرة", 7);
    s.appendChild(h(`<div class="ghost">05</div>`));
    const c = content(s);
    c.appendChild(h(`<div style="display:flex; flex-direction:column; height:100%;">
      <div class="kicker">CAREER LEDGER <span class="ar">المسيرة المهنية</span></div>
      <h2 class="d2" style="margin-top:12px;">Nine years turning identity<br>into <span class="serif-i accent">infrastructure</span>.</h2>

      <div style="margin-top:26px; flex:1;">
        ${D.timeline.map((t) => `
          <div class="tl-row">
            <span class="tl-yr">${esc(t.yr)}</span>
            <span>
              <div class="tl-role">${esc(t.role)}</div>
              <div class="tl-org">${esc(t.org)}</div>
            </span>
            <span class="tl-note">${esc(t.note)}</span>
          </div>`).join("")}
      </div>

      <div class="g2" style="gap:10px;">
        <div style="border-top:1px solid var(--line-2); padding-top:10px;">
          <div class="micro" style="color:var(--coral)">EDUCATION</div>
          <div class="body-sm" style="margin-top:4px;">B.Sc. — Al-Azhar University · 2017–2024</div>
        </div>
        <div style="border-top:1px solid var(--line-2); padding-top:10px;">
          <div class="micro" style="color:var(--coral)">TRAINING</div>
          <div class="body-sm" style="margin-top:4px;">MSP · Youth Scope · AYB · Bedaya · Resalah</div>
        </div>
      </div>
    </div>`));
  }

  /* ═══ WORK · HERO PAGE (per project) ═══════════════════════════════ */
  function projectHero(p, pageNo) {
    const s = makeSheet("pj-" + p.slug, `WORK ${p.idx} — ${p.name}`, pageNo);
    glow(s, p.glow || "#FF6B47", { width: 520, height: 520, left: -140, bottom: -160 });

    /* full-bleed hero visual (photo) or typographic plate */
    if (p.kind === "plate") {
      const plate = h(`<div class="pj-hero-plate" style="background:
        linear-gradient(180deg, ${hexA(p.glow || "#121120", 0.10)}, rgb(8 7 16 / 0) 55%),
        radial-gradient(ellipse 80% 70% at 50% 42%, ${hexA(p.glow || "#181729", 0.30)}, rgb(8 7 16 / 0) 70%),
        var(--surface-1); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px;">
        <div class="plate-word" style="font-size:${p.plateWords.length > 1 && p.plateWords.join("").length > 9 ? 66 : 96}px; line-height:0.95; letter-spacing:-0.02em; color:var(--ink);">
          ${p.plateWords.map((w, i) => `<span style="color:${i === 0 ? (p.accentWord || "var(--ink)") : "var(--ink)"}">${esc(w)}</span>${i < p.plateWords.length - 1 ? "<br>" : ""}`).join("")}
        </div>
        <div class="micro" style="letter-spacing:0.3em;">${esc(p.plateSub)}</div>
      </div>`);
      s.appendChild(plate);
    } else {
      const hero = h(`<div class="pj-hero-img"></div>`);
      bg(hero, p.img);
      s.appendChild(hero);
    }

    s.appendChild(h(`<span class="tag-corner">${esc(p.category)}</span>`));

    const c = h(`<div class="pj-body"></div>`);
    c.appendChild(h(`
      <p class="pj-idx">${esc(p.idx)} / 13 · ${esc(p.discipline)} · ${esc(p.year)}</p>
      <h2 class="pj-title">${esc(p.name)}</h2>
      <div class="pj-title-ar">${esc(p.nameAr)}</div>
      <div class="pj-meta">
        ${p.stack.map((x) => `<span class="chip">${esc(x)}</span>`).join("")}
        ${p.live ? `<span class="sep"></span><span class="chip chip--acc">LIVE · ${esc(p.live)}</span>` : ""}
      </div>
      <div class="pj-outcome">
        <span><span class="po-label">OUTCOME&nbsp;&nbsp;</span><span class="po-val">${esc(p.outcome)}</span></span>
        <span class="po-ar">${esc(p.outcomeAr)}</span>
      </div>`));
    s.appendChild(c);
  }

  /* ═══ WORK · DETAIL PAGE (case-file projects) ══════════════════════ */
  function projectDetail(p, pageNo) {
    const s = makeSheet("pjd-" + p.slug, `CASE FILE ${p.idx} — ${p.name}`, pageNo);
    glow(s, p.glow || "#FF6B47", { width: 480, height: 480, right: -150, top: -140 });
    const c = content(s);

    c.appendChild(h(`<div style="display:flex; flex-direction:column; height:100%;">
      <div class="pj-d-head">
        <div>
          <p class="micro" style="color:var(--coral)">${esc(p.idx)} · CASE FILE — ملف المشروع</p>
          <h2 class="d3" style="margin-top:6px;">${esc(p.name)}</h2>
        </div>
        <div class="pj-d-meta"><p class="micro">${esc(p.year)}</p><p class="micro" style="margin-top:4px;">${esc(p.discipline)}</p></div>
      </div>

      <div class="case-story">
        <div><div class="micro" style="color:var(--coral)">01 · THE PROBLEM</div><p class="body-sm case-story__text">${esc(p.brief)}</p></div>
        <div><div class="micro" style="color:var(--coral)">02 · MY ROLE + DECISION</div><p class="body-sm case-story__text">${esc(p.role || "Strategy, identity direction, system design and delivery.")}</p><p class="body-sm case-story__decision">${esc(p.decision || "The key decision was to make the identity behave as a governed system, not a collection of isolated assets.")}</p></div>
      </div>

      <div class="pj-kpis">
        ${p.kpis.map((k) => `<div class="stat"><div class="stat-n" style="font-size:40px;">${esc(k.n)}</div><div class="stat-l" style="font-size:10px;">${esc(k.l)}</div><div class="stat-c">${esc(k.c)}</div></div>`).join("")}
      </div>

      <div class="case-label micro"><span style="color:var(--coral)">03 · THE SYSTEM + APPLICATION</span><span>${esc(p.stack.join(" · "))}</span></div>
      <div class="pj-gal">
        ${p.gallery.map((g) => {
          const card = h(`<div class="imgcard ${g.full ? "imgcard--full" : ""}" style="height:${g.full ? 160 : 156}px"><span class="cap">${esc(g.cap)}</span></div>`);
          bg(card, g.img);
          return card.outerHTML;
        }).join("")}
      </div>

      <div class="case-outcome">
        <div><span class="micro" style="color:var(--coral)">04 · OUTCOME</span><div class="d3" style="font-size:17px; margin-top:4px;">${esc(p.outcome)}</div></div>
        <div class="body-sm" style="text-align:right; max-width:34ch;">${esc(p.outcomeAr)}</div>
      </div>
    </div>`));
  }

  /* ═══ LEDGER ═══════════════════════════════════════════════════════ */
  function pageLedger() {
    const s = makeSheet("ledger", "PROJECT LEDGER — سجل المشاريع", PG_LEDGER);
    const c = content(s);
    c.appendChild(h(`<div style="display:flex; flex-direction:column; height:100%;">
      <div class="kicker">07 · THE ENGINEERING LEDGER <span class="ar">سجل المشاريع</span></div>
      <h2 class="d2" style="margin-top:12px;">Every engagement,<br>recorded as a <span class="serif-i accent">system</span>.</h2>

      <table class="ledger-t" style="margin-top:24px;">
        <thead>
          <tr><th>NO</th><th>PROJECT</th><th>DISCIPLINE</th><th>STACK</th><th>OUTCOME</th><th>YEAR</th></tr>
        </thead>
        <tbody>
          ${D.projects.map((p) => `
            <tr>
              <td class="td-no">${esc(p.idx)}</td>
              <td class="td-name">${esc(p.name)}<br><span style="font-family:var(--f-ar); font-weight:400; font-size:9px; color:var(--ink-32);">${esc(p.nameAr)}</span></td>
              <td>${esc(p.discipline)}</td>
              <td class="td-mono">${p.stack.map(esc).join(" · ")}</td>
              <td>${esc(p.outcome)}</td>
              <td class="td-mono">${esc(p.year)}</td>
            </tr>`).join("")}
        </tbody>
      </table>

      <div style="flex:1;"></div>
      <div style="display:flex; justify-content:space-between; align-items:baseline; border-top:2px solid var(--coral); padding-top:12px;">
        <span class="micro">13 ENGAGEMENTS · 2019 → 2026 · PHARMA / FOOD / HEALTHCARE / EDU / NGO / GOV / COMMERCE / AGRITECH</span>
        <span class="micro" style="color:var(--coral)">LEDGER CLOSED</span>
      </div>
    </div>`));
  }

  /* ═══ PROCESS ══════════════════════════════════════════════════════ */
  function pageProcess() {
    const s = makeSheet("process", "PROCESS — المنهجية", PG_PROCESS);
    s.appendChild(h(`<div class="ghost">08</div>`));
    const c = content(s);
    c.appendChild(h(`<div style="display:flex; flex-direction:column; height:100%;">
      <div class="kicker">08 · THE PROCESS <span class="ar">المنهجية</span></div>
      <h2 class="d2" style="margin-top:12px;">38 days, <span class="serif-i accent">four gates</span>,<br>zero guesswork.</h2>

      <div class="g4" style="margin-top:24px;">
        ${D.process.map((ph) => `
          <div class="phase">
            <div class="ph-n">${ph.n}</div>
            <div class="ph-name">${esc(ph.en)}</div>
            <div class="micro" style="margin-top:2px; font-family:var(--f-ar); letter-spacing:0;">${esc(ph.ar)}</div>
            <div class="ph-body">${esc(ph.body)}</div>
            <div style="flex:1;"></div>
            <div class="ph-days">${esc(ph.days)}</div>
          </div>`).join("")}
      </div>

      <div style="flex:1;"></div>

      <div style="border:1px solid var(--line-1); border-radius:12px; padding:18px 20px; background:var(--surface-1);">
        <p class="micro" style="color:var(--coral); margin-bottom:10px;">PAYMENT STRUCTURE — هيكل الدفع</p>
        <div class="g2" style="gap:14px;">
          <div>
            <div class="body-sm" style="font-weight:600; color:var(--ink); font-size:10px;">${esc(D.payment.t1)}</div>
          </div>
          <div>
            <div class="body-sm" style="font-weight:600; color:var(--ink); font-size:10px;">${esc(D.payment.t23)}</div>
          </div>
        </div>
        <p class="micro" style="margin-top:12px;">${esc(D.payment.methods)} · <span style="font-family:var(--f-ar); letter-spacing:0;">${esc(D.payment.methodsAr)}</span></p>
      </div>
    </div>`));
  }

  /* ═══ OFFERS ═══════════════════════════════════════════════════════ */
  function pageOffers() {
    const s = makeSheet("offers", "OFFERS — العروض", PG_OFFERS);
    s.appendChild(h(`<div class="ghost">09</div>`));
    glow(s, "#FF6B47", { width: 520, height: 520, right: -160, bottom: -140 });
    const c = content(s);
    c.appendChild(h(`<div style="display:flex; flex-direction:column; height:100%;">
      <div class="kicker">09 · INVESTMENT <span class="ar">العروض</span></div>
      <h2 class="d2" style="margin-top:12px;">Pick the <span class="serif-i accent">tier</span>. Keep the doctrine.</h2>

      <div class="g3" style="margin-top:20px;">
        ${D.tiers.map((t) => `
          <div class="tier ${t.rec ? "tier--rec" : ""}">
            ${t.rec ? '<span class="tag-corner" style="border-radius:0 12px 0 12px;">RECOMMENDED</span>' : ""}
            <span class="t-tag">${esc(t.tag)}</span>
            <span class="t-name">${esc(t.name)}</span>
            <span class="t-price">${esc(t.price)}</span>
            <div class="t-row"><span>BEST FOR</span><span>${esc(t.bestFor)}</span></div>
            <div class="t-row"><span>DURATION</span><span>${esc(t.duration)}</span></div>
            <div class="t-row"><span>PAYMENT</span><span>${esc(t.payment)}</span></div>
            <ul class="t-inc">
              ${t.inc.map((x) => `<li>${esc(x)}</li>`).join("")}
            </ul>
            <div style="flex:1;"></div>
            ${t.exc ? `<p class="micro" style="color:var(--ink-32)">${esc(t.exc)}</p>` : `<p class="micro" style="color:var(--coral)">FULL SYSTEM · GOVERNED</p>`}
          </div>`).join("")}
      </div>

      <div class="g2" style="margin-top:16px; gap:12px;">
        ${D.alacarte.map((g) => `
          <div class="alac">
            <div class="al-head">${esc(g.g)}</div>
            ${g.rows.map((r) => `
              <div class="al-row">
                <span><span class="al-svc">${esc(r.s)}</span><span class="al-det" style="display:block;">${esc(r.d)}</span></span>
                <span class="al-price">${esc(r.p)}</span>
              </div>`).join("")}
          </div>`).join("")}
      </div>
    </div>`));
  }

  /* ═══ CONTACT / BACK COVER ═════════════════════════════════════════ */
  function pageContact() {
    const s = makeSheet("contact", "CONTACT — التواصل", PG_CONTACT);
    s.classList.add("p-contact");
    glow(s, "#FF6B47", { width: 700, height: 700, left: -200, bottom: -260 });
    glow(s, "#7850C8", { width: 480, height: 480, right: -140, top: -120 });
    const c = content(s);
    const av = h(`<div class="avatar" style="width:110px; height:110px;"></div>`);
    bg(av, "avatar");

    c.appendChild(h(`<div style="display:flex; flex-direction:column; height:100%;">
      <div class="kicker">10 · START A PROJECT <span class="ar">ابدأ مشروعك</span></div>

      <div style="margin-top:38px;">
        <p class="serif-i" style="font-size:34px; color:var(--ink-48);">${esc(D.closing.quiet)}</p>
        <h2 class="d1" style="font-size:64px;">${esc(D.closing.loud)}</h2>
        <p class="ar-disp" style="font-size:20px; margin-top:14px; direction:rtl; text-align:left; color:var(--ink-68);">${esc(D.closing.quietAr)} <span class="accent" style="color:var(--coral)">${esc(D.closing.loudAr)}</span></p>
        <p class="lead" style="max-width:52ch; margin-top:16px;">${esc(D.closing.lead)}</p>
        <p class="ar-body" style="max-width:52ch; margin-top:4px; text-align:right;">${esc(D.closing.leadAr)}</p>
      </div>

      <div style="flex:1;"></div>

      <div>
        ${D.identity.links.map((l) => `
          <div class="contact-row">
            <span class="c-label">${esc(l.label)}</span>
            <span class="c-val">${esc(l.value)}</span>
          </div>`).join("")}
        <div class="contact-row">
          <span class="c-label">EMAIL</span>
          <span class="c-val">${esc(D.identity.email)}</span>
        </div>
        <div class="contact-row">
          <span class="c-label">BASE</span>
          <span class="c-val">${esc(D.identity.location)}<span class="c-ar">${esc(D.identity.locationAr)}</span></span>
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:18px; margin-top:26px; padding-top:16px; border-top:2px solid var(--coral);">
        <div id="av-end"></div>
        <div style="flex:1;">
          <p class="d3" style="font-size:22px;">MUSTAFA ABOALAZM</p>
          <p class="micro" style="margin-top:4px;">SYSTEMIC IDENTITY ARCHITECT · CO-FOUNDER, CODE &amp; CANVAS</p>
        </div>
        <div style="text-align:right;">
          <p class="micro" style="color:var(--coral)">END OF FILE</p>
          <p class="micro" style="margin-top:4px;">${esc(D.identity.version)}</p>
        </div>
      </div>
    </div>`));

    c.querySelector("#av-end").replaceWith(av);
  }

  /* ── ASSEMBLE (page order) ──────────────────────────────────────────── */
  pageCover();
  pageIndex();
  D.projects.forEach((p, i) => {
    const pageNo = projPage[p.slug];
    projectHero(p, pageNo);
    if (p.hasDetail) projectDetail(p, pageNo + 1);
  });

  pageLedger();
  pageProcess();
  pageOffers();
  pageContact();

  /* expose for export.js */
  window.__SHEETS = Array.from(document.querySelectorAll(".sheet"));
})();
