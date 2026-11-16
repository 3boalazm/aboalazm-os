"use client";

/**
 * PHARMACY WEB — Product case file / 010
 *
 * Source: 3boalazm/pharmacy-web, read directly. This is the strongest
 * engineering story of the ten, because the repository enforces its own
 * rules with tooling rather than asking reviewers to remember them.
 *
 * Repository facts used here (from README + src tree):
 *   · Next.js 14 App Router · TypeScript strict · Tailwind (token-driven)
 *   · TanStack Query · Zustand (POS cart only) · Cairo typeface · Arabic RTL
 *   · 15 bounded-context modules: catalog, customers, finance, identity,
 *     inventory, orders, platform, pos, prescriptions, reporting, sales,
 *     shifts, shop, suppliers (+ app routes)
 *   · boundary rules enforced by `npm run boundaries` (dependency-cruiser):
 *     modules import only through their index.ts facade, components/ui may
 *     never import modules, app/ pages hold no business logic
 *   · money is string end-to-end (NUMERIC(19,4)); server total authoritative
 *   · Idempotency-Key (uuidv7) on every financial/inventory POST
 *   · pharmacy_id never leaves the client — tenancy in the JWT
 *   · DUR_BLOCK → pharmacist PIN elevation, then retry with durOverride
 *   · contract tests + an e2e smoke spec ship in tests/
 */
import { ProductCase } from "./product-case";

