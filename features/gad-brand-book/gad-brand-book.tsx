import Image from "next/image";
import { ArrowRight, Award, ChevronRight, Eye, Globe, Heart, Shield, Target, TrendingUp, Users, Zap } from "./icons";
import { Swatch } from "./swatch";
import { SectionNav } from "./section-nav";
import { Anatomy } from "./anatomy";
import { Usage } from "./usage";
import {
  BLUE, BLUE_LIGHT, DARK, DARKER, INFOGRAPHIC_COLORS, NEUTRAL_COLORS, PRIMARY_COLORS, RED, RED_TEXT,
} from "./tokens";

const IMG = "/images/work/gad";
const MUTED = "rgb(255 255 255 / 0.68)";

function Chip({ label, number }: { label: string; number: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: RED_TEXT }}>{number}</span>
      <span className="h-px w-8" style={{ background: RED }} />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{label}</span>
    </div>
  );
}

function Heading({ children, size = "clamp(36px,4.5vw,72px)" }: { children: React.ReactNode; size?: string }) {
  return (
    <h2 className="mb-8 font-bold leading-[1.02] tracking-tight text-white" style={{ fontSize: size }}>
      {children}
    </h2>
  );
}

const Accent = ({ children }: { children: React.ReactNode }) => (
  <span className="block" style={{ color: RED_TEXT }}>{children}</span>
);

const PLATE_DARK = "#070D14";

/**
 * The supplied vector logos come in light-ground and dark-ground colourways;
 * each sits on the plate it was drawn for. `dark` picks the dark plate.
 */
