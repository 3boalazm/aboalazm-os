"use client";

/**
 * CODE & CANVAS — PLATFORM — Product case file / 012
 *
 * Source: the live site codeandcanvas.net (fetched), because
 * 3boalazm/codeandcanvas-native is private and not readable by this
 * integration. Everything marked "live" below was read off the deployed
 * site's own markup; nothing is inferred from the repository.
 *
 * What the live site states about itself:
 *   · a two-partner studio: "The Code" (Ahmed M. Bedeer, enterprise
 *     architect, healthcare) + "The Canvas" (Mustafa Aboalazm, creative
 *     director) — this is the platform behind the brand, not a solo site
 *   · 23 services across four tracks: technology 6, creative 10,
 *     healthcare 5, combined 2 + custom
 *   · published price bands per service (e.g. AB-01 $1,000–5,000;
 *     HC-03 from $2,500; MA-03 $1,490–2,975+; CC-01 from $1,500)
 *   · payment terms stated: 50/50 advisory, 50/25/25 creative
 *   · currencies USD · SAR · EGP
 *   · a delivery method of scope-before-money, milestone gates, and
 *     hand-over of source files when the final milestone closes
 *   · three case studies, each stating engagement status and what may be
 *     published; explicitly "we don't publish protected client material or
 *     unmeasured results"
 */
import { ProductCase } from "./product-case";

