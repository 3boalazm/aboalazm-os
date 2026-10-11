"use client";

import { useEffect, useRef, useState } from "react";
import { RED_TEXT } from "./tokens";

interface Props {
  hex: string;
  name: string;
  pantone?: string;
  role?: string;
}

/** Click-to-copy colour swatch. The button is the whole card, so it is keyboard-reachable. */
export function Swatch({ hex, name, pantone, role }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      return; // clipboard blocked (insecure context / permissions) — stay silent
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${name} ${hex} — copy hex code`}
      className="group block w-full cursor-pointer rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <span
        className="mb-4 block aspect-square w-full rounded-2xl border border-white/10 shadow-lg transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        style={{ background: hex }}
      />
      <span className="block text-sm font-semibold text-white">{name}</span>
      {role && <span className="mt-0.5 block text-xs text-white/65">{role}</span>}
      <span
        className="mt-1 block font-mono text-xs"
        style={{ color: copied ? RED_TEXT : "rgb(255 255 255 / 0.65)" }}
        aria-live="polite"
      >
        {copied ? "Copied!" : hex}
      </span>
      {pantone && <span className="block text-xs text-white/65">{pantone}</span>}
    </button>
  );
}
