# Sprint 3 (ABO-26) — توحيد قمع التحويل + مصدر واحد لشروط الدفع

**التاريخ:** 2026-10-14 — **الحالة:** ✅ مُرحّل
**الكوميت:** ابحث عن `feat(funnel): S3` في git log
**Linear:** ABO-26 · الدليل الكامل: `02_MASTER_PLAN.md` §S3

---

## 1) المشكلة اللي اتحلّت

صفحة `/start` (703 سطر) كانت مكررة تقريبًا كل حاجة: الأقسام بتاعتها = /services (الفئات) + /process (٣٨ يوم) + /contact (البدء)، ويوستفايت ليها فيها تناقض مباشر مع QA #19/66:

- `payNote` كان كاتب: «50% deposit to start · 50% before final files · No exceptions»
- بينما `lib/offers.ts` (المصدر الحقيقي المعتمد في الفواتير) كاتب: Tier 2 و3 بنظام **50/25/25** (٥٠٪ عند البدء، ٢٥٪ عند اعتماد الاستراتيجية، ٢٥٪ قبل التسليم)

أي عميل يقرأ الاتنين يسأل «فيّن الحقيقة؟» — ده was ضد قاعدة «أجمد استوديو في العالم»: transparency upstream.

## 2) الحل اللي اتنفّذ

### أ. توحيد المصطلح — `TERMS_LINE` في `lib/offers.ts`
ثابت جديد هو **المصدر الوحيد** لسطر الشروط (EN/AR)، معلّق: «every page that mentions payment says exactly this or links here; never paraphrase it locally again».

المواقع الموحّدة:
| الملف | قبل | بعد |
|---|---|---|
| `services-view.tsx` FAQ | «50/50 — لا بداية بدون المقدّم» (مسطّح وغلط للفئتين 2 و3) | `TERMS_LINE` + وسائل الدفع |
| `process-view.tsx` phase 04 | «Final 25–50% before delivery» (غامض) | «Balance before delivery: 25% (Tiers 2–3) · 50% (Tier 1)» + المرآة العربية |
| `gate-stepper.tsx` | نفس الغموض | نفس الدقة |
| `og-pages.tsx` (agreement OG) | «50 / 50 payment structure» في وصف الصورة الاجتماعية | «tiered payment splits» |
| `start-view.tsx` payNote | التناقض نفسه | **اتحذف مع الروت** |

`agreement-view.tsx` Term 05 كان أصلاً موحّد صح — اتأكّد واتساب.

### ب. دمج /start في /contact (Funnel absorption)
إضافة قسم **«BEFORE YOU WRITE / قبل ما تكتب»** فوق الفورم في `contact-view.tsx`:
1. **Fit-check**: عمودان «Right fit if —» (4 ✓) / «Probably not, if —» (3 ✗) — بنصوص /start الأصلية EN+AR.
2. **Kickoff steps**: ٣ كروت «Discovery Call → Brief & Proposal → Contract & Kickoff» مع CTA «Book the Call» على wa.me.
3. **سطر الشروط** من `TERMS_LINE` — مفيش نسخة محلية تانية خالص.

النتيجة: آخر صفحة في القمع بتفلتر العميل وتضبط توقعاته **قبل** ما يكتب — بدل ما كانت بتجمّع رسايل من ناس مش جاهزين.

### ج. الـ 301 والتنضيف
- `next.config.ts`: `{ source: "/start", destination: "/contact", permanent: true }` (308 مؤكد).
- حذف `app/(site)/start/` كاملًا (page + view + opengraph).
- `lib/sitemap.ts`: إزالة /start من الروتات والأولويات.
- `features/terminal/terminal-overlay.tsx`: أمر `start` بقى يودّي /contact.
- `lib/og-pages.tsx`: حذف مفتاح `start` من `OgPageId` و`OG_PAGES` + دالة `vStart` اليتيمة.
- `features/home/home-bands.tsx`: تعليق ستايل — الـ ClientJourneyBand كان مكتوب إنه teaser لـ /start.

## 3) التحقق (live, قبل الإقفال)

| فحص | نتيجة |
|---|---|
| `GET /start` | **308 → /contact** ✅ |
| sitemap.xml | صفر روابط /start ✅ |
| /contact SSR | كل عناصر القسم الجديد موجودة (14/14) ✅ |
| /services SSR | `TERMS_LINE` ظاهر، الصياغة القديمة صفر ✅ |
| /process SSR | phase-01 مدفوع بـ50% ظاهر؛ الأكورديونات 02–04 مقفولة عمدًا بالتصميم (النص الجديد أكّده typecheck + assert عند التحرير) ✅ |
| Contact form states | idle/working/sent/error/rateLimited + honeypot + IP rate-limit + تخزين Payload + إشعار إيميل معزول الفشل — سليم، مفيش تعديل ✅ |
| `tsc --noEmit` | نظيف ✅ |
| `npm run build` | 54 صفحة static، /start اختفت من الجدول ✅ |

## 4) قرارات ومتابعات

- **38 days مقابل ديوريشن الفئات**: لسه بانتظار قرار المالك (سؤال مفتوح في ABO-26 comment) — متعملش تغيير أحادي.
- الـ 301s الباقية (gallery→work, work-ui→labs, why→about, capabilities→services) مجدولة S4 زي الـ amendment.