export function CodeCanvasDevCaseStudy() {
  return (
    <ProductCase
      accent="amber"
      fileNo="012"
      code="C&C / PLATFORM"
      eyebrow="CODE & CANVAS / PLATFORM"
      wordmark="Code &"
      wordmarkTail="Canvas"
      heroLead="Two practices, one front door: an enterprise architect and a creative director selling 23 fixed-scope services with the price band printed on them."
      heroLeadAr="ممارستان وباب واحد: مهندس معماري للمؤسسات ومدير إبداعي بيبيعوا 23 خدمة بنطاق ثابت والسعر مكتوب جانبها."
      badges={[
        { en: "Studio platform", ar: "منصة استوديو" },
        { en: "MENA", ar: "الشرق الأوسط" },
        { en: "Fixed scope", ar: "نطاق ثابت" },
        { en: "Live", ar: "مباشر" },
      ]}
      snapshot={[
        { value: "23", label: "Services published", labelAr: "خدمة معلنة" },
        { value: "04", label: "Service tracks", labelAr: "مسارات خدمة" },
        { value: "03", label: "Currencies quoted", labelAr: "عملات مسعّرة" },
        { value: "02", label: "Founding practices", labelAr: "ممارستان مؤسِّستان" },
      ]}
      snapshotTitle={{ en: "System snapshot", ar: "لقطة النظام" }}
      snapshotCode="C&C / MENA"
      snapshotNote="Every number in this panel is printed on the live site itself — services, tracks, currencies and the two founding disciplines."
      snapshotNoteAr="كل رقم في اللوحة دي مطبوع على الموقع الحي نفسه — الخدمات والمسارات والعملات والتخصصين المؤسِّسين."
      role={{ en: "Role: Co-founder · creative direction", ar: "الدور: شريك مؤسس · إدارة إبداعية" }}
      domain={{ en: "Domain: Advisory & studio", ar: "المجال: استشارات واستوديو" }}
      year="2026"
      cover={{
        src: "/images/work/cc-cover.jpg",
        alt: "Code & Canvas — brand guidelines cover",
        altAr: "كود آند كانفس — غلاف دليل الهوية",
        caption: "Identity guidelines — the studio's own system",
        captionAr: "دليل الهوية — نظام الاستوديو نفسه",
        tag: "LIVE / 2026",
      }}
      cta={{ href: "https://codeandcanvas.net/", en: "Open Code & Canvas", ar: "افتح كود آند كانفس" }}
      challenge={{
        title: "Two disciplines, one invoice, and a buyer who has been burned before.",
        titleAr: "تخصصان، فاتورة واحدة، ومشترٍ اتحرق قبل كده.",
        paragraphs: [
          "A healthcare transformation buyer and a brand buyer arrive with different questions, but the same scar: a project that started broad, drifted, and ended without anyone owning the whole. Vendors are chosen per discipline, then the disciplines never speak.",
          "The usual studio answer is a portfolio and a contact form. That answers 'can you?' and leaves 'what will it cost, when will it end, and what do I own at the end' to a discovery call.",
          "Code & Canvas inverts it. The price band, the duration and the deliverable are printed next to each service before the first conversation, and every engagement is scoped to a fixed outcome with milestone gates.",
        ],
        paragraphsAr: [
          "مشتري تحوّل رقمي في الصحة ومشتري هوية بيجوا بأسئلة مختلفة، لكن بنفس الجرح: مشروع بدأ واسع، واتأرجح، وانتهى ومحدش مالك الكل. الموردين بيتختاروا لكل تخصص، وبعدها التخصصات مبتتكلمش.",
          "إجابة الاستوديو المعتادة بورتفوليو وفورم تواصل. ده بيجاوب «تقدر؟» وبيسيب «هيكلف كام، وهينتهي إمتى، وأنا هملك إيه في الآخر» لمكالمة استكشاف.",
          "كود آند كانفس بيعكسها. النطاق السعري والمدة والمخرج مطبوعين جنب كل خدمة قبل أول محادثة، وكل ارتباط بيتسعّر على نتيجة ثابتة ببوابات مراحل.",
        ],
        callout: "Core decision: publish the price band. A studio that hides its range is asking the buyer to spend a meeting finding out whether it can afford to be in the room.",
        calloutAr: "القرار الأساسي: انشر النطاق السعري. استوديو بيخبي نطاقه بيطلب من المشتري يصرف اجتماع عشان يعرف يقدر يبقى في الغرفة أصلًا ولا لأ.",
      }}
      system={{
        kicker: "Structure",
        kickerAr: "البنية",
        title: "Four tracks, one method.",
        titleAr: "أربع مسارات، ومنهج واحد.",
        aside: "Service counts are the site's own published tallies per track: 6 technology, 10 creative, 5 healthcare, 2 combined + custom.",
        asideAr: "أعداد الخدمات هي نفسها اللي الموقع بينشرها لكل مسار: 6 تقنية، 10 إبداعية، 5 صحية، 2 مشتركة + مخصص.",
        modules: [
          {
            no: "01",
            name: "Technology & EA",
            nameAr: "التقنية والمعمارية",
            detail: "Enterprise architecture, healthcare digital transformation, data architecture, solution architecture, cloud modernization and executive advisory.",
            detailAr: "معمارية المؤسسات، والتحوّل الرقمي الصحي، ومعمارية البيانات، ومعمارية الحلول، وتحديث السحابة، والاستشارات التنفيذية.",
            tech: "6 services · TOGAF · CPHIMS · from $800",
          },
          {
            no: "02",
            name: "Creative & brand",
            nameAr: "الإبداع والهوية",
            detail: "Logo sprint through full brand system, design systems, web and platforms, print and social production, monthly retainers — Arabic treated as a first language.",
            detailAr: "من سبرنت اللوجو للنظام الكامل، وأنظمة التصميم، والويب والمنصات، والطباعة والسوشيال، والريتينر الشهري — والعربي لغة أولى مش إضافة.",
            tech: "10 services · strategy to delivery · from $170",
          },
          {
            no: "03",
            name: "Healthcare",
            nameAr: "الصحة",
            detail: "Clinic digital launch, healthcare BI, HIS selection advisory, clinic brand identity, and EA assessment with EMRAM — a domain track, not a vertical skin.",
            detailAr: "إطلاق عيادة رقمي، وذكاء أعمال صحي، واستشارة اختيار HIS، وهوية عيادة، وتقييم معمارية مع EMRAM — مسار مجال، مش قشرة عمودية.",
            tech: "5 services · CBAHI · EMRAM · NORA · from $1,500",
          },
          {
            no: "04",
            name: "Combined",
            nameAr: "المشترك",
            detail: "Digital Launch Package — identity, bilingual site and launch system in one fixed scope — plus custom combinations from the full index.",
            detailAr: "باقة الإطلاق الرقمي — هوية وموقع ثنائي اللغة ونظام إطلاق في نطاق ثابت — بالإضافة لتركيبات مخصصة من الفهرس الكامل.",
            tech: "2 packages + custom · both founders · from $1,500",
          },
        ],
        flow: {
          a: "Scoped inquiry",
          aSub: "Service code, e.g. HC-03",
          mid: "Fixed proposal",
          midSub: "Outcome · days · price band",
          b: "Milestone gate",
          bSub: "Signed off per stage",
          note: "The method page states the same sequence: one call, a written proposal with price and explicit out-of-scope, then milestone delivery with a review at every gate.",
          noteAr: "صفحة المنهج بتقول نفس التسلسل: مكالمة واحدة، عرض مكتوب بالسعر وما هو خارج النطاق صراحة، وبعدها تسليم بمراحل ومراجعة عند كل بوابة.",
        },
      }}
      decisions={{
        title: "The site sells like the delivery does.",
        titleAr: "الموقع بيبيع زي ما التسليم بيمشي.",
        items: [
          {
            n: "01",
            title: "Prices are on the page",
            titleAr: "الأسعار على الصفحة",
            body: "Every service carries a band and a duration — AB-01 $1,000–5,000 over 2–8 weeks, CC-01 from $1,500 over 6–8 weeks. The buyer can qualify themselves before a call is booked.",
            bodyAr: "كل خدمة شايلة نطاق ومدة — AB-01 من 1000 لـ5000 دولار في 2–8 أسابيع، وCC-01 من 1500 دولار في 6–8 أسابيع. المشتري بيقيّم نفسه قبل ما يحجز مكالمة.",
          },
          {
            n: "02",
            title: "Every service has a code",
            titleAr: "كل خدمة ليها كود",
            body: "HC-03, MA-03, CC-01. A code turns a vague 'we need branding' into an inquiry that already names a scope — and makes the proposal and the invoice refer to the same thing.",
            bodyAr: "HC-03 وMA-03 وCC-01. الكود بيحوّل «محتاجين هوية» لغموض لاستفسار بيسمّي نطاق — وبيخلّي العرض والفاتورة يشيروا لنفس الحاجة.",
          },
          {
            n: "03",
            title: "Scope before money",
            titleAr: "النطاق قبل الفلوس",
            body: "The stated method is one call, then a written proposal: outcome, deliverables, duration, price range and what is explicitly out of scope. Change requests are quoted before they start.",
            bodyAr: "المنهج المعلن مكالمة واحدة وبعدها عرض مكتوب: النتيجة والمخرجات والمدة والنطاق السعري وما هو خارج النطاق صراحة. طلبات التغيير بتتسعّر قبل ما تبدأ.",
          },
          {
            n: "04",
            title: "Milestones with acceptance gates",
            titleAr: "مراحل ببوابات قبول",
            body: "Delivery runs in stages, each with a review and an acceptance gate. That is the mechanism that stops 'started broad, drifted, nobody owned it'.",
            bodyAr: "التسليم بمراحل، كل واحدة بمراجعة وبوابة قبول. ده الميكانيزم اللي بيمنع «بدأ واسع، واتأرجح، ومحدش مالكه».",
          },
          {
            n: "05",
            title: "Hand-over is contractual",
            titleAr: "التسليم تعاقدي",
            body: "Source files, code and documentation are released when the final milestone closes — stated as a promise in the site copy, which is the strongest form of 'no lock-in'.",
            bodyAr: "ملفات المصدر والكود والتوثيق بتتسلّم لما آخر مرحلة تقفل — مذكورة كوعد في نص الموقع، وده أقوى شكل لـ«بلا احتجاز».",
          },
          {
            n: "06",
            title: "Publishing limits are part of the case studies",
            titleAr: "حدود النشر جزء من الكيس ستادي",
            body: "Each case study states engagement status, role and what may be published, and the site says outright that it does not publish protected client material or unmeasured results.",
            bodyAr: "كل كيس ستادي بيحدد حالة الارتباط والدور وما يجوز نشره، والموقع بيقول صريح إنه مبنشرش مواد عملاء محمية ولا نتايج غير مقيسة.",
          },
        ],
      }}
      rows={{
        kicker: "Services",
        kickerAr: "الخدمات",
        title: "What a buyer can actually pick.",
        titleAr: "اللي المشتري يقدر يختاره فعلًا.",
        items: [
          { name: "AB-01 · Enterprise architecture", nameAr: "AB-01 · معمارية مؤسسات", body: "$1,000–5,000 · 2–8 weeks · roadmap and governance model, scoped inquiry flow.", bodyAr: "1000–5000 دولار · 2–8 أسابيع · خريطة طريق ونموذج حوكمة، عبر مسار استفسار محدد." },
          { name: "HC-03 · HIS selection advisory", nameAr: "HC-03 · استشارة اختيار HIS", body: "From $2,500 · 3–5 weeks · scored criteria and a defensible decision record.", bodyAr: "من 2500 دولار · 3–5 أسابيع · معايير مُقيّمة وسجل قرار قابل للدفاع عنه." },
          { name: "MA-03 · Full brand system", nameAr: "MA-03 · نظام هوية كامل", body: "$1,490–2,975+ · 5–7 weeks · 25–40 page guidelines plus a workshop.", bodyAr: "1490–2975+ دولار · 5–7 أسابيع · دليل 25–40 صفحة مع ورشة." },
          { name: "CC-01 · Digital launch", nameAr: "CC-01 · إطلاق رقمي", body: "From $1,500 · 6–8 weeks · identity, bilingual site and launch system together.", bodyAr: "من 1500 دولار · 6–8 أسابيع · هوية وموقع ثنائي اللغة ونظام إطلاق مع بعض." },
        ],
      }}
      evidence={{
        title: "Read off the live site, this pass.",
        titleAr: "مقروء من الموقع الحي، في الجولة دي.",
        items: [
          { value: "23", label: "Services in the published index", labelAr: "خدمة في الفهرس المعلن", origin: "live" },
          { value: "04", label: "Tracks with their own pages", labelAr: "مسارات بصفحات مستقلة", origin: "live" },
          { value: "03", label: "Currencies accepted", labelAr: "عملات مقبولة", origin: "live" },
          { value: "50/50", label: "Advisory payment split", labelAr: "تقسيم دفع الاستشارات", origin: "live" },
        ],
        notes: [
          "The repository (3boalazm/codeandcanvas-native) is private and was not readable here, so this file is written entirely from the deployed site. No code-level claims are made.",
          "Prices, durations and payment splits are quoted exactly as the site publishes them; they are the studio's own terms, not an independently verified rate card.",
          "The site's own disclaimer is preserved here: case studies state status and publishable scope, and no protected client material or unmeasured result is presented.",
        ],
        notesAr: [
          "الريبو (codeandcanvas-native) خاص ومقروش هنا، فالملف ده مكتوب بالكامل من الموقع المنشور. مفيش ادعاءات على مستوى الكود.",
          "الأسعار والمدد وتقسيمات الدفع منقولة زي ما الموقع بينشرها؛ دي شروط الاستوديو نفسه، مش قائمة أسعار متحقق منها بشكل مستقل.",
          "تنبيه الموقع نفسه محفوظ هنا: الكيس ستاديز بتحدد الحالة ونطاق النشر، ومفيش مواد عملاء محمية أو نتايج غير مقيسة معروضة.",
        ],
      }}
      stack={{
        title: "A platform in front of the practice.",
        titleAr: "منصة قدام الممارسة.",
        items: ["Next.js platform", "Arabic / English", "Service index (23)", "Per-track landing pages", "Scoped inquiry flow", "Case-study publishing rules", "Blog", "Books preview"],
        note: "The stack here is observed from the shipped site — routing, per-service pages and the inquiry query string. The private repository's internals are not asserted.",
        noteAr: "الحزمة هنا ملاحظة من الموقع المنشور — الراوتنج وصفحات كل خدمة و query string الاستفسار. تفاصيل الريبو الخاص مش مفترضة.",
      }}
      handoff={{
        title: "A studio that answers the budget question first.",
        titleAr: "استوديو بيرد على سؤال الميزانية الأول.",
        note: "Next: converting the 23-service index into a scoped configurator, so a combined engagement can be priced without a call.",
        noteAr: "الخطوة التالية: تحويل فهرس الـ23 خدمة لـconfigurator بيسعّر ارتباط مشترك من غير مكالمة.",
      }}
    />
  );
}
