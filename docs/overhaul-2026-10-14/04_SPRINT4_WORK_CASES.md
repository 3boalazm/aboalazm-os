# Sprint 4 (ABO-27) — الشغل ودراسات الحالة: Wall merge + Next-case + P0-3

**التاريخ:** 2026-10-14 — **الحالة:** ✅ مُرحّل
**Linear:** ABO-27 · **Google Doc:** «Overhaul — Sprint S4» · الدليل: `02_MASTER_PLAN.md` §S4

---

## 1) /gallery اتدمجت في /work — «الحيطة» جوّا الفهرس

- **توجّل جديد في `work-filter.tsx`**: مجموعتان `Index / Wall` (مع `aria-pressed`) — الافتراضي Index؛ اختيار Wall يبدّل المحتوى لـ `GalleryView` المضمّن (شرائط الفلترة بالعميل تختفي والـ Wall لها شرائح فلاترها الخاصة).
- **`GalleryView` أخذ prop `embedded`**: في الوضع المضمّن تترندر بدون `<main>`/هيدر خاص — الوصف الصغير «THE WALL — every identity project, one wall» يظهر مكان أزرار الفلترة.
- **`/work/page.tsx`**: `Promise.all([getProjects(), getGalleryData()])` — جلبتين بالتوازي، التواجل عميلي خالص (الـ Wall مش في SSR → حجم الصفحة الأولي محافظ عليه).
- **301 دايم**: `/gallery → /work` (متتحقق لايف: 308). الفوتر بقى يشير لـ «Wall / الحيطة» بدل «Gallery» والتيرمنال alias بيودّي /work، والسايتماب وog-pages اتنضّفوا (مفتاح `gallery` + دالة `vGallery` اليتيمة).

## 2) Next-case في نهاية كل دراسة

- **`features/case-studies/next-case-link.tsx`** (عميل): رابط-بانر full-width «NEXT CASE ↳ FROM THE FILES / الملف التالي» باسم الدراسة التالية وحقل accent خافت من **سجل الدراسة التالية** نفسها (الانتقال يُحس قبل الضغط) + سهم يتمرايل RTL.
- **`case-studies/[slug]/page.tsx`**: ابحث دوريًا عبر `getAllCaseStudySlugs()` (`idx+1 mod n`) — مفيش نهاية ميّتة في الفهرس أبدًا. متتحقق: gad-institute → Nile Pharma Food.

## 3) P0-3 (الكارت الطافي لا يُفك عند تبديل الصف) — مغلق هيكليًا

تحقق الكود (انظر تصحيح 00_VERIFICATION السطر 57):
- `floating-preview.tsx` عند `key="preview"` **ثابت** — تعليق داخلي يشرح: «Stable key… so a stale card can never linger (P0-3)».
- `FloatingPreview` يُركّب **مرة واحدة فقط** (داخل `ProjectLedger`، و`/work` يحمل ليدجرًا واحدًا).
- عند `setActive(projectB)` نفس الـ `motion.div` يعاد ترنديره في مكانه؛ الـ `exit` يعمل فقط عند الخروج من الليدجر كله. **كون كارتين متزامنين مستحيل بنيويًا** في هذا التكوين. التوثيق القديم (00 / backlog) وصف نسخة ما قبل `408ec03`.
- نظّفت تعليقًا قديمًا في رأس الملف (سطر 13) كان يقول «crossfades images»، واستبدلته بوصف التصميم الحالي.
- **باب القبول الأصلي «live manual pass غير قابل للأتمتة من الـ sandbox» — متروك لنظرة عين سريعة من المالك على الـ preview** (30 ثانية: حرّك بين صفين على شاشة ≥lg واتأكد إن مفيش كارت ثاني). إن لاحظت أي تجمّع: افتح تعليق على ABO-27.

## 4) تحقق روابط «Open live»

| الهدف | الحالة |
|---|---|
| `/showcase/nile-erp/index.html` (داخلي) | ✅ موجود في `public/` |
| `/showcase/farm/index.html` (داخلي) | ✅ موجود في `public/` |
| `https://momo-collective3.vercel.app/` | ✅ شغّال (OLTRÈ Collective — fetch_page) |
| `https://codeandcanvas.net/` | ✅ شغّال (Code & Canvas — fetch_page) |

ملاحظة: فحص curl من الـ sandbox يعطي 000 للمواقع الخارجية بسبب سياسة الشبكة هنا (قائمة hosts محدودة) — ده قيد بيئة مش دليل موت رابط؛ التحقق اتعمل عبر fetch_page.

## 5) «Featured cases image-first» — موجود ومتأكد

قراءة `FeaturedCaseCard`: كرت ميديا 16:10 بصورة المشروع (أو لوحة accent كفallback) + نتيجة المشروع كتعليق mono **على** الصورة + عنوان/تحدٍ/CTA تحتها. الصورة أول عنصر في DOM قبل النص — المعيار متحقق، لا تعديل.

## 6) بوابة السبرينت

| فحص | نتيجة |
|---|---|
| `tsc --noEmit` | ✅ |
| `npm run build` (بعد إيقاف dev) | ✅ 54 صفحة — /gallery خارج الجدول |
| `/gallery` 308 → /work ✅ · `/start` 308 → /contact (بدون رجعة) ✅ · sitemap صفر للمسارين ✅ | ✅ |
| /work SSR: أزرار Index/Wall + الفلاتر + الليدجر؛ Wall عميل-فقط | ✅ |
| Next-case SSR: «NEXT CASE ↳ FROM THE FILES — Nile Pharma Food» | ✅ |
| الرئيسية + /contact 200 بدون رجعة | ✅ |
