import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ScrollReveal from '../components/ScrollReveal';

const FAQ_ITEMS = [
  { q: 'How does credit-based investment work?', a: 'Instead of cash, investors fund apps with Logic Packs credits. These credits become compute — API calls, pack installs, automation runs. When the app generates revenue (subscriptions, fees), investors earn a proportional share based on their credit stake.' },
  { q: "What's the minimum investment?", a: '$50 in credits. There\'s no maximum — you can invest up to $5,000 per app. Investments are instant with zero paperwork.' },
  { q: 'How do founders receive credits?', a: 'Once accepted into a tier (Spark, Launch, or Scale), credits are instantly deposited into the founder\'s Logic Packs workspace. They can use them for API calls, pack installations, automation runs, and compute.' },
  { q: "What's the revenue share model?", a: 'Revenue share is proportional to credit stake. If you invested $500 of the $5,000 total credits, you own 10% of the revenue share pool. LP Ventures takes a 5% platform fee on distributions.' },
  { q: 'Can I withdraw credits as cash?', a: 'Credits are non-refundable but transferable to other users. Revenue share earnings, however, are paid out in cash monthly via bank transfer or crypto.' },
  { q: 'What happens if an app fails?', a: 'Credits already consumed as compute are not recoverable. Unused credits can be transferred. Apps that fall below 80% test coverage or become inactive for 30 days are flagged and may be delisted from the investor board.' },
];

