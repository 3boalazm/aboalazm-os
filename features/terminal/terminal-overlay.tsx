"use client";

/**
 * TERMINAL EASTER EGG — Ctrl+` toggles a small command bar overlay.
 *
 * Not a real shell, not a Window Manager — just a fun, scoped Easter egg
 * that fits an "OS"-branded portfolio without pretending to be a full
 * desktop simulation. Supports:
 *   help              → list commands
 *   whoami            → short bio line
 *   ls                → list every page
 *   open <page>       → client-side navigate (e.g. `open work`)
 *   clear             → clear the output buffer
 *   ↑ / ↓             → command history, like a real shell
 *
 * Mounted once in the root layout (app/(site)/layout.tsx) so it's
 * available on every page.
 */

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useRouter } from "next/navigation";

const PAGES: Record<string, string> = {
  home: "/",
  about: "/about",
  start: "/start",
  work: "/work",
  "work-ui": "/work-ui",
  ui: "/work-ui",
  services: "/services",
  pricing: "/pricing",
  why: "/why",
  process: "/process",
  capabilities: "/capabilities",
  resources: "/resources",
  labs: "/labs",
  books: "/books",
  library: "/books",
  gallery: "/gallery",
  agreement: "/agreement",
  writing: "/writing",
  contact: "/contact",
};

const WHOAMI = [
  "mustafa aboalazm — systemic identity architect",
  "co-founder, code & canvas · al obour, egypt",
  "nine years across pharma, education, and government.",
];

interface Line {
  kind: "input" | "output" | "error";
  text: string;
}

export function TerminalOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { kind: "output", text: "aboalazm-os terminal — type `help` to start." },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+` (backtick) toggles the terminal from anywhere on the site.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    setLines((l) => [...l, { kind: "input", text: cmd }]);
    setHistory((h) => [...h, cmd]);
    setHistoryIdx(null);

    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help":
        setLines((l) => [
          ...l,
          {
            kind: "output",
            text:
              "commands: help · whoami · ls · open <page> · clear\n" +
              "e.g. \"open work\", \"open contact\"",
          },
        ]);
        break;
      case "whoami":
        setLines((l) => [...l, { kind: "output", text: WHOAMI.join("\n") }]);
        break;
      case "ls":
        setLines((l) => [
          ...l,
          { kind: "output", text: Object.keys(PAGES).filter((k) => k !== "home").join("  ") },
        ]);
        break;
      case "clear":
        setLines([]);
        break;
      case "open": {
        const target = PAGES[arg];
        if (!target) {
          setLines((l) => [...l, { kind: "error", text: `no such page: "${arg}" — try "ls"` }]);
          break;
        }
        setLines((l) => [...l, { kind: "output", text: `→ opening ${arg}...` }]);
        router.push(target);
        setOpen(false);
        break;
      }
      default:
        setLines((l) => [...l, { kind: "error", text: `command not found: ${head} — try "help"` }]);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setValue(history[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === null) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(null);
        setValue("");
      } else {
        setHistoryIdx(nextIdx);
        setValue(history[nextIdx] ?? "");
      }
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Terminal"
      className="fixed inset-x-0 bottom-0 z-[999] flex justify-center px-3 pb-3 sm:px-0"
    >
      <div className="glass w-full max-w-xl rounded-panel border border-border-default shadow-card">
        <div className="flex items-center justify-between border-b border-border-subtle px-3 py-1.5">
          <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
            aboalazm-os — terminal
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close terminal"
            className="inline-flex items-center gap-1 font-mono text-micro text-text-tertiary hover:text-text-primary"
          >
            esc <Icon name="x" size="0.9em" />
          </button>
        </div>

        <div className="max-h-52 overflow-y-auto px-3 py-2 font-mono text-body-sm">
          {lines.map((l, i) => (
            <pre
              key={i}
              className={[
                "whitespace-pre-wrap break-words",
                l.kind === "input"
                  ? "text-text-primary before:content-['$_'] before:text-accent"
                  : l.kind === "error"
                    ? "text-accent"
                    : "text-text-secondary",
              ].join(" ")}
            >
              {l.text}
            </pre>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border-subtle px-3 py-2">
          <span className="font-mono text-body-sm text-accent">$</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent font-mono text-body-sm text-text-primary outline-none placeholder:text-text-ghost"
            placeholder='try "help"'
          />
        </div>
      </div>
    </div>
  );
}
