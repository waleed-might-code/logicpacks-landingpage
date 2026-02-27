import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import HeroScene from '../components/HeroScene';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

/* ──────────────────────────────────────────────────────────
   FOUNDER / INVESTOR LANDING PAGE
   Non-technical, outcome-focused, VC-ready
   ────────────────────────────────────────────────────────── */

const LOGOS = [
  'Y Combinator', 'Techstars', 'Sequoia', 'a16z', 'Stripe', 'Vercel',
];

export default function HomeFounder() {
  const [, setSearchParams] = useSearchParams();
  const { openBeta } = useBeta();

  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo('.founder-hero-reveal',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power4.out' }
    );

    return () => {
      tl.kill();
      gsap.set('.founder-hero-reveal', { clearProps: 'all' });
    };
  }, []);

  return (
    <>
      {/* ═══ VIEW TOGGLE (floating pill) ═══ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[#141414]/90 backdrop-blur-xl border border-white/[0.08] rounded-full p-1 shadow-2xl shadow-black/40">
        <button onClick={() => setSearchParams({ view: 'marketplace' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all text-neutral-400 hover:text-white">Marketplace</button>
        <button onClick={() => setSearchParams({ view: 'founder' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all bg-white text-black">Founders</button>
        <button onClick={() => setSearchParams({ view: 'developer' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all text-neutral-400 hover:text-white">Developers</button>
      </div>

      {/* ═══ A) HERO — outcome-first with 3D sphere ═══ */}
      <div className="relative h-screen w-full overflow-hidden pt-14">
        {/* 3D Sphere background */}
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        {/* Content over sphere */}
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          <main className="flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-24">
            <div className="max-w-3xl space-y-7">
              <div className="overflow-hidden">
                <div className="founder-hero-reveal flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                  <span className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-medium">Now in Open Beta</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="overflow-hidden">
                  <h1 className="founder-hero-reveal text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] text-white">Build apps that</h1>
                </div>
                <div className="overflow-hidden">
                  <h1 className="founder-hero-reveal text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] text-neutral-400 italic">don't fall apart.</h1>
                </div>
              </div>

              <div className="overflow-hidden max-w-xl">
                <p className="founder-hero-reveal text-base md:text-lg text-neutral-400 leading-relaxed">
                  Logic Packs lets you assemble apps from proven, reusable building blocks — like LEGO for software. Ship faster. Break less. Reuse everything.
                </p>
              </div>

              <div className="overflow-hidden pt-2">
                <div className="founder-hero-reveal flex flex-wrap pointer-events-auto gap-3">
                  <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3.5 text-sm hover:bg-neutral-200 transition-colors">
                    Start Building Free <Icon icon="solar:arrow-right-linear" width={16} />
                  </button>
                  <a href="#how" className="inline-flex items-center gap-2 border border-white/15 text-white font-medium rounded-md px-8 py-3.5 text-sm hover:bg-white/5 transition-colors">
                    See How It Works
                  </a>
                </div>
              </div>

              <div className="overflow-hidden">
                <div className="founder-hero-reveal flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600">
                  <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500" width={16} /> Free to start</span>
                  <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500" width={16} /> No code required</span>
                  <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500" width={16} /> Works with AI tools</span>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-[5] pointer-events-none" />
      </div>

      {/* ═══ B) WHAT'S HAPPENING NOW — the AI shift ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-white/[0.06]">
            <div className="py-16 md:py-24 md:pr-12 lg:pr-20">
              <ScrollReveal>
                <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">The New Reality</span>
              </ScrollReveal>
              <ScrollReveal>
                <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-6">
                  Anyone can build an app now.<br />
                  <span className="text-neutral-500 italic font-light">Keeping it working is the hard part.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-neutral-400 text-base leading-relaxed mb-6 max-w-lg">
                  AI tools like ChatGPT, Cursor, and "vibe coding" have made building version 1 of an app incredibly fast. A weekend project. A hackathon idea. A prototype in hours.
                </p>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-neutral-500 text-base leading-relaxed max-w-lg">
                  But here's what nobody talks about: <strong className="text-white">version 1 was never the bottleneck</strong>. The real challenge starts when you need to update it, add features, fix bugs, and keep it running — without everything falling apart.
                </p>
              </ScrollReveal>
            </div>

            <div className="py-16 md:py-24 md:pl-12 lg:pl-20 flex flex-col justify-center">
              <ScrollReveal>
                <div className="space-y-5">
                  {[
                    { icon: 'solar:bolt-linear', color: 'text-yellow-400', title: 'Building v1 is now easy', desc: 'AI generates code in seconds. Anyone can prototype.' },
                    { icon: 'solar:danger-triangle-linear', color: 'text-orange-400', title: 'But updates break things', desc: 'Change one feature, three others stop working.' },
                    { icon: 'solar:refresh-circle-linear', color: 'text-red-400', title: 'Teams rebuild the same features', desc: 'Login, payments, dashboards — rebuilt from scratch every project.' },
                    { icon: 'solar:link-broken-linear', color: 'text-red-500', title: 'Integrations are chaos', desc: 'Every tool connects differently. Nothing fits together cleanly.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                        <Icon icon={item.icon} className={`${item.color} text-lg`} />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium mb-0.5">{item.title}</h4>
                        <p className="text-neutral-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ C) THE REAL PROBLEM — plain language ═══ */}
      <section className="border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/[0.02] to-transparent pointer-events-none" />
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <span className="text-red-400/80 text-xs font-medium uppercase tracking-[0.2em] block mb-4">The Hidden Cost</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-8">
                You're not building software.<br />You're <span className="text-red-400 italic">rebuilding</span> it.
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-neutral-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
                Every new project starts from scratch. Your team rewrites login systems, payment flows, admin dashboards, and notification logic — over and over. It's like building a house from raw lumber every time, even though the floor plan is the same.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { val: '60%', label: 'of dev time is spent rebuilding features that already exist somewhere', icon: 'solar:clock-circle-linear' },
              { val: '3–5×', label: 'more expensive to maintain an app than to build the first version', icon: 'solar:wallet-money-linear' },
              { val: '70%', label: 'of startups cite "integration headaches" as a top engineering pain', icon: 'solar:plug-circle-linear' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="text-center p-6 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                  <Icon icon={stat.icon} className="text-neutral-600 text-2xl mx-auto mb-3" />
                  <div className="text-3xl font-semibold text-white mb-2">{stat.val}</div>
                  <p className="text-neutral-500 text-sm leading-relaxed">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BRIDGE QUOTE ═══ */}
      <section className="border-t border-white/[0.06] py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[0.95]">
              What if you never had to<br />build the same thing <span className="text-green-500 italic">twice</span>?
            </h2>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ D) WHAT LOGIC PACKS DOES — LEGO analogy ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-0 lg:divide-x divide-white/[0.06]">
            <div className="py-16 md:py-24 lg:pr-16">
              <ScrollReveal>
                <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">The Solution</span>
              </ScrollReveal>
              <ScrollReveal>
                <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-6">
                  Reusable building blocks<br />for everything you build.
                </h2>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-neutral-400 text-base leading-relaxed mb-6 max-w-lg">
                  Think of it like LEGO. Instead of molding raw plastic every time you want to build something, you snap together pre-made pieces. Each piece is tested, reliable, and fits perfectly with the others.
                </p>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-neutral-400 text-base leading-relaxed mb-8 max-w-lg">
                  That's what a <strong className="text-white">"Pack"</strong> is — a proven, reusable building block for your app. Login? There's a pack for that. Payments? A pack. Email notifications? Pack. Admin dashboard? Pack.
                </p>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-lg">
                  Install a pack. Customize it. Snap it together with other packs. Launch your app. Then reuse those same packs across every project you ever build.
                </p>
              </ScrollReveal>
            </div>

            <div className="py-16 md:py-24 lg:pl-16 flex items-center">
              <ScrollReveal>
                <div className="w-full">
                  {/* Visual: Pack blocks */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { name: 'Login & Signup', icon: 'solar:lock-keyhole-linear', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                      { name: 'Payments', icon: 'solar:card-linear', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                      { name: 'Dashboard', icon: 'solar:chart-square-linear', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                      { name: 'Notifications', icon: 'solar:bell-linear', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
                      { name: 'File Uploads', icon: 'solar:cloud-upload-linear', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                      { name: 'CRM & Contacts', icon: 'solar:users-group-rounded-linear', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
                    ].map((pack, i) => (
                      <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${pack.bg} border ${pack.border} hover:scale-[1.02] transition-transform cursor-default`}>
                        <Icon icon={pack.icon} className={`${pack.color} text-xl`} />
                        <span className="text-white text-sm font-medium">{pack.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center py-4">
                    <div className="flex flex-col items-center gap-1 text-neutral-600">
                      <Icon icon="solar:arrow-down-linear" width={20} />
                      <span className="text-[10px] uppercase tracking-widest">Snap together</span>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="p-5 rounded-xl bg-green-500/[0.06] border border-green-500/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                      <Icon icon="solar:rocket-2-bold" className="text-green-500 text-2xl" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-semibold">Your App — Ready to Launch</h4>
                      <p className="text-green-500/70 text-xs">Assembled from 6 packs · Built in days, not months</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOUNDER STORY ═══ */}
      <section className="border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">Real Scenario</span>
            </ScrollReveal>
            <ScrollReveal>
              <blockquote className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed mb-6">
                "I used to spend <strong className="text-white">6 weeks</strong> building a customer portal for each new client. Same login system. Same dashboard. Same payment flow. Every single time."
              </blockquote>
            </ScrollReveal>
            <ScrollReveal>
              <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8">
                "With Logic Packs, I did it in a <strong className="text-green-500">weekend</strong>. And when I needed another portal for a different client, I just reused the same packs with a new look."
              </blockquote>
            </ScrollReveal>
            <ScrollReveal>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-sm font-semibold text-white">S</div>
                <div>
                  <p className="text-white text-sm font-medium">Sarah K.</p>
                  <p className="text-neutral-600 text-xs">Founder, 3× SaaS ventures</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ E) WHAT YOU GET — outcome bullets ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="text-center mb-14">
            <ScrollReveal>
              <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">Outcomes</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">What founders actually get.</h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-neutral-500 text-base max-w-xl mx-auto">Not features. Results.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'solar:rocket-2-linear', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', title: 'Ship 10× faster', desc: 'Stop rebuilding features. Snap together proven building blocks and launch in days instead of months.' },
              { icon: 'solar:refresh-circle-linear', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', title: 'Reuse across ventures', desc: 'Built a login system once? Use it in every app you ever build. Your packs follow you across projects.' },
              { icon: 'solar:wallet-money-linear', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', title: 'Cut dev costs by 40–60%', desc: 'Less rebuilding means less engineering time. Small teams ship what used to require large ones.' },
              { icon: 'solar:calendar-date-linear', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'Predictable delivery', desc: "No surprises. Packs come with clear specs and tested behavior. You know what you're getting before you install." },
              { icon: 'solar:shield-check-linear', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', title: 'Apps that stay working', desc: 'Packs are version-controlled and auto-tested. When something breaks, the system detects and fixes it automatically.' },
              { icon: 'solar:copy-linear', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', title: 'One team, multiple products', desc: 'Spin up an internal ops dashboard, a customer portal, and a partner app — all from the same building blocks.' },
            ].map((outcome, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="p-6 rounded-xl border border-white/[0.06] bg-[#0f0f0f] hover:bg-[#131313] hover:border-white/10 transition-all h-full">
                  <div className={`w-11 h-11 rounded-xl ${outcome.bg} border ${outcome.border} flex items-center justify-center mb-4`}>
                    <Icon icon={outcome.icon} className={`${outcome.color} text-xl`} />
                  </div>
                  <h3 className="text-white text-base font-semibold mb-2">{outcome.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{outcome.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ F) HOW IT WORKS — 4 steps, no jargon ═══ */}
      <section id="how" className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="text-center mb-14">
            <ScrollReveal>
              <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">Simple Process</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">Four steps. That's it.</h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-neutral-500 text-base max-w-xl mx-auto">From idea to working app. No engineering degree required.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', icon: 'solar:magnifer-linear', title: 'Browse & Pick', desc: 'Find the building blocks you need from the marketplace. Login, payments, CRM, dashboards — all ready to go.', example: 'Like choosing apps from the App Store, but for features inside your app.' },
              { n: '02', icon: 'solar:settings-minimalistic-linear', title: 'Customize', desc: 'Make each block your own. Change the look, adjust the behavior, set your business rules. No coding needed.', example: 'Think of it like customizing a recipe — same foundation, your twist.' },
              { n: '03', icon: 'solar:widget-add-linear', title: 'Snap Together', desc: 'Connect your building blocks. Login connects to dashboard. Payments connect to notifications. Everything fits.', example: 'Like LEGO — each piece clicks into the others perfectly.' },
              { n: '04', icon: 'solar:rocket-2-linear', title: 'Launch', desc: "Hit deploy. Your app is live. And because it's built from tested blocks, it works reliably from day one.", example: 'Launch a customer portal in a weekend. For real.' },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="relative p-6 rounded-xl border border-white/[0.06] bg-[#0f0f0f] hover:bg-[#131313] hover:border-white/10 transition-all h-full flex flex-col">
                  <span className="text-green-500 font-mono text-xs font-medium mb-4">{step.n}</span>
                  <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                    <Icon icon={step.icon} className="text-white text-lg" />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4">{step.desc}</p>
                  <p className="text-neutral-600 text-xs italic mt-auto pt-4 border-t border-white/[0.04]">{step.example}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ USE CASE SCENARIOS ═══ */}
      <section className="border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="text-center mb-14">
            <ScrollReveal>
              <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">Use Cases</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">What you can build this week.</h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'solar:monitor-smartphone-linear', title: 'Customer Portal', time: 'Weekend project', desc: 'Launch a fully working customer portal with login, billing, support tickets, and a dashboard. In a weekend, not a quarter.', packs: 'Auth + Dashboard + Payments + Notifications' },
              { icon: 'solar:chart-square-linear', title: 'Internal Ops Dashboard', time: '3 days', desc: 'Spin up an internal ops dashboard for your team without rebuilding auth or permissions every single time.', packs: 'Auth + Admin Panel + Analytics + CRM' },
              { icon: 'solar:copy-linear', title: 'Multi-Venture Reuse', time: 'Ongoing', desc: 'Reuse the same onboarding, CRM, and billing logic across multiple ventures. Build it once, deploy it everywhere.', packs: 'Onboarding + CRM + Payments + Email' },
            ].map((useCase, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="p-6 rounded-xl border border-white/[0.06] bg-[#0d0d0d] hover:border-green-500/20 transition-all h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <Icon icon={useCase.icon} className="text-green-500 text-2xl" />
                    <span className="text-[10px] uppercase tracking-wider text-green-500/70 font-medium">{useCase.time}</span>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4 flex-1">{useCase.desc}</p>
                  <div className="pt-4 border-t border-white/[0.04]">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-600 block mb-1.5">Packs used</span>
                    <span className="text-xs text-neutral-400 font-mono">{useCase.packs}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CREATION SURFACES — layman version ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="text-center mb-14">
            <ScrollReveal>
              <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">One Platform</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">Four ways to build. One workspace.</h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-neutral-500 text-base max-w-xl mx-auto">Whether you're designing screens, building features, automating tasks, or planning your product — it all happens in one place.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'solar:monitor-smartphone-linear', label: 'Build Screens', desc: "Design your app's look and feel. Drag, drop, and customize — then connect it to your building blocks.", color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
              { icon: 'solar:server-minimalistic-linear', label: 'Build Features', desc: 'Create the logic behind your app — the things that actually happen when users click buttons. Like recipes for actions.', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { icon: 'solar:bolt-circle-linear', label: 'Automate Tasks', desc: 'Set up things that happen on their own. Send an email when someone signs up. Update a spreadsheet when a sale happens.', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
              { icon: 'solar:pen-new-round-linear', label: 'Plan & Prototype', desc: 'Sketch your ideas on an infinite canvas. Map out flows, generate images, prototype before you build.', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            ].map((surface, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="p-6 rounded-xl border border-white/[0.06] bg-[#0f0f0f] hover:bg-[#131313] hover:border-white/10 transition-all h-full text-center">
                  <div className={`w-12 h-12 rounded-xl ${surface.bg} border ${surface.border} flex items-center justify-center mx-auto mb-4`}>
                    <Icon icon={surface.icon} className={`${surface.color} text-xl`} />
                  </div>
                  <h3 className="text-white text-base font-semibold mb-2">{surface.label}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{surface.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ G) WHY INVESTORS CARE ═══ */}
      <section className="border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <ScrollReveal>
                <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">For Investors</span>
              </ScrollReveal>
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
                  This isn't a feature.<br />It's a <span className="text-green-500">platform</span>.
                </h2>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-neutral-400 text-base leading-relaxed mb-8 max-w-lg">
                  Logic Packs is building the operating system for reusable software — in plain English: we're creating the foundation that every app can be built on. Think of it as an app factory instead of one-off projects.
                </p>
              </ScrollReveal>

              {/* Category definition */}
              <ScrollReveal>
                <div className="p-5 rounded-xl bg-green-500/[0.04] border border-green-500/15 mb-8">
                  <span className="text-green-500 text-xs font-medium uppercase tracking-widest block mb-2">Category Definition</span>
                  <p className="text-white text-base font-medium leading-relaxed">
                    "The platform where you build apps from proven building blocks — and every block gets better with every app that uses it."
                  </p>
                </div>
              </ScrollReveal>

              {/* Why Now */}
              <ScrollReveal>
                <h3 className="text-white text-lg font-semibold mb-4">Why now?</h3>
                <div className="space-y-3 mb-8">
                  {[
                    'AI made building v1 trivial — but exposed the maintenance crisis. The market needs a reliability layer.',
                    'Vibe coding created millions of new builders who need structure, not just code generation.',
                    'Enterprise software spend is $700B+. Reusable components capture margin from every layer.',
                  ].map((reason, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Icon icon="solar:arrow-right-linear" className="text-green-500 mt-1 shrink-0" width={14} />
                      <p className="text-neutral-400 text-sm leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Moat */}
            <div className="flex flex-col justify-center">
              <ScrollReveal>
                <h3 className="text-white text-lg font-semibold mb-6">The Moat — in plain English</h3>
                <div className="space-y-4">
                  {[
                    { icon: 'solar:verified-check-bold', color: 'text-green-500', title: 'Verified Pack Ecosystem', desc: "Every building block is tested and verified. Like Apple's App Store review, but for software components. Quality compounds." },
                    { icon: 'solar:users-group-rounded-linear', color: 'text-blue-400', title: 'Network Effects', desc: 'More users = more packs built = more reasons to join. Every new pack makes the platform more valuable for everyone.' },
                    { icon: 'solar:layers-minimalistic-linear', color: 'text-purple-400', title: 'Compounding Library', desc: 'Every pack ever built stays in the ecosystem. The library grows forever. Late entrants start 10,000 packs behind.' },
                    { icon: 'solar:lock-keyhole-minimalistic-linear', color: 'text-yellow-400', title: 'Switching Costs', desc: 'Once your apps are built on standardized packs, migrating off means rebuilding everything from scratch. Stickiness is built in.' },
                  ].map((moat, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <Icon icon={moat.icon} className={`${moat.color} text-xl mt-0.5 shrink-0`} />
                      <div>
                        <h4 className="text-white text-sm font-semibold mb-1">{moat.title}</h4>
                        <p className="text-neutral-500 text-sm leading-relaxed">{moat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Revenue model */}
              <ScrollReveal>
                <div className="mt-8 p-5 rounded-xl border border-white/[0.06] bg-[#0f0f0f]">
                  <h4 className="text-white text-sm font-semibold mb-3">Revenue Model</h4>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Subscriptions', desc: 'Free / Pro / Enterprise tiers' },
                      { label: 'Marketplace', desc: 'Take rate on premium pack sales' },
                      { label: 'Enterprise', desc: 'Custom deployments + support SLAs' },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-neutral-400">{r.label}</span>
                        <span className="text-neutral-600 text-xs">{r.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ H) SOCIAL PROOF ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="text-center mb-14">
            <ScrollReveal>
              <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">Traction</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">Early results speak for themselves.</h2>
            </ScrollReveal>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {[
              { val: '2,400+', label: 'Builders on the platform' },
              { val: '180+', label: 'Packs in the marketplace' },
              { val: '74%', label: 'Time saved per project (avg)' },
              { val: '12 min', label: 'Avg time to first working app' },
            ].map((metric, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="text-center p-6 rounded-xl border border-white/[0.06] bg-[#0f0f0f] hover:bg-[#131313] transition-colors">
                  <div className="text-3xl md:text-4xl font-semibold text-white mb-1">{metric.val}</div>
                  <p className="text-neutral-500 text-xs">{metric.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {[
              { quote: "We launched our internal tools suite in 2 weeks. Our CTO estimated it would have taken 3 months the traditional way.", name: 'Marcus R.', role: 'COO, FinTech Startup', initials: 'MR' },
              { quote: "The marketplace is a game-changer. We found a customer onboarding pack that saved us from building it from scratch — again.", name: 'Priya S.', role: 'Product Lead, SaaS Company', initials: 'PS' },
              { quote: "I'm not technical. At all. But I assembled a working MVP for my agency's client portal in a weekend. That's never happened before.", name: 'James T.', role: 'Agency Founder', initials: 'JT' },
            ].map((testimonial, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="p-6 rounded-xl border border-white/[0.06] bg-[#0f0f0f] h-full flex flex-col">
                  <Icon icon="solar:quote-down-circle-linear" className="text-green-500/30 text-2xl mb-3" />
                  <p className="text-neutral-300 text-sm leading-relaxed mb-6 flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                    <div className="w-9 h-9 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-semibold text-white">{testimonial.initials}</div>
                    <div>
                      <p className="text-white text-xs font-medium">{testimonial.name}</p>
                      <p className="text-neutral-600 text-[11px]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Logos placeholder */}
          <ScrollReveal>
            <div className="text-center">
              <p className="text-neutral-700 text-xs uppercase tracking-widest mb-6">Backed by builders from</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {LOGOS.map((logo, i) => (
                  <span key={i} className="text-neutral-700 hover:text-neutral-500 transition-colors text-sm font-medium tracking-tight">{logo}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ I) PRICING — layman terms ═══ */}
      <section id="pricing" className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="text-center mb-14">
            <ScrollReveal>
              <span className="text-green-500 text-xs font-medium uppercase tracking-[0.2em] block mb-4">Pricing</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">Start free. Scale when ready.</h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-neutral-500 text-base max-w-xl mx-auto">No surprises. No hidden fees. Choose the plan that matches where you are right now.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                tier: 'Free',
                price: '$0',
                who: 'For solo founders exploring ideas',
                desc: 'Everything you need to try Logic Packs and build your first app.',
                features: ['1 project', 'Community building blocks', 'Basic automation', 'Public marketplace access'],
                cta: 'Get Started Free',
                ctaClass: 'bg-white text-black hover:bg-neutral-200',
              },
              {
                tier: 'Pro',
                price: '$29',
                unit: '/month',
                who: 'For teams shipping real products',
                desc: 'Unlimited projects, premium building blocks, and apps that fix themselves.',
                features: ['Unlimited projects', 'Verified premium packs', 'Unlimited automations', 'Auto-healing (apps fix themselves)', 'Team collaboration'],
                cta: 'Start Pro — 14 Day Trial',
                ctaClass: 'bg-green-500 text-black hover:bg-green-400',
                highlight: true,
              },
              {
                tier: 'Enterprise',
                price: 'Custom',
                who: 'For organizations needing control',
                desc: 'Dedicated infrastructure, compliance, and a team that has your back.',
                features: ['Dedicated setup', 'Audit & compliance tools', 'Priority support + SLA', 'Custom integrations'],
                cta: 'Talk to Sales',
                ctaClass: 'border border-white/10 text-white hover:bg-white/5',
              },
            ].map((plan) => (
              <ScrollReveal key={plan.tier}>
                <div className={`p-6 md:p-8 rounded-xl border h-full flex flex-col ${plan.highlight ? 'border-green-500/30 bg-green-500/[0.03]' : 'border-white/[0.06] bg-[#0f0f0f]'}`}>
                  <span className="text-green-500 font-mono text-[10px] uppercase tracking-widest mb-3">{plan.tier}</span>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-semibold text-white">{plan.price}</span>
                    {plan.unit && <span className="text-neutral-500 text-sm">{plan.unit}</span>}
                  </div>
                  <p className="text-neutral-600 text-xs mb-4">{plan.who}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">{plan.desc}</p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                        <Icon icon="solar:check-circle-bold" className="text-green-500 shrink-0" width={16} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={openBeta} className={`block w-full text-center px-5 py-3 rounded-md text-sm font-semibold transition-colors ${plan.ctaClass}`}>{plan.cta}</button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ J) FINAL CTA ═══ */}
      <section className="border-t border-white/[0.06] py-28 md:py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[40vw] h-[40vw] bg-green-500/[0.05] blur-[150px] rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-5">
              Stop rebuilding.<br />Start assembling.
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-lg">
              Join the founders who ship faster, spend less on engineering, and build apps that actually stay working.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3.5 text-sm hover:bg-neutral-200 transition-colors">
                Get Started Free <Icon icon="solar:arrow-right-linear" width={16} />
              </button>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/15 text-white font-medium rounded-md px-8 py-3.5 text-sm hover:bg-white/5 transition-colors">
                Browse Marketplace
              </button>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-neutral-700 text-xs mt-8">Free forever. No credit card required.</p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

