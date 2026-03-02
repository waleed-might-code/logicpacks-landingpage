import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

/* ──────────────────────────────────────────────────────────
   PAKISTAN NATIVE LANDING PAGE
   
   Atmospheric DNA:
   - Deep emerald (#064E3B) → not flag green, valley green
   - Warm marble (#FAF9F6, #F5F0EB) → Lahore Fort sandstone
   - Copper/gold accents (#D4A574, #B87333) → hospitality
   - Islamic geometric tessellation at 3-5% opacity
   - Faisal Mosque angular silhouette (modern, not dome)
   - Generous whitespace → courtyard architecture
   ────────────────────────────────────────────────────────── */

/* ── Inline SVG pattern for geometric tessellation ── */
const TESSELLATION_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z'/%3E%3Ccircle cx='40' cy='40' r='15'/%3E%3C/g%3E%3C/svg%3E")`;

const TESSELLATION_DARK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23064E3B' stroke-width='0.5'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z'/%3E%3Ccircle cx='40' cy='40' r='15'/%3E%3C/g%3E%3C/svg%3E")`;

const STATS = [
  { val: '5', label: 'Creation surfaces', sub: 'Build, Design, Automate, Compose, Discover' },
  { val: '180+', label: 'Verified packs', sub: 'In the marketplace and growing' },
  { val: '74%', label: 'Time saved', sub: 'Average per project vs rebuilding' },
  { val: '<12min', label: 'Time to first app', sub: 'From zero to working product' },
];

const CAPABILITIES = [
  { icon: 'solar:monitor-smartphone-linear', title: 'Build Screens', desc: 'Drag-and-drop UI builder that generates production React components. Every screen binds directly to your logic packs.', color: '#064E3B' },
  { icon: 'solar:server-minimalistic-linear', title: 'Build Logic', desc: 'Create backend features as reusable packs — endpoints, schemas, auth, tests, and versioning in one artifact.', color: '#0F766E' },
  { icon: 'solar:bolt-circle-linear', title: 'Automate', desc: 'Set up workflows that trigger automatically. When a user signs up, send an email. When a sale happens, update your dashboard.', color: '#B87333' },
  { icon: 'solar:pen-new-round-linear', title: 'Compose & Plan', desc: 'Infinite canvas for product flows and architecture. Prototype ideas, generate assets, and map out your entire system.', color: '#78716C' },
];

const FEATURES = [
  { icon: 'solar:shield-check-linear', title: 'Self-Healing Systems', desc: 'When something breaks, agents inspect logs, propose a patch, rerun tests, and ship a fix — automatically. Packs get more reliable over time.' },
  { icon: 'solar:widget-add-linear', title: 'Pack Marketplace', desc: 'Browse hundreds of verified, reusable building blocks. Auth, payments, dashboards, CRM, notifications — install with one click.' },
  { icon: 'solar:layers-minimalistic-linear', title: 'Compose Everything', desc: 'Wire packs together. Login connects to dashboard. Payments connect to notifications. Everything fits like precision-cut stone.' },
  { icon: 'solar:lock-keyhole-minimalistic-linear', title: 'Enterprise Security', desc: 'SOC 2, ISO 27001, data sovereignty. Built for organizations that need governance, audit trails, and compliance from day one.' },
  { icon: 'solar:refresh-circle-linear', title: 'Version Control', desc: 'Every pack is versioned, tested, and tracked. Roll back instantly. Know exactly what changed and when.' },
  { icon: 'solar:users-group-rounded-linear', title: 'Team Collaboration', desc: 'Real-time collaborative workspace. Multiple engineers building simultaneously. No merge conflicts on pack boundaries.' },
];