export function PharmacyWebCaseStudy() {
  return (
    <ProductCase
      accent="rose"
      fileNo="010"
      code="PHARMA / POS"
      eyebrow="PHARMACY WEB / صيدليتي"
      wordmark="Pharmacy"
      wordmarkTail="Web"
      heroLead="A pharmacy counter runs on a till that cannot be wrong: dispense, check interactions, take payment, and keep the books straight — in Arabic, with the money stored as text."
      heroLeadAr="كاونتر صيدلية يعمل على كاشير لا يحتمل الخطأ: صرف، وفحص تداخل، وتحصيل، وحسابات مضبوطة بالعربية، والمال مخزَّن كنص."
      badges={[
        { en: "Healthcare", ar: "صحة" },
        { en: "Multi-tenant SaaS", ar: "SaaS متعدد المستأجرين" },
        { en: "Arabic RTL", ar: "عربي RTL" },
        { en: "Contract-tested", ar: "مختبَر بعقود" },
      ]}
      snapshot={[
        { value: "15", label: "Bounded-context modules", labelAr: "وحدة سياق مغلق" },
        { value: "19,4", label: "Money precision", labelAr: "دقة الفلوس" },
        { value: "03", label: "Enforced boundary rules", labelAr: "قواعد حدود مفروضة" },
        { value: "00", label: "Domain data in localStorage", labelAr: "بيانات مجال في localStorage" },
      ]}
      snapshotTitle={{ en: "System snapshot", ar: "لقطة النظام" }}
      snapshotCode="PHARMA / RTL"
      snapshotNote="Module count is the src/modules directory; the 19,4 is the NUMERIC precision the contract specifies for money."
      snapshotNoteAr="عدد الوحدات من مجلد src/modules؛ و19,4 هي دقة NUMERIC التي يحددها العقد للمال."
      role={{ en: "Role: Product & frontend architecture", ar: "الدور: منتج + بنية واجهة" }}
      domain={{ en: "Domain: Pharmacy / POS", ar: "المجال: صيدلية ونقاط بيع" }}
      year="2026"
      cover={{
        src: "/images/work/dev-cards/pharmacy-web-card.jpg",
        alt: "Pharmacy Web — token-driven interface kit",
        altAr: "فارماسي ويب: طقم واجهة مبني على متغيّرات التصميم",
        caption: "Interface kit — token-driven, RTL-first",
        captionAr: "طقم الواجهة: على متغيّرات التصميم، وبالعربية أولًا",
        tag: "CONTRACT / 2026",
      }}
      cta={{ href: "https://pharmacy-web-eight.vercel.app/", en: "Open Pharmacy Web", ar: "افتح فارماسي ويب" }}
      challenge={{
        title: "A till is a financial system that a tired person operates at 11pm.",
        titleAr: "الكاشير نظام مالي يشغّله شخص متعب في الحادية عشرة ليلًا.",
        paragraphs: [
          "Retail software fails in a specific way: not by crashing, but by being slightly wrong. A total rounded on the client, a payment posted twice after a flaky connection, a credit balance written by a screen that should only read it.",
          "Pharmacy adds a second layer. Dispensing has rules the software must respect — an interaction block is not a warning toast, it is a stop that a pharmacist has to consciously override, and the override itself has to be recorded.",
          "This is the web frontend for a pharmacy SaaS platform, written against a CTO architecture decision document and an API contract specification. The interesting work is not the screens — it is making the rules impossible to bypass.",
        ],
        paragraphsAr: [
          "تفشل برمجيات التجزئة بطريقة محددة: لا بالانهيار، بل بأن تخطئ قليلًا. إجمالي مقرَّب على العميل، ودفعة سُجّلت مرتين بعد شبكة متقطعة، ورصيد آجل كتبته شاشة يفترض أن تقرأ فقط.",
          "وتضيف الصيدلية طبقة ثانية. فللصرف قواعد يجب أن يحترمها البرنامج: حجب التداخل ليس toast تحذيريًا، بل وقفة يجب أن يتجاوزها الصيدلي بوعي، ويجب أن يُسجَّل التجاوز نفسه.",
          "هذه واجهة الويب لمنصة صيدليات SaaS، كُتبت على مستند قرار معماري من الـCTO ومواصفة عقد API. والعمل المهم ليس الشاشات، بل أن تصبح القواعد مستحيلة التجاوز.",
        ],
        callout: "Core decision: the server owns every number. The client may preview a total, but it never posts one — and it never posts twice, because every financial call carries an idempotency key.",
        calloutAr: "القرار الأساسي: الخادم يملك كل رقم. يستطيع العميل عرض إجمالي تقديري، لكنه لا يرسل إجماليًا، ولا يرسل مرتين، لأن كل نداء مالي يحمل idempotency key.",
      }}
      system={{
        kicker: "Architecture",
        kickerAr: "البنية",
        title: "Fifteen modules, three iron rules.",
        titleAr: "خمس عشرة وحدة، وثلاث قواعد صارمة.",
        aside: "The boundary rules are not a convention in a wiki — `npm run boundaries` fails the build when one is crossed.",
        asideAr: "قواعد الحدود ليست عُرفًا في ويكي: يُفشل الأمر `npm run boundaries` البناء إذا انكسرت قاعدة.",
        modules: [
          {
            no: "01",
            name: "POS & sales",
            nameAr: "نقطة البيع والمبيعات",
            detail: "Cart state in Zustand (the only place it lives), POST /sales with the DUR gate in front of it, and a payment panel that reflects server truth.",
            detailAr: "حالة السلة في Zustand (مكانها الوحيد)، ثم POST /sales وبوابة DUR قبله، ولوحة دفع تعكس حقيقة الخادم.",
            tech: "modules/pos · modules/sales",
          },
          {
            no: "02",
            name: "Inventory & FEFO",
            nameAr: "المخزون وFEFO",
            detail: "Stock, batches and GRN posting — with first-expiry-first-out allocation, which is a clinical requirement before it is an accounting one.",
            detailAr: "المخزون والدفعات وترحيل GRN، بتخصيص أول انتهاء أول خروج (FEFO)، وهو شرط إكلينيكي قبل أن يكون محاسبيًا.",
            tech: "modules/inventory · …/grn",
          },
          {
            no: "03",
            name: "Finance & ledger",
            nameAr: "المالية والدفاتر",
            detail: "Customer statements and payments. The balance is read-only in the UI: it renders from the statement endpoint and there is no path that writes it.",
            detailAr: "كشوف العملاء والمدفوعات. الرصيد للقراءة فقط في الواجهة: يُعرض من endpoint الكشف، ولا يوجد مسار يكتبه.",
            tech: "modules/finance · modules/customers",
          },
          {
            no: "04",
            name: "Identity & tenancy",
            nameAr: "الهوية والمستأجرين",
            detail: "Tenant identity lives in the JWT. pharmacy_id is never sent from the client, so a manipulated payload cannot address another pharmacy.",
            detailAr: "هوية المستأجر في الـJWT. ولا يُرسل pharmacy_id من العميل، فلا يستطيع payload مُتلاعَب به أن يخاطب صيدلية أخرى.",
            tech: "modules/identity · lib/auth",
          },
        ],
        flow: {
          a: "POS cart",
          aSub: "Zustand — UI only",
          mid: "API + contract",
          midSub: "Idempotency-Key, uuidv7",
          b: "Server total",
          bSub: "The only authoritative number",
          note: "Every financial or inventory POST is idempotent: a retried request after a dropped connection cannot double-charge or double-receive.",
          noteAr: "كل POST مالي أو مخزوني idempotent: طلب معاد بعد انقطاع اتصال لا يمكن أن يُحصَّل مرتين ولا يُستلَم مرتين.",
        },
      }}
      decisions={{
        title: "Rules a compiler can check.",
        titleAr: "قواعد يستطيع المترجم (compiler) فحصها.",
        items: [
          {
            n: "01",
            title: "Money is a string, end to end",
            titleAr: "المال نص، من الطرف إلى الطرف",
            body: "NUMERIC(19,4) survives the wire as a string. Client arithmetic exists for preview only; the server total is the one a receipt may print.",
            bodyAr: "يعيش NUMERIC(19,4) على الشبكة كنص. وحسابات العميل للمعاينة فقط؛ أما إجمالي الخادم فهو ما تطبعه الفاتورة.",
          },
          {
            n: "02",
            title: "Every financial POST is idempotent",
            titleAr: "كل POST مالي idempotent",
            body: "A uuidv7 Idempotency-Key rides on /sales, /finance/payments and /inventory/grn. The flaky-connection double-post — the classic retail bug — is designed out rather than tested for.",
            bodyAr: "يركب Idempotency-Key من نوع uuidv7 على /sales و/finance/payments و/inventory/grn. وخطأ التسجيل المزدوج بعد شبكة متقطعة، وهو الكلاسيكي في التجزئة، مُصمَّم خارج النظام لا متحصَّن باختبار.",
          },
          {
            n: "03",
            title: "Module boundaries fail the build",
            titleAr: "حدود الوحدات تُفشل البناء",
            body: "Three rules, enforced by dependency-cruiser: cross-module imports only via index.ts, components/ui never imports modules, and pages hold no logic. Architecture debt cannot be merged quietly.",
            bodyAr: "ثلاث قواعد يفرضها dependency-cruiser: الاستيراد بين الوحدات عبر index.ts فقط، وcomponents/ui لا تستورد وحدات، والصفحات بلا منطق. فلا تندمج ديون البنية في صمت.",
          },
          {
            n: "04",
            title: "A DUR block is a stop, not a toast",
            titleAr: "حجب التداخل وقفة، لا toast",
            body: "Error codes drive the interface. DUR_BLOCK opens a pharmacist PIN-elevation modal and only then retries the request with an explicit override — so the override is an auditable act.",
            bodyAr: "تقود أكواد الخطأ الواجهة. يفتح DUR_BLOCK نافذة (modal) لرفع الصلاحية بكود الصيدلي، وبعدها فقط يعيد الطلب بتجاوز صريح، فيصبح التجاوز فعلًا قابلًا للمراجعة.",
          },
          {
            n: "05",
            title: "Tenancy is never a client field",
            titleAr: "المستأجر ليس حقلًا في العميل",
            body: "pharmacy_id arrives inside the JWT and nowhere else. There is no request shape a malicious client can edit to reach another tenant's data.",
            bodyAr: "يصل pharmacy_id داخل الـJWT ولا يصل من أي مكان آخر. ولا يوجد شكل لطلب عميل خبيث يستطيع تعديله للوصول إلى بيانات مستأجر آخر.",
          },
          {
            n: "06",
            title: "Storage is for session, not domain",
            titleAr: "التخزين للجلسة لا للبيانات",
            body: "The session token lives in sessionStorage and domain data is never put in localStorage. A shared pharmacy terminal is a shared machine, and the browser should not remember a previous patient.",
            bodyAr: "رمز الجلسة في sessionStorage، ولا تُوضع بيانات المجال في localStorage. فكاشير الصيدلية المشترك جهاز مشترك، ويجب ألّا يتذكر المتصفح مريضًا سابقًا.",
          },
        ],
      }}
      rows={{
        kicker: "Routes",
        kickerAr: "المسارات",
        title: "Five surfaces, one contract.",
        titleAr: "خمس واجهات، وعقد واحد.",
        items: [
          { name: "Auth", nameAr: "الدخول", body: "Login and the PIN-elevation path used when a dispense trips the DUR gate.", bodyAr: "تسجيل الدخول ومسار رفع الصلاحية بالكود الذي يُفتح حين يصطدم الصرف ببوابة DUR." },
          { name: "Dashboard", nameAr: "اللوحة", body: "The guarded shell — sidebar per the design system, with revenue/inventory signals where a pharmacist actually looks.", bodyAr: "القشرة المحمية: شريط جانبي بحسب نظام التصميم، مع مؤشرات الإيراد والمخزون في المكان الذي ينظر إليه الصيدلي." },
          { name: "POS", nameAr: "نقطة البيع", body: "Search via the catalog facade, cart, payment panel, receipt printing.", bodyAr: "بحث عبر facade الكتالوج، وسلة، ولوحة دفع، وطباعة إيصال." },
          { name: "Inventory", nameAr: "المخزون", body: "Stock levels, FEFO batches and GRN posting for received shipments.", bodyAr: "مستويات المخزون ودفعات FEFO وترحيل GRN للشحنات المستلمة." },
          { name: "Customers", nameAr: "العملاء", body: "CRM list, a per-customer page and a ledger statement that is read-only by construction.", bodyAr: "قائمة CRM وصفحة لكل عميل وكشف دفتر للقراءة فقط بحكم التصميم." },
        ],
      }}
      evidence={{
        title: "The repository argues with itself, and wins.",
        titleAr: "المستودع يحاكم نفسه، ويكسب.",
        items: [
          { value: "15", label: "Modules under boundary rules", labelAr: "وحدة تحت قواعد حدود", origin: "repo" },
          { value: "03", label: "Rules enforced in CI, not prose", labelAr: "قواعد مفروضة في CI لا نصوص", origin: "repo" },
          { value: "41", label: "Runtime dependencies", labelAr: "اعتمادية تشغيل", origin: "repo" },
          { value: "STRICT", label: "TypeScript mode", labelAr: "وضع TypeScript", origin: "repo" },
        ],
        notes: [
          "Module count and boundary rules come from src/modules and the README's own boundary section; dependency count is package.json's runtime list.",
          "Contract tests (tests/contract) and an e2e smoke spec ship in the repo. They are not re-run here, and this file makes no claim about their current pass rate.",
          "No pharmacy count, patient count or revenue figure is claimed — the frontend repository contains no production data.",
        ],
        notesAr: [
          "عدد الوحدات وقواعد الحدود من src/modules وقسم الحدود في README؛ وعدد الاعتماديات من قائمة التشغيل في package.json.",
          "اختبارات العقود (tests/contract) وspec e2e مشحونة في المستودع. ولم تُشغَّل هنا، ولا يدّعي هذا الملف نسبة نجاحها الحالية.",
          "لا ادعاء بعدد صيدليات أو مرضى أو إيرادات: مستودع الواجهة لا يحمل بيانات إنتاج.",
        ],
      }}
      stack={{
        title: "Boring where it counts.",
        titleAr: "ممل في الأماكن التي تهمّ.",
        items: ["Next.js 14", "TypeScript (strict)", "Tailwind (token-driven)", "TanStack Query", "Zustand", "Radix UI", "Zod", "Cairo typeface", "Arabic RTL", "dependency-cruiser", "Vitest", "Playwright"],
        note: "Twenty runtime dependencies, chosen for state, forms, dialogs and validation — nothing exotic, because a till has to be predictable.",
        noteAr: "عشرون اعتمادية تشغيل، مختارة للحالة والنماذج والحوارات والتحقق. لا شيء غريب، لأن الكاشير يجب أن يكون متوقَّعًا.",
      }}
      handoff={{
        title: "The receipt is the contract.",
        titleAr: "الإيصال هو العقد.",
        note: "Next: offline-first dispense queue for a dropped connection, with the same idempotency key replayed on reconnect rather than a new one.",
        noteAr: "الخطوة التالية: طابور صرف دون اتصال للاتصال المتقطع، بمفتاح idempotency نفسه يُعاد عند الرجوع لا مفتاح جديد.",
      }}
    />
  );
}
