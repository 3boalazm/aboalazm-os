import type { Metadata } from "next";
import { RESPONSE_PROMISE } from "@/lib/contact-details";
import { SITE_URL } from "@/lib/site";
import { localeHref, type Locale } from "@/lib/locale";
import { PROJECTS } from "@/features/work/projects.data";

const AR: Record<string, [string, string]> = {
  "/": ["Aboalazm OS — استوديو هوية وتجربة رقمية وأنظمة تشغيل بقيادة مصطفى أبوالعزم", "استوديو بقيادة مؤسسه، يبني الهوية والتموضع، والطبقة الرقمية ثنائية اللغة، وأنظمة التشغيل والأتمتة: من أول مكالمة استكشافية إلى نطاق مكتوب وتسليم يعمل به فريقك."],
  "/services": ["خدمات الهوية البصرية والمواقع", "تصميم الهوية البصرية وتطبيقاتها، ومواقع ثنائية اللغة ومنتجات رقمية، بنطاق واضح وأمثلة من أعمال مشابهة وباقات تناسب احتياج المشروع."],
  "/services/brand-identity": ["تصميم هوية بصرية بالعربية والإنجليزية", "شعار وألوان وخطوط وتطبيقات ودليل استخدام للعلامة. استعرض أمثلة حقيقية، وقارن بين الباقات، وابدأ استفسارك."],
  "/services/websites": ["تصميم مواقع ومنتجات رقمية", "مواقع شركات وصفحات هبوط ومتاجر وأدوات تشغيل بالعربية والإنجليزية، من تحديد رحلة المستخدم إلى التسليم والتشغيل."],
  "/services/systems": ["أنظمة التشغيل والأتمتة: لوحات تحكم وERP وأدوات داخلية", "لوحات تشغيل ووحدات ERP وأدوات داخلية بواجهة عربية RTL، وأتمتة تحلّ محل الخطوات اليدوية، بنطاق مكتوب يُحدَّد في مكالمة استكشافية أولًا."],
  "/partnership": ["الشراكة والدعم المستمر بعد التسليم", "30 يومًا من الدعم ضمن كل مشروع، ورعاية للهوية بدءًا من $247 شهريًا، وشراكة رقمية وأنظمة بتسعير شهري، مع إشعار قبل 14 يومًا ودون رسوم خروج."],
  "/services/store-72h": ["متجر أو كتالوج إلكتروني خلال 72 ساعة — من $197", "متجر أو كتالوج ثنائي اللغة (عربي RTL وإنجليزي LTR) خلال 72 ساعة من استلام المحتوى: حتى نحو 30 منتجًا، طلب عبر واتساب، دفع عند الاستلام أو إنستاباي، وربط الشحن والنطاق."],
  "/contact": ["تواصل وناقش مشروعك", `حدّثنا عن مشروع الهوية أو الموقع أو المنتج الرقمي. ${RESPONSE_PROMISE.ar}`],
  "/pricing": ["أسعار وباقات الهوية البصرية", "قارن بين باقات الشعار والهوية ونظام العلامة المتكامل، وتعرّف على المخرجات والمدد وآلية الدفع، ثم اختر الباقة المناسبة."],
  "/book": ["احجز بعربون لتأكيد بدء المشروع", "اختر الباقة والعملة (EGP أو SAR أو USD)، وأرسل عربونًا بنسبة 50% (أو ادفع المبلغ كاملًا بخصم 10%)، ثم أكّد الحجز عبر واتساب."],
  "/work": ["الأعمال: الهوية والمنتجات الرقمية", "استعرض مشاريع الهوية البصرية والمواقع والمنتجات الرقمية، مع تفاصيل المساهمة والمخرجات ومعاينات المشاريع المتاحة."],
  "/work/design": ["أعمال الهوية البصرية", "هويات وتطبيقات تغليف ومطبوعات وإرشادات استخدام للعلامات بالعربية والإنجليزية."],
  "/work/development": ["مشاريع المواقع والمنتجات الرقمية", "مواقع ومنصات وأدوات تشغيل، مع دراسات حالة ومعاينات مرئية وروابط التجارب العامة المتاحة."],
  "/work-ui": ["معرض واجهات المشاريع", "صور فعلية لواجهات المواقع والمنتجات الرقمية مع تفاصيل المشروع ورابط المعاينة المتاح."],
  "/about": ["عن مصطفى أبوالعزم", "تعرّف على خبرة مصطفى أبوالعزم في الهوية البصرية والتصميم والمنتجات الرقمية، وعمله بالعربية والإنجليزية."],
  "/for-hiring": ["مصطفى أبوالعزم: ملف التوظيف", "خبرات مصطفى أبوالعزم وأدواره ومساهماته، مع نماذج أعمال وسيرة ذاتية لفرق التوظيف والوكالات."],
  "/process": ["خطوات تصميم الهوية والتسليم", "البحث والاستراتيجية والتصميم والتسليم، مع مراجعات واضحة وجدول زمني يتحدد حسب باقة المشروع وحجم التطبيقات."],
  "/agreement": ["اتفاقية التعاون ونطاق المشروع", "تفاصيل المخرجات والمراجعات والدفع وحقوق الاستخدام والتسليم. تُعتمد تفاصيل كل مشروع في عرض مكتوب."],
  "/writing": ["مقالات عن الهوية والتصميم", "مقالات وأفكار عن الهوية البصرية والأنظمة والتصميم بالعربية والإنجليزية، مع أمثلة من الممارسة."],
  "/resources": ["موارد وأدوات تصميم مجانية", "وثائق وأطر عمل تساعد على تنظيم مشروع الهوية وتحديد النطاق والاستخدام والتسليم."],
  "/books": ["كتب التصميم والهوية البصرية", "كتب تفاعلية في أساسيات التصميم والهوية البصرية، مع قارئ مدمج. استكشف المحتوى التعليمي لمصطفى أبوالعزم."],
  "/developer": ["التصميم وتطوير المنتجات الرقمية", "مشاريع ومهارات مصطفى أبوالعزم في بناء المواقع والواجهات والأدوات الرقمية."],
  "/capabilities": ["أنظمة التصميم والتطبيق", "أمثلة على الألوان والخطوط ومتغيّرات التصميم، وكيف تتحول إرشادات الهوية إلى تطبيقات رقمية متسقة."],
  "/why": ["كيف يساعد نظام الهوية فريقك", "هوية واضحة وإرشادات وتطبيقات تدعم عمل فريقك عبر المطبوعات والمواقع والمنتجات الرقمية."],
  "/labs": ["مختبر تجارب التصميم", "تجارب وأدوات لاستكشاف الخطوط والألوان والتباين والهوية ثنائية اللغة."],
  "/reels": ["ريلز: المنهج بالفيديو", "ريلز قصيرة تشرح كيف يفكّر الاستوديو ويبني: بحث موثّق، وخطة تنفيذ حقيقية، وتنفيذ بمساعدة الذكاء الاصطناعي، ومراجعة مستقلة."],
};

