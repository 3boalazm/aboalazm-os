/**
 * BOOT — the OS boots once per session: a counter runs 0 → 100, then the
 * black screen opens through a growing circle onto the page.
 * Pure CSS (works without JS, never blocks input: pointer-events none).
 * The inline script decides whether this session has booted already, and lets
 * the first wheel / touch / key / click skip the wait instead of making anyone
 * sit through the intro.
 */
const SCRIPT = `(function(){try{var h=document.documentElement,k='os:booted';if(sessionStorage.getItem(k)){h.setAttribute('data-booted','1');return}sessionStorage.setItem(k,'1');var done=false,ev=['wheel','touchstart','keydown','pointerdown'];function end(){if(done)return;done=true;h.setAttribute('data-booted','1')}function skip(){if(done)return;h.setAttribute('data-skip','1');setTimeout(end,320)}for(var i=0;i<ev.length;i++){addEventListener(ev[i],skip,{passive:true,once:true})}setTimeout(end,2150)}catch(e){}})();`;

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
