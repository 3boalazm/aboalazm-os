# 02 — MASTER PLAN: الـ Overhaul الشامل لموقع Aboalazm OS (2026-10-14)

**الهدف المعلن (من صاحب المشروع):** «الويب سايت بعد ما أخلص ميختلفش عن أجمد استوديو في العالم».
**دوري:** 6 فرق في عقل واحد — Business · Marketing · Design · UX/Flow · Technical · Analytics.
**القاعدة الحاكمة:** كل حكم بصري/تحريري يعدي من بوابة الـ Benchmark (ملف 01) + بوابة build/typecheck/preview قبل ما ينحسب «تم».

---

## 1. الفلو اللي همشي بيه (الترتيب الإلزامي)

```
S0 ✅ أساسيات: توثيق + تحقق من الشغل السابق + بحث + خطة   ← (هذا الملف ومرفقاته)
S1   IA: تقليص الناف والخريطة (حذف/دمج/إخفاء) + redirects + sitemap
S2   الرئيسية: إعادة ترتيب وتشكيل البانلز بالكامل
S3   مسار التحويل: فانل واحد قانوني + توحيد شروط البيع
S4   الشغل ودراسات الحالة: صقل بصري + Next case + إصلاح P0-3
S5   ديون تقنية: Card coverage، ثيم فاتح، soft-404s، perf/a11y sweep
S6   Analytics & Growth: events + structured data + سطوح الـ Insights
S7   QA نهائي + ريبورت التسليم → Docs + Linear (إقفال)
```

كل Sprint له: **باب قبول** (قبل الانتقال) + **دليل قابل للفحص** (diff، معاينة، screenshot ذهني موصوف). ومفيش PR/دمج لـ main — الشغل على فرع الجلسة، ومصطفى يراجع من الـ live preview.

## 2. منهجية الريسيرش (إزاي ببحث)

1. **Benchmark extraction** (تم في ملف 01): عيّنة استوديوهات عالمية + أدلة تحويل منشورة 2025–2026 → استخراج قوانين مشتركة → مصفوفة فجوات.
2. **Audit from code, not memory:** كل حكم على موقعنا من قراءة السورس/الرندر الحالي، مش من إحساس.
3. **Reference to doctrine:** ARCHITECTURE.md (Quiet Luxury + ون سيستم) هو الدستور — أي اقتراح بيكسره محتاج مبرر صريح.
4. **تحقق adversarial:** كل إصلاح مهم يتقاس ضد «إزاي ممكن يكون غلط» قبل الشحن (الأسلوب المتبع في QA السابقين).

## 3. الاستراتيجية المعتمدة (قرار البيزنيس — مؤسس على ملف 01 §4)

> **أبطال الرئيسية = عميل الاستوديو.** التوظيف مسار هادي متميز (/for-hiring تفضل وتتحسن، لكنها مش الرسالة الأولى). الهيرو يبيع «استوديو هويات مستقل — أنظمة براند ثنائية اللغة» بـ CTA واحد: **Start a project**، ولينك هادي واحد: **See the work**.

## 4. خريطة الموقع المستهدفة (IA)

### 4.1 الناف الأساسي (من 5+12 → 6 لينكات + CTA)

```
WORK · SERVICES · PRICING · PROCESS · WRITING · ABOUT      [START A PROJECT ↗]
```
- **FOR HIRING** يخرج من الناف → يعيش في الهيرو (لينك هادي) + الفوتر + صفحته تتحسن.
- قائمة «MORE» (12 لينك) **تلغى** — محتواها يتوزع: BOOKS/RESOURCES/GALLERY/LABS → الفوتر + صفحات الـ Insights/Work؛ WHY/CAPABILITIES → يتدمجوا في ABOUT/SERVICES؛ AGREEMENT → الفوتر فقط.

### 4.2 جدول القرارات لكل راوت (~21 → ~14)