/* Malay (ms) titles and descriptions. Separate from AR so a Malay page never
   inherits an Arabic override passed in by a dynamic route. */
const MS: Record<string, [string, string]> = {
  "/": ["Aboalazm OS — studio identiti dan digital pimpinan Mustafa Aboalazm", "Studio pimpinan pengasas untuk identiti, lapisan digital dwibahasa dan sistem operasi — dari panggilan penemuan hingga skop bertulis dan penyerahan siap guna."],
  "/services": ["Perkhidmatan identiti visual dan laman web", "Reka bentuk identiti visual dan aplikasinya, laman dwibahasa, dan produk digital. Skop yang jelas, kerja serupa, dan pakej mengikut keperluan projek."],
  "/services/brand-identity": ["Identiti jenama dwibahasa Arab & Inggeris", "Logo, warna, fon, aplikasi, dan panduan penggunaan jenama. Lihat contoh sebenar, bandingkan pakej, dan mulakan pertanyaan anda."],
  "/services/websites": ["Reka bentuk laman web dan produk digital", "Laman korporat, laman pendaratan, kedai dalam talian, dan alat operasi dwibahasa, dari takrifan perjalanan pengguna hingga penyerahan dan operasi."],
  "/services/systems": ["Sistem operasi dan automasi — papan pemuka dan ERP", "Papan operasi, modul ERP dan alat dalaman dwibahasa dengan RTL, serta automasi yang menggantikan langkah manual — skop bertulis ditentukan dalam panggilan penemuan."],
  "/partnership": ["Perkongsian dan sokongan selepas penyerahan", "30 hari sokongan dalam setiap projek, penjagaan identiti dari $247 sebulan, dan perkongsian digital serta sistem berharga bulanan — notis 14 hari, tiada yuran keluar."],
  "/services/store-72h": ["Kedai atau katalog dwibahasa, 72 jam — dari $197", "Kedai atau katalog dwibahasa (Arab RTL + Inggeris LTR) siap dalam 72 jam selepas kandungan diterima: sehingga ~30 produk, pesanan WhatsApp, penghantaran dan domain."],
  "/contact": ["Hubungi dan bincangkan projek anda", `Ceritakan tentang projek identiti, laman, atau produk digital anda. ${RESPONSE_PROMISE.ms}`],
  "/pricing": ["Harga dan pakej identiti visual", "Bandingkan pakej logo, identiti, dan sistem jenama lengkap. Ketahui hasil kerja, tempoh, dan pembayaran, dan pilih pakej yang sesuai."],
  "/book": ["Tempah dengan deposit — sahkan permulaan projek", "Pilih pakej dan mata wang (EGP, SAR atau USD), hantar deposit 50% (atau bayar penuh dengan diskaun 10%), dan sahkan tempahan melalui WhatsApp."],
  "/work": ["Kerja — identiti dan produk digital", "Lihat projek identiti visual, laman web, dan produk digital, dengan butiran sumbangan, hasil, dan pratonton projek yang tersedia."],
  "/work/design": ["Kerja identiti visual", "Identiti, aplikasi pembungkusan, bahan cetakan, dan garis panduan penggunaan jenama dalam bahasa Arab dan Inggeris."],
  "/work/development": ["Projek laman web dan produk digital", "Laman web, platform, dan alat operasi, dengan kajian kes, pratonton visual, dan pautan pengalaman awam yang tersedia."],
  "/work-ui": ["Galeri antara muka projek", "Imej sebenar antara muka laman web dan produk digital, dengan butiran projek dan pautan pratonton yang tersedia."],
  "/about": ["Tentang Mustafa Aboalazm", "Ketahui pengalaman Mustafa Aboalazm dalam identiti visual, reka bentuk, dan produk digital, serta kerja dalam bahasa Arab dan Inggeris."],
  "/for-hiring": ["Mustafa Aboalazm — profil pengambilan", "Pengalaman, peranan, dan sumbangan Mustafa Aboalazm, contoh kerja, dan CV untuk pasukan pengambilan dan agensi. Peluang di Malaysia, Teluk dan jarak jauh."],
  "/process": ["Langkah reka bentuk identiti dan penyerahan", "Penyelidikan, strategi, reka bentuk, dan penyerahan, dengan semakan yang jelas dan jadual yang ditentukan mengikut pakej projek dan skala aplikasi."],
  "/agreement": ["Perjanjian kerjasama dan skop projek", "Butiran hasil kerja, semakan, pembayaran, hak penggunaan, dan penyerahan. Butiran setiap projek disahkan dalam cadangan bertulis."],
  "/writing": ["Artikel tentang identiti dan reka bentuk", "Artikel dan idea tentang identiti visual, sistem, dan reka bentuk dalam bahasa Arab dan Inggeris, dengan contoh daripada amalan."],
  "/resources": ["Sumber dan alat reka bentuk percuma", "Dokumen dan rangka kerja untuk membantu merancang projek identiti, menentukan skop, penggunaan, dan penyerahan."],
  "/books": ["Buku reka bentuk dan identiti visual", "Buku dan pembaca interaktif tentang asas reka bentuk dan identiti visual. Terokai kandungan pendidikan Mustafa Aboalazm."],
  "/developer": ["Reka bentuk dan pembangunan produk digital", "Projek dan kemahiran Mustafa Aboalazm dalam membina laman web, antara muka, dan alat digital."],
  "/capabilities": ["Sistem reka bentuk dan pelaksanaan", "Contoh warna, fon, token, dan cara panduan identiti diterjemah kepada aplikasi digital yang konsisten."],
  "/why": ["Bagaimana sistem identiti membantu pasukan anda", "Identiti yang jelas, panduan, dan aplikasi yang menyokong kerja pasukan anda merentasi bahan cetakan, laman web, dan produk digital."],
  "/labs": ["Makmal eksperimen reka bentuk", "Eksperimen dan alat untuk meneroka fon, warna, kontras, dan identiti dwibahasa."],
  "/reels": ["Reel — kaedah studio dalam video", "Reel pendek tentang cara studio berfikir dan membina: penyelidikan berasas sumber, pelan pelaksanaan sebenar, penghantaran dibantu AI dan audit bebas."],
};

