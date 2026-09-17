# MUSTAFA ABOALAZM — PORTFOLIO 2026 · بورتفوليو 2026

**Fixed A4 bilingual portfolio — 29 pages, dark editorial (Behance-grade), exports to a pixel-perfect PDF.**
**بورتفوليو ثابت مقاس A4 — ٢٩ صفحة، ستايل إيديتوريال دارك، وبيتصدر PDF ظبط بظبط.**

> **NOTE — نسخة داخلية:** البورتفوليو ده كمان صفحة رسمية جوه الموقع على
> **`/portfolio`** (نفس التصميم، مبنية Next.js، بيليها شورت كت في آخر المينيو).
> الفولدر ده هو **النسخة المستقلة أوفلاين** — للتحميل كمصدر أو فتحه من غير نت.

Zero build. Zero dependencies to install. Zero internet needed — يفتح من أي مكان.

---

## ⚡ QUICK START — من غير أي تعب

1. **Open `index.html`** in Chrome / Edge / Firefox — افتح الملف دبل كليك (مش محتاج سيرفر).
2. Browse the pages — تنقّل بالسكرول أو أزرار الـ dock (COVER · WORK · OFFERS · CONTACT).
3. **↓ PDF · تحميل** — wait ~40–60s while every page renders (progress bar) → downloads
   **`Mustafa-Aboalazm-Portfolio-2026.pdf`** — exact A4, 29 pages, ready to send.
   - استنى التاب يفضل مفتوح ومركّز لحد ما يخلص.
   - **PRINT · طباعة** = same result via the browser print dialog (Ctrl+P → Save as PDF).

## 📄 WHAT'S INSIDE — المحتوى (29 صفحة)

| # | Section | المحتوى |
|---|---------|---------|
| 01 | Cover | الاسم · الدور · 9 YRS / 20+ SYSTEMS / 2× LANGUAGES / 13 PROJECTS |
| 02 | Index | فهرس كل الأقسام والمشاريع بأرقام صفحات حقيقية |
| 03 | Manifesto | «I don't design brands. I BUILD SYSTEMS.» + المبادئ الأربعة |
| 04 | Identity System | الأفاتار · ألوان النظام (Obsidian/Alabaster/Coral) · الخطوط الخمسة · الحقائق |
| 05 | Capabilities | 4 قدرات (هوية · أنظمة · ويب · منتجات) + wordwall بـ 20+ أداة |
| 06 | By the Numbers | +42% · 0% · 3× + أرقام حقيقية (Nile Pharma +40% إلخ) |
| 07 | Career Timeline | 2018 → 2026 · الكود & كانفاس · نايل فارما · MSP · Youth Scope |
| 08–25 | Selected Work | **13 مشروع** — 5 منهم بملف كامل (KPIs + جاليري + توكنز) |
| 26 | Project Ledger | جدول الـ 13 مشروع كاملين (تخصص · ستاك · نتيجة · سنة) |
| 27 | Process | 4 مراحل × 38 يوم + هيكل الدفع |
| 28 | Offers | 3 تيرات + À la carte (مطبوعات · سوشيال · ويب · ريتينر) |
| 29 | Contact | الإيميل واللينكات + END OF FILE |

## 🎨 DESIGN SYSTEM — ماخود من هويتك 1:1

- **Canvas:** Obsidian `#080710` — من `globals.css` بتاع الموقع
- **Signal:** Studio Coral `#FF6B47` — نفس الـ accent بتاع الموقع
- **Type:** GC Epicpro (EN display) · Thmanyah Serif (AR display) · Montserrat · IBM Plex Sans Arabic · JetBrains Mono — **كلهم محليين في `assets/fonts/`**
- **Grid:** صفحات ثابتة **794×1123px = A4 بالظبط @96dpi** — اللي بتشوفه على الشاشة هو نفسه اللي بيطلع في الـ PDF
- **Ledger chrome:** كل صفحة ليها هيدر/فوتر إيديتوريال (الاسم · القسم · رقم الصفحة · الإحداثيات)
- **Project glows:** كل مشروع مaiter بـ glow لونه هو (GAD أزرق · CC بنفسجي · Zad دهبي …) — من `accent` بتاع كل مشروع في الداتا

## ✏️ EDIT — عدّل براحتك

كل المحتوى في ملف واحد: **`js/data.js`**
- عدّل أي نص → احفظ → اعمل refresh → صفحاتك اتحدثت → صدّر PDF تاني.
- عايز تضيف/تنقل صور؟ حط الملف في `public/images/work/…` (في أصل الريبو)، ضيف سطر في `tools/gen-assets.mjs`، وبعدين:
  ```bash
  node tools/gen-assets.mjs
  ```
  بيولّد `assets/img.js` (الصور base64 — عشان التصدير يشتغل من file:// من غير سيرفر).

## 🧠 WHY IT WORKS OFFLINE — ليه بيشتغل من غير نت

- الصور متدمجة base64 في `assets/img.js` → الـ canvas مش بيتلوث → **html2canvas + jsPDF بيصدّروا من file:// عادي**
- الخطوط كلها woff2/otf محلية
- المكتبتين (`html2canvas.min.js` · `jspdf.umd.min.js`) محليين في `assets/vendor/`

## 📁 FILES — الخريطة

```
portfolio/
├── index.html            ← افتح ده
├── css/portfolio.css     ← نظام التصميم كله (tokens · pages · print)
├── js/data.js            ← ✏️ كل المحتوى — عدّل هنا
├── js/render.js          ← باني الـ 29 صفحة من الداتا
├── js/export.js          ← محرك تصدير الـ PDF
├── assets/img.js         ← الصور (auto-generated — متعدلش بإيدك)
├── assets/fonts/         ← الخطوط المحلية
├── assets/vendor/        ← html2canvas + jsPDF
└── tools/gen-assets.mjs  ← مولّد الصور
```

## 🖨 PRINT TIPS

- لو مستخدم **PRINT** من المتصفح: فعّل **Background graphics** وخلّي Margins = **None**.
- الـ PDF المُصدَّر بالزر الأحسن للإرسال (محسوب بالبكسل، من غير هامش متصفح).

—
Built on the Aboalazm OS identity · Mustafa Aboalazm · [aboalazm.com](https://aboalazm.com) · [behance.net/aboalazm](https://www.behance.net/aboalazm)
