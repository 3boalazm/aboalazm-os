import type { Metadata } from "next";
import { RESPONSE_PROMISE } from "@/lib/contact-details";
import { SITE_URL } from "@/lib/site";
import { localeHref, type Locale } from "@/lib/locale";
import { PROJECTS } from "@/features/work/projects.data";

const AR: Record<string, [string, string]> = {
  "/": ["مصطفى أبوالعزم — مصمم هوية بصرية | Aboalazm OS استوديو هوية وتجربة رقمية وأنظمة أعمال", "مصطفى أبوالعزم، مصمم هوية بصرية في العبور بمصر ومؤسس Aboalazm OS: استوديو يبني الهوية والتموضع، والطبقة الرقمية ثنائية اللغة، وأنظمة الأعمال والأتمتة، من أول مكالمة استكشافية إلى نطاق مكتوب وتسليم يعمل به فريقك."],
  "/services": ["خدمات الهوية البصرية والمواقع", "تصميم الهوية البصرية وتطبيقاتها، ومواقع ثنائية اللغة ومنتجات رقمية، بنطاق واضح وأمثلة من أعمال مشابهة وباقات تناسب احتياج المشروع."],
  "/services/brand-identity": ["تصميم هوية بصرية بالعربية والإنجليزية", "شعار وألوان وخطوط وتطبيقات ودليل استخدام للعلامة. استعرض أمثلة حقيقية، وقارن بين الباقات، وابدأ استفسارك."],
  "/services/websites": ["تصميم مواقع ومنتجات رقمية", "مواقع شركات وصفحات هبوط ومتاجر وأدوات تشغيل بالعربية والإنجليزية، من تحديد رحلة المستخدم إلى التسليم والتشغيل."],
  "/services/systems": ["أنظمة الأعمال والأتمتة: لوحات تحكم وERP وأدوات داخلية", "لوحات تشغيل ووحدات ERP وأدوات داخلية بواجهة عربية RTL، وأتمتة تحلّ محل الخطوات اليدوية، بنطاق مكتوب يُحدَّد في مكالمة استكشافية أولًا."],
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
    arabic ?? (AR[path] ? { title: AR[path][0], description: AR[path][1] } : project ? { title: `${project.nameAr ?? project.name} — تفاصيل المشروع`, description: projectDescriptionAr(project) } : undefined);
  const useTranslated = locale === "ar" && translated;
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
  const OG_LOCALE: Record<Locale, string> = { en: "en_US", ar: "ar_EG" };
  return {
    ...base, title, description,
    alternates: { canonical, languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}${localeHref(path, "ar")}`, "x-default": `${SITE_URL}${path}` } },
    openGraph: { ...base.openGraph, title: openGraphTitle, description: description ?? undefined, siteName: "Mustafa Aboalazm", url: canonical, locale: OG_LOCALE[locale], alternateLocale: (["en", "ar"] as const).filter((l) => l !== locale).map((l) => OG_LOCALE[l]) },
  };
}
