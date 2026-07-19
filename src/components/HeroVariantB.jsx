import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import HeroScene from './HeroScene';

/* ──────────────────────────────────────────────────────────
   HERO — VARIANT B  (A/B test)

   Reached via ?variant=b on the marketplace landing page.
   Deliberately distinct from the default (variant A) hero so
   the two can be compared:

     • Headline  — outcome/ROI framing instead of "Add any feature."
     • Layout    — centered, search-first "command palette" mock
                   instead of the left-aligned copy block.
     • CTA       — "Start free — install a pack" (primary) +
                   "Talk to us" instead of "Browse / How it works".

   Self-contained: renders its own HeroScene (centered) and its
   own reveal timeline (.hb-reveal) so it never collides with the
   default hero's .mp-hero-reveal selectors.
   ────────────────────────────────────────────────────────── */

const CHIPS = ['payments', 'ai chat', 'auth + 2fa', 'dashboards', 'try-on', 'email'];

export default function HeroVariantB({ openBeta }) {
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.hb-reveal',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: 'power4.out' }
    );
    return () => {
      tl.kill();
      gsap.set('.hb-reveal', { clearProps: 'all' });
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden pt-14" data-variant="b">
      {/* 3D sphere — centered for the B layout */}
      <div className="absolute inset-0 z-0">
        <HeroScene centered />
      </div>

      <div className="relative z-10 flex flex-col min-h-[calc(100vh-56px)] pointer-events-none">
        <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-12 py-16 text-center">
          {/* Badge */}
          <div className="overflow-hidden">
            <div className="hb-reveal inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 mb-8">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-[11px] font-mono tracking-wide text-neutral-400">180+ packs · avg. live in 2 min</span>
            </div>
          </div>

          {/* Headline — distinct from variant A */}
          <div className="max-w-3xl">
            <div className="overflow-hidden">
              <h1 className="hb-reveal text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] text-white">
                Ship the feature.
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="hb-reveal text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] text-neutral-400 italic">
                Skip the build.
              </h1>
            </div>
          </div>

          {/* Sub-copy */}
          <div className="overflow-hidden max-w-xl mt-7">
            <p className="hb-reveal text-sm md:text-base text-neutral-500 leading-relaxed">
              Stop paying to rebuild the same payments, login and AI plumbing.
              Install a verified pack and the feature is live, tested, and yours — today.
            </p>
          </div>

          {/* Search-first "command palette" mock — the layout differentiator */}
          <div className="overflow-hidden w-full max-w-xl mt-9">
            <button
              onClick={openBeta}
              className="hb-reveal pointer-events-auto group w-full flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0d0d0d]/80 backdrop-blur px-4 py-3.5 text-left hover:border-green-500/30 hover:bg-[#0d0d0d] transition-colors"
            >
              <Icon icon="solar:magnifer-linear" width={18} className="text-neutral-500 group-hover:text-green-500 transition-colors" />
              <span className="text-sm text-neutral-500">Search 180+ packs — try “payments”…</span>
              <kbd className="ml-auto text-[10px] font-mono text-neutral-600 border border-white/[0.08] rounded px-1.5 py-0.5">/</kbd>
            </button>
          </div>

          {/* Suggestion chips */}
          <div className="overflow-hidden mt-4">
            <div className="hb-reveal flex flex-wrap justify-center gap-2 pointer-events-auto">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={openBeta}
                  className="text-[11px] font-mono text-neutral-500 border border-white/[0.06] rounded-full px-3 py-1 hover:text-green-500 hover:border-green-500/25 transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs — distinct labels from variant A */}
          <div className="overflow-hidden mt-9">
            <div className="hb-reveal flex flex-wrap justify-center gap-3 pointer-events-auto">
              <button
                onClick={openBeta}
                className="inline-flex items-center gap-2 bg-green-500 text-black font-semibold rounded-md px-7 py-3 text-sm hover:bg-green-400 transition-colors"
              >
                Start free — install a pack <Icon icon="solar:arrow-right-linear" width={16} />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 border border-white/15 text-white font-medium rounded-md px-7 py-3 text-sm hover:bg-white/5 transition-colors"
              >
                Talk to us <Icon icon="solar:chat-round-line-linear" width={16} className="text-neutral-400" />
              </a>
            </div>
          </div>

          {/* Trust row */}
          <div className="overflow-hidden mt-8">
            <div className="hb-reveal flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-600">
              <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500/70" width={14} /> No card to start</span>
              <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500/70" width={14} /> No coding needed</span>
              <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500/70" width={14} /> Cancel anytime</span>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-[5] pointer-events-none" />
    </div>
  );
}
