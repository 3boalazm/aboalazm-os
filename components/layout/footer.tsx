import Link from "next/link";

/**
 * FOOTER — per Copy Deck. Server component, zero JS.
 * Three mono-headed columns + the sign-off line + legal stamp.
 */
const COLUMNS = [
  {
    head: "SYSTEM",
    links: [
      ["Work", "/work"],
      ["Capabilities", "/capabilities"],
      ["Writing", "/writing"],
    ],
  },
  {
    head: "STUDIO",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
    ],
  },
  {
    head: "ELSEWHERE",
    links: [
      ["Behance ↗", "https://www.behance.net/aboalazm"],
      ["LinkedIn ↗", "https://www.linkedin.com/in/aboalazm"],
      ["WhatsApp ↗", "https://wa.me/201092500454"],
      ["Email", "mailto:Mustafaaboalazm@mail.ru"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="container-wide flex flex-col gap-8 py-8">
        <p className="max-w-[24ch] font-display text-title tracking-[-0.015em] text-text-primary">
          We don't make brands. <em className="text-text-secondary">We make brands operational.</em>
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <nav key={col.head} aria-label={col.head} className="flex flex-col gap-1">
              <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
                {col.head}
              </p>
              {col.links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  {...(href.startsWith("http") || href.startsWith("mailto")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="w-fit text-body-sm text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
                >
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <p className="border-t border-border-subtle pt-3 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          © 2026 MUSTAFA ABOALAZM · AL OBOUR, EGYPT → WORLDWIDE · BUILT ON ITS OWN SYSTEM
        </p>
      </div>
    </footer>
  );
}
