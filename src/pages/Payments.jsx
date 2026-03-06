import { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

/* ── Marquee data ─────────────────────────────────────────── */
const INTEGRATIONS = [
  { icon: 'simple-icons:shopify',     label: 'Shopify',     color: '#96bf48' },
  { icon: 'simple-icons:wordpress',   label: 'WordPress',   color: '#21759b' },
  { icon: 'simple-icons:woocommerce', label: 'WooCommerce', color: '#7f54b3' },
  { icon: 'simple-icons:stripe',      label: 'Stripe',      color: '#635bff' },
  { icon: 'simple-icons:googlepay',   label: 'Google Pay',  color: '#4285F4' },
  { icon: 'simple-icons:applepay',    label: 'Apple Pay',   color: '#ffffff' },
  { icon: 'simple-icons:webflow',     label: 'Webflow',     color: '#4353ff' },
  { icon: 'simple-icons:squarespace', label: 'Squarespace', color: '#ffffff' },
  { icon: 'simple-icons:magento',     label: 'Magento',     color: '#ee672d' },
  { icon: 'simple-icons:bigcommerce', label: 'BigCommerce', color: '#34313f' },
];

/* ── Stats ─────────────────────────────────────────────────── */
const STATS = [
  { val: '0.2s',   desc: 'Median checkout velocity — faster than a blink',   green: false },
  { val: '94%',    desc: 'Dispute deflection rate powered by AI profiling',   green: true  },
  { val: '3.1×',   desc: 'Revenue uplift from precision customer profiling',  green: false },
  { val: '∞',      desc: 'Integrations — one line of code, any platform',     green: true  },
];

/* ── Profiling signals ─────────────────────────────────────── */
const SIGNALS = [
  { icon: 'solar:cursor-linear',           label: 'Cursor velocity & dwell',     desc: 'How long they hover on price points. Hesitation patterns. Micro-movements that reveal intent.' },
  { icon: 'solar:finger-linear',           label: 'Touch & swipe biometrics',    desc: 'Swipe pressure, scroll inertia, pinch cadence. Every gesture builds a unique behavioral fingerprint.' },
  { icon: 'solar:clock-circle-linear',     label: 'Session time architecture',   desc: 'Time-on-page per element, bounce rhythm, return cadence. The full lifecycle, not just a pageview.' },
  { icon: 'solar:eye-linear',              label: 'Attention heat mapping',       desc: 'Where eyes land. What they skip. Invisible form fill hesitations that signal intent or doubt.' },
  { icon: 'solar:graph-linear',            label: 'Purchase velocity scoring',    desc: 'How fast they move from discovery to checkout. Compared against 50M+ behavioral benchmarks.' },
  { icon: 'solar:smartphone-linear',       label: 'Device & context entropy',     desc: 'OS, browser, timezone, battery state, network type — hundreds of passive signals fused silently.' },
];

/* ── Risk tier table ───────────────────────────────────────── */
const RISK_TIERS = [
  { tier: 'Verified',    score: '< 20',  action: 'Approve instantly',         color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
  { tier: 'Standard',   score: '20–59',  action: 'Proceed with light check',  color: 'text-neutral-300', bg: 'bg-white/[0.04]',  border: 'border-white/[0.08]'  },
  { tier: 'Elevated',   score: '60–79',  action: 'Soft friction layer',        color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { tier: 'High Risk',  score: '80+',    action: 'Block or step-up verify',   color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
];

/* ── Steps ──────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', icon: 'solar:plug-circle-linear',     title: 'Connect in 90 seconds',      desc: 'Paste one script tag or install a plugin. No developer required. Works on any platform — Shopify, WordPress, WooCommerce, custom HTML, or headless React.' },
  { n: '02', icon: 'solar:eye-linear',              title: 'AI begins profiling',         desc: 'The moment a visitor lands, our model starts reading. Scroll rhythm, session depth, cursor entropy — hundreds of signals, zero friction, fully invisible.' },
  { n: '03', icon: 'solar:shield-check-linear',     title: 'Risk score at checkout',      desc: 'By the time they click pay, we already know. Verified buyers fly through. Risky sessions get a frictionless soft-check — no one feels interrogated.' },
  { n: '04', icon: 'solar:card-linear',             title: 'Accept any payment',          desc: 'Stripe, Google Pay, Apple Pay, or direct card. One-tap on mobile. Instant bank on desktop. No redirects. No KYC forms. Just revenue.' },
];

/* ── Payment method cards ──────────────────────────────────── */
const PAY_METHODS = [
  { icon: 'simple-icons:stripe',   label: 'Stripe',      sub: 'Cards, SEPA, BACS, ACH',     color: 'text-[#635bff]', bg: 'bg-[#635bff]/10', border: 'border-[#635bff]/20' },
  { icon: 'simple-icons:googlepay',label: 'Google Pay',  sub: 'One-tap Android & Chrome',   color: 'text-[#4285F4]', bg: 'bg-[#4285F4]/10', border: 'border-[#4285F4]/20' },
  { icon: 'simple-icons:applepay', label: 'Apple Pay',   sub: 'Touch & Face ID checkout',   color: 'text-white',      bg: 'bg-white/10',      border: 'border-white/20'     },
  { icon: 'solar:card-linear',     label: 'Direct Card', sub: 'Zero-redirect card vault',   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
];

/* ── Platform cards ─────────────────────────────────────────── */
const PLATFORMS = [
  { icon: 'simple-icons:shopify',     label: 'Shopify',       sub: 'App install — 2 clicks',     color: 'text-[#96bf48]' },
  { icon: 'simple-icons:wordpress',   label: 'WordPress',     sub: 'Plugin — no code',           color: 'text-[#21759b]' },
  { icon: 'simple-icons:woocommerce', label: 'WooCommerce',   sub: 'Gateway extension',          color: 'text-[#7f54b3]' },
  { icon: 'simple-icons:webflow',     label: 'Webflow',       sub: 'Embed snippet',              color: 'text-[#4353ff]' },
  { icon: 'simple-icons:magento',     label: 'Magento',       sub: 'Module package',             color: 'text-[#ee672d]' },
  { icon: 'solar:code-square-linear', label: 'Custom / API',  sub: 'REST + webhooks',            color: 'text-green-500' },
];

export default function Payments() {
  const heroRef = useRef(null);
  const { openBeta } = useBeta();

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo('.pay-hero-reveal',
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power4.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="pt-14 relative overflow-hidden min-h-[92vh] flex items-center border-b border-white/[0.06]">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] bg-green-500/[0.04] blur-[160px] rounded-full" />
          <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-violet-500/[0.03] blur-[120px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <div className="overflow-hidden mb-6">
                <div className="pay-hero-reveal flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                  <p className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-mono font-medium">Logic Packs · Payments</p>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <div className="overflow-hidden">
                  <h1 className="pay-hero-reveal text-5xl md:text-7xl lg:text-[82px] font-semibold tracking-tight leading-[0.93] text-white">Revenue,</h1>
                </div>
                <div className="overflow-hidden">
                  <h1 className="pay-hero-reveal text-5xl md:text-7xl lg:text-[82px] font-light tracking-tight leading-[0.93] text-neutral-400 italic">Unleashed.</h1>
                </div>
              </div>

              <div className="overflow-hidden max-w-lg mb-10">
                <p className="pay-hero-reveal text-base md:text-lg text-neutral-500 leading-relaxed">
                  The AI-native commercial layer that turns visitors into verified buyers — before they ever see a checkout. No paperwork. No friction. No lost revenue.
                </p>
              </div>

              <div className="overflow-hidden">
                <div className="pay-hero-reveal flex flex-wrap gap-3">
                  <button
                    onClick={openBeta}
                    className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-7 py-3 text-sm hover:bg-neutral-200 transition-colors"
                  >
                    Start Collecting Revenue <Icon icon="solar:arrow-right-linear" width={16} />
                  </button>
                  <button
                    onClick={openBeta}
                    className="inline-flex items-center gap-2 border border-white/15 text-white font-medium rounded-md px-7 py-3 text-sm hover:bg-white/5 transition-colors"
                  >
                    See It Live <Icon icon="solar:play-circle-linear" width={16} className="text-green-500" />
                  </button>
                </div>
              </div>

              {/* Trust strip */}
              <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-wrap items-center gap-6">
                {[
                  { icon: 'solar:shield-check-linear', label: 'No KYC forms' },
                  { icon: 'solar:lock-keyhole-linear', label: 'PCI DSS Level 1' },
                  { icon: 'solar:bolt-linear',         label: '90-second setup' },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <Icon icon={t.icon} className="text-green-500 text-sm" />
                    <span className="text-neutral-500 text-xs font-medium">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — live risk dashboard mockup */}
            <ScrollReveal>
              <div className="relative">
                {/* Outer card */}
                <div className="bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                  {/* Bar */}
                  <div className="h-10 bg-[#161616] border-b border-white/[0.06] flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-neutral-700 text-[10px] font-mono">lp-payments · risk dashboard</span>
                    </div>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Session feed */}
                    <div>
                      <p className="text-neutral-600 text-[10px] font-mono uppercase tracking-widest mb-3">Live Session Intelligence</p>
                      <div className="space-y-2">
                        {[
                          { id: 'usr_8f2a', score: 12,  verdict: 'Verified',  color: 'text-green-400',  bg: 'bg-green-500/10',  time: '0.3s ago', amount: '$249' },
                          { id: 'usr_3c1e', score: 44,  verdict: 'Standard', color: 'text-neutral-400', bg: 'bg-white/[0.04]',  time: '1.1s ago', amount: '$89'  },
                          { id: 'usr_9a0b', score: 81,  verdict: 'Blocked',  color: 'text-red-400',    bg: 'bg-red-500/10',    time: '2.4s ago', amount: '$419' },
                          { id: 'usr_4d7f', score: 18,  verdict: 'Verified',  color: 'text-green-400',  bg: 'bg-green-500/10',  time: '3.2s ago', amount: '$134' },
                          { id: 'usr_7b3c', score: 67,  verdict: 'Elevated', color: 'text-yellow-400', bg: 'bg-yellow-500/10', time: '4.9s ago', amount: '$599' },
                        ].map((row) => (
                          <div key={row.id} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                            <div className={`w-8 h-8 rounded-lg ${row.bg} flex items-center justify-center shrink-0`}>
                              <Icon icon="solar:user-linear" className={`${row.color} text-sm`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-mono">{row.id}</p>
                              <p className="text-neutral-600 text-[10px]">{row.time}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-white text-xs font-medium">{row.amount}</p>
                              <p className={`text-[10px] font-mono ${row.color}`}>{row.verdict} · {row.score}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Micro stat bar */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {[
                        { label: 'Approved',  val: '847',  color: 'text-green-400' },
                        { label: 'Disputed',  val: '3',    color: 'text-red-400'   },
                        { label: 'Revenue',   val: '$41.2k', color: 'text-white'   },
                      ].map((s) => (
                        <div key={s.label} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 text-center">
                          <p className={`text-base font-semibold tracking-tight ${s.color}`}>{s.val}</p>
                          <p className="text-neutral-600 text-[10px] font-mono mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-green-500 text-black rounded-xl px-4 py-2 shadow-xl text-xs font-bold">
                  94% disputes deflected
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ INTEGRATION MARQUEE ═══ */}
      <section className="overflow-hidden border-b border-white/[0.06]">
        <div className="flex overflow-hidden py-7 relative items-center">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-14 animate-marquee whitespace-nowrap min-w-full">
            {[0, 1].map((g) => (
              <div key={g} className="flex items-center gap-14 shrink-0">
                {INTEGRATIONS.map((t) => (
                  <div key={`${g}-${t.label}`} className="flex items-center gap-2.5 opacity-25 hover:opacity-70 transition-opacity">
                    <Icon icon={t.icon} width={20} style={{ color: t.color }} />
                    <span className="text-sm font-medium text-white tracking-tight">{t.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          {STATS.map((s, i) => (
            <ScrollReveal key={i} delay={i * 70}>
              <div className={`p-8 md:p-12 flex flex-col justify-end min-h-[200px] ${i > 0 ? 'border-t md:border-t-0' : ''} transition-colors ${s.green ? 'bg-green-500/[0.03] hover:bg-green-500/[0.05]' : 'hover:bg-white/[0.02]'}`}>
                <div className={`text-5xl md:text-6xl font-semibold tracking-tight mb-3 ${s.green ? 'text-green-500' : 'text-white'}`}>{s.val}</div>
                <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ HEADLINE BREAK ═══ */}
      <section className="border-b border-white/[0.06] py-20 md:py-28 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[50vw] h-[30vw] bg-green-500/[0.03] blur-[130px] rounded-full" />
        </div>
        <ScrollReveal>
          <h2 className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.0] max-w-5xl">
            Your buyers shouldn&apos;t have to prove they&apos;re human.<br />
            <span className="text-neutral-500 italic font-light">Your platform already knows.</span>
          </h2>
        </ScrollReveal>
      </section>

      {/* ═══ AI PROFILING ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[300px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Intelligence Layer</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Behavioral Profiling</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Invisible. Instant. Impossibly accurate. Every visitor leaves a behavioral signature. We read it before they reach checkout.</p></ScrollReveal>
            </div>
            <ScrollReveal>
              <div className="mt-8 flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-neutral-600 text-[10px] font-mono uppercase tracking-widest">Zero user friction</span>
              </div>
            </ScrollReveal>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {/* Left col — signals */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x divide-white/[0.06]">
              {SIGNALS.map((s, i) => (
                <ScrollReveal key={s.label} delay={i * 60}>
                  <div className="group p-7 hover:bg-white/[0.015] transition-colors border-b border-white/[0.06] last:border-0 md:last:border-b md:[&:nth-child(even)]:border-b-0">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-green-500/20 group-hover:bg-green-500/[0.06] transition-all">
                      <Icon icon={s.icon} className="text-neutral-400 group-hover:text-green-500 transition-colors" width={16} />
                    </div>
                    <h4 className="text-white text-sm font-medium tracking-tight mb-2">{s.label}</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Right col — live signal viz */}
            <ScrollReveal>
              <div className="p-7 flex flex-col justify-between min-h-[320px] bg-white/[0.01]">
                <p className="text-neutral-600 text-[10px] font-mono uppercase tracking-widest mb-4">Signal fusion · live</p>
                <div className="flex-1 space-y-3">
                  {[
                    { label: 'Scroll depth',       pct: 87, color: 'bg-green-500' },
                    { label: 'Cursor entropy',      pct: 43, color: 'bg-green-500/60' },
                    { label: 'Session coherence',   pct: 91, color: 'bg-green-500' },
                    { label: 'Touch pressure avg',  pct: 66, color: 'bg-green-500/70' },
                    { label: 'Time-on-price',       pct: 34, color: 'bg-yellow-500/60' },
                    { label: 'Hesitation index',    pct: 12, color: 'bg-green-500/40' },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-neutral-500 text-[10px] font-mono">{bar.label}</span>
                        <span className="text-neutral-400 text-[10px] font-mono">{bar.pct}%</span>
                      </div>
                      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className={`h-full ${bar.color} rounded-full animate-bar`} style={{ width: `${bar.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 text-[10px] font-mono">Risk score</span>
                    <span className="text-green-400 text-xl font-semibold font-mono">14</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '14%' }} />
                  </div>
                  <p className="text-green-500 text-[10px] font-mono mt-2">✓ Approved — proceed to checkout</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ RISK ENGINE ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[300px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Dispute Shield</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Risk Intelligence Engine</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Every transaction is scored before it happens. Disputes drop. Revenue holds. Your merchant account stays clean.</p></ScrollReveal>
            </div>
            <ScrollReveal>
              <button onClick={openBeta} className="mt-8 inline-flex items-center gap-2 border border-white/10 text-neutral-300 px-5 py-2.5 rounded-md text-xs font-medium hover:bg-white/5 transition-all w-max">
                See Risk Docs <Icon icon="solar:arrow-right-up-linear" width={14} className="text-neutral-500" />
              </button>
            </ScrollReveal>
          </div>

          <div className="md:col-span-3 flex flex-col">
            {/* Risk tier table */}
            <div className="border-b border-white/[0.06]">
              <div className="p-6 md:p-8">
                <p className="text-neutral-600 text-[10px] font-mono uppercase tracking-widest mb-5">Risk Tier Matrix</p>
                <div className="space-y-2">
                  {RISK_TIERS.map((t) => (
                    <ScrollReveal key={t.tier}>
                      <div className={`flex items-center gap-4 p-4 rounded-lg border ${t.bg} ${t.border} transition-all hover:scale-[1.01]`}>
                        <div className="w-24 shrink-0">
                          <span className={`text-xs font-semibold font-mono ${t.color}`}>{t.tier}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-neutral-400 text-xs">{t.action}</span>
                        </div>
                        <div className="shrink-0">
                          <span className="text-neutral-600 text-[10px] font-mono">Score {t.score}</span>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>

            {/* Detail rows */}
            {[
              {
                icon: 'solar:shield-warning-linear',
                n: '01 — DETECTION',
                title: 'Pre-transaction fraud detection',
                desc: 'Our model evaluates 400+ behavioral and contextual signals in under 80ms. By the time the buyer clicks "Pay", the verdict is already in — no added latency, no visible check.',
                detail: (
                  <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-lg p-4 font-mono text-xs space-y-1">
                    <div><span className="text-green-500">signals_evaluated:</span> <span className="text-neutral-300">412</span></div>
                    <div><span className="text-green-500">latency:</span> <span className="text-neutral-300">78ms</span></div>
                    <div><span className="text-green-500">model:</span> <span className="text-neutral-300">lp-risk-v4</span></div>
                    <div><span className="text-green-500">verdict:</span> <span className="text-green-400">APPROVED</span></div>
                  </div>
                ),
              },
              {
                icon: 'solar:user-check-linear',
                n: '02 — PROFILING',
                title: 'Continuous customer intelligence',
                desc: 'Returning buyers build a profile over time. Each visit sharpens accuracy. First-timers are evaluated cold — still 94% accurate. Repeat buyers get frictionless fast-pass approval.',
                detail: (
                  <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-lg p-4 font-mono text-xs space-y-1">
                    <div><span className="text-green-500">visits:</span> <span className="text-neutral-300">7</span></div>
                    <div><span className="text-green-500">profile_confidence:</span> <span className="text-neutral-300">98.2%</span></div>
                    <div><span className="text-green-500">last_dispute:</span> <span className="text-neutral-300">none</span></div>
                    <div><span className="text-green-500">tier:</span> <span className="text-green-400">FAST_PASS</span></div>
                  </div>
                ),
              },
              {
                icon: 'solar:hand-money-linear',
                n: '03 — RESPONSE',
                title: 'Adaptive friction — zero annoyance',
                desc: 'Risky sessions don\'t get blocked outright — they get a carefully designed soft-check that feels like part of your brand. High-risk? Hard block. Mid-risk? An invisible layer. Low-risk? Nothing.',
                detail: null,
              },
            ].map((row, i) => (
              <ScrollReveal key={row.n}>
                <div className={`group grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 p-8 md:p-10 hover:bg-white/[0.015] transition-colors ${i < 2 ? 'border-b border-white/[0.06]' : ''}`}>
                  <div className="flex flex-col justify-center">
                    <span className="text-green-500 font-mono text-[10px] mb-3">{row.n}</span>
                    <h3 className="text-lg text-white font-medium tracking-tight mb-3 flex items-center gap-2.5">
                      <Icon icon={row.icon} className="text-neutral-500 group-hover:text-green-500 transition-colors" width={18} />
                      {row.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{row.desc}</p>
                  </div>
                  {row.detail && <div className="flex items-center">{row.detail}</div>}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 min-h-[320px] justify-between">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Deployment</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Live in 90 Seconds</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">No engineering sprint. No KYC forms for you or your buyers. Just a connection and the AI does the rest.</p></ScrollReveal>
            </div>
            <ScrollReveal>
              <button onClick={openBeta} className="mt-8 inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-5 py-2.5 text-xs hover:bg-neutral-200 transition-colors w-max">
                Connect Now <Icon icon="solar:arrow-right-linear" width={14} />
              </button>
            </ScrollReveal>
          </div>

          <div className="md:col-span-3 flex flex-col">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.n} delay={i * 60}>
                <div className={`group grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] ${i < STEPS.length - 1 ? 'border-b border-white/[0.06]' : ''} hover:bg-white/[0.015] transition-colors`}>
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

      {/* ═══ PAYMENT METHODS ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 p-8 md:p-10 flex flex-col justify-center">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Checkout</span>
            <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Every Way They Want to Pay</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Tap, click, scan, or type. We route to the fastest, cheapest method automatically.</p></ScrollReveal>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {PAY_METHODS.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 70}>
                <div className="group p-8 hover:bg-white/[0.015] transition-colors flex flex-col gap-4 border-b border-white/[0.06] last:border-0 md:border-b-0">
                  <div className={`w-12 h-12 rounded-xl border ${m.bg} ${m.border} flex items-center justify-center`}>
                    <Icon icon={m.icon} className={`${m.color} text-2xl`} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium tracking-tight mb-1">{m.label}</h3>
                    <p className="text-neutral-500 text-xs">{m.sub}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/[0.04]">
                    <span className="text-[10px] text-neutral-600 group-hover:text-neutral-300 transition-colors flex items-center gap-1.5 font-mono">
                      Enabled by default <Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLATFORMS ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Integrations</span>
              <ScrollReveal><h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">Works Everywhere You Sell</h2></ScrollReveal>
            </div>
            <ScrollReveal>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 px-5 py-2.5 rounded-md text-xs font-medium hover:bg-white/5 transition-all shrink-0">
                View All Integrations <Icon icon="solar:arrow-right-up-linear" width={14} className="text-neutral-500" />
              </button>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/[0.06] rounded-xl overflow-hidden">
            {PLATFORMS.map((p, i) => (
              <ScrollReveal key={p.label} delay={i * 50}>
                <div className="group bg-[#0a0a0a] hover:bg-white/[0.03] transition-all p-6 flex flex-col items-center text-center gap-3 min-h-[140px] justify-center cursor-pointer">
                  <Icon icon={p.icon} width={28} className={`${p.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <div>
                    <p className="text-white text-xs font-medium">{p.label}</p>
                    <p className="text-neutral-600 text-[10px] font-mono mt-0.5">{p.sub}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section className="border-b border-white/[0.06] py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <blockquote className="text-2xl md:text-4xl text-neutral-300 font-light leading-snug tracking-tight mb-8">
              &ldquo;The best checkout experience is one your buyer never notices — because it just <span className="text-white italic">worked</span>, the moment they decided to buy.&rdquo;
            </blockquote>
          </ScrollReveal>
          <ScrollReveal><p className="text-sm text-neutral-600 font-mono uppercase tracking-widest">— Logic Packs Payments</p></ScrollReveal>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-12 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-4 flex flex-col p-8 md:p-12 justify-between">
            <div className="max-w-sm">
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Pricing</span>
              <ScrollReveal>
                <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[0.95] mb-6">
                  Flat rate.<br /><span className="text-neutral-500 italic">No surprises.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">You keep the margin. We make 0.3% per transaction on top of Stripe fees. No monthly minimums, no setup costs.</p></ScrollReveal>
            </div>
            <div className="mt-10 pt-6 border-t border-white/[0.04] flex items-center gap-6">
              <div>
                <span className="block text-[9px] font-mono text-neutral-600 uppercase mb-1">Settlement</span>
                <span className="text-green-500 text-xs font-mono">● T+1 standard</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col divide-y divide-white/[0.06]">
            {[
              {
                tier: 'Growth',
                price: '$0',
                unit: 'setup',
                fee: '+ 0.3% per transaction',
                desc: 'Everything live in 90 seconds. AI profiling, dispute shield, all payment methods, Shopify & WordPress plugins.',
                features: ['Full AI profiling', 'Dispute Shield', 'All payment methods', 'No KYC setup'],
                cta: 'Start for Free',
                ctaClass: 'bg-white text-black hover:bg-neutral-200',
              },
              {
                tier: 'Scale',
                price: '$149',
                unit: '/mo',
                fee: '+ 0.15% per transaction',
                desc: 'Reduced transaction fees, advanced behavioral analytics dashboard, custom risk thresholds, priority routing.',
                features: ['Halved transaction fee', 'Advanced analytics', 'Custom risk tiers', 'Priority support'],
                cta: 'Start Scale Trial',
                ctaClass: 'bg-green-500 text-black hover:bg-green-400',
                highlight: true,
              },
              {
                tier: 'Enterprise',
                price: 'Custom',
                unit: '',
                fee: 'Volume-negotiated rates',
                desc: 'Dedicated risk model trained on your buyer data, SLA, custom integrations, on-prem deployment.',
                features: ['Custom risk model', 'Dedicated SLA', 'On-prem option', 'Volume rates'],
                cta: 'Talk to Sales',
                ctaClass: 'border border-white/10 text-white hover:bg-white/5',
              },
            ].map((t) => (
              <ScrollReveal key={t.tier}>
                <div className={`group p-8 md:p-12 transition-colors ${t.highlight ? 'bg-green-500/[0.02] hover:bg-green-500/[0.04]' : 'hover:bg-white/[0.015]'}`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <span className="font-mono text-green-500 text-[10px] tracking-widest uppercase mb-3 block">{t.tier}</span>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <h3 className="text-3xl text-white font-semibold tracking-tight">{t.price}</h3>
                        {t.unit && <span className="text-neutral-500 text-sm">{t.unit}</span>}
                      </div>
                      <p className="text-green-500/70 text-xs font-mono mb-4">{t.fee}</p>
                      <p className="text-neutral-500 text-sm max-w-sm mb-5 leading-relaxed">{t.desc}</p>
                      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] font-mono text-neutral-400 uppercase">
                        {t.features.map((f) => (
                          <li key={f} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-green-500 rounded-full" />{f}
                          </li>
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
      <section className="py-28 md:py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[40vw] h-[40vw] bg-green-500/[0.05] blur-[140px] rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-green-500/80">No KYC · No Setup Fee · Live in 90s</span>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <h2 className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-[0.95] mb-6">
              Stop losing<br /><span className="text-neutral-500 italic font-light">buyers at checkout.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-neutral-500 text-base md:text-lg leading-relaxed mb-10">
              Your competitors are already converting buyers you&apos;re losing to form fatigue, failed payments, and dispute chargebacks. The gap closes today.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3.5 text-sm hover:bg-neutral-200 transition-colors">
                Connect Your Store <Icon icon="solar:arrow-right-linear" width={16} />
              </button>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/15 text-white font-medium rounded-md px-8 py-3.5 text-sm hover:bg-white/5 transition-colors">
                Watch a Demo <Icon icon="solar:play-circle-linear" width={16} className="text-green-500" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
