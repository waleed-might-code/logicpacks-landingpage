import { lazy, Suspense } from 'react';

// The real Three.js scene pulls in ~120 kB (gzip) of `three` + postprocessing.
// Loading it lazily keeps that weight off the home page's critical path, so the
// hero copy and CTA paint immediately while the WebGL canvas streams in behind
// a matching dark placeholder. Drop-in replacement for the old HeroScene import.
const HeroScene = lazy(() => import('./HeroScene'));

export default function HeroCanvas(props) {
  return (
    <Suspense fallback={<div aria-hidden="true" className="w-full h-full bg-[#0a0a0a]" />}>
      <HeroScene {...props} />
    </Suspense>
  );
}
