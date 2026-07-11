# HANDOFF — Aboalazm OS (سياق الجلسة السابقة)

> اكتب في الشات الجديد: "اقرأ HANDOFF.md في فولدر المشروع وكمّل من حيث انتهى".
> آخر تحديث: 2026-07-11

## 🔴 جلسة اليوم (2026-07-11) — QA شامل + إصلاحات — كمّل من هنا

**كل ده اتعمل واتعمله commit بالفعل (git status نضيف دلوقتي):**
- Smoke Test + Deep QA كامل على اللايف، وبعدين إصلاح كل الباجات المكتشفة:
  - **فورم التواصل (Critical)**: كان بيفضل عالق على "WORKING…" للأبد حتى لما السيرفر يرجع نجاح. اتصلح بـ timeout (20 ثانية) + منع الإرسال المكرر + إصلاح منطق الأخطاء + إلغاء الاعتماد على انتهاء أنيميشن Framer Motion (`features/contact/contact-form.tsx`).
  - **Reduced-motion (High)**: عناصر كتير كانت بتفضل `opacity:0` للأبد لو المستخدم مفعّل "تقليل الحركة". اتصلح بهوك `useEntrance`/`reduceMotion` في حوالي 13 كومبوننت (hero, gallery, work, about, وغيرهم).
  - Theme playground، mixed-content iframe (جزئي — تفاصيل تحت)، ترجمة "Start a commission" للعربي، تناسق سنة بداية المشوار المهني (2017 مش 2018).
  - إصلاح فشل بناء Vercel (`discipline: "E-Commerce Platform"` مش موجودة في enum — اتظبطت لـ "Product Architecture" زي باقي مشاريع الديفلوبمنت).
- **اكتشاف نمط تاني بعد الـ regression test**: `AnimatePresence mode="wait"` (و`popLayout`) كانت بتمنع تحديث المحتوى فعليًا حتى لو الـ state اتحدّث صح — نفس سبب باج الكونتاكت فورم بالظبط. اتصلح في:
  `features/process/gate-stepper.tsx`، `features/persona/persona-picker-band.tsx`، `features/gallery/gallery-view.tsx` (فلتر الماسونري)، `app/(site)/process/process-view.tsx` (الأكورديون)، `components/layout/nav.tsx` (مينيو الموبايل) — كل واحدة اتأكد منها لايف: ديسكتوب/موبايل/لايت/دارك/reduced-motion.
- إصلاح hydration warning إضافي (نفس فكرة reduced-motion) على gate-stepper بـ `suppressHydrationWarning` — مطابق لنفس الباترن المستخدم في `<html>`.

### ✅ Zad iframe — تم الحل
اتشغل `npx tsx scripts/fix-zad-live-url.ts` بنجاح، اتصلح الصف في Neon (`"zad".liveUrl → https://zad.codeandcanvas.net`). **باقي حاجة واحدة بس**: تأكيد سريع في أول regression pass إن الـ iframe بيحمل صح على اللايف ومفيش Mixed Content warnings.

### ✅ Phase 3A — Enterprise Design System Audit (source-only) — خلصت
تقرير كامل في [`design-preview/design-system-audit-phase3a.md`](design-preview/design-system-audit-phase3a.md) — تحليل ستاتيك لـ `globals.css` (2052 سطر) + 92 كومبوننت، من غير أي حكم بصري (screenshot لسه عطلانة، اتأكد تاني إن المشكلة في الأداة مش في الموقع).

