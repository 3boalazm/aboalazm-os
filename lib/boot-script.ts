/**
 * Runs before hydration:
 *  · appearance — pin the public site to its dark-only design tokens;
 *  · install prompt — Chrome/Edge fire `beforeinstallprompt` once, often
 *    before React has mounted the install button. Stash it on window so the
 *    button can trigger the native install dialog directly instead of falling
 *    back to manual "Add to Home Screen" instructions.
 */
export const BOOT_SCRIPT = `try{document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";localStorage.setItem("theme","dark")}catch(e){}try{window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__pwaInstallPrompt=e;window.dispatchEvent(new Event("pwa:installable"))})}catch(e){}`;
