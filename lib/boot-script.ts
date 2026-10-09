/**
 * Pre-paint boot script — inlined in <head> by the two root layouts that
 * serve visitor pages: app/(site)/layout.tsx and app/global-not-found.tsx.
 * (The (print) and (payload) root layouts deliberately do not use it.)
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
