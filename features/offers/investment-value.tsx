"use client";
import { useLang } from "@/components/providers/lang-provider";

/** Deliverables replace unmeasured efficiency percentages, including CMS values. */
export function InvestmentValue() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const items = ar ? [
    ["نطاق مكتوب", "المخرجات والمراجعات والمدة المتفق عليها واضحة قبل البدء."],
    ["ملفات قابلة للاستخدام", "الصيغ والتطبيقات المحددة في باقتك، مع تجهيز مناسب للطباعة والاستخدام الرقمي."],
    ["تسليم موضح", "قواعد الاستخدام وشرح الملفات بحسب النطاق، ليعرف فريقك كيف يواصل العمل."],
  ] : [
    ["Written scope", "Deliverables, revision rounds and an agreed schedule before kickoff."],
    ["Usable deliverables", "The formats and applications listed in your package, prepared for print and digital."],
    ["A clear handover", "Usage guidance and file walkthroughs appropriate to the scope, so your team can keep working."],
  ];
  return <section className="flex flex-col gap-3">
    <h2 className="font-display text-title">{ar ? "ما الذي تتسلّمه؟" : "What your investment includes"}</h2>
    <div className="grid gap-2 lg:grid-cols-3">{items.map(([title, body]) => <div key={title} className="rounded-card border border-border-default bg-surface-1 p-3"><h3 className="font-display font-display-sm text-subtitle">{title}</h3><p className="mt-1 text-body-sm text-text-secondary">{body}</p></div>)}</div>
    <p className="text-body-sm text-text-tertiary">{ar ? "يُحدَّد السعر النهائي بعد الاتفاق على عدد التطبيقات واللغات وتعقيد العمل. وتُقدَّم إضافات النطاق بعرض مستقل قبل تنفيذها." : "The final quote depends on applications, languages and complexity. Scope additions are quoted separately before work starts."}</p>
  </section>;
}