**أهم اللقطات:**
- الـ token layer (`@theme` block) نضيف ومنظم — المشكلة مش فيه.
- **مفيش شريط component مشترك خالص** (`components/ui` مش موجود، مفيش `<Button>`) — كل CTA بيتكرر يدوي. `.not-found-cta`, `.start-cta`, `.process-cta` — نفس الكود بالظبط 3 مرات.
- لون الـ accent `rgb(255 107 71 / …)` متكرر 49 مرة في globals.css بقيم opacity مختلفة عشوائياً (~20 قيمة غير موثقة) بدل tokens.
- `/start` و`/process` عندهم 69% من كل الـ arbitrary Tailwind values (90 قيمة في 13 ملف) — أكتر صفحتين بعيد عن نظام الـ tokens.
- سلم الـ spacing بيخالف قاعدته المكتوبة في نفس الملف (8px strict) في 15+ مكان.
- `AnimatePresence` واحدة لسه محتاجة مراجعة يدوية لايف: `features/work/floating-preview.tsx` (hover crossfade على كروت `/work`) — مش زي الباج اللي اتصلح، بس نفس المكتبة/mode.

**التالي: Phase 3B (Visual Audit)** — معلقة لحد ما أداة الـ screenshot تشتغل تاني في الجلسة.

### ✅ Backlog محضّر — لسه متبدأش أي تعديل كود
تقرير كامل في [`design-preview/design-system-backlog.md`](design-preview/design-system-backlog.md) — كل لقطات Phase 3A متبوّبة P0/P1/P2/P3 مع impact/effort/الملفات المتأثرة/مخاطر الميجريشن. **القرار الصريح من المستخدم: متبدأش أي refactor (لا CTA، لا tokens، لا component extraction) لحد ما Phase 3B تخلص كمان.** بعدين نرتّب الأولويات على الاثنين مع بعض ونعمل "Design System Refactoring Sprint" واحد.

- استثناء واحد: P0-1 و P0-2 (الاتنين تحقق سريع بس، مش تعديل) ممكن يتعملوا في أي وقت من غير ما ننتظر Phase 3B.

### 🟢 Design System Refactoring Sprint — بدأ فعليًا (تعليمات مباشرة من المستخدم، مش بعد Phase 3B)
المستخدم طلب صراحة نبدأ الـ sprint دلوقتي (Button/Heading/Card بس — Section/Container/Badge اتلغوا بالأدلة، Tag مؤجل). ترتيب الميجريشن: **Heading → Button → Card**، كل واحد لازم يخلص ويستقر (typecheck+build+regression) قبل ما نبدأ اللي بعده.

- **✅ Heading — production-complete.** التقرير الكامل في [`design-preview/sprint-heading-primitive.md`](design-preview/sprint-heading-primitive.md). 15 صفحة اتهاجرت لـ `components/ui/Heading.tsx`، كلها اتأكدت DOM-identical لايف. باج حقيقي اتلقى واتصلح أثناء الشغل: `cn()`/tailwind-merge كانت بتشيل `text-display`/`text-lead` بصمت (تعارض في تصنيف كلاسات `text-*` المخصصة) — اتصلح بدالة `joinClasses` بسيطة بدل `cn()`. كمان لقينا (مش بتاعنا، مسجّلين بس): 2 hydration mismatch سابقين في `system-constellation.tsx` و`resource-blocks.tsx` (اتأكد `git diff` إنهم متلموسناش).
- **✅ Button — production-complete.** التقرير الكامل في [`design-preview/sprint-button-primitive.md`](design-preview/sprint-button-primitive.md). `components/ui/Button.tsx` (buttonVariants + Button) بديل لـ 17 عنصر زرار عبر 11 ملف — 2 variants بس (primary/ghost)، مفيش size/font/hoverLift enum (كلها اتعملت مسودة واتشالت بعد ما القيم الحقيقية اختلفت لكل موقع). ~85 سطر CSS ميتة (`.not-found-cta`, `.start-cta`, `.process-cta`) اتشالت من `globals.css` بعد التأكد إنها مبقاش ليها أي استخدام. باجين حقيقيين اتلقوا **قبل** ما يوصلوا للكود (في مرحلة القياس، مش بعد الشحن): (1) فرضية خاطئة إن الـ 3 CSS classes متطابقين — start/process فعلاً متطابقين بس not-found مختلف رقميًا (حجم وpadding وhover مختلفين). (2) `hover:-translate-y-0.5`(4px/400ms) لـ CtaBand/nav/home-bands مش نفس الـ CSS-trio's translateY(-2px)/200ms — لو اتحط كـ default واحد كان هيكسر نص المواقع.
- **⏭️ التالي: Card** — لسه مبدأناش (stop condition صريح من المستخدم، مينفعش نبدأ تلقائي).
- الأودت الأصلي (Phase 1) في [`design-preview/phase1-primitive-audit.md`](design-preview/phase1-primitive-audit.md).