function LogoPlate({ src, alt, w, h, dark = false, className = "" }: { src: string; alt: string; w: number; h: number; dark?: boolean; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl p-8 ${dark ? "border border-white/15" : "bg-white"} ${className}`}
      style={dark ? { background: PLATE_DARK } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG, nothing to optimise */}
      <img src={src} alt={alt} width={w} height={h} className="h-auto max-h-full w-auto max-w-full" />
    </div>
  );
}

const VALUES = [
  { icon: <Award size={20} />, title: "Excellence", desc: "Striving for clinical and operational excellence in every service delivered." },
  { icon: <Heart size={20} />, title: "Compassion", desc: "Prioritizing patient comfort and emotional well-being at every touchpoint." },
  { icon: <Shield size={20} />, title: "Integrity", desc: "Upholding the highest standards of ethics and transparency." },
  { icon: <Zap size={20} />, title: "Innovation", desc: "Embracing cutting-edge technology and research-driven advancement." },
];

const PERSONA_BOXES = [
  { title: "Tone of Voice", items: ["Warm & Empathetic", "Reassuring & Comforting", "Professional & Confident", "Encouraging & Supportive"], color: BLUE_LIGHT },
  { title: "Personality Traits", items: ["Compassionate", "Trustworthy", "Patient-Focused", "Empathetic"], color: RED_TEXT },
  { title: "Brand Messaging", items: ["“Closer to every heart”", "“Your health is our priority”", "“Compassionate care, exceptional expertise”", "“Empowering personalized treatment”"], color: BLUE_LIGHT },
  { title: "Customer Experience", items: ["Build trust & emotional connection", "Comfort & transparency first", "Seamless healthcare journey", "Every patient feels valued"], color: RED_TEXT },
];


const STANDARDS = [
  { icon: <Globe size={20} />, title: "Digital", desc: "Presentations 1920×1080 · Web Hero 1920×600 · Leaderboard 728×90" },
  { icon: <Users size={20} />, title: "Social Media", desc: "IG/LinkedIn 1080×1080 · Facebook 1880×1576 · Stories 1080×1920" },
  { icon: <Award size={20} />, title: "Print", desc: "A4 210×297mm · Business Card 90×55mm · Roll-up 85–100cm×200cm" },
  { icon: <TrendingUp size={20} />, title: "Target Audience", desc: "Local Patients · International Medical Tourists · Insurance Partners · Families" },
];

const card = { background: "rgb(255 255 255 / 0.04)", border: "1px solid rgb(255 255 255 / 0.1)" };

export function GadBrandBook() {
  return (
    // Site spacing is 8px per step; this page was designed on Tailwind's 4px scale.
    <div style={{ "--spacing": "4px", background: DARK, fontFamily: "var(--font-sans)" } as React.CSSProperties} className="text-white">
      <SectionNav />

      {/* ── COVER ── */}
      <section id="cover" aria-labelledby="cover-title" className="relative flex min-h-svh flex-col justify-end overflow-hidden pt-36 pb-16 lg:pb-24" style={{ background: DARKER }}>
        <span aria-hidden className="pointer-events-none absolute inset-0 flex select-none items-center justify-end overflow-hidden pr-10 text-[22vw] font-bold leading-none tracking-tighter" style={{ color: "rgb(255 255 255 / 0.03)" }}>GAD</span>
        <div className="relative mx-auto grid w-full max-w-7xl items-end gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: RED_TEXT }}>Full Brand Identity</span>
              <span className="h-px w-12" style={{ background: RED }} />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">2025 — V2.0</span>
            </div>
            <h1 id="cover-title" className="mb-6 font-bold leading-[0.95] tracking-tight" style={{ fontSize: "clamp(44px,7vw,112px)" }}>
              <span className="block text-white">GAD Heart</span>
              <span className="block" style={{ color: BLUE_LIGHT }}>&amp; Lungs</span>
              <span className="block" style={{ color: RED_TEXT }}>Institute</span>
            </h1>
            <p lang="ar" dir="rtl" className="mb-10 w-fit max-w-xl text-lg leading-relaxed" style={{ color: MUTED, fontFamily: "var(--font-arabic)" }}>
              مستشفى د. غنام الدوسري للقلب والرئتين
            </p>
            <dl className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {[["V2.0", "Brand identity"], ["2025", "Edition"], ["EN + AR", "Bilingual identity"]].map(([k, v]) => (
                <div key={k}>
                  <dd className="text-3xl font-bold text-white">{k}</dd>
                  <dt className="mt-1 text-xs uppercase tracking-widest text-white/65">{v}</dt>
                </div>
              ))}
            </dl>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <Image src={`${IMG}/gad-cover.png`} alt="Cover slide of the GAD brand book: “Brand identity for GAD Heart & Lungs Institute, V2.0”" width={1400} height={933} priority sizes="(min-width:1024px) 45vw, 100vw" className="h-auto w-full" />
          </figure>
        </div>
        <p className="relative mx-auto mt-12 w-full max-w-7xl px-6 text-xs text-white/65 lg:px-16">
          Portfolio case study — brand identity &amp; brand book by Mustafa Aboalazm for GAD Heart &amp; Lungs Institute, Al Khobar, KSA.{" "}
          <a href="/case-studies/gad-institute" className="underline underline-offset-4 hover:text-white">Read the case study</a>
        </p>
      </section>

      {/* ── STRATEGY ── */}
      <section id="strategy" aria-labelledby="strategy-title" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <Chip label="Brand Strategy" number="01" />
          <div className="mb-20 grid items-start gap-16 lg:grid-cols-2">
            <div>
              <h2 id="strategy-title" className="mb-8 font-bold leading-none tracking-tight text-white" style={{ fontSize: "clamp(40px,5vw,80px)" }}>
                Pioneering<Accent>Care.</Accent>
              </h2>
              <p className="max-w-md text-base leading-relaxed" style={{ color: MUTED }}>
                GAD Heart &amp; Lungs Institute is a pioneering healthcare facility dedicated to providing world-class cardiopulmonary care in the Kingdom of Saudi Arabia and the Gulf region — combining cutting-edge medical technology, internationally recognized experts, and an unwavering patient-centered commitment.
              </p>
            </div>
            <div className="rounded-3xl p-10" style={{ background: `linear-gradient(135deg, ${BLUE}33, ${BLUE}0d)`, border: `1px solid ${BLUE}66` }}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: RED_TEXT }}>Tagline</p>
              <p className="text-3xl font-bold text-white">“Closer to every heart”</p>
              <p className="mt-6 text-sm leading-relaxed" style={{ color: MUTED }}>
                Dedicated to caring for every heartbeat and breath.
              </p>
            </div>
          </div>

          <div className="mb-16 grid gap-6 md:grid-cols-2">
            {[
              { icon: <Eye size={22} />, label: "Vision", text: "To be the leading cardiology and pulmonology center in Saudi Arabia and the Gulf, offering innovative healthcare, excelling in diagnosis, treatment, and rehabilitation, while establishing ourselves as a hub for medical tourism and innovation." },
              { icon: <Target size={22} />, label: "Mission", text: "GAD Institute is dedicated to delivering exceptional patient-centered care through advanced medical technologies, a team of globally recognized experts, and a commitment to research and education to continuously improve outcomes for patients with heart and lung conditions." },
            ].map((i) => (
              <div key={i.label} className="rounded-3xl p-8" style={card}>
                <div className="mb-5 flex items-center gap-3">
                  <span aria-hidden style={{ color: RED_TEXT }}>{i.icon}</span>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/75">{i.label}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/80">{i.text}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-8 text-xs font-semibold uppercase tracking-widest text-white/70">Core Values</h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <li key={v.title} className="rounded-2xl p-6" style={card}>
                <span aria-hidden className="mb-4 block" style={{ color: RED_TEXT }}>{v.icon}</span>
                <p className="mb-2 text-sm font-bold text-white">{v.title}</p>
                <p className="text-xs leading-relaxed text-white/70">{v.desc}</p>
              </li>
            ))}
          </ul>

          <div className="mt-16 rounded-3xl p-10" style={{ background: `linear-gradient(135deg, ${BLUE}22, ${BLUE}08)`, border: `1px solid ${BLUE}55` }}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: BLUE_LIGHT }}>Brand Promise</p>
            <p className="max-w-3xl text-xl leading-relaxed text-white/85">
              “To provide unparalleled cardiopulmonary care by combining advanced medical expertise with compassionate, personalized service, ensuring every patient feels <strong className="font-semibold text-white">valued, supported, and empowered</strong> to achieve better health.”
            </p>
          </div>
        </div>
      </section>

      {/* ── PERSONA ── */}
      <section id="persona" aria-labelledby="persona-title" className="py-28" style={{ background: DARKER }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <Chip label="Brand Persona" number="02" />
          <div className="grid items-start gap-16 lg:grid-cols-3">
            <div>
              <h2 id="persona-title" className="mb-6 font-bold leading-none tracking-tight text-white" style={{ fontSize: "clamp(36px,4vw,64px)" }}>
                The<Accent>Caregiver</Accent>Archetype
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-white/70">
                The Caregiver archetype represents compassion, nurturing, and a commitment to improving the lives of others — aligning with GAD’s mission to deliver exceptional, patient-centered cardiac and pulmonary care.
              </p>
              <ul className="space-y-3">
                {["Core Desire: To help, protect & support", "Goal: Improve lives through reliable care", "Fear: Failing those in their care"].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color: RED_TEXT }} />
                    <span className="text-xs text-white/75">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
              {PERSONA_BOXES.map((b) => (
                <div key={b.title} className="rounded-2xl p-7" style={card}>
                  <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest" style={{ color: b.color }}>{b.title}</h3>
                  <ul className="space-y-2">
                    {b.items.map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span aria-hidden className="mt-2 block size-1 shrink-0 rounded-full" style={{ background: b.color }} />
                        <span className="text-xs text-white/75">{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO ── */}
      <section id="logo" aria-labelledby="logo-title" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <Chip label="Logo Guidelines" number="03" />
          <div className="mb-20 grid gap-16 lg:grid-cols-2">
            <div>
              <h2 id="logo-title" className="mb-8 font-bold leading-none tracking-tight text-white" style={{ fontSize: "clamp(36px,4vw,64px)" }}>
                Logo<Accent>System</Accent>
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-white/70">
                The primary logo combines a stylized heart-and-lungs symbol in Crimson Red and Deep Blue — vitality, trust, and the dual focus of cardiopulmonary care. It ships in four lockups: English and Arabic, horizontal and vertical (brand book pp. 13–14).
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <LogoPlate src={`${IMG}/gad-logo-horizontal-en.svg`} alt="GAD Heart & Lungs Institute — English horizontal logo, light background" w={306} h={106} className="h-40" />
                <LogoPlate dark src={`${IMG}/gad-logo-horizontal-en-dark.svg`} alt="GAD Heart & Lungs Institute — English horizontal logo, dark background" w={306} h={106} className="h-40" />
                <LogoPlate src={`${IMG}/gad-logo-horizontal-ar.svg`} alt="شعار مستشفى د. غنام الدوسري للقلب والرئتين — أفقي، خلفية فاتحة" w={397} h={106} className="h-40" />
                <LogoPlate dark src={`${IMG}/gad-logo-horizontal-ar-dark.svg`} alt="شعار مستشفى د. غنام الدوسري للقلب والرئتين — أفقي، خلفية داكنة" w={397} h={106} className="h-40" />
                <LogoPlate src={`${IMG}/gad-logo-vertical-en.svg`} alt="GAD Heart & Lungs Institute — English vertical logo, light background" w={261} h={321} className="h-72" />
                <LogoPlate dark src={`${IMG}/gad-logo-vertical-en-dark.svg`} alt="GAD Heart & Lungs Institute — English vertical logo, dark background" w={261} h={321} className="h-72" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <LogoPlate src={`${IMG}/gad-mark.svg`} alt="GAD symbol on white" w={106} h={106} className="aspect-square !p-5" />
                <div className="flex aspect-square items-center justify-center rounded-2xl p-5" style={{ background: BLUE_LIGHT }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${IMG}/gad-mark.svg`} alt="GAD symbol on Sky Blue" width={106} height={106} className="h-full w-auto" />
                </div>
                <div className="flex aspect-square items-center justify-center rounded-2xl p-5" style={{ background: "#D0D0D0" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${IMG}/gad-mark.svg`} alt="GAD symbol on Light Grey" width={106} height={106} className="h-full w-auto" />
                </div>
                <LogoPlate dark src={`${IMG}/gad-mark-dark.svg`} alt="GAD symbol, dark-background colourway" w={106} h={106} className="aspect-square !p-5" />
              </div>
            </div>
          </div>
          <div className="mb-20">
            <h3 className="mb-8 text-2xl font-bold text-white">Anatomy of the mark</h3>
            <Anatomy />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-white/10">
              <Image src={`${IMG}/gad-logo-variations.png`} alt="Brand book page 13: the four logo variations — English and Arabic, horizontal and vertical" width={1400} height={933} sizes="(min-width:768px) 45vw, 100vw" className="h-auto w-full" />
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-white/10">
              <Image src={`${IMG}/gad-logo-symbol.png`} alt="Brand book page 14: logo symbol usage and guidelines" width={1400} height={933} sizes="(min-width:768px) 45vw, 100vw" className="h-auto w-full" />
            </figure>
          </div>
        </div>
      </section>

      {/* ── COLOR ── */}
      <section id="color" aria-labelledby="color-title" className="py-28" style={{ background: DARKER }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <Chip label="Color System" number="04" />
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <h2 id="color-title" className="font-bold leading-none tracking-tight text-white" style={{ fontSize: "clamp(36px,4vw,64px)" }}>
              Color<Accent>Palette</Accent>
            </h2>
            <p className="max-w-xs text-sm text-white/70">Bold, modern, and versatile — representing trust, vitality, and professionalism across all platforms. Tap a swatch to copy its hex.</p>
          </div>
          <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-white/70">Primary palette</h3>
          <div className="mb-16 grid grid-cols-2 gap-6 lg:grid-cols-4">{PRIMARY_COLORS.map((c) => <Swatch key={c.hex} {...c} />)}</div>
          <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-white/70">Neutral palette</h3>
          <div className="mb-16 grid grid-cols-2 gap-6 lg:grid-cols-4">{NEUTRAL_COLORS.map((c) => <Swatch key={c.hex} {...c} />)}</div>
          <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-white/70">Infographic palette</h3>
          <div className="mb-16 grid grid-cols-3 gap-4 lg:grid-cols-6">{INFOGRAPHIC_COLORS.map((c) => <Swatch key={c.hex} {...c} />)}</div>
          <figure className="overflow-hidden rounded-2xl border border-white/10">
            <Image src={`${IMG}/gad-colors-primary.png`} alt="Brand book page 22: primary palette — Dark Red Pantone P 49-16 U (#AB121C) and Deep Blue Pantone P 107-8 U (#005895)" width={1400} height={933} sizes="(min-width:1280px) 1100px, 100vw" className="h-auto w-full" />
          </figure>
        </div>
      </section>

      {/* ── TYPOGRAPHY ── */}
      <section id="typography" aria-labelledby="type-title" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <Chip label="Typography" number="05" />
          <div className="mb-16 grid gap-16 lg:grid-cols-2">
            <div>
              <h2 id="type-title" className="mb-8 font-bold leading-none tracking-tight text-white" style={{ fontSize: "clamp(36px,4vw,64px)" }}>
                Type<Accent>System</Accent>
              </h2>
              <p className="text-sm leading-relaxed text-white/70">
                Three families carry GAD’s voice: <strong className="text-white">Trap</strong> for bold, authoritative headlines, <strong className="text-white">Montserrat</strong> for versatile body copy, and <strong className="text-white">Alexandria</strong> for all Arabic communication.
              </p>
            </div>
          </div>
          <ul className="mb-8 grid gap-4 md:grid-cols-3">
            {[
              { name: "Trap", role: "Primary — headlines, display", note: "Hero sections, chapter openers, bold statements of identity." },
              { name: "Montserrat", role: "Secondary — body, UI, captions", note: "Subtitles, running text, labels and interface copy.", sample: "Closer to Every Heart" },
              { name: "Alexandria", role: "Arabic — all Arabic copy", note: "Modern, professional and highly legible at all sizes." },
            ].map((f) => (
              <li key={f.name} className="rounded-2xl p-8" style={card}>
                <p className="text-lg font-bold text-white">{f.name}</p>
                <p className="mt-1 text-xs text-white/70">{f.role}</p>
                {f.sample && <p className="mt-6 text-2xl font-bold leading-tight text-white">{f.sample}</p>}
                <p className="mt-4 text-xs text-white/70">{f.note}</p>
              </li>
            ))}
          </ul>
          <figure className="overflow-hidden rounded-2xl border border-white/10">
            <Image src={`${IMG}/gad-typography.png`} alt="Brand book page 28: Trap, Montserrat and Alexandria — letters, figures and weights" width={1400} height={933} sizes="(min-width:1280px) 1100px, 100vw" className="h-auto w-full" />
          </figure>
        </div>
      </section>

      {/* ── APPLICATIONS ── */}
      <section id="applications" aria-labelledby="apps-title" className="py-28" style={{ background: DARKER }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <Chip label="Brand Applications" number="06" />
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <h2 id="apps-title" className="font-bold leading-none tracking-tight text-white" style={{ fontSize: "clamp(36px,4vw,64px)" }}>
              Brand<Accent>In Use</Accent>
            </h2>
            <p className="max-w-xs text-sm text-white/70">The identity applied across signage, print, exhibition and outdoor — mockups from the brand book.</p>
          </div>
          <div className="mb-12 grid gap-4 md:grid-cols-12">
            {[
              { src: "gad-signage-environmental.jpg", alt: "Brushed-metal GAD logo mounted on a building facade", cap: "Environmental signage", span: "md:col-span-8" },
              { src: "gad-mockup-outdoor.jpg", alt: "GAD outdoor banner mockup", cap: "Outdoor", span: "md:col-span-4" },
              { src: "gad-mockup-logo.jpg", alt: "GAD logo on a wall — mockup", cap: "Logo wall", span: "md:col-span-4" },
              { src: "gad-mockup-card.jpg", alt: "GAD business cards in Deep Blue and white, with QR code", cap: "Business card", span: "md:col-span-4" },
              { src: "gad-mockup-exhibition.jpg", alt: "GAD exhibition stand mockup with Vision 2030 wall", cap: "Exhibition stand", span: "md:col-span-4" },
            ].map((m) => (
              <figure key={m.src} className={m.span}>
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/10">
                  <Image src={`${IMG}/${m.src}`} alt={m.alt} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/75">{m.cap}</figcaption>
              </figure>
            ))}
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARDS.map((s) => (
              <li key={s.title} className="rounded-2xl p-6" style={card}>
                <span aria-hidden className="mb-4 block" style={{ color: RED_TEXT }}>{s.icon}</span>
                <p className="mb-2 text-sm font-bold text-white">{s.title}</p>
                <p className="text-xs leading-relaxed text-white/70">{s.desc}</p>
              </li>
            ))}
          </ul>

          <div className="mt-24 text-center">
            <div className="mx-auto mb-10 flex w-fit rounded-2xl bg-white p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/gad-logo-horizontal-en.svg`} alt="GAD Heart & Lungs Institute logo" width={306} height={106} className="h-16 w-auto" />
            </div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/65">Brand Identity V2.0 — 2025</p>
            <p className="mx-auto max-w-3xl font-bold leading-tight tracking-tight text-white/85" style={{ fontSize: "clamp(28px,3.6vw,48px)" }}>
              Dedicated to caring for every heartbeat and breath.
            </p>
            <p className="mt-4 text-xl" style={{ color: RED_TEXT }}>“Closer to every heart”</p>
            <p className="mt-12 border-t border-white/10 pt-8 text-xs text-white/65">
              Brand identity &amp; brand book by Mustafa Aboalazm. GAD Heart &amp; Lungs Institute’s name, logo and marks belong to GAD.
            </p>
          </div>
        </div>
      </section>

      {/* ── USAGE ── */}
      <section id="usage" aria-labelledby="usage-title" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <Chip label="Usage Guidelines" number="07" />
          <h2 id="usage-title" className="mb-4 font-bold leading-none tracking-tight text-white" style={{ fontSize: "clamp(36px,4vw,64px)" }}>
            Using the<Accent>Logo</Accent>
          </h2>
          <p className="mb-16 max-w-2xl text-sm leading-relaxed text-white/70">
            Practical rules that extend the brand book’s symbol guidelines — clear space, sizing and common mistakes — drawn as a quick reference.
          </p>
          <Usage />
        </div>
      </section>
    </div>
  );
}
