import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

const R = 21;                 // ring radius (px)
const CIRC = 2 * Math.PI * R; // circumference

/**
 * Floating "back to top" control that fades in past the fold and renders a
 * live scroll-progress ring around itself. Progress is pushed through a CSS
 * variable so the SVG stroke updates without React re-renders.
 */
export default function BackToTop() {
  const btnRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (btnRef.current) btnRef.current.style.setProperty('--lp-scroll', ratio.toFixed(4));
      setVisible(window.scrollY > 600);
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

  return (
    <button
      ref={btnRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`lp-totop${visible ? ' is-visible' : ''}`}
      style={{ ['--lp-circ']: CIRC }}
      aria-label="Back to top"
      title="Back to top"
    >
      <svg className="lp-ring" width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="lp-ring-track" cx="22" cy="22" r={R} fill="none" strokeWidth="1.5" />
        <circle className="lp-ring-fill" cx="22" cy="22" r={R} fill="none" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <Icon icon="solar:alt-arrow-up-linear" width={18} className="lp-totop-arrow" />
    </button>
  );
}
