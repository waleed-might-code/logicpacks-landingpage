import { useEffect } from 'react';

/**
 * Fixed, non-interactive filmic layer (fine grain over a soft vignette) plus a
 * single delegated pointer-tracker that powers the cursor-follow spotlight on
 * any element opted in with the `lp-spotlight` class. Mounted once, globally —
 * no per-card listeners, no page markup changes required.
 */
export default function AmbientTexture() {
  useEffect(() => {
    let raf = 0;
    let pending = null;
    const apply = () => {
      raf = 0;
      const { target, x, y } = pending || {};
      if (!target) return;
      const el = target.closest && target.closest('.lp-spotlight');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--lp-mx', `${x - r.left}px`);
      el.style.setProperty('--lp-my', `${y - r.top}px`);
    };
    const onMove = (e) => {
      pending = { target: e.target, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="lp-vignette lp-fade-in" aria-hidden="true" />
      <div className="lp-grain lp-fade-in" aria-hidden="true" />
    </>
  );
}
