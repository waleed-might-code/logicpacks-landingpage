import { useEffect, useRef } from 'react';

/**
 * Thin gradient reading-progress bar pinned to the top of the viewport.
 * Purely presentational; writes a CSS custom property to avoid re-renders.
 */
export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const el = ref.current;
      if (el) {
        el.style.setProperty('--lp-scroll', ratio.toFixed(4));
        el.style.opacity = ratio > 0.005 ? '1' : '0';
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="lp-progress" style={{ opacity: 0 }} aria-hidden="true" />;
}
