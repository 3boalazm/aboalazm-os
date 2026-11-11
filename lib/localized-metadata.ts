import type { Metadata } from "next";
import { RESPONSE_PROMISE } from "@/lib/contact-details";
import { SITE_URL } from "@/lib/site";
import { localeHref, type Locale } from "@/lib/locale";
import { PROJECTS } from "@/features/work/projects.data";

const AR: Record<string, [string, string]> = {
  "/": ["Aboalazm OS — استوديو هوية ورقمي وأنظمة تشغيل يقوده مصطفى أبوالعزم", "استوديو يقوده مؤسسه يبني الهوية والتموضع، والطبقة الرقمية ثنائية اللغة، وأنظمة التشغيل والأتمتة — من أول مكالمة استكشاف لنطاق مكتوب وتسليم يشتغل بيه فريقك."],
  "/services": ["خدمات الهوية البصرية والمواقع", "تصميم هوية بصرية وتطبيقاتها، مواقع ثنائية اللغة ومنتجات رقمية. نطاق واضح وأعمال مشابهة وباقات حسب احتياج المشروع."],
  "/services/brand-identity": ["تصميم هوية بصرية بالعربي والإنجليزي", "شعار وألوان وخطوط وتطبيقات ودليل استخدام للبراند. استعرض أمثلة حقيقية وقارن الباقات وابدأ استفسارك."],
  "/services/websites": ["تصميم مواقع ومنتجات رقمية", "مواقع شركات وصفحات هبوط ومتاجر وأدوات تشغيل بالعربي والإنجليزي، من تحديد رحلة المستخدم إلى التسليم والتشغيل."],
  "/services/systems": ["أنظمة التشغيل والأتمتة — لوحات تحكم وERP وأدوات داخلية", "لوحات تشغيل ووحدات ERP وأدوات داخلية عربية RTL وأتمتة تستبدل الخطوات اليدوية — بنطاق مكتوب يُحدَّد في مكالمة استكشاف أولًا."],
  "/partnership": ["الشراكة والدعم المستمر — بعد التسليم", "30 يوم دعمًا مشمولة في كل مشروع، ورعاية للهوية من $247 شهريًا، وشراكة رقمية وأنظمة بتسعير شهري — بإخطار 14 يومًا وبدون رسوم خروج."],
  "/services/store-72h": ["متجر أو كتالوج إلكتروني ثنائي اللغة، جاهز خلال 72 ساعة — يبدأ من $197", "متجر أو كتالوج إلكتروني ثنائي اللغة (عربي RTL + إنجليزي LTR) جاهز خلال 72 ساعة من استلام المحتوى: حتى ~30 منتجاً، طلب عبر واتساب، الدفع عند الاستلام + إنستاباي، ربط الشحن والدومين."],
  "/contact": ["تواصل وناقش مشروعك", `احكي عن مشروع الهوية أو الموقع أو المنتج الرقمي. ${RESPONSE_PROMISE.ar}`],
  "/pricing": ["أسعار وباقات الهوية البصرية", "قارن باقات الشعار والهوية ونظام البراند المتكامل. تعرف على المخرجات والمدد والدفع وحدد الباقة المناسبة."],
  "/book": ["احجز بعربون — تأكيد بدء المشروع", "اختر الباقة والعملة (EGP أو SAR أو USD)، أرسل عربون 50% (أو ادفع كامل المبلغ بخصم 10%)، وأكّد الحجز عبر واتساب."],
  "/work": ["الأعمال — الهوية والمنتجات الرقمية", "استعرض مشروعات الهوية البصرية والمواقع والمنتجات الرقمية، مع تفاصيل المساهمة والمخرجات ومعاينات المشاريع المتاحة."],
  "/work/design": ["أعمال الهوية البصرية", "هويات وتطبيقات تغليف ومطبوعات وإرشادات استخدام للعلامات بالعربي والإنجليزي."],
  "/work/development": ["مشاريع المواقع والمنتجات الرقمية", "مواقع ومنصات وأدوات تشغيل، مع دراسات حالة ومعاينات مرئية وروابط التجارب العامة المتاحة."],
  "/work-ui": ["معرض واجهات المشاريع", "صور فعلية لواجهات المواقع والمنتجات الرقمية مع تفاصيل المشروع ورابط المعاينة المتاح."],
  "/about": ["عن مصطفى أبوالعزم", "تعرف على خبرة مصطفى أبوالعزم في الهوية البصرية والتصميم والمنتجات الرقمية والعمل بالعربية والإنجليزية."],
  "/for-hiring": ["مصطفى أبوالعزم — ملف التوظيف", "خبرات وأدوار ومساهمات مصطفى أبوالعزم، نماذج أعمال وسيرة ذاتية لفرق التوظيف والوكالات."],
  "/process": ["خطوات تصميم الهوية والتسليم", "البحث والاستراتيجية والتصميم والتسليم، مع مراجعات واضحة وجدول يتحدد حسب باقة المشروع وحجم التطبيقات."],
  "/agreement": ["اتفاقية التعاون ونطاق المشروع", "تفاصيل المخرجات والمراجعات والدفع وحقوق الاستخدام والتسليم. تُعتمد تفاصيل كل مشروع في عرض مكتوب."],
  "/writing": ["مقالات عن الهوية والتصميم", "مقالات وأفكار عن الهوية البصرية والأنظمة والتصميم بالعربية والإنجليزية، مع أمثلة من الممارسة."],
  "/resources": ["موارد وأدوات تصميم مجانية", "وثائق وأطر عمل تساعد على تنظيم مشروع الهوية وتحديد النطاق والاستخدام والتسليم."],
  "/books": ["كتب التصميم والهوية البصرية", "كتب وقارئات تفاعلية في أساسيات التصميم والهوية البصرية. استكشف المحتوى التعليمي لمصطفى أبوالعزم."],
  "/developer": ["التصميم وتطوير المنتجات الرقمية", "مشروعات ومهارات مصطفى أبوالعزم في بناء المواقع والواجهات والأدوات الرقمية."],
  "/capabilities": ["أنظمة التصميم والتطبيق", "أمثلة على الألوان والخطوط والتوكنز وتحويل إرشادات الهوية إلى تطبيقات رقمية متسقة."],
  "/why": ["كيف يساعد نظام الهوية فريقك", "هوية واضحة وإرشادات وتطبيقات تدعم عمل فريقك عبر المطبوعات والمواقع والمنتجات الرقمية."],
  "/labs": ["معمل تجارب التصميم", "تجارب وأدوات لاستكشاف الخطوط والألوان والتباين والهوية ثنائية اللغة."],
};

