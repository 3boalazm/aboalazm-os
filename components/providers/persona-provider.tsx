"use client";

/**
 * PERSONA PROVIDER — the "Choose Your Path" state.
 *
 * Three states: `null` (default/general — speaks to everyone), `"founder"`
 * (business outcomes: ROI, speed, go-to-market), `"technical"` (systems
 * language: architecture, tokens, governance, handoff).
 *
 * Scope by design (per product decision): only Home and /start read this
 * and adapt copy/emphasis. Every other page ignores it and stays general —
 * this keeps the surface area small and the content maintainable.
 *
 * Mechanism: a non-blocking toggle (not a modal), visible in the Nav and
 * as an inviting picker band on Home. Choice persists in localStorage and
 * survives navigation between pages, mirroring the LangProvider pattern
 * so hydration stays SSR-safe (default state on first render, restored
 * from storage in an effect after mount).
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Persona = "founder" | "technical" | null;

const STORAGE_KEY = "persona";

const PersonaContext = createContext<{
  persona: Persona;
  setPersona: (p: Persona) => void;
}>({
  persona: null,
  setPersona: () => {},
});

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>(null);

  /* Restore persisted choice — client-only, after mount (SSR-safe) */
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "founder" || saved === "technical") setPersonaState(saved);
  }, []);

  const setPersona = (p: Persona) => {
    setPersonaState(p);
    if (p === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, p);
  };

  return (
    <PersonaContext.Provider value={{ persona, setPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}

/**
 * pickFor — pick the right variant of a { founder, technical, base } triple.
 * Falls back to `base` when persona is null (default/general) or when a
 * persona-specific variant isn't provided for that field.
 */
export function pickFor<T>(
  persona: Persona,
  variants: { base: T; founder?: T; technical?: T },
): T {
  if (persona === "founder" && variants.founder !== undefined) return variants.founder;
  if (persona === "technical" && variants.technical !== undefined) return variants.technical;
  return variants.base;
}
