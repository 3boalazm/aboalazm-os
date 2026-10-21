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
      heroLeadAr="كاونتر صيدلية بيمشي على كاشير مينفعش يغلط: صرف، فحص تداخل، تحصيل، وحسابات مظبوطة — بالعربي، والفلوس متخزنة كنص."
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
      snapshotNoteAr="عدد الوحدات من مجلد src/modules؛ و19,4 هي دقة NUMERIC اللي العقد بيحددها للفلوس."
      role={{ en: "Role: Product & frontend architecture", ar: "الدور: منتج + معمارية واجهة" }}
      domain={{ en: "Domain: Pharmacy / POS", ar: "المجال: صيدلية ونقاط بيع" }}
      year="2026"
      cover={{
        src: "/images/work/dev-cards/pharmacy-web-card.jpg",
        alt: "Pharmacy Web — token-driven interface kit",
        altAr: "فارماسي ويب — طقم واجهة مبني على توكنز",
        caption: "Interface kit — token-driven, RTL-first",
        captionAr: "طقم الواجهة — على توكنز، عربي أولًا",
        tag: "CONTRACT / 2026",
      }}
      cta={{ href: "https://pharmacy-web-eight.vercel.app/", en: "Open Pharmacy Web", ar: "افتح فارماسي ويب" }}
      challenge={{
        title: "A till is a financial system that a tired person operates at 11pm.",
        titleAr: "الكاشير نظام مالي بيشغّله شخص تعبان الساعة 11 بالليل.",
        paragraphs: [
          "Retail software fails in a specific way: not by crashing, but by being slightly wrong. A total rounded on the client, a payment posted twice after a flaky connection, a credit balance written by a screen that should only read it.",
          "Pharmacy adds a second layer. Dispensing has rules the software must respect — an interaction block is not a warning toast, it is a stop that a pharmacist has to consciously override, and the override itself has to be recorded.",
          "This is the web frontend for a pharmacy SaaS platform, written against a CTO architecture decision document and an API contract specification. The interesting work is not the screens — it is making the rules impossible to bypass.",
        ],
        paragraphsAr: [
          "برمجيات التجزئة بتفشل بطريقة معينة: مش بالانهيار، لكن بإنها غلط شوية. إجمالي متقرّب على العميل، دفعة اتسجلت مرتين بعد شبكة متقطعة، رصيد آجل كتبته شاشة المفروض تقرأ بس.",
          "الصيدلية بتضيف طبقة تانية. الصرف ليه قواعد البرنامج لازم يحترمها — حجب التداخل مش toast تحذير، ده وقفة لازم الصيدلي يتجاوزها بوعي، والتجاوز نفسه لازم يتسجل.",
          "ده واجهة الويب لمنصة صيدليات SaaS، مكتوبة على مستند قرار معماري من الـCTO ومواصفة عقد API. الشغل المهم مش الشاشات — الشغل إن القواعد يبقى مستحيل تتجاوز.",
        ],
        callout: "Core decision: the server owns every number. The client may preview a total, but it never posts one — and it never posts twice, because every financial call carries an idempotency key.",
        calloutAr: "القرار الأساسي: السيرفر بيملك كل رقم. العميل يقدر يعرض إجمالي تقديري، لكنه مبنيبعتش إجمالي — ومبنيبعتش مرتين، لأن كل نداء مالي شايل idempotency key.",
      }}
      system={{
        kicker: "Architecture",
        kickerAr: "المعمارية",
        title: "Fifteen modules, three iron rules.",
        titleAr: "خمستاشر وحدة، وتلات قواعد حديد.",
        aside: "The boundary rules are not a convention in a wiki — `npm run boundaries` fails the build when one is crossed.",
        asideAr: "قواعد الحدود مش عُرف في ويكي — `npm run boundaries` بيفشّل البناء لما قاعدة تتكسر.",
        modules: [
          {
            no: "01",
            name: "POS & sales",
            nameAr: "نقطة البيع والمبيعات",
            detail: "Cart state in Zustand (the only place it lives), POST /sales with the DUR gate in front of it, and a payment panel that reflects server truth.",
            detailAr: "حالة السلة في Zustand (المكان الوحيد ليها)، وPOST /sales وبوابته DUR قبله، ولوحة دفع بتعكس حقيقة السيرفر.",
            tech: "modules/pos · modules/sales",
          },
          {
            no: "02",
            name: "Inventory & FEFO",
            nameAr: "المخزون وFEFO",
            detail: "Stock, batches and GRN posting — with first-expiry-first-out allocation, which is a clinical requirement before it is an accounting one.",
            detailAr: "المخزون والدفعات وترحيل GRN — بتخصيص أول انتهاء أول خروج، وهو شرط إكلينيكي قبل ما يكون محاسبي.",
            tech: "modules/inventory · …/grn",
          },
          {
            no: "03",
            name: "Finance & ledger",
            nameAr: "المالية والدفاتر",
            detail: "Customer statements and payments. The balance is read-only in the UI: it renders from the statement endpoint and there is no path that writes it.",
            detailAr: "كشوف العملاء والمدفوعات. الرصيد للقراءة فقط في الواجهة: بيتعرض من endpoint الكشف ومفيش مسار بيكتبه.",
            tech: "modules/finance · modules/customers",
          },
          {
            no: "04",
            name: "Identity & tenancy",
            nameAr: "الهوية والمستأجرين",
            detail: "Tenant identity lives in the JWT. pharmacy_id is never sent from the client, so a manipulated payload cannot address another pharmacy.",
            detailAr: "هوية المستأجر في الـJWT. pharmacy_id مبيتبعتش من العميل، فـpayload متلاعب بيه مش قادر يخاطب صيدلية تانية.",
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
          noteAr: "كل POST مالي أو مخزوني idempotent: طلب معاد بعد اتصال اتقطع مش قادر يحصّل مرتين ولا يستلم مرتين.",
        },
      }}
      decisions={{
        title: "Rules a compiler can check.",
        titleAr: "قواعد الكومبايلر يقدر يفحصها.",
        items: [
          {
            n: "01",
            title: "Money is a string, end to end",
            titleAr: "الفلوس نص، من الآخر للآخر",
            body: "NUMERIC(19,4) survives the wire as a string. Client arithmetic exists for preview only; the server total is the one a receipt may print.",
            bodyAr: "NUMERIC(19,4) بيعيش على الشبكة كنص. حسابات العميل للمعاينة بس؛ إجمالي السيرفر هو اللي الفاتورة تطبعه.",
          },
          {
            n: "02",
            title: "Every financial POST is idempotent",
            titleAr: "كل POST مالي idempotent",
            body: "A uuidv7 Idempotency-Key rides on /sales, /finance/payments and /inventory/grn. The flaky-connection double-post — the classic retail bug — is designed out rather than tested for.",
            bodyAr: "Idempotency-Key من نوع uuidv7 بيركب على /sales و/finance/payments و/inventory/grn. بق التسجيل المزدوج بعد شبكة متقطعة — الكلاسيكي في التجزئة — مُصمَّم بره مش متحصّن بالاختبار.",
          },
          {
            n: "03",
            title: "Module boundaries fail the build",
            titleAr: "حدود الوحدات بتفشّل البناء",
            body: "Three rules, enforced by dependency-cruiser: cross-module imports only via index.ts, components/ui never imports modules, and pages hold no logic. Architecture debt cannot be merged quietly.",
            bodyAr: "تلات قواعد بيفرضها dependency-cruiser: الاستيراد بين الوحدات عبر index.ts بس، وcomponents/ui مبتستوردش وحدات، والصفحات بلا منطق. ديون المعمارية مبتتدمجش في صمت.",
          },
          {
            n: "04",
            title: "A DUR block is a stop, not a toast",
            titleAr: "حجب التداخل وقفة، مش toast",
            body: "Error codes drive the interface. DUR_BLOCK opens a pharmacist PIN-elevation modal and only then retries the request with an explicit override — so the override is an auditable act.",
            bodyAr: "أكواد الخطأ بتقود الواجهة. DUR_BLOCK بيفتح modal رفع صلاحية بكود الصيدلي وبعدها بس بيعيد الطلب بتجاوز صريح — فالتجاوز فعل قابل للمراجعة.",
          },
          {
            n: "05",
            title: "Tenancy is never a client field",
            titleAr: "المستأجر مش حقل في العميل",
            body: "pharmacy_id arrives inside the JWT and nowhere else. There is no request shape a malicious client can edit to reach another tenant's data.",
            bodyAr: "pharmacy_id بيوصل جوه الـJWT ومش في أي مكان تاني. مفيش شكل طلب عميل خبيث يقدر يعدّله للوصول لبيانات مستأجر تاني.",
          },
          {
            n: "06",
            title: "Storage is for session, not domain",
            titleAr: "التخزين للجلسة مش للبيانات",
            body: "The session token lives in sessionStorage and domain data is never put in localStorage. A shared pharmacy terminal is a shared machine, and the browser should not remember a previous patient.",
            bodyAr: "توكن الجلسة في sessionStorage وبيانات المجال مبتتحطش في localStorage. كاشير الصيدلية المشترك جهاز مشترك، والمتصفح المفروض ميفتكرش مريض سابق.",
          },
        ],
      }}
      rows={{
        kicker: "Routes",
        kickerAr: "المسارات",
        title: "Five surfaces, one contract.",
        titleAr: "خمس واجهات، عقد واحد.",
        items: [
          { name: "Auth", nameAr: "الدخول", body: "Login and the PIN-elevation path used when a dispense trips the DUR gate.", bodyAr: "تسجيل الدخول ومسار رفع الصلاحية بالكود اللي بيتفتح لما الصرف يخبط بوابة DUR." },
          { name: "Dashboard", nameAr: "اللوحة", body: "The guarded shell — sidebar per the design system, with revenue/inventory signals where a pharmacist actually looks.", bodyAr: "القشرة المحمية — سايدبار حسب نظام التصميم، مع مؤشرات الإيراد والمخزون في المكان اللي الصيدلي بيبصله." },
          { name: "POS", nameAr: "نقطة البيع", body: "Search via the catalog facade, cart, payment panel, receipt printing.", bodyAr: "بحث عبر facade الكتالوج، سلة، لوحة دفع، طباعة إيصال." },
          { name: "Inventory", nameAr: "المخزون", body: "Stock levels, FEFO batches and GRN posting for received shipments.", bodyAr: "مستويات المخزون ودفعات FEFO وترحيل GRN للشحنات المستلمة." },
          { name: "Customers", nameAr: "العملاء", body: "CRM list, a per-customer page and a ledger statement that is read-only by construction.", bodyAr: "قائمة CRM وصفحة لكل عميل وكشف دفتر للقراءة فقط بالتصميم." },
        ],
      }}
      evidence={{
        title: "The repository argues with itself, and wins.",
        titleAr: "الريبو بيتحاكم مع نفسه، ويكسب.",
        items: [
          { value: "15", label: "Modules under boundary rules", labelAr: "وحدة تحت قواعد حدود", origin: "repo" },
          { value: "03", label: "Rules enforced in CI, not prose", labelAr: "قواعد مفروضة في CI مش نصوص", origin: "repo" },
          { value: "41", label: "Runtime dependencies", labelAr: "اعتمادية تشغيل", origin: "repo" },
          { value: "STRICT", label: "TypeScript mode", labelAr: "وضع TypeScript", origin: "repo" },
        ],
        notes: [
          "Module count and boundary rules come from src/modules and the README's own boundary section; dependency count is package.json's runtime list.",
          "Contract tests (tests/contract) and an e2e smoke spec ship in the repo. They are not re-run here, and this file makes no claim about their current pass rate.",
          "No pharmacy count, patient count or revenue figure is claimed — the frontend repository contains no production data.",
        ],
        notesAr: [
          "عدد الوحدات وقواعد الحدود من src/modules وقسم الحدود في الـREADME؛ وعدد الاعتماديات من قائمة التشغيل في package.json.",
          "اختبارات العقود (tests/contract) وspec e2e متشحنين في الريبو. ماشتغلوش هنا، والملف مبيعملش ادعاء عن نسبة نجاحهم الحالية.",
          "مفيش ادعاء بعدد صيدليات أو مرضى أو إيرادات — ريبو الواجهة مبيحملش بيانات إنتاج.",
        ],
      }}
      stack={{
        title: "Boring where it counts.",
        titleAr: "ممل في المكان اللي بيهم.",
        items: ["Next.js 14", "TypeScript (strict)", "Tailwind (token-driven)", "TanStack Query", "Zustand", "Radix UI", "Zod", "Cairo typeface", "Arabic RTL", "dependency-cruiser", "Vitest", "Playwright"],
        note: "Twenty runtime dependencies, chosen for state, forms, dialogs and validation — nothing exotic, because a till has to be predictable.",
        noteAr: "عشرين اعتمادية تشغيل، مختارة للحالة والنماذج والحوارات والتحقق — مفيش حاجة غريبة، لأن الكاشير لازم يبقى متوقع.",
      }}
      handoff={{
        title: "The receipt is the contract.",
        titleAr: "الإيصال هو العقد.",
        note: "Next: offline-first dispense queue for a dropped connection, with the same idempotency key replayed on reconnect rather than a new one.",
        noteAr: "الخطوة التالية: طابور صرف أوفلاين للاتصال المتقطع، بنفس idempotency key يتعاد عند الرجوع مش واحد جديد.",
      }}
    />
  );
}