### ✅ V1/V2 اتعملوا، وP0-1 اتصلح واتأكد (2026-07-11)
- **V1 (Zad iframe) ✅ PASS**: `iframe.src` على اللايف = `https://zad.codeandcanvas.net/`، مفيش mixed-content warnings. مقفول.
- **V2 → P0-1 ✅ FIXED & VERIFIED**: `features/work/floating-preview.tsx` كان بيستخدم Framer Motion `animate` prop مباشر من غير فرع reduced-motion (فات على الـ 13 كومبوننت اللي اتصلحوا قبل كده). الإصلاح: نفس الباترن بالظبط المستخدم في `gate-stepper.tsx`/`gallery-view.tsx` — `useReducedMotion()` + `initial={reduceMotion ? false : {...}}`، من غير أي تعديل في `animate`/`exit`/`transition`. **الملف الوحيد المعدّل: `features/work/floating-preview.tsx`.**
  - ✅ `npm run typecheck` نضيف.
  - ✅ `npm run build` نجح، `/work` زي ما هو (8.7 kB).
  - ✅ اتأكد لايف على dev server محلي: Normal motion → الأنيميشن زي ما كانت بالظبط (opacity 1, transform none بعد الدخول). Reduced motion → دلوقتي بيظهر فورًا (`opacity:1; transform:none`) بدل ما يفضل واقف على `opacity:0`.
- **🆕 باج جديد اتكشف أثناء التحقق (متتصلحش، مش جزء من المهمة دي)**: لما تعمل hover من صف مشروع لصف تاني في `/work` من غير ما الماوس يسيب الليدجر خالص، الكارت القديم مش بيعمل unmount — بيفضل الاتنين ظاهرين (`opacity:1`) في نفس الوقت. اتأكد إنه بيحصل **في الحالتين (reduced-motion وnormal motion)** يعني مش مرتبط بالإصلاح ده، باج سابق أصلاً. مسجّل كـ **P0-3** في الباكلوج، لسه محتاج triage.
- تفاصيل كاملة في [`design-preview/design-system-backlog.md`](design-preview/design-system-backlog.md) تحت P0-1/P0-2/P0-3.

---

## المشروع
- **الريبو الأساسي (الكانوني):** `E:\final projcts web\aboalazm-os` → GitHub `3boalazm/aboalazm-os` → Vercel `aboalazm-os.vercel.app`
- Next.js 15 + Payload CMS 3.85.2 + Neon Postgres + Vercel Blob. ثنائي اللغة (EN/AR) بثيم فاتح/داكن (الافتراضي داكن، `html[data-theme="light"]`).
- النسخ في Downloads (aboalazm-os-*) كلها snapshots قديمة — تجاهلها.

## البنية التحتية (مثبتة وشغالة)
- **داتابيز واحدة فقط** على Neon: `ep-billowing-recipe-att0uulq` — نفسها في `.env.local` وفي Vercel env. مفيش داتابيز تانية.
- **Blob store**: الجديد Public (prefix `aboalazmos_` في Vercel، والتوكن متحط يدوياً في `BLOB_READ_WRITE_TOKEN`). القديم `aboalazm-os-blob` كان Private وفاضي — ده كان سبب فشل رفع الصور.
- ⚠️ **مطلوب لاحقاً:** تدوير المفاتيح (Neon password + PAYLOAD_SECRET + Blob token) لأنها اتكتبت في شاتات وملفات كتير.

