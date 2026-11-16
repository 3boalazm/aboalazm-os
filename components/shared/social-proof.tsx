"use client";

import Image from "next/image";
import { useLang } from "@/components/providers/lang-provider";
import { PanelCard } from "@/components/ui/PanelCard";
import {
  CLIENTS,
  getPermittedClients,
  type ClientLogoEntry,
} from "@/content/clients";
import {
  TESTIMONIALS,
  getPermittedTestimonials,
  type TestimonialEntry,
} from "@/content/testimonials";

export function ClientLogosStrip({
  items = CLIENTS,
  className = "",
}: {
  items?: readonly ClientLogoEntry[];
  className?: string;
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const permitted = getPermittedClients(items);

  // Logo strip requires 3 or more permitted entries; otherwise render nothing at all.
  if (permitted.length < 3) return null;

  return (
    <section
      aria-label={ar ? "شركاء وعملاء" : "Selected clients"}
      className={`container-content py-6 ${className}`}
    >
      <p className="mb-3 font-mono text-micro uppercase tracking-[0.14em] text-text-ghost">
        {ar ? "علامات تجارية وشركاء" : "SELECTED CLIENTS"}
      </p>
      <div className="grid grid-cols-2 items-center gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {permitted.map((client) => {
          const label = ar
            ? client.companyAr ?? client.company
            : client.company;
          const img = (
            <div className="flex h-16 items-center justify-center rounded-card border border-border-default bg-surface-1 px-4 py-3 transition-colors hover:border-border-strong">
              <Image
                src={client.logo}
                alt={label}
                width={140}
                height={40}
                className="max-h-9 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
              />
            </div>
          );

          return client.url ? (
            <a
              key={`${client.company}-${client.logo}`}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              {img}
            </a>
          ) : (
            <div key={`${client.company}-${client.logo}`}>{img}</div>
          );
        })}
      </div>
    </section>
  );
}

export function TestimonialsSection({
  items = TESTIMONIALS,
  className = "",
}: {
  items?: readonly TestimonialEntry[];
  className?: string;
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const permitted = getPermittedTestimonials(items);

  // If no permitted entries exist, do not render the section at all.
  if (permitted.length === 0) return null;

  return (
    <section
      aria-label={ar ? "آراء العملاء" : "Client testimonials"}
      className={`container-content py-6 ${className}`}
    >
      <div className="flex flex-col gap-1">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "آراء العملاء" : "CLIENT FEEDBACK"}
        </p>
        <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
          {ar ? "كلمات من شركاء المشروع." : "Words from project partners."}
        </h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {permitted.map((item) => {
          const quote = ar
            ? item.quote_ar || item.quote_en
            : item.quote_en || item.quote_ar;
          const name = ar ? item.nameAr ?? item.name : item.name;
          const role = ar ? item.roleAr ?? item.role : item.role;
          const company = ar ? item.companyAr ?? item.company : item.company;

          return (
            <PanelCard
              key={`${item.name}-${item.company}`}
              className="flex flex-col justify-between gap-4 rounded-card p-4"
            >
              <blockquote className="text-body leading-relaxed text-text-primary">
                “{quote}”
              </blockquote>
              <footer className="border-t border-border-subtle pt-3">
                <p className="font-display text-body-sm font-medium text-text-primary">
                  {name}
                </p>
                <p className="font-mono text-micro text-text-tertiary">
                  {[role, company].filter(Boolean).join(" · ")}
                </p>
              </footer>
            </PanelCard>
          );
        })}
      </div>
    </section>
  );
}

export function SocialProof({
  clients = CLIENTS,
  testimonials = TESTIMONIALS,
  className = "",
}: {
  clients?: readonly ClientLogoEntry[];
  testimonials?: readonly TestimonialEntry[];
  className?: string;
}) {
  const hasClients = getPermittedClients(clients).length >= 3;
  const hasTestimonials = getPermittedTestimonials(testimonials).length > 0;

  if (!hasClients && !hasTestimonials) return null;

  return (
    <div className={className}>
      <ClientLogosStrip items={clients} />
      <TestimonialsSection items={testimonials} />
    </div>
  );
}
