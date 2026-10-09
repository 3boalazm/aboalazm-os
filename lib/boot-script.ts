/**
 * Pre-paint boot script — inlined in <head> of every root layout that owns a
 * <html> (the (site) layout and app/global-not-found.tsx).
 *
 * Restores the two returning-visitor preferences that live only in
 * localStorage, before first paint and before hydration:
 *   · theme → data-theme="light" (dark is the default and needs no attribute)
 *   · lang  → lang="ar" dir="rtl" (English/LTR is the default SSR emits)
 *
 * It only sets <html> attributes; the copy still swaps to Arabic at
 * hydration because the server cannot know the language. ThemeProvider and
 * LangProvider own the reactive half and never write their defaults back
 * before their own restore has run. Static string, no user input.
 */
export const BOOT_SCRIPT = `try{var d=document.documentElement;if(localStorage.getItem("theme")==="light")d.setAttribute("data-theme","light");if(localStorage.getItem("lang")==="ar"){d.lang="ar";d.dir="rtl"}}catch(e){}`;
