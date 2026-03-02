import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import HeroScene from '../components/HeroScene';
import Home from './Home';
import HomeFounder from './HomeFounder';
import HomePakistan from './HomePakistan';
import HomeMarketplace from './HomeMarketplace';

/* ──────────────────────────────────────────────────────────
   HOME ROUTER
   
   When no ?view= param → show a chooser screen asking
   the visitor who they are, then route to the right page.
   
   ?view=marketplace → buyer / marketplace
   ?view=founder     → founder / VC
   ?view=developer   → developer / technical
   ?view=pakistan     → pakistan native (hidden from chooser)
   ────────────────────────────────────────────────────────── */

const PERSONAS = [
  {
    id: 'marketplace',
    icon: 'solar:bag-heart-linear',
    title: 'I want to add features',
    subtitle: 'Business owner, operator, agency',
    desc: 'Browse and install ready-made features — payments, AI, dashboards, login — into your app with one click. No coding.',
    cta: 'Browse Marketplace',
  },
  {
    id: 'founder',
    icon: 'solar:rocket-2-linear',
    title: 'I want to build a product',
    subtitle: 'Founder, startup, investor',
    desc: 'Ship faster with reusable building blocks. Cut dev costs, reduce time-to-market, and build apps that stay working.',
    cta: 'See the Vision',
  },
  {
    id: 'developer',
    icon: 'solar:code-square-linear',
    title: 'I want to build packs',
    subtitle: 'Developer, engineer, creator',
    desc: 'Create reusable Logic Packs with tests, versioning, and self-healing. Build once, compose everywhere.',
    cta: 'Explore Platform',
  },
];

function HomeChooser() {
  const [, setSearchParams] = useSearchParams();
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo('.chooser-reveal',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out' }
      );
      tl.fromTo('.chooser-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power4.out' },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChoose = (id) => {
    setSearchParams({ view: id });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden pt-14">
      {/* 3D Sphere background — centered for chooser */}
      <div className="absolute inset-0 z-0">
        <HeroScene centered />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-[calc(100vh-56px)] pointer-events-none">
        <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-12 py-16 md:py-20">
          {/* Header */}
          <div className="text-center max-w-2xl mb-14">
            <div className="overflow-hidden">
              <div className="chooser-reveal flex items-center justify-center gap-2.5 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                <p className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-medium font-mono">Logic Packs</p>
              </div>
            </div>
            <div className="overflow-hidden">
              <h1 className="chooser-reveal text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-white mb-4">
                What brings you here?
              </h1>
            </div>
            <div className="overflow-hidden">
              <p className="chooser-reveal text-base md:text-lg text-neutral-500 leading-relaxed">
                Choose your path and we&apos;ll show you what matters most.
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-lg overflow-hidden max-w-4xl w-full pointer-events-auto">
            {PERSONAS.map((persona) => (
              <button
                key={persona.id}
                onClick={() => handleChoose(persona.id)}
                className="chooser-card group bg-[#0a0a0a] hover:bg-white/[0.03] transition-all text-left p-8 md:p-10 flex flex-col cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-white/[0.03] border border-white/[0.06] group-hover:border-green-500/20 group-hover:bg-green-500/[0.06] flex items-center justify-center mb-6 transition-all">
                  <Icon icon={persona.icon} width={24} className="text-neutral-400 group-hover:text-green-500 transition-colors" />
                </div>

                <h3 className="text-lg text-white font-medium tracking-tight mb-1">{persona.title}</h3>
                <p className="text-xs text-neutral-600 font-mono mb-4">{persona.subtitle}</p>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6 flex-1">{persona.desc}</p>

                <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 group-hover:text-green-500 transition-colors mt-auto pt-4 border-t border-white/[0.04]">
                  {persona.cta}
                  <Icon icon="solar:arrow-right-linear" width={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Skip text */}
          <div className="overflow-hidden mt-8">
            <p className="chooser-reveal text-neutral-700 text-xs font-mono pointer-events-auto">
              Or just scroll down — we&apos;ll start with the marketplace.
            </p>
          </div>
        </main>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-[5] pointer-events-none" />
    </div>
  );
}

export default function HomeRouter() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');

  // If a specific view is requested, show that page
  if (view === 'developer') return <Home />;
  if (view === 'founder') return <HomeFounder />;
  if (view === 'pakistan') return <HomePakistan />;
  if (view === 'marketplace') return <HomeMarketplace />;

  // No view param → show the chooser
  return <HomeChooser />;
}