const STEPS = [
  { n: '01', title: 'Browse & Install', desc: 'Find proven building blocks from the marketplace. Auth, payments, CRM — all verified and ready.', icon: 'solar:magnifer-linear' },
  { n: '02', title: 'Configure & Customize', desc: 'Set your business rules, adjust behavior, connect your data sources. Make each pack yours.', icon: 'solar:settings-minimalistic-linear' },
  { n: '03', title: 'Compose & Wire', desc: 'Connect packs together. UI binds to logic. Events flow between services. The system validates everything.', icon: 'solar:link-round-linear' },
  { n: '04', title: 'Deploy & Scale', desc: 'Tests pass, app deploys. Self-healing keeps it running. Publish improved packs back to the ecosystem.', icon: 'solar:rocket-2-linear' },
];

const TESTIMONIALS = [
  { quote: "We launched our internal operations suite in 2 weeks. Our CTO estimated it would have taken 3 months the traditional way. Logic Packs changed everything.", name: 'Farhan Malik', role: 'COO, Karachi FinTech', initials: 'FM' },
  { quote: "The marketplace saved us from rebuilding customer onboarding for the fourth time. We found a pack, customized it, and shipped in a weekend.", name: 'Ayesha Khan', role: 'Product Lead, Lahore SaaS', initials: 'AK' },
  { quote: "I run three ventures. The same auth, billing, and dashboard packs power all of them. That kind of reuse was impossible before.", name: 'Saad Raza', role: 'Serial Founder, Islamabad', initials: 'SR' },
];