export default function Ventures() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* ═══ ① HERO ═══ */}
      <section className="pt-14 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[50vw] h-[50vw] bg-green-500/[0.04] blur-[150px] rounded-full translate-y-[-10%]" />
        </div>
        <div className="relative z-10 border-b border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-24 md:py-36 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
              <span className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-mono">Now Accepting Applications</span>
            </div>
            <ScrollReveal>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-6">
                Micro VC for the<br /><span className="text-neutral-500 italic">Pack Ecosystem</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                Instant investment. Credits-based funding. Real-time telemetry. The fastest path from idea to funded app.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/founders" className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-neutral-200 transition-colors">
                  I'm a Founder <Icon icon="solar:arrow-right-linear" width={16} />
                </Link>
                <Link to="/investors" className="inline-flex items-center gap-2 bg-green-500 text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-green-400 transition-colors">
                  I'm an Investor <Icon icon="solar:arrow-right-linear" width={16} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ ② HOW IT WORKS — Split View ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-white/[0.06]">
          {/* Founders Side */}
          <div className="p-8 md:p-14">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// For Founders</span>
            <ScrollReveal><h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-8">Build → Apply → Get Funded</h2></ScrollReveal>
            <div className="space-y-6">
              {[
                { n: '01', title: 'Build on Logic Packs', desc: 'Use any mode — UI, Logic, Notebook, Canvas. Install packs, compose your app, enable telemetry.' },
                { n: '02', title: 'Apply for Incubation', desc: 'Submit your app, pack stack, and pitch. We review within 48 hours.' },
                { n: '03', title: 'Get Credits + Mentorship + Visibility', desc: 'Receive $500–$10,000 in platform credits, a mentor, and investor board listing.', green: true },
              ].map(step => (
                <ScrollReveal key={step.n}>
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full ${step.green ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'} border flex items-center justify-center shrink-0`}>
                      <span className={`${step.green ? 'text-green-500' : 'text-white'} font-mono text-xs`}>{step.n}</span>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">{step.title}</h4>
                      <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal>
              <Link to="/founders" className="inline-flex items-center gap-2 mt-8 border border-white/10 text-neutral-300 px-5 py-2.5 rounded-md text-xs font-medium hover:bg-white/5 transition-all">
                Apply Now <Icon icon="solar:arrow-right-up-linear" width={14} className="text-neutral-500" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Investors Side */}
          <div className="p-8 md:p-14 border-t md:border-t-0 border-white/[0.06]">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// For Investors</span>
            <ScrollReveal><h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-8">Browse → Invest → Earn</h2></ScrollReveal>
            <div className="space-y-6">
              {[
                { n: '01', title: 'Browse Live Deals', desc: 'See real apps with real-time telemetry — users, uptime, test coverage, revenue.' },
                { n: '02', title: 'Micro-Invest Credits ($50–$5,000)', desc: 'Fund apps instantly with credits. No paperwork. No minimums. No lock-up.' },
                { n: '03', title: 'Earn Revenue Share', desc: 'When apps monetize, you earn proportional returns. Track everything in real-time.', green: true },
              ].map(step => (
                <ScrollReveal key={step.n}>
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full ${step.green ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'} border flex items-center justify-center shrink-0`}>
                      <span className={`${step.green ? 'text-green-500' : 'text-white'} font-mono text-xs`}>{step.n}</span>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">{step.title}</h4>
                      <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal>
              <Link to="/investors" className="inline-flex items-center gap-2 mt-8 border border-green-500/20 text-green-400 px-5 py-2.5 rounded-md text-xs font-medium hover:bg-green-500/5 transition-all">
                Browse Deals <Icon icon="solar:arrow-right-up-linear" width={14} className="text-green-500/60" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ ③ LIVE STATS BAR ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-white/[0.06]">
          {[
            { val: '$847K', label: 'Credits Deployed' },
            { val: '142', label: 'Apps Funded' },
            { val: '<48h', label: 'Avg. Time to Fund', green: true },
            { val: '23%', label: 'Avg. Investor Return' },
          ].map(s => (
            <div key={s.label} className="p-6 md:p-8 text-center hover:bg-white/[0.015] transition-colors">
              <div className={`text-3xl md:text-4xl font-semibold ${s.green ? 'text-green-500' : 'text-white'} tracking-tight mb-1`}>{s.val}</div>
              <p className="text-neutral-600 text-xs font-mono uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1 p-6 md:p-8 text-center bg-green-500/[0.03] hover:bg-green-500/[0.05] transition-colors flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-green-500 font-semibold text-lg">Live</span>
            </div>
            <p className="text-neutral-600 text-xs font-mono uppercase tracking-wider">Real-time Status</p>
          </div>
        </div>
      </section>

      {/* ═══ ④ THE MODEL — Why Credits, Not Cash ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// The Model</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Why Credits,<br />Not Cash</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">A fundamentally different investment model built for the Logic Packs ecosystem.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y md:divide-x divide-white/[0.06]">
            {[
              { icon: 'solar:cpu-bolt-linear', title: 'Credits = Compute', desc: 'Investment directly fuels the app — API calls, pack installs, automation runs. No cash sitting idle.', green: true },
              { icon: 'solar:bolt-circle-linear', title: 'Zero Friction', desc: 'No legal paperwork for micro amounts. Invest $50 instantly. No SAFEs, no cap tables, no lawyers.' },
              { icon: 'solar:chart-2-linear', title: 'Transparent Telemetry', desc: 'Everything runs on Logic Packs — investors see real metrics: uptime, users, API calls, self-healing events, test pass rates.' },
              { icon: 'solar:money-bag-linear', title: 'Revenue Share', desc: 'When the app monetizes — subscriptions, marketplace fees — investors get proportional returns to their credit stake.', green: true },
            ].map(item => (
              <ScrollReveal key={item.title}>
                <div className="p-8 md:p-10 hover:bg-white/[0.015] transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${item.green ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'} border flex items-center justify-center mb-5`}>
                    <Icon icon={item.icon} className={`${item.green ? 'text-green-500' : 'text-neutral-400'} text-lg`} />
                  </div>
                  <h3 className="text-lg text-white font-medium tracking-tight mb-2">{item.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Flow Diagram ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-0 text-center">
              {[
                { icon: 'solar:user-rounded-linear', label: 'Investor', green: true },
                { icon: 'solar:wallet-money-linear', label: 'Credits', green: true },
                { icon: 'solar:widget-5-linear', label: 'App', sub: 'Compute · Packs · Runs' },
                { icon: 'solar:dollar-minimalistic-linear', label: 'Revenue' },
                { icon: 'solar:graph-up-linear', label: 'Returns', green: true },
              ].map((step, i) => (
                <div key={step.label} className="contents">
                  <ScrollReveal>
                    <div className="flex-1 p-4">
                      <div className={`w-12 h-12 rounded-full ${step.green ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'} border flex items-center justify-center mx-auto mb-3`}>
                        <Icon icon={step.icon} className={`${step.green ? 'text-green-500' : 'text-neutral-400'} text-lg`} />
                      </div>
                      <span className="text-white text-sm font-medium block">{step.label}</span>
                      {step.sub && <span className="text-neutral-600 text-[10px] font-mono">{step.sub}</span>}
                    </div>
                  </ScrollReveal>
                  {i < 4 && (
                    <>
                      <Icon icon="solar:arrow-right-linear" className="text-neutral-700 text-xl hidden md:block" />
                      <Icon icon="solar:arrow-down-linear" className="text-neutral-700 text-xl md:hidden" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ⑤ FEATURED PORTFOLIO ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-2">/// Portfolio</span>
              <ScrollReveal><h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Featured Apps</h2></ScrollReveal>
            </div>
            <Link to="/investors" className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">View all deals <Icon icon="solar:arrow-right-linear" width={14} /></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'ShopStack', packs: 'Auth + Payments + Dashboard', stage: 'Launch', stageColor: 'bg-green-500/15 text-green-400 border-green-500/20', icon: 'solar:cart-large-minimalistic-linear', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20', users: '2.4k', mrr: '$8.2k', funded: '$3,200 / $5,000', progress: 64, backers: '14 backers' },
              { name: 'FeedbackLoop', packs: 'Auth + Email + Form Builder', stage: 'Scale', stageColor: 'bg-purple-500/15 text-purple-400 border-purple-500/20', icon: 'solar:chat-round-dots-linear', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20', users: '5.1k', mrr: '$12k', funded: '$10,000 / $10,000', progress: 100, backers: '28 backers · Fully funded' },
              { name: 'InvoiceBot', packs: 'Payments + PDF + Scheduler', stage: 'Spark', stageColor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', icon: 'solar:document-text-linear', iconColor: 'text-orange-400', iconBg: 'bg-orange-500/10 border-orange-500/20', users: '340', mrr: '$1.1k', funded: '$480 / $500', progress: 96, backers: '7 backers' },
              { name: 'ClinicOS', packs: 'Auth + CRUD + LPDN', stage: 'Launch', stageColor: 'bg-green-500/15 text-green-400 border-green-500/20', icon: 'solar:heart-pulse-linear', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20', users: '890', mrr: '$3.4k', funded: '$1,800 / $2,500', progress: 72, backers: '11 backers' },
            ].map(app => (
              <ScrollReveal key={app.name}>
                <div className="border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.015] transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${app.iconBg} border flex items-center justify-center`}>
                      <Icon icon={app.icon} className={`${app.iconColor} text-lg`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white text-sm font-medium truncate">{app.name}</h3>
                      <span className="text-neutral-600 text-[10px] font-mono">{app.packs}</span>
                    </div>
                    <span className={`ml-auto px-2 py-0.5 rounded text-[9px] font-semibold border ${app.stageColor}`}>{app.stage}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-md p-2 text-center"><span className="text-white text-sm font-semibold block">{app.users}</span><span className="text-neutral-600 text-[9px] font-mono">users</span></div>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-md p-2 text-center"><span className="text-white text-sm font-semibold block">{app.mrr}</span><span className="text-neutral-600 text-[9px] font-mono">MRR</span></div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1"><span className="text-neutral-500">Funded</span><span className="text-white font-mono">{app.funded}</span></div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${app.progress}%` }} /></div>
                  </div>
                  <span className="text-neutral-600 text-[10px] font-mono">{app.backers}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ⑥ INCUBATION TIERS ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Tiers</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Incubation Levels</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Three tiers based on your app's stage. More traction = more credits, more support.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {/* Spark */}
            <ScrollReveal>
              <div className="p-8 hover:bg-white/[0.015] transition-colors">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider inline-block mb-4">Spark</span>
                <div className="text-3xl font-semibold text-white tracking-tight mb-1">$500</div>
                <span className="text-neutral-600 text-xs font-mono mb-4 block">credits · 4 weeks</span>
                <ul className="space-y-2 text-xs text-neutral-500 mb-6">
                  {['Platform credits', 'Community support', 'Marketplace listing', 'Basic telemetry'].map(f => (
                    <li key={f} className="flex items-center gap-2"><Icon icon="solar:check-circle-linear" className="text-green-500/60" width={14} />{f}</li>
                  ))}
                </ul>
                <p className="text-neutral-700 text-[10px] italic">For experiments</p>
              </div>
            </ScrollReveal>
            {/* Launch */}
            <ScrollReveal>
              <div className="p-8 bg-green-500/[0.02] hover:bg-green-500/[0.04] transition-colors">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20 uppercase tracking-wider inline-block mb-4">Launch</span>
                <div className="text-3xl font-semibold text-white tracking-tight mb-1">$2,500</div>
                <span className="text-neutral-600 text-xs font-mono mb-4 block">credits · 8 weeks</span>
                <ul className="space-y-2 text-xs text-neutral-500 mb-6">
                  {['Everything in Spark', 'Dedicated mentor', 'Featured placement', 'Full analytics', 'Investor board listing'].map((f, i) => (
                    <li key={f} className="flex items-center gap-2"><Icon icon="solar:check-circle-linear" className={i === 0 ? 'text-green-500/60' : 'text-green-500'} width={14} />{f}</li>
                  ))}
                </ul>
                <p className="text-neutral-700 text-[10px] italic">For MVPs</p>
              </div>
            </ScrollReveal>
            {/* Scale */}
            <ScrollReveal>
              <div className="p-8 hover:bg-white/[0.015] transition-colors">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/20 uppercase tracking-wider inline-block mb-4">Scale</span>
                <div className="text-3xl font-semibold text-white tracking-tight mb-1">$10,000+</div>
                <span className="text-neutral-600 text-xs font-mono mb-4 block">credits · 12 weeks</span>
                <ul className="space-y-2 text-xs text-neutral-500 mb-6">
                  {['Everything in Launch', 'Investor matching', 'Demo day slot', 'Custom infra', 'Priority self-healing'].map((f, i) => (
                    <li key={f} className="flex items-center gap-2"><Icon icon="solar:check-circle-linear" className={i === 0 ? 'text-green-500/60' : 'text-purple-400'} width={14} />{f}</li>
                  ))}
                </ul>
                <p className="text-neutral-700 text-[10px] italic">For scaling apps</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ ⑦ TRUST LAYER ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
          <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Trust</span>
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-6">
              Every app runs on<br /><span className="text-neutral-500 italic">Logic Packs infrastructure.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal><p className="text-neutral-500 text-base max-w-2xl mx-auto mb-12">Investors see what they're funding. Founders prove what they've built. The infrastructure is the trust layer.</p></ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { icon: 'solar:verified-check-bold', title: 'Pack Verified', sub: 'All packs audited' },
              { icon: 'solar:test-tube-linear', title: 'Test Coverage', sub: '80%+ required' },
              { icon: 'solar:heart-pulse-linear', title: 'Self-Healing', sub: 'Reliability score' },
              { icon: 'solar:chart-2-linear', title: 'Open Telemetry', sub: 'Real-time metrics' },
              { icon: 'solar:eye-linear', title: 'Transparent', sub: 'Public dashboards', span: true },
            ].map(t => (
              <ScrollReveal key={t.title}>
                <div className={`border border-white/[0.06] rounded-lg p-4 hover:bg-white/[0.015] transition-colors ${t.span ? 'col-span-2 md:col-span-1' : ''}`}>
                  <Icon icon={t.icon} className="text-green-500 text-xl mb-2" />
                  <span className="text-white text-xs font-medium block">{t.title}</span>
                  <span className="text-neutral-600 text-[10px]">{t.sub}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ⑧ CTA SPLIT ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-white/[0.06]">
          <Link to="/founders" className="group p-12 md:p-16 flex flex-col justify-center hover:bg-white/[0.015] transition-colors">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Founders</span>
            <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3 group-hover:text-green-50 transition-colors">Ready to build?</h3>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-6">Apply for incubation and get instant credits, mentorship, and investor visibility.</p>
            <span className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-6 py-3 text-sm w-max group-hover:bg-neutral-200 transition-colors">
              Apply Now <Icon icon="solar:arrow-right-linear" width={16} />
            </span>
          </Link>
          <Link to="/investors" className="group p-12 md:p-16 flex flex-col justify-center bg-green-500/[0.03] hover:bg-green-500/[0.06] transition-colors border-t md:border-t-0 border-white/[0.06]">
            <span className="font-mono text-green-500/60 text-[11px] block mb-3">/// Investors</span>
            <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3 group-hover:text-green-50 transition-colors">Ready to invest?</h3>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-6">Browse live deals with real-time telemetry. Micro-invest from $50. Earn revenue share.</p>
            <span className="inline-flex items-center gap-2 bg-green-500 text-black font-semibold rounded-md px-6 py-3 text-sm w-max group-hover:bg-green-400 transition-colors">
              Browse Deals <Icon icon="solar:arrow-right-linear" width={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* ═══ ⑨ FAQ ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// FAQ</span>
            <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-8">Common Questions</h2></ScrollReveal>
            <div className="divide-y divide-white/[0.06]">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="faq-item">
                  <button className="w-full flex items-center justify-between py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                    <Icon icon="solar:alt-arrow-down-linear" className={`text-neutral-600 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} width={16} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-[300px] pb-3' : 'max-h-0'}`}>
                    <p className="text-neutral-500 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
