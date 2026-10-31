import type { Metadata } from "next";
import { RESPONSE_PROMISE } from "@/lib/contact-details";
import { SITE_URL } from "@/lib/site";
import { localeHref, type Locale } from "@/lib/locale";
import { PROJECTS } from "@/features/work/projects.data";

const AR: Record<string, [string, string]> = {
  "/": ["مصطفى أبوالعزم — تصميم هوية بصرية ومواقع", "هوية بصرية بالعربي والإنجليزي، أدلة استخدام ومواقع ومنتجات رقمية. استعرض أعمال مصطفى أبوالعزم وناقش نطاق مشروعك."],
  "/services": ["خدمات الهوية البصرية والمواقع", "تصميم هوية بصرية وتطبيقاتها، مواقع ثنائية اللغة ومنتجات رقمية. نطاق واضح وأعمال مشابهة وباقات حسب احتياج المشروع."],
  "/services/brand-identity": ["تصميم هوية بصرية بالعربي والإنجليزي", "شعار وألوان وخطوط وتطبيقات ودليل استخدام للبراند. استعرض أمثلة حقيقية وقارن الباقات وابدأ استفسارك."],
  "/services/websites": ["تصميم مواقع ومنتجات رقمية", "مواقع شركات وصفحات هبوط ومتاجر وأدوات تشغيل بالعربي والإنجليزي، من تحديد رحلة المستخدم إلى التسليم والتشغيل."],
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

export function localizedMetadata(base: Metadata, locale: Locale, path: string, arabic?: { title: string; description: string }): Metadata {
  const project = path.startsWith("/case-studies/") ? PROJECTS.find((p) => p.slug === path.split("/").pop()) : undefined;
  const translated = arabic ?? (AR[path] ? { title: AR[path][0], description: AR[path][1] } : project ? { title: `${project.nameAr ?? project.name} — تفاصيل المشروع`, description: project.outcomeAr ?? project.outcome } : undefined);
  const title = locale === "ar" && translated ? translated.title : base.title;
  const description = locale === "ar" && translated ? translated.description : base.description;
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
  return {
    ...base, title, description,
    alternates: { canonical, languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}${localeHref(path, "ar")}`, "x-default": `${SITE_URL}${path}` } },
    openGraph: { ...base.openGraph, title: openGraphTitle, description: description ?? undefined, siteName: "Mustafa Aboalazm", url: canonical, locale: locale === "ar" ? "ar_EG" : "en_US", alternateLocale: locale === "ar" ? "en_US" : "ar_EG" },
  };
}