## نظام المقالات (Writing)
- **21 بوست منشور**: W-001→W-005 أصلية EN، وW-006→W-013 "سلسلة الأنظمة" بلغتين (العربي بلاحقة `-ar` في الـ slug).
- المحتوى مصدره ملفات وليس الأدمن: `scripts/writing-content.ts` (الأنواع + toLexical + W-001..005)، `scripts/writing-systems-en.ts` و`-ar.ts` (W-006..013)، `scripts/writing-posts-list.ts` (الميتاداتا).
- أنواع البلوكات: h, h3, p, q, ul, ol, table, mermaid(+caption), stats — والثلاثة الأخيرة Payload Blocks مسجلة في `payload.config.ts` (BlocksFeature: diagram, dataTable, stats).
- **السكريبتات:**
  - `npx tsx scripts/seed-posts.ts` — زرع البوستات فقط (idempotent). مع `--refresh` يعيد بناء أجسام كل البوستات من الملفات (يستخدم بعد أي تعديل محتوى).
  - `npx tsx scripts/seed.ts` — زرع كل حاجة (مشاريع + دراسات حالة + صور للبلوب + عروض + بوستات).
  - `npx tsx scripts/publish-all.ts` — نشر إجباري (البوستات المزروعة بتقع Draft أحياناً — ده الحل).
  - `npx tsx scripts/export-articles-md.ts` — تصدير المقالات Markdown لـ exports/articles.

## واجهة المقالات (Lovable-style — مبنية بالكامل)
الملفات: `features/writing/*` + `app/(site)/writing/*`:
- Hero بتوهجات وعنوان بيدخل كلمة-كلمة + وقت قراءة + شرائح topics بفواصل `+`.
- شريط تقدم قراءة، Side-nav بأرقام الأقسام مع scrollspy، زرار ↑TOP، فوتر Prev/Next (نفس اللغة).
- أقسام H2 بأرقام Outline ضخمة (01، 02...)، Reveal fade-in لكل بلوك، جداول تحريرية بـ hover.
- **كروت إحصائيات متحركة** (stats block) — العدادات بتعد من صفر.
- **مخططات Native** (`features/writing/diagram.tsx`): parser بيقرأ أكواد mermaid المخزنة ويرسمها HTML/CSS بعقد Lovable (ألوان `--node-*` في globals.css بتتبدل مع الثيم). Mermaid CDN موجود كـ fallback بس.
- الاقتباس الختامي بيترندر لوحة عريضة بإطار برتقالي تلقائياً.
- RTL كامل للمقالات العربية (dir حسب لغة البوست مش لغة الواجهة).

## آخر تعديلات (قد تكون غير مرفوعة — راجع git status)
1. تكبير كل الفونتات الصغيرة +15% (globals.css + text-micro 11→12px).
2. سلم كونتراست متدرج للايت مود: text 0.86/0.66/0.48/0.32 + حدود أغمق.
3. الهيرو اتصغر: `--text-hero: clamp(3rem, 7.5vw, 7rem)`.
4. الماركي: كان بيتحول لسترُوب مع prefers-reduced-motion (باج 0.01ms) — اتصلح بـ iteration-count:1 عالمياً + استثناء `.marquee` ليفضل متحرك 120s دائماً.
5. إصلاح hydration #418: `suppressHydrationWarning` على `<html>` في `app/(site)/layout.tsx`.

## أوامر النشر المعتادة
```bash
npm run typecheck
git add . && git commit -m "..." && git push   # Vercel بيبني تلقائياً
# لو عدلت محتوى مقالات: npx tsx scripts/seed-posts.ts --refresh
```

## ملفات جانبية
- `design-preview/code-aligned-landing.html` — لاندينج بيدج مستقلة (برومبت التباين) — مش جزء من الموقع.
- `exports/articles/` — تصدير المقالات للتصميم الخارجي.
- المطلوب المتبقي من المستخدم سابقاً: مقارنة النتيجة بلوفابل وتظبيطات بصرية حسب طلبه أولاً بأول.
