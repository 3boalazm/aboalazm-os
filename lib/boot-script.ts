/** Theme is the only browser-only preference; language is rendered from the URL. */
export const BOOT_SCRIPT = `try{if(localStorage.getItem("theme")==="light")document.documentElement.setAttribute("data-theme","light")}catch(e){}`;