/* Malay (ms) titles and descriptions. Separate from AR so a Malay page never
   inherits an Arabic override passed in by a dynamic route. */
const MS: Record<string, [string, string]> = {
  "/": ["Aboalazm OS — studio identiti dan digital yang dipimpin Mustafa Aboalazm", "Studio yang dipimpin pengasasnya membina identiti, lapisan digital dwibahasa, dan sistem operasi — dari panggilan penemuan pertama hingga skop bertulis dan penyerahan yang boleh digunakan pasukan anda."],
  "/services": ["Perkhidmatan identiti visual dan laman web", "Reka bentuk identiti visual dan aplikasinya, laman dwibahasa, dan produk digital. Skop yang jelas, kerja serupa, dan pakej mengikut keperluan projek."],
  "/services/brand-identity": ["Reka bentuk identiti jenama dwibahasa Arab & Inggeris", "Logo, warna, fon, aplikasi, dan panduan penggunaan jenama. Lihat contoh sebenar, bandingkan pakej, dan mulakan pertanyaan anda."],
  "/services/websites": ["Reka bentuk laman web dan produk digital", "Laman korporat, laman pendaratan, kedai dalam talian, dan alat operasi dwibahasa, dari takrifan perjalanan pengguna hingga penyerahan dan operasi."],
  "/services/systems": ["Sistem operasi dan automasi — papan pemuka, ERP dan alat dalaman", "Papan operasi, modul ERP, dan alat dalaman dwibahasa dengan RTL serta automasi yang menggantikan langkah manual — dengan skop bertulis yang ditentukan dalam panggilan penemuan dahulu."],
  "/partnership": ["Perkongsian dan sokongan berterusan — selepas penyerahan", "30 hari sokongan termasuk dalam setiap projek, penjagaan identiti dari $247 sebulan, dan perkongsian digital serta sistem dengan harga bulanan — notis 14 hari dan tiada yuran keluar."],
  "/services/store-72h": ["Kedai atau katalog dalam talian dwibahasa, siap dalam 72 jam — bermula $197", "Kedai atau katalog dalam talian dwibahasa (Arab RTL + Inggeris LTR) siap dalam 72 jam selepas kandungan diterima: sehingga ~30 produk, pesanan melalui WhatsApp, sambungan penghantaran dan domain."],
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
};

export function localizedMetadata(base: Metadata, locale: Locale, path: string, arabic?: { title: string; description: string }): Metadata {
  const project = path.startsWith("/case-studies/") ? PROJECTS.find((p) => p.slug === path.split("/").pop()) : undefined;
  const translated =
    locale === "ms"
      ? (MS[path] ? { title: MS[path][0], description: MS[path][1] } : undefined)
      : arabic ?? (AR[path] ? { title: AR[path][0], description: AR[path][1] } : project ? { title: `${project.nameAr ?? project.name} — تفاصيل المشروع`, description: project.outcomeAr ?? project.outcome } : undefined);
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
