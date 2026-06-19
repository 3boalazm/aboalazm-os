"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { RESOURCES } from "@/lib/resources";
import { SectionHead, CtaBand } from "@/features/offers/offer-blocks";
import {
  SpineRail,
  EmailGate,
  ResourceCard,
  readUnlocked,
} from "@/features/resources/resource-blocks";

export function ResourcesView() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [unlocked, setUnlocked] = useState(false);

  /* Hydrate unlock state after mount (localStorage is client-only). */
  useEffect(() => setUnlocked(readUnlocked()), []);

  return (
    <main className="container-content flex flex-col gap-16 py-16">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          {ar ? "المصادر / قاعدة المعرفة" : "RESOURCES / KNOWLEDGE BASE"}
        </p>
        <h1 className="font-display text-display tracking-[-0.025em]">
          {ar ? "ثمانية أطر. " : "Eight frameworks. "}
          <em className="text-accent">{ar ? "نظام تشغيل واحد." : "One operating system."}</em>
        </h1>
        <p className="max-w-[56ch] text-lead text-text-secondary">
          {ar
            ? "ليست ثمانية تنزيلات منفصلة، بل منهجية واحدة مترابطة لبناء البراندات بوضوح واتساق وقابلية للتوسّع — كل إطار يغذّي التالي."
            : "Not eight separate downloads — one connected methodology for building brands with clarity, consistency, and scale. Each framework feeds the next."}
        </p>
      </header>

      {/* The spine */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["01 / THE SPINE", "٠١ / العمود الفقري"]}
          title={["The operating", "نظام التشغيل"]}
          italic={["spine.", "المتسلسل."]}
        />
        <SpineRail />
      </section>

      {/* Gate — only shown while locked */}
      {!unlocked && (
        <section>
          <EmailGate onUnlock={() => setUnlocked(true)} />
        </section>
      )}

      {/* The library */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["02 / THE LIBRARY", "٠٢ / المكتبة"]}
          title={ar ? ["الوثائق", ""] : ["The eight", ""]}
          italic={ar ? ["الثماني.", ""] : ["documents.", ""]}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <ResourceCard key={r.id} resource={r} unlocked={unlocked} />
          ))}
        </div>
      </section>

      <CtaBand
        kicker={["FROM RESOURCES TO RESULTS", "من المصادر إلى النتائج"]}
        title={["Frameworks are the map.", "الأطر هي الخريطة."]}
        italic={["Let's build the brand.", "لنبنِ البراند."]}
        primary={["Start a project", "ابدأ مشروعًا"]}
        primaryHref="/contact"
        secondary={["See the work", "شاهد الأعمال"]}
        secondaryHref="/work"
      />
    </main>
  );
}
