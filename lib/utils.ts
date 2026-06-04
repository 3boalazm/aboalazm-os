import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Token-aware class merger — the only way classes are composed. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