/* The card's one-line outcome ("هوية الفعالية والتواصل البصري", 28-40 characters)
   is a label, not a snippet. Below a useful length it gets the project's name,
   year and what the page is, using only fields the record already carries. */
function projectDescriptionAr(project: (typeof PROJECTS)[number]): string {
  const outcome = project.outcomeAr ?? project.outcome;
  if (outcome.length >= 70) return outcome;
  return `${outcome} — ${project.nameAr ?? project.name}، ${project.year}. دراسة حالة ولمحة عامة عن المشروع.`;
}

export function localizedMetadata(base: Metadata, locale: Locale, path: string, arabic?: { title: string; description: string }): Metadata {
  const project = path.startsWith("/case-studies/") ? PROJECTS.find((p) => p.slug === path.split("/").pop()) : undefined;
  const translated =
    locale === "ms"
      ? (MS[path] ? { title: MS[path][0], description: MS[path][1] } : undefined)
      : arabic ?? (AR[path] ? { title: AR[path][0], description: AR[path][1] } : project ? { title: `${project.nameAr ?? project.name} — تفاصيل المشروع`, description: projectDescriptionAr(project) } : undefined);
  const useTranslated = (locale === "ar" || locale === "ms") && translated;
  const title = useTranslated ? translated.title : base.title;
  const description = useTranslated ? translated.description : base.description;
  const canonical = localeHref(path, locale);
  const openGraphTitle = typeof title === "string"
    ? title
    : title && typeof title === "object"
      ? ("absolute" in title && typeof title.absolute === "string"
          ? title.absolute
          : "default" in title && typeof title.default === "string"
            ? title.default
            : undefined)
      : undefined;
  const OG_LOCALE: Record<Locale, string> = { en: "en_US", ar: "ar_EG", ms: "ms_MY" };
  return {
    ...base, title, description,
    alternates: { canonical, languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}${localeHref(path, "ar")}`, ms: `${SITE_URL}${localeHref(path, "ms")}`, "x-default": `${SITE_URL}${path}` } },
    openGraph: { ...base.openGraph, title: openGraphTitle, description: description ?? undefined, siteName: "Mustafa Aboalazm", url: canonical, locale: OG_LOCALE[locale], alternateLocale: (["en", "ar", "ms"] as const).filter((l) => l !== locale).map((l) => OG_LOCALE[l]) },
  };
}
