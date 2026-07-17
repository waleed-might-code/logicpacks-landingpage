import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function NotFound() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-56px)] w-full flex items-center justify-center overflow-hidden px-6 py-24">
      {/* Ambient glow + grid, same visual grammar as the access gate */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[40vw] h-[70vw] md:h-[40vw] bg-green-500/[0.04] blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
          <p className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-mono">Error 404</p>
        </div>

        <h1 className="text-6xl md:text-8xl font-semibold tracking-tight text-white leading-none mb-6">
          404
        </h1>

        <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-2">
          This pack didn&apos;t compile.
        </p>
        <p className="text-neutral-600 text-sm font-mono mb-10">
          The route you asked for isn&apos;t in the registry.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 text-black text-sm font-medium hover:bg-green-400 active:scale-[0.98] transition-all"
          >
            <Icon icon="solar:home-2-linear" width={16} />
            Back to home
          </Link>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-neutral-300 text-sm font-medium hover:text-white hover:border-white/15 hover:bg-white/[0.04] transition-all"
          >
            <Icon icon="solar:widget-5-linear" width={16} />
            Browse packs
          </Link>
        </div>
      </div>
    </div>
  );
}