| الروات الحالي | القرار | السبب (فريق) |
|---|---|---|
| `/` | 🔨 إعادة بناء كاملة | أساس الفانل الجديد |
| `/work` | تحسين (ليدجر + دمج gallery كواجهة تانية) | الأصل الأقوى (Design/UX) |
| `/case-studies/[slug]` | إضافة Next-case + صقل | المعيار العالمي (UX) |
| `/services` | السنتر البيعي — يمتص capabilities + أفضل أجزاء why | Marketing |
| `/pricing` | يبقى (شفافية = ميزة فردي) + توحيد الشروط | Business |
| `/process` | يبقى صفحة المنهجية الوحيدة (البوابات الأربع) | كل الاستوديوهات بتلخصها مرة واحدة |
| `/about` | يمتص why + شخصنة أقوى (صورة + قصة) | Marketing |
| `/for-hiring` | يبقى، يتخرج من الناف، تحسين هيكل CV-dossier | Business |
| `/writing` | **يتسطح** كـ Insights مرئي في الناف + teaser في الرئيسية | SEO/Growth |
| `/books` | يبقى — يتربط من Insights + الفوتر (أصل عميق) | Marketing |
| `/resources` | يبقى — يتربط من المقالات ذات الصلة (lead capture) | Growth |
| `/labs` | يمتص /work-ui (التجارب الحية مكانها المعمل) → يتنقل للفوتر | Technical |
| `/gallery` | **يدمج داخل /work** كتبديل عرض (Ledger ⇄ Visual reel) | UX — إزالة ازدواج |
| `/contact` | **يمتص /start** — صفحة التحويل الوحيدة (brief + قنوات) | Conversion |
| `/start` | ❌ يتقفل → 301 إلى `/contact` | إزالة ازدواج الفانل |
| `/why`, `/capabilities` | ❌ يتقفلوا → 301 إلى `/about` / `/services` وأفضل محتواهم يتنقل فعلياً | إزالة حشو |
| `/work-ui` | ❌ يتقفل → المحتوى الصالح ينتقل إلى `/labs` (502 bug was here) | Technical |
| `/gallery-test` | 🗑️ حذف نهائي (artifact تطوير) | Technical |
| `/type` | يبقى noindex مخفي (playground خطوط) | Technical |
| `/portfolio`, `/cv`, `/agreement` | يبقوا كما هم — روابط فوتر فقط | جاهزية |
| Admin/API | بلا تغيير | — |

### 4.3 الرئيسية المستهدفة — ترتيب وتشكيل البانلز (القلب النابض للطلب)

| # | البانل الجديد | التشكيل | ليه (فريق) |
|---|---|---|---|
| 01 | **Hero** — جملة واحدة + CTA واحد + لينك عمل | Constellation يخف (يتحول لمؤثر خلفية، مش لوحة بيانات)؛ شارة Availability صغيرة؛ لينك هادي «For hiring teams» | Business + Design |
| 02 | **Proof strip** — قطاعات/عملاء في سطر واحد (Pharma · Food · Education · Government · Art) + حارس «9+ years» | شريط نصي رفيع مباشرة تحت الهيرو | Marketing |
| 03 | **Selected Work** — 3 حالات مميزة | صور-أولاً (الميديا تاخد ≥60% من سطح الكارت)، عنوان + سطر نتيجة + لينك | Design |
| 04 | **Statement band** — لحظة مانيفستو بخط ضخم على خلفية هادية | كسر الإيقاع — أول سيكشن من غير SectionMarker | Design |
| 05 | **Services snapshot** — 3 مستويات + à la carte قصير | كروت PanelCard مع لينكات pricing | Business |
| 06 | **Method** — البوابات الأربع | أفقي بأرقام ضخمة (Gate 01–04) + لينك process | UX |
| 07 | **About teaser** — الشخص وقصته | صورة شخصية + 4 حقائق + لينك | Marketing |
| 08 | **Insights teaser** — أحدث 3 مقالات | كروت تحريرية | Growth/SEO |
| 09 | **FAQ** — 5 أسئلة اعتراضية | Accordion موجود — يتنقّى | Conversion |
| 10 | **Final CTA** — «Have a brand to shape?» | Panel واحد ضخم + Start a project | Conversion |

**المُزال من الرئيسية:** SkillsMarquee (حشو متحرك — تتنقل كلماته إلى About) · GitHub band من مسار الرئيسية إن كان ظاهر · ازدواج CTA «للتوظيف/للعملاء» من الهيرو · تكرار نفس entrance لكل قسم.

