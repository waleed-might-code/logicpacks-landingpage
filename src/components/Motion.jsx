import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from '../lib/motion';

// Fade-up on enter, staggered with `delay` (ms). Fully visible with reduced motion.
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      data-in={inView ? 'true' : 'false'}
      className={`lp-reveal ${className}`}
      style={{ '--d': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// A looping black and white motion background (public/bg/<name>.{webm,mp4,jpg}),
// from our NovaMotion Studio library. It loads and plays only while on screen;
// reduced motion keeps the poster frame. The parent needs `relative isolate`.
export function MotionBg({ name, shade = 'bg-black/60', className = '' }) {
  const [ref, inView] = useInView({ once: false, rootMargin: '200px 0px' });
  const video = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView && !reduced) v.play?.()?.catch?.(() => {});
    else v.pause?.();
  }, [inView, reduced]);
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <video
        ref={video}
        data-testid="motion-bg"
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        poster={`/bg/${name}.jpg`}
      >
        <source src={`/bg/${name}.webm`} type="video/webm" />
        <source src={`/bg/${name}.mp4`} type="video/mp4" />
      </video>
      <div className={`absolute inset-0 ${shade}`} />
    </div>
  );
}
