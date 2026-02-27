import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import HeroScene from '../components/HeroScene';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

const TECH_STACK = [
  { icon: 'simple-icons:react', label: 'React' },
  { icon: 'simple-icons:python', label: 'Python' },
  { icon: 'simple-icons:fastapi', label: 'FastAPI' },
  { icon: 'simple-icons:typescript', label: 'TypeScript' },
  { icon: 'simple-icons:puppeteer', label: 'Puppeteer' },
  { icon: 'simple-icons:selenium', label: 'Selenium' },
  { icon: 'simple-icons:docker', label: 'Docker' },
  { icon: 'simple-icons:tailwindcss', label: 'Tailwind' },
];

export default function Home() {
  const [, setSearchParams] = useSearchParams();
  const { openBeta } = useBeta();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Use fromTo so both start AND end states are explicit — avoids elements
    // being stuck invisible if the timeline is interrupted
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo('.hero-reveal',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power4.out' }
    ).fromTo('.nav-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' },
      '-=0.8'
    );

    return () => {
      tl.kill();
      // Reset inline styles so elements are visible if component re-mounts
      gsap.set('.hero-reveal', { clearProps: 'all' });
      gsap.set('.nav-item', { clearProps: 'all' });
    };
  }, []);

  return (
    <>
      {/* ═══ VIEW TOGGLE (floating pill) ═══ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[#141414]/90 backdrop-blur-xl border border-white/[0.08] rounded-full p-1 shadow-2xl shadow-black/40">
        <button onClick={() => setSearchParams({ view: 'marketplace' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all text-neutral-400 hover:text-white">Marketplace</button>
        <button onClick={() => setSearchParams({ view: 'founder' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all text-neutral-400 hover:text-white">Founders</button>
        <button onClick={() => setSearchParams({ view: 'developer' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all bg-white text-black">Developers</button>
      </div>

      {/* ═══ HERO ═══ */}
      <div className="relative h-screen w-full overflow-hidden pt-14">
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          <main className="flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-24">
            <div className="max-w-3xl space-y-7">
              <div className="overflow-hidden">
                <div className="hero-reveal flex items-center gap-2.5">
                  <span id="status-light" className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)] transition-colors" />
                  <p id="status-text" className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-medium font-mono transition-colors">Platform Status: Operational</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="overflow-hidden">
                  <h1 className="hero-reveal text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] text-white glitch-target">Build Once,</h1>
                </div>
                <div className="overflow-hidden">
                  <h1 className="hero-reveal text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] text-neutral-400 italic glitch-target">Reuse Everywhere.</h1>
                </div>
              </div>
              <div className="overflow-hidden max-w-lg">
                <p className="hero-reveal text-sm md:text-base text-neutral-500 leading-relaxed">
                  The operating system for reusable software. Create verified packs for backend, UI, automation, and creative assets — then compose them into production apps that self-heal over time.
                  <span className="text-green-500/60 text-xs block mt-3 font-mono uppercase tracking-widest">&gt; Scroll to explore · Hover to attract · Click to reassemble</span>
                </p>
              </div>
              <div className="overflow-hidden pt-4">
                <div className="hero-reveal flex flex-wrap pointer-events-auto gap-3">
                  <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-black font-medium rounded-md px-7 py-3 text-sm hover:bg-neutral-200 transition-colors">
                    Get Started <Icon icon="solar:arrow-right-linear" width={16} />
                  </button>
                  <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/15 text-white font-medium rounded-md px-7 py-3 text-sm hover:bg-white/5 transition-colors">
                    Documentation <Icon icon="solar:document-text-linear" width={16} className="text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          </main>
          <footer className="pointer-events-auto nav-item flex justify-between items-end w-full px-6 pb-6 opacity-0">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-neutral-700 font-medium">Vector</span>
              <span id="coords" className="text-xs font-mono text-green-500/70">0.50.0.50.00</span>
            </div>
            <div className="hidden md:flex gap-4">
              <button onClick={openBeta}><Icon icon="simple-icons:github" className="text-neutral-600 hover:text-white transition-colors text-lg" /></button>
              <button onClick={openBeta}><Icon icon="simple-icons:discord" className="text-neutral-600 hover:text-[#5865F2] transition-colors text-lg" /></button>
              <button onClick={openBeta}><Icon icon="simple-icons:x" className="text-neutral-600 hover:text-white transition-colors text-lg" /></button>
            </div>
          </footer>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-[5] pointer-events-none" />
      </div>

      {/* ═══ MARQUEE ═══ */}
      <section className="overflow-hidden border-t border-white/[0.06] relative">
        <div className="flex overflow-hidden py-8 relative items-center">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-16 animate-marquee whitespace-nowrap min-w-full">
            {[0, 1].map((g) => (
              <div key={g} className="flex items-center gap-16 shrink-0">
                {TECH_STACK.map((t) => (
                  <div key={`${g}-${t.label}`} className="flex items-center gap-2.5 opacity-30 hover:opacity-80 transition-opacity">
                    <Icon icon={t.icon} width={22} />
                    <span className="text-sm font-medium text-white tracking-tight">{t.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-1">/// About</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Logic Packs</h2></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 p-8 md:p-14 flex flex-col justify-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.05] mb-8">
                A browser-based, real-time collaborative AI IDE that produces reusable <span className="text-neutral-500 italic">Packs</span> — not just code.
              </h2>
            </ScrollReveal>
            <div className="flex flex-col md:flex-row gap-10 md:items-end justify-between">
              <ScrollReveal><p className="text-base text-neutral-500 leading-relaxed max-w-xl">Apps are built by assembling and composing packs inside one workspace. Every pack ships with tests, telemetry, versioning, and self-healing — so software gets more reliable over time, not more fragile.</p></ScrollReveal>
              <ScrollReveal>
                <a href="#modes" className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all shrink-0">
                  Explore Platform <Icon icon="solar:arrow-right-up-linear" width={16} className="text-neutral-500" />
                </a>
              </ScrollReveal>
            </div>
          </div>
          {/* Stats */}
          {[
            { val: '5', desc: 'Pack types: Logic, UI, Automation, Creative, Provider', first: true },
            { val: '5', desc: 'Strategic surfaces: Build, Design, Automate, Compose, Discover' },
            { val: '8+', desc: 'Real engineering problems solved, from rebuild hell to integration chaos' },
            { val: '∞', desc: 'Self-healing loops — packs improve automatically over time', green: true },
          ].map((s, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className={`md:col-span-1 p-8 md:p-10 flex flex-col justify-end ${s.first ? 'border-t md:border-t-0' : 'border-t'} border-white/[0.06] min-h-[220px] transition-colors ${s.green ? 'bg-green-500/[0.04] hover:bg-green-500/[0.06]' : 'hover:bg-white/[0.02]'}`}>
                <div className={`text-5xl md:text-6xl font-medium tracking-tight mb-3 ${s.green ? 'text-green-500' : 'text-white'}`}>{s.val}</div>
                <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ 4 MODES ═══ */}
      <section id="modes" className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Platform</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Four Modes</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-6">One workspace, four surfaces. Each mode produces a different pack type, all composable together.</p></ScrollReveal>
            </div>
            <ScrollReveal>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 px-5 py-2.5 rounded-md text-xs font-medium hover:bg-white/5 transition-all w-max">
                View Docs <Icon icon="solar:arrow-right-up-linear" width={14} className="text-neutral-500" />
              </button>
            </ScrollReveal>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y md:divide-x divide-white/[0.06]">
            {/* UI Mode */}
            <ScrollReveal>
              <div className="group flex flex-col hover:bg-white/[0.015] transition-colors p-8">
                <div className="aspect-video overflow-hidden flex flex-col select-none bg-neutral-900/30 w-full border border-white/[0.06] rounded-lg mb-7 p-5 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="flex items-center gap-1.5 mb-4 relative z-10 animate-wireframe" style={{ animationDelay: '0ms' }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-white/15" /><div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>
                  <div className="flex gap-4 w-full h-full min-h-0 relative z-10">
                    <div className="w-[28%] h-full border border-white/[0.04] p-3 flex flex-col animate-wireframe" style={{ animationDelay: '100ms' }}>
                      <div className="w-1/2 h-1.5 bg-white/10 mb-2 animate-wireframe" style={{ animationDelay: '200ms' }} />
                      <div className="w-3/4 h-1.5 bg-white/10 opacity-40 mb-5 animate-wireframe" style={{ animationDelay: '300ms' }} />
                      <div className="w-1/3 h-1 bg-green-500/30 mb-2 animate-wireframe" style={{ animationDelay: '400ms' }} />
                      <div className="w-2/3 h-1 bg-white/10 opacity-30 animate-wireframe" style={{ animationDelay: '500ms' }} />
                    </div>
                    <div className="flex-1 h-full flex flex-col gap-3">
                      <div className="flex-1 bg-white/[0.02] border border-white/[0.04] p-4 flex items-center gap-4 animate-wireframe" style={{ animationDelay: '200ms' }}>
                        <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 shrink-0 rounded animate-wireframe" style={{ animationDelay: '300ms' }} />
                        <div className="flex flex-col gap-2 w-full"><div className="w-2/5 h-2 bg-white/15 animate-wireframe" style={{ animationDelay: '400ms' }} /><div className="w-full h-2 bg-white/[0.08] animate-wireframe" style={{ animationDelay: '500ms' }} /></div>
                      </div>
                      <div className="h-[38%] flex gap-3">
                        <div className="flex-1 bg-white/[0.02] border border-white/[0.04] p-3 flex flex-col justify-end gap-2 animate-wireframe" style={{ animationDelay: '400ms' }}><div className="w-1/2 h-1.5 bg-white/15" /><div className="w-3/4 h-1.5 bg-white/[0.08]" /></div>
                        <div className="flex-1 bg-white/[0.02] border border-white/[0.04] p-3 flex flex-col justify-end gap-2 animate-wireframe" style={{ animationDelay: '500ms' }}><div className="w-2/3 h-1.5 bg-white/15" /><div className="w-1/3 h-1.5 bg-white/[0.08]" /></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="font-mono text-green-500 text-xs block mb-2">01</span>
                <h3 className="text-lg text-white font-medium tracking-tight mb-2">UI Mode</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4">Generate pack-aware React screens. Forms, tables, and routes bind directly to pack schemas and endpoints.</p>
                <div className="mt-auto pt-4 border-t border-white/[0.04]">
                  <span className="text-xs text-neutral-600 group-hover:text-neutral-300 transition-colors flex items-center gap-1.5">React + TypeScript<Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-0.5 transition-transform" /></span>
                </div>
              </div>
            </ScrollReveal>

            {/* Logic Mode */}
            <ScrollReveal delay={80}>
              <div className="group flex flex-col hover:bg-white/[0.015] transition-colors p-8">
                <div className="aspect-video overflow-hidden flex bg-neutral-900/30 w-full border border-white/[0.06] rounded-lg mb-7 relative items-center justify-center">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2/3 h-1/3 bg-green-600/10 blur-[60px] rounded-full pointer-events-none" />
                  <div className="relative w-[88%] h-auto min-h-[70%] bg-[#0d0d0d] rounded-lg border border-white/[0.06] overflow-hidden flex flex-col font-mono text-[10px] sm:text-xs">
                    <div className="h-8 border-b border-white/[0.04] flex items-center px-3 gap-1.5 bg-white/[0.02]">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" /><div className="w-2.5 h-2.5 rounded-full bg-neutral-800" /><div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                    </div>
                    <div className="flex-1 p-3 md:p-4 relative overflow-hidden">
                      <div className="flex gap-3 md:gap-5 relative z-10">
                        <div className="flex flex-col text-neutral-800 text-right select-none space-y-1"><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div></div>
                        <div className="flex flex-col text-neutral-500 font-mono w-full space-y-1">
                          <div className="-mx-1.5 flex h-4 px-1.5 relative items-center"><div className="absolute inset-0 bg-green-500/5 rounded border border-green-500/10 w-fit pr-8" /><div className="relative z-10 w-fit typing-line line-1"><span className="text-green-500">from</span> <span className="text-white">fastapi</span> <span className="text-green-500">import</span> <span className="text-white">FastAPI</span></div></div>
                          <div className="w-fit typing-line line-2 h-4"><span className="text-green-500">from</span> <span className="text-neutral-300">packs</span> <span className="text-green-500">import</span> <span className="text-white">AuthPack</span></div>
                          <div className="h-4" />
                          <div className="w-fit typing-line line-3 h-4"><span className="text-neutral-300">app</span> <span className="text-neutral-600">=</span> <span className="text-white">FastAPI</span><span className="text-neutral-600">()</span></div>
                          <div className="w-fit typing-line line-4 h-4"><span className="text-neutral-300">auth</span> <span className="text-neutral-600">=</span> <span className="text-white">AuthPack</span><span className="text-neutral-600">.</span><span className="text-white">install</span><span className="text-neutral-600">(</span><span className="text-neutral-300">app</span><span className="text-neutral-600">)</span></div>
                          <div className="pl-0 w-fit typing-line line-5 h-4"><span className="text-neutral-300">auth</span><span className="text-neutral-600">.</span><span className="text-white">verify</span><span className="text-neutral-600">()</span> <span className="text-green-700"># ✓ tests pass</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="font-mono text-green-500 text-xs block mb-2">02</span>
                <h3 className="text-lg text-white font-medium tracking-tight mb-2">Logic Mode</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4">Build reusable backend features as Logic Packs. Endpoints, schemas, auth, tests, and versioning — all in one artifact.</p>
                <div className="mt-auto pt-4 border-t border-white/[0.04]">
                  <span className="text-xs text-neutral-600 group-hover:text-neutral-300 transition-colors flex items-center gap-1.5">Python + FastAPI<Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-0.5 transition-transform" /></span>
                </div>
              </div>
            </ScrollReveal>

            {/* Notebook Mode */}
            <ScrollReveal delay={160}>
              <div className="group flex flex-col hover:bg-white/[0.015] transition-colors p-8">
                <div className="aspect-video overflow-hidden flex flex-col select-none bg-neutral-900/30 w-full border border-white/[0.06] rounded-lg mb-7 relative items-center justify-center">
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_55%)]" />
                    <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
                  </div>
                  <div className="relative z-10 w-[85%] flex flex-col gap-2.5">
                    {[{ n: '[1]', c: 'text-green-500/60', bg: 'bg-white/[0.03] border-white/[0.06]', d: '0ms' }, { n: '[2]', c: 'text-green-500/60', bg: 'bg-green-500/[0.04] border-green-500/10', d: '200ms' }, { n: 'out', c: 'text-neutral-700', bg: 'bg-white/[0.02] border-white/[0.04]', d: '400ms' }].map((cell) => (
                      <div key={cell.n} className="flex items-start gap-2 animate-wireframe" style={{ animationDelay: cell.d }}>
                        <div className={`text-[9px] font-mono ${cell.c} mt-1 shrink-0`}>{cell.n}</div>
                        <div className={`flex-1 ${cell.bg} border rounded p-2.5`}>
                          <div className={`w-3/4 h-1.5 ${cell.n === '[2]' ? 'bg-green-500/15' : 'bg-white/10'} mb-1.5`} />
                          <div className={`w-1/2 h-1.5 ${cell.n === '[2]' ? 'bg-green-500/10' : 'bg-white/[0.08]'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-green-500 text-xs block mb-2">03</span>
                <h3 className="text-lg text-white font-medium tracking-tight mb-2">Notebook Mode</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4">The lab for experiments and integrations. Prototype actions, then promote working notebooks into Automation Packs or Logic Pack actions.</p>
                <div className="mt-auto pt-4 border-t border-white/[0.04]">
                  <span className="text-xs text-neutral-600 group-hover:text-neutral-300 transition-colors flex items-center gap-1.5">Jupyter-style cells<Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-0.5 transition-transform" /></span>
                </div>
              </div>
            </ScrollReveal>

            {/* Canvas Mode */}
            <ScrollReveal delay={240}>
              <div className="group flex flex-col hover:bg-white/[0.015] transition-colors p-8">
                <div className="aspect-video overflow-hidden flex bg-neutral-900/30 w-full border border-white/[0.06] rounded-lg mb-7 relative items-center justify-center">
                  <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 bg-green-500/[0.06] blur-[50px] rounded-full" />
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /><span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500">Canvas</span></div>
                  <svg viewBox="0 0 200 160" className="w-[60%] max-w-[400px] h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]" aria-hidden="true">
                    <defs>
                      <linearGradient id="ct" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" /><stop offset="100%" stopColor="#d4d4d4" stopOpacity="0.9" /></linearGradient>
                      <linearGradient id="cl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a3a3a3" stopOpacity="0.9" /><stop offset="100%" stopColor="#636363" stopOpacity="0.9" /></linearGradient>
                      <linearGradient id="cr" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#737373" stopOpacity="0.9" /><stop offset="100%" stopColor="#404040" stopOpacity="0.9" /></linearGradient>
                      <radialGradient id="sg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.12" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" /></radialGradient>
                    </defs>
                    <g transform="translate(100,108)"><g className="anim-cube-b opacity-0"><path d="M0,-14 L24,0 L0,14 L-24,0 Z" fill="rgba(100,100,100,0.3)" /><path d="M-24,0 L0,14 V40 L-24,26 Z" fill="rgba(20,20,20,0.85)" /><path d="M0,14 L24,0 V26 L0,40 Z" fill="rgba(10,10,10,0.9)" /></g></g>
                    <g transform="translate(56,82)"><g className="anim-cube-l opacity-0"><path d="M0,-14 L24,0 L0,14 L-24,0 Z" fill="rgba(100,100,100,0.28)" /><path d="M-24,0 L0,14 V40 L-24,26 Z" fill="rgba(15,15,15,0.85)" /><path d="M0,14 L24,0 V26 L0,40 Z" fill="rgba(8,8,8,0.9)" /></g></g>
                    <g transform="translate(144,82)"><g className="anim-cube-r opacity-0"><path d="M0,-14 L24,0 L0,14 L-24,0 Z" fill="rgba(100,100,100,0.28)" /><path d="M-24,0 L0,14 V40 L-24,26 Z" fill="rgba(15,15,15,0.85)" /><path d="M0,14 L24,0 V26 L0,40 Z" fill="rgba(8,8,8,0.9)" /></g></g>
                    <g transform="translate(100,56) scale(1.12)"><circle cx="0" cy="18" r="38" fill="url(#sg)" /><path d="M0,-14 L24,0 L0,14 L-24,0 Z" fill="url(#ct)" /><path d="M-24,0 L0,14 V40 L-24,26 Z" fill="url(#cl)" /><path d="M0,14 L24,0 V26 L0,40 Z" fill="url(#cr)" /></g>
                  </svg>
                </div>
                <span className="font-mono text-green-500 text-xs block mb-2">04</span>
                <h3 className="text-lg text-white font-medium tracking-tight mb-2">Canvas Mode</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4">Infinite board for product flows, architecture, and rapid HTML prototyping. Access multi-model image generation and export Creative Packs.</p>
                <div className="mt-auto pt-4 border-t border-white/[0.04]">
                  <span className="text-xs text-neutral-600 group-hover:text-neutral-300 transition-colors flex items-center gap-1.5">Design + Prototype<Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-0.5 transition-transform" /></span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ BANNER ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="py-20 md:py-28 px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[0.95] max-w-5xl">Software that <span className="text-neutral-500 italic">stays working.</span></h2>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ KEY FEATURES ═══ */}
      <section id="features" className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Core</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">What Makes It Different</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">The three pillars that turn Logic Packs from &quot;another AI builder&quot; into a production platform.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col divide-y divide-white/[0.06]">
            {/* Pack Standard */}
            <ScrollReveal>
              <div className="group grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 p-8 md:p-12 hover:bg-white/[0.015] transition-colors">
                <div className="flex flex-col justify-center">
                  <span className="text-green-500 font-mono text-[10px] mb-3">01 — STANDARD</span>
                  <h3 className="text-xl text-white font-medium tracking-tight mb-3">Pack Manifest &amp; Contracts</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">Every pack declares its inputs, outputs, permissions, schemas, tests, and telemetry requirements. This is the spine — if the spec is crisp, reuse is real. If it's vague, it's just templates with marketing.</p>
                </div>
                <div className="bg-neutral-900/30 border border-white/[0.06] rounded-lg p-6 flex flex-col gap-2 font-mono text-xs">
                  <div className="text-neutral-600 mb-1"># pack.manifest.yaml</div>
                  <div><span className="text-green-500">name:</span> <span className="text-white">auth-pack</span></div>
                  <div><span className="text-green-500">version:</span> <span className="text-neutral-300">2.1.0</span></div>
                  <div><span className="text-green-500">type:</span> <span className="text-neutral-300">logic</span></div>
                  <div><span className="text-green-500">runtime:</span> <span className="text-neutral-300">python</span></div>
                  <div><span className="text-green-500">contracts:</span></div>
                  <div className="pl-3"><span className="text-neutral-400">actions:</span> <span className="text-neutral-500">[login, signup, verify]</span></div>
                  <div className="pl-3"><span className="text-neutral-400">scopes:</span> <span className="text-neutral-500">[db.read, db.write]</span></div>
                  <div><span className="text-green-500">tests:</span> <span className="text-neutral-300">pytest</span></div>
                </div>
              </div>
            </ScrollReveal>

            {/* Compose */}
            <ScrollReveal>
              <div className="group grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 p-8 md:p-12 hover:bg-white/[0.015] transition-colors">
                <div className="flex flex-col justify-center">
                  <span className="text-green-500 font-mono text-[10px] mb-3">02 — COMPOSE</span>
                  <h3 className="text-xl text-white font-medium tracking-tight mb-3">Wire Everything Together</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">Compose binds UI to Logic Pack actions, connects packs to each other via events, maps secrets and env vars, and runs end-to-end checks. Apps = composed packs.</p>
                </div>
                <div className="bg-neutral-900/30 border border-white/[0.06] rounded-lg p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-green-500/10 border border-green-500/20 flex items-center justify-center"><Icon icon="solar:widget-linear" className="text-green-500 text-sm" /></div>
                    <span className="text-xs text-white font-medium">UI Pack</span>
                    <div className="flex-1 h-px bg-white/10 mx-2" /><span className="text-[10px] text-green-500 font-mono">bind</span><div className="flex-1 h-px bg-white/10 mx-2" />
                    <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center"><Icon icon="solar:server-linear" className="text-neutral-400 text-sm" /></div>
                    <span className="text-xs text-white font-medium">Logic Pack</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center"><Icon icon="solar:server-linear" className="text-neutral-400 text-sm" /></div>
                    <span className="text-xs text-white font-medium">Auth Pack</span>
                    <div className="flex-1 h-px bg-white/10 mx-2" /><span className="text-[10px] text-green-500 font-mono">event</span><div className="flex-1 h-px bg-white/10 mx-2" />
                    <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center"><Icon icon="solar:letter-linear" className="text-neutral-400 text-sm" /></div>
                    <span className="text-xs text-white font-medium">Email Pack</span>
                  </div>
                  <div className="mt-2 pt-3 border-t border-white/[0.04] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-neutral-500 font-mono">compose.test → all checks passed</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Self-Healing */}
            <ScrollReveal>
              <div className="group grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 p-8 md:p-12 hover:bg-white/[0.015] transition-colors">
                <div className="flex flex-col justify-center">
                  <span className="text-green-500 font-mono text-[10px] mb-3">03 — RELIABILITY</span>
                  <h3 className="text-xl text-white font-medium tracking-tight mb-3">Self-Healing Packs</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">When something breaks, agents inspect logs, propose a patch, rerun tests, and ship a fix — automatically. Packs get more reliable over time, not more fragile.</p>
                </div>
                <div className="bg-neutral-900/30 border border-white/[0.06] rounded-lg p-6 flex flex-col gap-2.5 text-xs font-mono">
                  <div className="flex items-center gap-2"><span className="text-red-400">✕</span><span className="text-neutral-400">test_auth_flow failed</span><span className="text-neutral-700 ml-auto">12:04</span></div>
                  <div className="flex items-center gap-2"><span className="text-yellow-400">⟳</span><span className="text-neutral-400">agent: inspecting logs + traces</span><span className="text-neutral-700 ml-auto">12:04</span></div>
                  <div className="flex items-center gap-2"><span className="text-yellow-400">⟳</span><span className="text-neutral-400">agent: patch proposed → PR #142</span><span className="text-neutral-700 ml-auto">12:05</span></div>
                  <div className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-neutral-400">tests rerun → all passing</span><span className="text-neutral-700 ml-auto">12:05</span></div>
                  <div className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-white">v2.1.1 released (patch)</span><span className="text-neutral-700 ml-auto">12:06</span></div>
                  <div className="mt-2 pt-2 border-t border-white/[0.04] text-neutral-600">MTTR: 2 minutes • automated</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 min-h-[350px] justify-between">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Journey</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">How It Works</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">From idea to deployed app in four steps. The experience should feel like assembling LEGO, not writing boilerplate.</p></ScrollReveal>
            </div>
            <ScrollReveal>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 px-5 py-2.5 rounded-md text-xs font-medium hover:bg-white/5 transition-all w-max mt-8">
                Start Building <Icon icon="solar:arrow-right-up-linear" width={14} className="text-neutral-500" />
              </button>
            </ScrollReveal>
          </div>
          <div className="md:col-span-3 flex flex-col">
            {[
              { icon: 'solar:download-minimalistic-linear', n: '01', title: 'Install Packs', desc: 'Browse the marketplace and install verified packs — auth, payments, notifications, CRUD, scraping — with one click. Each pack ships with tests, scopes, and contracts.' },
              { icon: 'solar:settings-linear', n: '02', title: 'Configure', desc: 'Set environment variables, wire secrets, configure scopes and permissions. The workspace validates everything before you move forward.' },
              { icon: 'solar:link-round-linear', n: '03', title: 'Compose', desc: 'Bind UI to pack actions, connect packs via events, apply auth guards and role-based routes. Run end-to-end checks to validate the whole graph.' },
              { icon: 'solar:rocket-2-linear', n: '04', title: 'Deploy & Publish', desc: 'Tests pass → deploy-ready. Publish your improved packs back to the marketplace so others can install them. Build once, distribute everywhere.' },
            ].map((step, i) => (
              <ScrollReveal key={step.n} delay={i * 60}>
                <div className={`group grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] ${i < 3 ? 'border-b border-white/[0.06]' : ''} hover:bg-white/[0.015] transition-colors`}>
                  <div className="p-6 md:p-8 flex flex-col justify-between border-r border-white/[0.06]">
                    <Icon icon={step.icon} width={20} className="text-neutral-500 group-hover:text-green-500 transition-colors" />
                    <span className="font-mono text-xs text-neutral-700 group-hover:text-green-500/50 mt-4">{step.n}</span>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="text-lg text-white font-medium tracking-tight mb-2">{step.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-lg">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section className="border-t border-white/[0.06] py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <blockquote className="text-2xl md:text-4xl text-neutral-300 font-light leading-snug tracking-tight mb-8">
              &ldquo;In a world where anyone can generate code, the real problem is keeping software <span className="text-white italic">working</span>. Logic Packs solves the gap between code generation and production software.&rdquo;
            </blockquote>
          </ScrollReveal>
          <ScrollReveal><p className="text-sm text-neutral-600 font-mono uppercase tracking-widest">— The Logic Packs Thesis</p></ScrollReveal>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-12 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-4 flex flex-col p-8 md:p-12 justify-between">
            <div className="max-w-sm">
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Pricing</span>
              <ScrollReveal>
                <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[0.95] mb-6">
                  Simple,<br /><span className="text-neutral-500 italic">transparent</span><br />pricing.
                </h2>
              </ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Start free. Scale as you grow. Enterprise when you need governance and SLA.</p></ScrollReveal>
            </div>
            <div className="mt-10 pt-6 border-t border-white/[0.04] flex items-center gap-6">
              <div><span className="block text-[9px] font-mono text-neutral-600 uppercase mb-1">Status</span><span className="text-green-500 text-xs font-mono">● Open Beta</span></div>
            </div>
          </div>
          <div className="md:col-span-8 flex flex-col divide-y divide-white/[0.06]">
            {[
              { tier: 'Starter', price: 'Free', desc: 'Everything you need to explore. Personal workspace, community packs, and basic automation.', features: ['1 workspace', 'Community packs', '100 runs/mo'], cta: 'Get Started Free', ctaClass: 'bg-white text-black hover:bg-neutral-200' },
              { tier: 'Pro', price: '$29', unit: '/month', desc: 'For teams shipping real products. Unlimited packs, full automation runtime, self-healing.', features: ['Team workspace', 'Verified packs', 'Unlimited runs', 'Self-healing'], cta: 'Start Pro Trial', ctaClass: 'bg-green-500 text-black hover:bg-green-400', highlight: true },
              { tier: 'Enterprise', price: 'Custom', desc: 'For organizations needing governance, audit trails, dedicated support, SLA, and on-premise.', features: ['Dedicated infra', 'SLA support', 'Audit & compliance'], cta: 'Contact Sales', ctaClass: 'border border-white/10 text-white hover:bg-white/5' },
            ].map((t) => (
              <ScrollReveal key={t.tier}>
                <div className={`group p-8 md:p-12 transition-colors ${t.highlight ? 'bg-green-500/[0.02] hover:bg-green-500/[0.04]' : 'hover:bg-white/[0.015]'}`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <span className="font-mono text-green-500 text-[10px] tracking-widest uppercase mb-3 block">{t.tier}</span>
                      <div className="flex items-baseline gap-1 mb-4">
                        <h3 className="text-3xl text-white font-medium tracking-tight">{t.price}</h3>
                        {t.unit && <span className="text-neutral-500 text-sm">{t.unit}</span>}
                      </div>
                      <p className="text-neutral-500 text-sm max-w-sm mb-6 leading-relaxed">{t.desc}</p>
                      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] font-mono text-neutral-400 uppercase">
                        {t.features.map((f) => (
                          <li key={f} className="flex items-center gap-1.5"><span className="w-1 h-1 bg-green-500 rounded-full" />{f}</li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={openBeta} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold transition-colors shrink-0 ${t.ctaClass}`}>{t.cta}</button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-t border-white/[0.06] py-28 md:py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[35vw] h-[35vw] bg-green-500/[0.04] blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <ScrollReveal><h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-5">Start building.</h2></ScrollReveal>
          <ScrollReveal><p className="text-neutral-500 text-base md:text-lg leading-relaxed mb-10">Build once, install everywhere, compose into apps, publish and reuse. Join the developers who are done rebuilding from scratch.</p></ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-neutral-200 transition-colors">
                Get Started Free <Icon icon="solar:arrow-right-linear" width={16} />
              </button>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/15 text-white font-medium rounded-md px-8 py-3 text-sm hover:bg-white/5 transition-colors">
                View Documentation
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