## 5. تفصيل السبرينتات وقبولها

### S1 — IA & الراوتنج
- ناف جديد (6+CTA) بكل اللغات، موبايل بنود محدثة، فوتر مُعاد تنظيمه (4 أعمدة: Engage/Studio/Insights/Social).
- Redirects 301 في `next.config.ts`: `/start→/contact`، `/why→/about`، `/capabilities→/services`، `/work-ui→/labs`، `/gallery→/work?view=gallery` (أو hash)، حذف `/gallery-test`.
- `sitemap.ts` + `robots.ts` يتحدثوا تلقائياً.
- **باب القبول:** build + typecheck نضيف؛ كل الراوتس القديمة ترد 301؛ مفيش لينك داخلي ميت في الناف/الفوتر.

### S2 — الرئيسية
- تنفيذ ترتيب §4.3 بالكامل: مكونات جديدة (ProofStrip, StatementBand, ServicesSnapshot, InsightsTeaser) + إعادة هيكلة الهيرو.
- **باب القبول:** SSR-أول LCP محفوظ (بلا opacity-0)، عربي RTL سليم، بلا CLS جديد على الموبايل، أقسام متمايزة بصرياً (مش نفس البترن).

### S3 — مسار التحويل
- /contact يمتص محتوى /start (توقعات/نطاق قبل الفورم)؛ توحيد نص شروط الدفع والمراجعات من مصدر واحد (`lib/offers.ts`) في الصفحات الأربع.
- تحسين الفورم نفسه: خطوات أقل، رسائل حالة واضحة (موجودة — تتأكد).
- **باب القبول:** نفس السياسات نصياً في contact/pricing/agreement؛ اختبار إرسال محلي يظهر نجاح/خطأ صح.

### S4 — الشغل ودراسات الحالة
- Featured cases صور-أولاً؛ غاليري /work المدمجة؛ Next-case متابعة في نهاية كل دراسة؛ إصلاح/تحقق P0-3 (الكارت الطافي)؛ لينك «Open live» يتحقق أو يتشال.
- **باب القبول:** لا باج P0-3 عند التنقل السريع بين الصفوف (فحص يدوي لايف)؛ كل دراسة تقفل بتنقل لدراسة تانية.

### S5 — ديون تقنية
- تغطية Card primitive (فحص: أين تُستخدم PanelCard/MediaCard وأين لسه cards متعشية يدوياً).
- مسح الثيم الفاتح المتبقي (كونتراست أكس 2019 nodes كانت في لايت)؛ soft-404s في الراوتس الديناميكية؛ تدقيق perf (preloads، صور featured بـ priority).
- **باب القبول:** لا violations حرجة في فحص سريع؛ notFound() يرجع 404 حقيقي في build محلي.

