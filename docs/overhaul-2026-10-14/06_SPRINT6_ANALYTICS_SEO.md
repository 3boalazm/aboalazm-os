# S6 — Analytics & Growth Sprint Report (ABO-29)

**Commit:** `dcf11e7` · **Date:** 2026-10-14 · **Sprint gate:** ✅ typecheck clean · build green (54 pages) · no route regressed

## الملخص
آخر سبرنت في سلسلة الـ overhaul: قياس (analytics) + بيانات مهيكلة (structured data) فقط. دلوقتي كلم نقطة تحويل أساسية متقيسة باسم مستقر، وكل نوع محتوى عنده JSON-LD صالح. الشغل اتنفذ في ملفين أساسيين (`lib/analytics.ts`, `lib/structured-data.ts`) + توصيلات في 10 مواضع + EVENTS.md كمصدر حقيقة.

## 1. Vercel Analytics — 5 أحداث تحويلية (M6)
`@vercel/analytics@2.0.1` كان مثبتًا ومظبوطًا على الـ layout من قبل — الناقص كان الأحداث. البنية:
- **`lib/analytics.ts`** — `trackEvent(name, props)` بـ union مكتوب (`EventName`) يجعل أي خطأ إملائي في اسم الحدث خطأ تجميعي، وtry/catch يضمن أن الأناليتكس مستحيل تكسر أكشن للمستخدم.
- **`docs/EVENTS.md`** — الكتالوج الرسمي: المعنى + مواضع الإطلاق + الـ props + قراءة القمع. أي تغيير يحدث هنا في نفس الـ commit مع الكود.

| Event | Fire sites | Props |
|---|---|---|
| `cta_start_project` | hero primary · `CtaBand` primary (home/services/pricing/agreement/labs) · /contact "Book the Call" | `placement`, `href` |
| `case_study_open` | FeaturedCaseCard (الداخلي فقط) · NextCaseLink | `slug`, `surface` |
| `contact_submit` | فرع النجاح فقط في contact-form | `locale` |
| `insight_open` | insights-teaser · صفوف الأرشيف /writing | `slug`, `surface` |
| `cv_download` | رابط السيرة في /for-hiring | — |

**ملاحظة توثيقية:** فخاخ البوتات في contact-form ترجع ok للزائر بدون تخزين — قيد التوثيق في EVENTS.md؛ لو الداشبورد احتاجت فصل الضجيج لاحقًا نضيف `contact_submit_spam` (تركناها خارج النطاق قصدًا عشان الـ honeypot يفضل غير مرئي).

## 2. Structured Data (QA #48)
الموجود سابقًا: Person+WebSite (site graph), ProfilePage, BreadcrumbList. المضاف:

| Schema | Route | SSR-verified |
|---|---|---|
| `ItemList` (3 كتب) | `/books` | ✅ في المصدر المُقدَّم |
| `Book` | `/books/[slug]` (×3) | ✅ |
| `Article` | `/writing/[slug]` (×ن) | ⚠️ كود-متأكد فقط (انظر القيود) |

`getArticleSchema/getBookSchema/getBookListSchema` رُكبت في `lib/structured-data.ts` وربطت بـ Person/WebSite graph (`author: {@id: PERSON_ID}`). تم التحقق من صلاحية كل مصنع (الحقول المطلوبة موجودة + JSON قابل للتسلسل) عبر تنفيذ محلي.

## 3. تسوية دخول المكتبة تحريريًا (M3)
صفحة الرف (/books) كانت مهدمة على `PanelCard` في S5. البقعة الوحيدة المتبقية: نص ثابت "3 journeys" داخل الكارت — أي إضافة رحلة لكتاب كانت هتكذب الواجهة. الآن مشتق: `book.journeys.length` (en: "journeys" / ar: "رحلات").

## 4. OG لمسارات أساسية (M5)
تدقيق شامل بعد استقرار الـ IA: **كل مسار عام عنده `opengraph-image.tsx`** (about, agreement, books(+[slug]), capabilities, contact, for-hiring, labs, pricing, process, resources, services, why, work, work-ui, writing(+[slug]), وhome عبر layout). الاستثناء الوحيد `/type` — مستثنى بالتصميم: صفحة عينات داخلية `robots: noindex`، لا تشارك اجتماعي مطلوب عليها.

## Gates
- ✅ `npm run typecheck` نظيف
- ✅ `npm run build` أخضر — 54 صفحة، /books و/books/[slug] و/writing/[slug] كلها في الجدول
- ✅ SSR كيرل: `/books` → ItemList+3 ListItem · `/books/basics-of-design` → Book · /, /services, /work, /case-studies/nile-pharma → 200
- ✅ مصانع السكيما: 3/3 VALID محليًا
- ⚠️ **قيد SSR:** صفحات /writing/[slug] ترجع 404 في الساندبوكس بسبب سلوك موجود مسبقًا: `getPost` لا يملك fallback إستاتيكي (الملف متطابق حرفيًا مع main — byte-diff صفر). على Vercel مع `DATABASE_URI` الصفحات تُقدَّم عادي والـ Article schema سيظهر فيها. هذا جدار بيئة، ليس رجعة.

## لم يُنفذ (خارج نطاق S6 قصدًا)
- `contact_submit_spam` — موثق كخيار مستقبلي في EVENTS.md.
- التحقق من الشبكة الحية للأحداث: يتطلب متصفح + Vercel — مترك لآخر مرور حي للمالك (انظر دليل التنبيهات المحلية في EVENTS.md).

## القيود البيئية للساندبوكس (محررة لمرة واحدة — تنطبق على كل الـ sprint reports)
- الشبكة الصادرة محصورة في github.com/npm/pypi — أي نداء للإنتاج الحي (ابوazm-os.vercel.app, Payload DB) غير ممكن.
- `validate-site-metadata.mjs` يعيد HTTP 000 في الساندبوكس — الاتساق الوصفي اتدقق محليًا على الملفات بدل حي.
- لا توجد بيئة DATABASE_URI محلية — كود /writing/[slug] يُفحص بالمقارنة مع main + تحقق المصنع، لا SSR.
- axe لا يعمل بلا متصفح — الامتثال للتباين يُحسب رياضيًا رمز-لرمز (S5).