export default function HomePakistan() {
  const [, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const heroRef = useRef(null);
  const { openBeta } = useBeta();

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 });
      tl.fromTo('.pk-hero-reveal',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power4.out' }
      );

      // Floating geometric elements
      gsap.to('.pk-float-1', { y: -15, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.pk-float-2', { y: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      gsap.to('.pk-float-3', { y: -10, rotation: 45, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#FAF9F6] text-[#1C1917] selection:bg-[#064E3B]/20 selection:text-[#064E3B] [&_*]:!border-transparent">

      {/* ═══ CUSTOM STYLES for overriding dark header/footer ═══ */}
      <style>{`
        /* Override the global dark header for this page */
        header.fixed { background: rgba(250,249,246,0.85) !important; border-color: rgba(0,0,0,0.06) !important; backdrop-filter: blur(20px) saturate(180%) !important; }
        header a, header span, header button { color: #1C1917 !important; }
        header a:hover { color: #064E3B !important; }
        header .bg-white { background: #064E3B !important; color: white !important; }
        header .bg-white:hover { background: #065F46 !important; }
        header .border-white\\/10, header .bg-white\\/\\[0\\.03\\] { border-color: rgba(0,0,0,0.08) !important; background: rgba(6,78,59,0.05) !important; }
        header .text-green-500 { color: #064E3B !important; }
        /* Mobile menu */
        header #mobile-menu, header > div:last-child { background: rgba(250,249,246,0.97) !important; }

        /* Override dark footer */
        footer { background: #064E3B !important; border-color: rgba(255,255,255,0.08) !important; }
        footer * { border-color: rgba(255,255,255,0.08) !important; }
        footer .text-green-500 { color: #D4A574 !important; }
        footer .border-white\\/\\[0\\.06\\] { border-color: rgba(255,255,255,0.08) !important; }
        footer input { border-color: rgba(255,255,255,0.15) !important; }
        footer input:focus { border-color: #D4A574 !important; }
      `}</style>

      {/* ═══ VIEW TOGGLE ═══ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white/90 backdrop-blur-xl border !border-black/[0.06] rounded-full p-1 shadow-2xl shadow-black/10">
        <button onClick={() => setSearchParams({ view: 'marketplace' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all text-[#78716C] hover:text-[#1C1917]">Marketplace</button>
        <button onClick={() => setSearchParams({ view: 'founder' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all text-[#78716C] hover:text-[#1C1917]">Founders</button>
        <button onClick={() => setSearchParams({ view: 'developer' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all text-[#78716C] hover:text-[#1C1917]">Developers</button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          A) HERO — Deep Emerald Valley
      ═══════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative min-h-screen w-full overflow-hidden pt-14">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#042f25] via-[#064E3B] to-[#065F46]" />

        {/* Radial light — simulates golden hour hitting from top-left */}
        <div className="absolute top-0 left-0 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_20%_20%,rgba(212,165,116,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_80%_80%,rgba(15,118,110,0.2)_0%,transparent_60%)] pointer-events-none" />

        {/* Tessellation pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: TESSELLATION_BG }} />

        {/* Floating geometric elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Eight-pointed star — top right */}
          <svg className="pk-float-1 absolute top-[15%] right-[10%] w-24 h-24 opacity-[0.06] text-white" viewBox="0 0 100 100">
            <path d="M50 0L58 38L100 50L58 62L50 100L42 62L0 50L42 38Z" fill="currentColor" />
          </svg>
          {/* Octagon — bottom left */}
          <svg className="pk-float-2 absolute bottom-[25%] left-[8%] w-16 h-16 opacity-[0.05] text-[#D4A574]" viewBox="0 0 100 100">
            <polygon points="30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30" fill="currentColor" />
          </svg>
          {/* Small diamond — middle right */}
          <svg className="pk-float-3 absolute top-[55%] right-[20%] w-8 h-8 opacity-[0.08] text-white" viewBox="0 0 100 100">
            <rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" fill="currentColor" />
          </svg>
          {/* Thin lines — architectural reference */}
          <div className="absolute top-[20%] right-[5%] w-px h-[40%] bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute top-[30%] right-[6%] w-px h-[25%] bg-gradient-to-b from-transparent via-[#D4A574]/[0.08] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen justify-center px-6 md:px-12 lg:px-24 pb-32">
          <div className="max-w-4xl space-y-8">
            <div className="overflow-hidden">
              <div className="pk-hero-reveal flex items-center gap-3">
                <div className="h-px w-8 bg-[#D4A574]" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4A574] font-medium">Built in Pakistan</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="overflow-hidden">
                <h1 className="pk-hero-reveal text-[clamp(2.5rem,7vw,6rem)] font-semibold tracking-[-0.02em] leading-[0.95] text-white">
                  Software that stays
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="pk-hero-reveal text-[clamp(2.5rem,7vw,6rem)] font-light tracking-[-0.02em] leading-[0.95] text-[#D4A574]">
                  working.
                </h1>
              </div>
            </div>

            <div className="overflow-hidden max-w-xl">
              <p className="pk-hero-reveal text-base md:text-lg text-white/50 leading-relaxed">
                Logic Packs is the platform where you assemble production-grade apps from proven, reusable building blocks. Ship faster. Break less. Reuse everything.
              </p>
            </div>

            <div className="overflow-hidden pt-2">
              <div className="pk-hero-reveal flex flex-wrap gap-4">
                <button onClick={openBeta} className="group inline-flex items-center gap-2.5 bg-white text-[#064E3B] font-semibold rounded-lg px-8 py-4 text-sm hover:bg-[#F5F0EB] transition-all shadow-xl shadow-black/10">
                  Get Started Free <Icon icon="solar:arrow-right-linear" width={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <a href="#how" className="inline-flex items-center gap-2 border !border-white/15 text-white/80 font-medium rounded-lg px-8 py-4 text-sm hover:bg-white/10 hover:text-white transition-all">
                  See How It Works
                </a>
              </div>
            </div>

            <div className="overflow-hidden pt-4">
              <div className="pk-hero-reveal flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/30">
                {['Free to start', 'No code required', 'Enterprise ready'].map((t, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#D4A574]" />{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to marble */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#FAF9F6] to-transparent z-20 pointer-events-none" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          B) STATS BAR
      ═══════════════════════════════════════════════════════ */}
      <section className="relative z-30 -mt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-2xl shadow-xl shadow-black/[0.04] border !border-[#E7E5E4] overflow-hidden">
              {STATS.map((s, i) => (
                <div key={i} className={`p-6 md:p-8 text-center ${i > 0 ? 'border-l !border-[#E7E5E4]' : ''}`}>
                  <div className="text-3xl md:text-4xl font-bold text-[#064E3B] mb-1">{s.val}</div>
                  <div className="text-sm font-semibold text-[#1C1917] mb-0.5">{s.label}</div>
                  <div className="text-xs text-[#A8A29E]">{s.sub}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          C) ABOUT — Big Statement
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-36">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
          <ScrollReveal>
            <p className="text-[#B87333] text-xs font-semibold uppercase tracking-[0.25em] mb-8">The Platform</p>
          </ScrollReveal>
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1C1917] leading-[1.1] mb-8">
              A browser-based, real-time collaborative workspace that produces reusable <span className="text-[#064E3B] italic">Packs</span> — not just code.
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-[#78716C] text-lg leading-relaxed max-w-2xl mx-auto">
              Apps are built by assembling and composing packs. Every pack ships with tests, telemetry, versioning, and self-healing — so software gets more reliable over time, not more fragile.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          D) FOUR CAPABILITIES
      ═══════════════════════════════════════════════════════ */}
      <section id="platform" className="py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-[#B87333] text-xs font-semibold uppercase tracking-[0.25em] mb-4">Four Surfaces</p>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1C1917] mb-4">One workspace. Four ways to build.</h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-[#78716C] text-base max-w-xl mx-auto">Each mode produces a different pack type, all composable together into production applications.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map((cap, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="group relative bg-white rounded-2xl p-7 border !border-[#E7E5E4] hover:border-[#064E3B]/20 hover:shadow-xl hover:shadow-[#064E3B]/[0.04] transition-all duration-300 h-full flex flex-col overflow-hidden">
                  {/* Subtle tessellation on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: TESSELLATION_DARK }} />
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative z-10" style={{ background: `${cap.color}10`, border: `1px solid ${cap.color}20` }}>
                    <Icon icon={cap.icon} width={24} style={{ color: cap.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1C1917] mb-2 relative z-10">{cap.title}</h3>
                  <p className="text-[#78716C] text-sm leading-relaxed relative z-10 flex-1">{cap.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          E) PRODUCT SHOWCASE — Code + Visual
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#064E3B] relative overflow-hidden">
        {/* Tessellation overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: TESSELLATION_BG }} />
        <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(ellipse_at_80%_30%,rgba(212,165,116,0.08)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <ScrollReveal>
                <p className="text-[#D4A574] text-xs font-semibold uppercase tracking-[0.25em] mb-6">How It Feels</p>
              </ScrollReveal>
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1] mb-6">
                  Install a pack.<br />Customize it.<br />Ship your app.
                </h2>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md">
                  Every pack comes with contracts, tests, and telemetry built in. Install it, configure your business rules, and compose it with other packs. Your app is production-ready from the start.
                </p>
              </ScrollReveal>
              <ScrollReveal>
                <div className="flex flex-wrap gap-3">
                  <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-[#064E3B] font-semibold rounded-lg px-6 py-3 text-sm hover:bg-[#F5F0EB] transition-colors">
                    Try It Free <Icon icon="solar:arrow-right-linear" width={14} />
                  </button>
                  <button onClick={openBeta} className="inline-flex items-center gap-2 border !border-white/15 text-white/70 font-medium rounded-lg px-6 py-3 text-sm hover:bg-white/10 hover:text-white transition-all">
                    View Docs
                  </button>
                </div>
              </ScrollReveal>
            </div>

            {/* Terminal mockup */}
            <ScrollReveal>
              <div className="bg-[#0C1E1E] rounded-2xl border !border-white/[0.06] shadow-2xl shadow-black/30 overflow-hidden">
                <div className="h-10 bg-white/[0.03] border-b !border-white/[0.04] flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D4A574]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="ml-3 text-[10px] text-white/20 font-mono">app.py</span>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed">
                  <div className="text-white/20 mb-4"># Install and compose packs</div>
                  <div><span className="text-[#D4A574]">from</span> <span className="text-white">logicpacks</span> <span className="text-[#D4A574]">import</span> <span className="text-white">App</span></div>
                  <div><span className="text-[#D4A574]">from</span> <span className="text-white/60">packs</span> <span className="text-[#D4A574]">import</span> <span className="text-white">AuthPack</span>, <span className="text-white">PaymentsPack</span></div>
                  <div className="h-4" />
                  <div><span className="text-white/60">app</span> <span className="text-white/30">=</span> <span className="text-white">App</span><span className="text-white/30">(</span><span className="text-[#D4A574]">"my-saas"</span><span className="text-white/30">)</span></div>
                  <div><span className="text-white/60">app</span><span className="text-white/30">.</span><span className="text-white">install</span><span className="text-white/30">(</span><span className="text-white">AuthPack</span><span className="text-white/30">)</span></div>
                  <div><span className="text-white/60">app</span><span className="text-white/30">.</span><span className="text-white">install</span><span className="text-white/30">(</span><span className="text-white">PaymentsPack</span><span className="text-white/30">)</span></div>
                  <div><span className="text-white/60">app</span><span className="text-white/30">.</span><span className="text-white">compose</span><span className="text-white/30">()</span></div>
                  <div className="h-4" />
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-white/40">All tests passing · Ready to deploy</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          F) KEY FEATURES GRID
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-[#B87333] text-xs font-semibold uppercase tracking-[0.25em] mb-4">Core Features</p>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1C1917] mb-4">Everything you need to ship.</h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="bg-white rounded-2xl p-7 border !border-[#E7E5E4] hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300 h-full">
                  <div className="w-11 h-11 rounded-xl bg-[#064E3B]/[0.06] border !border-[#064E3B]/10 flex items-center justify-center mb-5 text-[#064E3B]">
                    <Icon icon={f.icon} width={22} />
                  </div>
                  <h3 className="text-base font-semibold text-[#1C1917] mb-2">{f.title}</h3>
                  <p className="text-[#78716C] text-sm leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          G) HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section id="how" className="py-20 md:py-28 bg-[#F5F0EB]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-[#B87333] text-xs font-semibold uppercase tracking-[0.25em] mb-4">Process</p>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1C1917] mb-4">Four steps. That's it.</h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-[#78716C] text-base max-w-lg mx-auto">From idea to deployed app. The experience should feel like assembling precision-cut building blocks.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="relative bg-white rounded-2xl p-7 border !border-[#E7E5E4] h-full flex flex-col group hover:shadow-lg hover:shadow-black/[0.03] transition-all">
                  <span className="text-[#064E3B] font-mono text-xs font-bold mb-4 block">{step.n}</span>
                  <div className="w-10 h-10 rounded-lg bg-[#064E3B]/[0.06] border !border-[#064E3B]/10 flex items-center justify-center mb-4 text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                    <Icon icon={step.icon} width={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1C1917] mb-2">{step.title}</h3>
                  <p className="text-[#78716C] text-sm leading-relaxed flex-1">{step.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <Icon icon="solar:arrow-right-linear" width={14} className="text-[#B87333]" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          H) TESTIMONIALS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-[#B87333] text-xs font-semibold uppercase tracking-[0.25em] mb-4">Testimonials</p>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1C1917]">Trusted by builders across Pakistan.</h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-white rounded-2xl p-7 border !border-[#E7E5E4] h-full flex flex-col hover:shadow-lg hover:shadow-black/[0.03] transition-all">
                  <Icon icon="solar:quote-down-circle-linear" className="text-[#064E3B]/15 text-3xl mb-4" />
                  <p className="text-[#1C1917] text-sm leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-5 border-t !border-[#E7E5E4]">
                    <div className="w-10 h-10 rounded-full bg-[#064E3B] flex items-center justify-center text-xs font-bold text-white">{t.initials}</div>
                    <div>
                      <p className="text-[#1C1917] text-sm font-semibold">{t.name}</p>
                      <p className="text-[#A8A29E] text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          I) PRICING
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F5F0EB]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-[#B87333] text-xs font-semibold uppercase tracking-[0.25em] mb-4">Pricing</p>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1C1917] mb-4">Start free. Scale when ready.</h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-[#78716C] text-base max-w-lg mx-auto">No surprises. No hidden fees.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { tier: 'Starter', price: 'Free', who: 'For solo builders exploring ideas', features: ['1 workspace', 'Community packs', '100 runs/mo', 'Public marketplace'], cta: 'Get Started Free', highlight: false },
              { tier: 'Pro', price: '$29', unit: '/mo', who: 'For teams shipping real products', features: ['Unlimited workspaces', 'Verified packs', 'Unlimited runs', 'Self-healing', 'Team collaboration'], cta: 'Start Pro Trial', highlight: true },
              { tier: 'Enterprise', price: 'Custom', who: 'For organizations needing control', features: ['Dedicated infra', 'SLA + priority support', 'Audit & compliance', 'Custom integrations'], cta: 'Contact Sales', highlight: false },
            ].map((plan) => (
              <ScrollReveal key={plan.tier}>
                <div className={`rounded-2xl p-7 md:p-8 h-full flex flex-col border ${plan.highlight ? 'bg-[#064E3B] text-white !border-[#064E3B] shadow-xl shadow-[#064E3B]/20 scale-[1.02]' : 'bg-white !border-[#E7E5E4]'}`}>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 ${plan.highlight ? 'text-[#D4A574]' : 'text-[#B87333]'}`}>{plan.tier}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-[#1C1917]'}`}>{plan.price}</span>
                    {plan.unit && <span className={`text-sm ${plan.highlight ? 'text-white/50' : 'text-[#78716C]'}`}>{plan.unit}</span>}
                  </div>
                  <p className={`text-xs mb-6 ${plan.highlight ? 'text-white/40' : 'text-[#A8A29E]'}`}>{plan.who}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-white/80' : 'text-[#1C1917]'}`}>
                        <Icon icon="solar:check-circle-bold" width={16} className={plan.highlight ? 'text-[#D4A574]' : 'text-[#064E3B]'} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={openBeta} className={`block w-full text-center px-5 py-3.5 rounded-xl text-sm font-semibold transition-all ${plan.highlight ? 'bg-white text-[#064E3B] hover:bg-[#F5F0EB]' : 'bg-[#064E3B] text-white hover:bg-[#065F46]'}`}>
                    {plan.cta}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          J) FINAL CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6 relative overflow-hidden">
        {/* Subtle tessellation */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: TESSELLATION_DARK }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="h-px w-8 bg-[#B87333]" />
              <span className="text-[#B87333] text-xs font-semibold uppercase tracking-[0.25em]">Get Started</span>
              <div className="h-px w-8 bg-[#B87333]" />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1C1917] leading-[0.95] mb-6">
              Start building.<br /><span className="text-[#064E3B]">From Pakistan.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-[#78716C] text-lg leading-relaxed mb-10 max-w-lg mx-auto">
              Join the builders who ship faster, spend less on engineering, and create software that stays working.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={openBeta} className="group inline-flex items-center gap-2.5 bg-[#064E3B] text-white font-semibold rounded-xl px-10 py-4 text-sm hover:bg-[#065F46] transition-all shadow-xl shadow-[#064E3B]/20">
                Get Started Free <Icon icon="solar:arrow-right-linear" width={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border !border-[#1C1917]/10 text-[#1C1917] font-medium rounded-xl px-10 py-4 text-sm hover:bg-[#1C1917]/5 transition-all">
                Browse Marketplace
              </button>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-[#A8A29E] text-xs mt-8">Free forever. No credit card required.</p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
