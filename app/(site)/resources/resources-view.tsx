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
import { Heading } from "@/components/ui/Heading";

export function ResourcesView() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [unlocked, setUnlocked] = useState(false);

  /* Hydrate unlock state after mount (localStorage is client-only). */
  useEffect(() => setUnlocked(readUnlocked()), []);

  return (
    <main className="container-content flex flex-col gap-16 py-16">
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={ar ? "المصادر / قاعدة المعرفة" : "RESOURCES / KNOWLEDGE BASE"}
          title={
            <>
              {ar ? "ثمانية أطر. " : "Eight frameworks. "}
              <em className="text-accent">{ar ? "نظام تشغيل واحد." : "One operating system."}</em>
            </>
          }
          subtitle={
            ar
              ? "ليست ثمانية تنزيلات منفصلة، بل منهجية واحدة مترابطة لبناء البراندات بوضوح واتساق وقابلية للتوسّع — كل إطار يغذّي التالي."
              : "Not eight separate downloads — one connected methodology for building brands with clarity, consistency, and scale. Each framework feeds the next."
          }
          titleClassName="heading-fit-long"
          subtitleClassName="max-w-[56ch]"
        />
      </header>

      {/* The spine */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["01 / THE SPINE", "01 / العمود الفقري"]}
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
          label={["02 / THE LIBRARY", "02 / المكتبة"]}
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
