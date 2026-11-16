/**
 * BOOT — the OS boots once per session: a counter runs 0 → 100, then the
 * black screen opens through a growing circle onto the page.
 * Pure CSS (works without JS, never blocks input: pointer-events none).
 * The inline script only decides whether this session has booted already.
 */
const SCRIPT = `(function(){try{var h=document.documentElement,k='os:booted';if(sessionStorage.getItem(k)){h.setAttribute('data-booted','1')}else{sessionStorage.setItem(k,'1');setTimeout(function(){h.setAttribute('data-booted','1')},2600)}}catch(e){}})();`;

export function Boot() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div className="x-boot" aria-hidden>
        <p className="x-mono x-boot__top">Aboalazm OS · boot</p>
        <p className="x-boot__n" />
        <div className="x-boot__bar"><i /></div>
        <p className="x-mono x-boot__bot">brand · digital · systems</p>
      </div>
    </>
  );
}