### S6 — Analytics & Growth
- Vercel Analytics custom events: `cta_start_project`, `case_study_open`, `contact_submit`, `insight_open`, `cv_download`.
- JSON-LD: Article/Book لـ /writing و/books (QA #48)، hreflang أو pre-paint language مكتمل (موجود عبر G2 — يتأكد).
- **باب القبول:** events تظهر في سجل الشبكة محلياً؛ JSON-LD صالح في فحص.

### S7 — QA + التسليم
- كرول كامل على الـ preview (كل راوت × 375/768/1440 × darك/light)، عربي spot-check، build نهائي.
- **ريبورت التسليم** (`03_DELIVERY_REPORT.md`) → Google Docs + إقفال تذاكر Linear بروابط.

## 6. المقترحات الإضافية (ابتكارات الفرق — تقيّم أثناء التنفيذ)

| # | المقترح | الفريق | القرار |
|---|---|---|---|
| M1 | **Case-study «client view» snippet** — سطر اقتباس مكان الشهادة لحد ما الشهادات الحقيقية توصل | Marketing | يُنفذ كـ placeholder مؤسسي بلا اختلاق نصوص (يُملى على مصطفى) |
| M2 | **«Now» strip** في About (شغال على إيه/متاح من متى) — نمط استوديوهات 2026 | Marketing | في S2/S4 لو الموضع اتثبت |
| M3 | **توحيد تجربة الكتب** — دخول القارئ من Insights بغلاف تحريري | Design | S6 |
| M4 | **ـsـريعة اختصارات لوحة مفاتيح** موجودة (Ctrl+`) — توثيقها في الفوتر بدل «مفاجأة» | UX | S5 |
| M5 | **OG images ديناميكية جديدة لكل راوت رئيسي** بعد IA | Technical | S6 (بعد تثبيت الراوتس) |
| M6 | **EVENTS.md** — خارطة قياس لكل تفاعل (Single source of truth للأناليتكس) | Analytics | في S6 |

## 7. محتاج من مصطفى (Owner-decision items — لن أختلقها)

1. **3–5 شهادات عملاء** باسم/دور/نص موافق عليه → قسم Proof.
2. **توحيد أرقام الخبرة والدور الحالي** (9 سنوات؟ من 2017؟ دور نايل فارما انتهى 2025 ولّا لسه؟) — عندي تناقضات موثقة في QA #62–63.
3. **موقف «38 يوم»** — يتقال برنامج ثابت ولّا يتصمت (يتناقض مع مدد الباقات).
4. **صور شخصية عالية الجودة** للـ About teaser + غلاف أوبن جراف شخصي.
5. **تأكيد تطبيع الشروط:** 50/50 ولّا 50/25/25، رسوم الدفع، حقوق المراجعات الإضافية/سعرها.

## 8. المخاطر وإدارتها

| الخطر | الاحتمال | التخفيف |
|---|---|---|
| كسر SEO بإغلاق راوتس | متوسط | 301 كاملة + sitemap محدث + مراجعة titles بعد الدمج |
| الـ Handoff drift (توثيق قديم يضلل) | مؤكد | هذا الملف هو المرجع الوحيد — HANDOFF القديم يُؤرشف بإشارة في آخره |
| باجات تفاعل (AnimatePresence class) | متوسط | قاعدة ثابتة من QA: لا `mode="wait"` بلا فحص يدوي لايف |
| نطاق ينفجر (20+ راوت) | — | ترتيب السبرينتات صارم؛ أي سبرينت يعدي بابه أو يتوقف للمراجعة |

## 9. سجل المخرجات (Registry — يتحدث كل سبرينت)

| المخرج | المكان | الرابط/المسار |
|---|---|---|
| هذا الملف + 00 + 01 | الريبو | `docs/overhaul-2026-10-14/` |
| مجلد Drive | «Aboalazm OS — Overhaul 2026-10-14» | https://drive.google.com/drive/folders/1CHkZjBuv82zU-XEJusLKWAokmGc6c7mR |
| Doc 00 — التحقق من الشغل السابق | Google Docs | https://docs.google.com/document/d/1H13Y29TwBJT9p29yCCycC5B8f8Pltd18I2kd-5VUtXo/edit |
| Doc 01 — البحث المرجعي | Google Docs | https://docs.google.com/document/d/11Gxi6vNpIVY4y6-UNHZ5tXk52v3RIjBmUShO5HZuDTI/edit |
| Doc 02 — الخطة الرئيسية | Google Docs | https://docs.google.com/document/d/1uxVumKFuca9pVdKwJieiZzkhqe_c9IfZOiLk_Df7QXw/edit |
| مشروع Linear | «Aboalazm OS — Studio-grade overhaul (Oct 2026)» | id `4da0f815-8bf2-40c9-bf2f-f08f8937e3db` (state: In Progress) |
| تذاكر السبرينتات | Linear | ABO-23 ✅ S0 · ABO-24 S1 · ABO-25 S2 · ABO-26 S3 · ABO-27 S4 · ABO-28 S5 · ABO-29 S6 · ABO-30 S7 |
| ريبورت التسليم | `docs/overhaul-2026-10-14/03_DELIVERY_REPORT.md` + Docs + Linear | S7 |

---
*تم التوقيع: الفرق الستة، جلسة واحدة، 2026-10-14. نبدأ التنفيذ من S1 فور اعتماد هذه الخطة.*
