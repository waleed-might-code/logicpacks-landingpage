import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

const DEALS = [
  { name: 'ShopStack', desc: 'Full-stack e-commerce builder on Logic Packs', detail: 'Build complete stores with Auth + Payments + Dashboard packs. One-click Stripe, inventory, analytics.', packs: 'Auth + Payments + Dashboard', category: 'ecommerce', stage: 'launch', stageLabel: 'Launch', stageColor: 'text-green-400', icon: 'solar:cart-large-minimalistic-linear', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20', users: '2.4k', uptime: '99%', tests: '94%', mrr: '$8.2k', funded: '$3,200 / $5,000', progress: 64, backers: '14 backers', fullyFunded: false },
  { name: 'FeedbackLoop', desc: 'AI-powered user feedback aggregator', detail: 'Collect, categorize, and act on user feedback. Auto-tag themes, sentiment analysis, Slack/email integration.', packs: 'Auth + Email + Form Builder', category: 'saas', stage: 'scale', stageLabel: 'Scale', stageColor: 'text-purple-400', icon: 'solar:chat-round-dots-linear', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20', users: '5.1k', uptime: '99.8%', tests: '97%', mrr: '$12k', funded: '$10,000 / $10,000', progress: 100, backers: '28 backers', fullyFunded: true },
  { name: 'InvoiceBot', desc: 'Automated invoicing and payment tracking', detail: 'Generate, send, and track invoices. Auto-reminders, multi-currency, PDF export, payment reconciliation.', packs: 'Payments + PDF + Scheduler', category: 'saas', stage: 'spark', stageLabel: 'Spark', stageColor: 'text-yellow-400', icon: 'solar:document-text-linear', iconColor: 'text-orange-400', iconBg: 'bg-orange-500/10 border-orange-500/20', users: '340', uptime: '98%', tests: '86%', mrr: '$1.1k', funded: '$480 / $500', progress: 96, backers: '7 backers', fullyFunded: false },
  { name: 'ClinicOS', desc: 'Offline-first clinic management via LPDN', detail: 'Patient records, scheduling, prescriptions — works offline via LPDN. Syncs when connected. Built for rural clinics.', packs: 'Auth + CRUD + LPDN', category: 'saas', stage: 'launch', stageLabel: 'Launch', stageColor: 'text-green-400', icon: 'solar:heart-pulse-linear', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20', users: '890', uptime: '97%', tests: '91%', mrr: '$3.4k', funded: '$1,800 / $2,500', progress: 72, backers: '11 backers', fullyFunded: false },
  { name: 'SummarizeAI', desc: 'Multi-model content summarization engine', detail: 'Drop any doc, video, or URL. Get structured summaries across multiple AI models. Compare outputs, export notes.', packs: 'Provider + PDF + Storage', category: 'ai', stage: 'spark', stageLabel: 'Spark', stageColor: 'text-yellow-400', icon: 'solar:magic-stick-3-linear', iconColor: 'text-cyan-400', iconBg: 'bg-cyan-500/10 border-cyan-500/20', users: '120', uptime: '96%', tests: '82%', mrr: '$400', funded: '$280 / $500', progress: 56, backers: '4 backers', fullyFunded: false },
  { name: 'DeployKit', desc: 'One-click deployment for Logic Pack apps', detail: 'Deploy any LP app to cloud or LPDN in one click. Auto-scaling, rollback, edge caching, custom domains.', packs: 'Infra + DNS + Monitoring', category: 'devtools', stage: 'launch', stageLabel: 'Launch', stageColor: 'text-green-400', icon: 'solar:server-square-linear', iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/10 border-indigo-500/20', users: '680', uptime: '99.5%', tests: '92%', mrr: '$4.8k', funded: '$2,100 / $2,500', progress: 84, backers: '9 backers', fullyFunded: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'FeedbackLoop', cat: 'SaaS', funded: '$10,000', users: '5,100', mrr: '$12,000', ret: '+34%', stage: 'Scale', stageColor: 'bg-purple-500/15 text-purple-400' },
  { rank: 2, name: 'ShopStack', cat: 'E-commerce', funded: '$3,200', users: '2,400', mrr: '$8,200', ret: '+28%', stage: 'Launch', stageColor: 'bg-green-500/15 text-green-400' },
  { rank: 3, name: 'DeployKit', cat: 'Dev Tools', funded: '$2,100', users: '680', mrr: '$4,800', ret: '+22%', stage: 'Launch', stageColor: 'bg-green-500/15 text-green-400' },
  { rank: 4, name: 'ClinicOS', cat: 'Healthcare', funded: '$1,800', users: '890', mrr: '$3,400', ret: '+19%', stage: 'Launch', stageColor: 'bg-green-500/15 text-green-400' },
  { rank: 5, name: 'InvoiceBot', cat: 'SaaS', funded: '$480', users: '340', mrr: '$1,100', ret: '+12%', stage: 'Spark', stageColor: 'bg-yellow-500/15 text-yellow-400' },
];

const FAQ_ITEMS = [
  { q: "What's the minimum investment?", a: '$50 in credits per investment. You can invest across multiple apps. Maximum of $5,000 per individual app.' },
  { q: 'How does revenue share work?', a: 'When an app monetizes (subscriptions, marketplace fees, etc.), revenue is distributed proportionally to credit stake. LP Ventures takes a 5% platform fee. Payouts are monthly via bank transfer or crypto.' },
  { q: 'Can I sell my position?', a: "Credits are transferable. You can transfer your credit stake to another investor on the platform. We're building a secondary marketplace for position trading." },
  { q: 'What if an app shuts down?', a: 'Credits already consumed as compute are not recoverable. Unused credits are transferred back to your account. Apps are monitored — if they fall below quality thresholds, investors are notified before delisting.' },
  { q: 'How do I track my portfolio?', a: 'Your investor dashboard shows total invested, current portfolio value, revenue earned, per-app breakdowns, and real-time alerts for milestones.' },
  { q: 'Are returns guaranteed?', a: 'No. Like any investment, returns are not guaranteed. However, our real-time telemetry gives you far more visibility than traditional investing, so you can make informed decisions based on actual app performance.' },
];

const COMPARISON = [
  { label: 'Min investment', trad: '$25,000+', angel: '$1,000', lp: '$50' },
  { label: 'Due diligence', trad: 'Months', angel: 'Weeks', lp: 'Real-time telemetry' },
  { label: 'Time to fund', trad: '3–6 months', angel: '2–4 weeks', lp: 'Instant' },
  { label: 'Transparency', trad: 'Quarterly reports', angel: 'Monthly updates', lp: 'Live dashboards' },
  { label: 'Paperwork', trad: 'SAFEs, legal review', angel: 'Simplified', lp: 'Zero' },
];

export default function Investors() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStage, setActiveStage] = useState(null);
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const { openBetaModal } = useBeta();

  const filteredDeals = DEALS.filter(d => {
    const catMatch = activeCategory === 'all' || d.category === activeCategory;
    const stageMatch = !activeStage || d.stage === activeStage;
    const searchMatch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.detail.toLowerCase().includes(search.toLowerCase());
    return catMatch && stageMatch && searchMatch;
  });

  const toggleStage = (stage) => {
    setActiveStage(activeStage === stage ? null : stage);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-14 border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-3 flex items-center gap-2 text-xs text-neutral-600">
          <Link to="/ventures" className="hover:text-white transition-colors">Ventures</Link>
          <Icon icon="solar:alt-arrow-right-linear" width={12} />
          <span className="text-neutral-400">For Investors</span>
        </div>
      </div>

      {/* ═══ ① HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[50vw] h-[50vw] bg-green-500/[0.04] blur-[150px] rounded-full translate-y-[-10%]" />
        </div>
        <div className="relative z-10 border-b border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-24 md:py-36 text-center">
            <ScrollReveal>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-6">
                Invest in the<br /><span className="text-neutral-500 italic">Future of Software</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                Browse real apps with real telemetry. Micro-invest from $50. Earn revenue share as apps grow. Zero paperwork.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-mono text-neutral-400 mb-10">
                <span><span className="text-white font-semibold">$847K</span> deployed</span>
                <span className="text-neutral-700">·</span>
                <span><span className="text-green-500 font-semibold">23%</span> avg return</span>
                <span className="text-neutral-700">·</span>
                <span><span className="text-white font-semibold">142</span> apps funded</span>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 justify-center">
                <a href="#deals" className="inline-flex items-center gap-2 bg-green-500 text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-green-400 transition-colors">
                  Browse Deals <Icon icon="solar:arrow-right-linear" width={16} />
                </a>
                <a href="#how-it-works" className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 font-medium rounded-md px-8 py-3 text-sm hover:bg-white/5 transition-colors">
                  How It Works
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ ② INVESTMENT MODEL — 4 Steps ═══ */}
      <section id="how-it-works" className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {[
            { icon: 'solar:eye-linear', n: '01', title: 'Browse', desc: 'See live apps with real-time telemetry — users, uptime, test coverage, revenue.', green: true },
            { icon: 'solar:wallet-money-linear', n: '02', title: 'Invest', desc: 'Fund apps with credits — $50 to $5,000 per investment. Instant. No paperwork.', green: true },
            { icon: 'solar:cpu-bolt-linear', n: '03', title: 'Fuel', desc: 'Your credits become compute — API calls, pack access, automation runs. The app grows.' },
            { icon: 'solar:graph-up-linear', n: '04', title: 'Earn', desc: 'When the app monetizes, you earn proportional revenue share. Track returns in real-time.', green: true },
          ].map(step => (
            <ScrollReveal key={step.n}>
              <div className="p-8 md:p-10 text-center hover:bg-white/[0.015] transition-colors">
                <div className={`w-12 h-12 rounded-full ${step.green ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'} border flex items-center justify-center mx-auto mb-5`}>
                  <Icon icon={step.icon} className={`${step.green ? 'text-green-500' : 'text-neutral-400'} text-lg`} />
                </div>
                <span className="text-white text-xs font-mono uppercase tracking-wider block mb-2">Step {step.n}</span>
                <h3 className="text-white text-lg font-medium tracking-tight mb-2">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ ③ LIVE DEAL BOARD ═══ */}
      <section id="deals" className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-2">/// Deal Board</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight">Live Deals</h2></ScrollReveal>
            </div>
            <div className="relative max-w-xs w-full">
              <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" width={16} />
              <input type="text" placeholder="Search deals…" value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent border border-white/[0.06] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'all', label: 'All' },
              { id: 'saas', label: 'SaaS' },
              { id: 'ecommerce', label: 'E-commerce' },
              { id: 'ai', label: 'AI/ML' },
              { id: 'devtools', label: 'Developer Tools' },
              { id: 'marketplace', label: 'Marketplace' },
            ].map(f => (
              <button key={f.id} onClick={() => setActiveCategory(f.id)} className={`px-3 py-1.5 border border-white/[0.06] rounded-md text-xs font-medium transition-all ${activeCategory === f.id ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'text-neutral-400 hover:text-white'}`}>
                {f.label}
              </button>
            ))}
            <span className="mx-2 border-l border-white/[0.06]" />
            {[
              { id: 'spark', label: 'Spark', color: 'bg-yellow-400' },
              { id: 'launch', label: 'Launch', color: 'bg-green-400' },
              { id: 'scale', label: 'Scale', color: 'bg-purple-400' },
            ].map(s => (
              <button key={s.id} onClick={() => toggleStage(s.id)} className={`px-3 py-1.5 border border-white/[0.06] rounded-md text-xs font-medium transition-all ${activeStage === s.id ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'text-neutral-400 hover:text-white'}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.color} mr-1.5`} />{s.label}
              </button>
            ))}
          </div>

          {/* Deal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDeals.map(deal => (
              <ScrollReveal key={deal.name}>
                <div className="border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.015] transition-all hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-lg ${deal.iconBg} border flex items-center justify-center`}>
                      <Icon icon={deal.icon} className={`${deal.iconColor} text-lg`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-sm font-medium truncate">{deal.name}</h3>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/15 text-green-400 border border-green-500/20 uppercase">Ventures</span>
                      </div>
                      <p className="text-neutral-600 text-[11px] truncate">{deal.desc}</p>
                    </div>
                  </div>
                  <p className="text-neutral-500 text-xs leading-relaxed mb-4">{deal.detail}</p>
                  <div className="text-[10px] text-neutral-600 font-mono mb-4">Pack Stack: <span className="text-neutral-400">{deal.packs}</span></div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded p-2 text-center"><span className="text-white text-xs font-semibold block">{deal.users}</span><span className="text-neutral-600 text-[9px]">users</span></div>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded p-2 text-center"><span className="text-white text-xs font-semibold block">{deal.uptime}</span><span className="text-neutral-600 text-[9px]">uptime</span></div>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded p-2 text-center"><span className="text-white text-xs font-semibold block">{deal.tests}</span><span className="text-neutral-600 text-[9px]">tests</span></div>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded p-2 text-center"><span className="text-green-400 text-xs font-semibold block">{deal.mrr}</span><span className="text-neutral-600 text-[9px]">MRR</span></div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1"><span className="text-neutral-500">Funding progress</span><span className="text-white font-mono">{deal.funded}</span></div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${deal.progress}%` }} /></div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-neutral-600 text-[10px] font-mono">{deal.backers} · <span className={deal.stageColor}>{deal.stageLabel}</span>{deal.fullyFunded ? ' · Fully funded' : ''}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={openBetaModal} className="flex-1 text-center border border-white/[0.06] text-neutral-300 font-medium rounded-md px-3 py-2.5 text-xs hover:bg-white/5 transition-colors">View Details</button>
                    {deal.fullyFunded ? (
                      <button disabled className="flex-1 text-center bg-white/5 text-neutral-600 font-semibold rounded-md px-3 py-2.5 text-xs cursor-not-allowed">Fully Funded</button>
                    ) : (
                      <button onClick={openBetaModal} className="flex-1 text-center bg-green-500 text-black font-semibold rounded-md px-3 py-2.5 text-xs hover:bg-green-400 transition-colors">Invest →</button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ④ WHY INVEST HERE — Comparison Table ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Comparison</span>
          <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-10">Why Invest Here</h2></ScrollReveal>
          <ScrollReveal>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-4 pr-6 text-xs text-neutral-600 font-mono uppercase tracking-wider" />
                    <th className="py-4 px-6 text-xs text-neutral-500 font-mono uppercase tracking-wider">Traditional VC</th>
                    <th className="py-4 px-6 text-xs text-neutral-500 font-mono uppercase tracking-wider">AngelList</th>
                    <th className="py-4 px-6 text-xs text-green-500 font-mono uppercase tracking-wider border-l border-r border-green-500/10 bg-green-500/[0.02]">LP Ventures</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {COMPARISON.map((row, i) => (
                    <tr key={row.label} className={i < COMPARISON.length - 1 ? 'border-b border-white/[0.04]' : ''}>
                      <td className="py-4 pr-6 text-neutral-400 font-medium">{row.label}</td>
                      <td className="py-4 px-6 text-neutral-500">{row.trad}</td>
                      <td className="py-4 px-6 text-neutral-500">{row.angel}</td>
                      <td className="py-4 px-6 text-green-400 font-medium border-l border-r border-green-500/10 bg-green-500/[0.02]">{row.lp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ ⑤ PORTFOLIO DASHBOARD PREVIEW ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Dashboard</span>
          <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Your Portfolio, Real-Time</h2></ScrollReveal>
          <ScrollReveal><p className="text-neutral-500 text-sm mb-10">Track everything from a single dashboard. Live metrics, revenue share, milestones.</p></ScrollReveal>

          <ScrollReveal>
            <div className="border border-white/[0.06] rounded-xl overflow-hidden">
              {/* Dashboard Header */}
              <div className="p-6 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 text-xs font-semibold">JD</div>
                  <div>
                    <span className="text-white text-sm font-medium block">Jane's Portfolio</span>
                    <span className="text-neutral-600 text-[10px] font-mono">Investor since Jan 2026</span>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-right"><span className="text-white text-xl font-semibold block">$2,450</span><span className="text-neutral-600 text-[10px] font-mono">Total Invested</span></div>
                  <div className="text-right"><span className="text-green-400 text-xl font-semibold block">$3,180</span><span className="text-neutral-600 text-[10px] font-mono">Current Value</span></div>
                  <div className="text-right"><span className="text-green-400 text-xl font-semibold block">$412</span><span className="text-neutral-600 text-[10px] font-mono">Revenue Earned</span></div>
                </div>
              </div>

              {/* Dashboard Body */}
              <div className="divide-y divide-white/[0.04]">
                {[
                  { name: 'ShopStack', icon: 'solar:cart-large-minimalistic-linear', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20', invested: '$500', users: '2,400', growth: '+18%', growthColor: 'text-green-400', earned: '$186', status: 'Live', statusColor: 'bg-green-500/15 text-green-400' },
                  { name: 'ClinicOS', icon: 'solar:heart-pulse-linear', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20', invested: '$1,200', users: '890', growth: '+24%', growthColor: 'text-green-400', earned: '$226', status: 'Live', statusColor: 'bg-green-500/15 text-green-400' },
                  { name: 'DeployKit', icon: 'solar:server-square-linear', iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/10 border-indigo-500/20', invested: '$750', users: '680', growth: '+5%', growthColor: 'text-yellow-400', earned: '$0', status: 'New', statusColor: 'bg-yellow-500/15 text-yellow-400' },
                ].map(app => (
                  <div key={app.name} className="flex items-center gap-4 p-5 hover:bg-white/[0.01] transition-colors">
                    <div className={`w-9 h-9 rounded-lg ${app.iconBg} border flex items-center justify-center`}>
                      <Icon icon={app.icon} className={`${app.iconColor} text-sm`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-white text-sm font-medium">{app.name}</h4>
                      <span className="text-neutral-600 text-[10px] font-mono">Invested {app.invested}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-right">
                      <div><span className="text-white text-xs font-mono block">{app.users}</span><span className="text-neutral-700 text-[9px]">users</span></div>
                      <div><span className={`${app.growthColor} text-xs font-mono block`}>{app.growth}</span><span className="text-neutral-700 text-[9px]">this month</span></div>
                      <div><span className="text-white text-xs font-mono block">{app.earned}</span><span className="text-neutral-700 text-[9px]">earned</span></div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${app.statusColor} uppercase`}>{app.status}</span>
                  </div>
                ))}
              </div>

              {/* Alert */}
              <div className="p-4 border-t border-white/[0.06] bg-green-500/[0.02] flex items-center gap-3">
                <Icon icon="solar:bell-linear" className="text-green-500 text-lg" />
                <span className="text-neutral-400 text-xs"><span className="text-green-400 font-medium">ShopStack</span> hit 2,400 users milestone · <span className="text-neutral-600 font-mono">2 hours ago</span></span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ ⑥ TOP PERFORMING — Leaderboard ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Leaderboard</span>
          <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-8">Top Performing Apps</h2></ScrollReveal>
          <ScrollReveal>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-3 pr-4 text-[10px] text-neutral-600 font-mono uppercase tracking-wider w-8">#</th>
                    <th className="py-3 px-4 text-[10px] text-neutral-600 font-mono uppercase tracking-wider">App</th>
                    <th className="py-3 px-4 text-[10px] text-neutral-600 font-mono uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 text-[10px] text-neutral-600 font-mono uppercase tracking-wider text-right">Funded</th>
                    <th className="py-3 px-4 text-[10px] text-neutral-600 font-mono uppercase tracking-wider text-right">Users</th>
                    <th className="py-3 px-4 text-[10px] text-neutral-600 font-mono uppercase tracking-wider text-right">MRR</th>
                    <th className="py-3 px-4 text-[10px] text-neutral-600 font-mono uppercase tracking-wider text-right">Return</th>
                    <th className="py-3 pl-4 text-[10px] text-neutral-600 font-mono uppercase tracking-wider text-right">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD.map((r, i) => (
                    <tr key={r.rank} className={`${i < LEADERBOARD.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.01] transition-colors`}>
                      <td className="py-4 pr-4 text-neutral-600 font-mono">{r.rank}</td>
                      <td className="py-4 px-4 text-white font-medium">{r.name}</td>
                      <td className="py-4 px-4 text-neutral-500">{r.cat}</td>
                      <td className="py-4 px-4 text-white font-mono text-right">{r.funded}</td>
                      <td className="py-4 px-4 text-white font-mono text-right">{r.users}</td>
                      <td className="py-4 px-4 text-green-400 font-mono text-right">{r.mrr}</td>
                      <td className="py-4 px-4 text-green-400 font-mono text-right">{r.ret}</td>
                      <td className="py-4 pl-4 text-right"><span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${r.stageColor}`}>{r.stage}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ ⑦ RISK & TRANSPARENCY ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Transparency</span>
            <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Risk & Trust</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-12">We believe transparency is the best risk mitigation. Here's how we protect investors.</p></ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { icon: 'solar:chart-2-linear', title: 'Real Metrics', desc: 'All metrics pulled from Logic Packs telemetry. No self-reporting.' },
              { icon: 'solar:transfer-horizontal-linear', title: 'Transferable', desc: 'Credits are non-refundable but transferable to other users.' },
              { icon: 'solar:pie-chart-2-linear', title: 'Proportional', desc: 'Revenue share is proportional to your credit stake. Fair and simple.' },
              { icon: 'solar:test-tube-linear', title: '80%+ Tests', desc: 'Apps must maintain 80%+ test coverage to remain listed.' },
              { icon: 'solar:heart-pulse-linear', title: 'Self-Healing', desc: 'Public reliability score — see health before you invest.' },
            ].map(t => (
              <ScrollReveal key={t.title}>
                <div className="border border-white/[0.06] rounded-lg p-5 text-center hover:bg-white/[0.015] transition-colors">
                  <Icon icon={t.icon} className="text-green-500 text-2xl mb-3" />
                  <h4 className="text-white text-xs font-medium mb-1">{t.title}</h4>
                  <p className="text-neutral-600 text-[11px] leading-relaxed">{t.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ⑧ CTA ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[40vw] h-[40vw] bg-green-500/[0.04] blur-[150px] rounded-full" />
          </div>
          <div className="relative z-10">
            <ScrollReveal><h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">Start Investing</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-base mb-8">Minimum $50 in credits. No maximum. Instant deployment.</p></ScrollReveal>
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={openBetaModal} className="inline-flex items-center gap-2 bg-green-500 text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-green-400 transition-colors">
                  Browse Deals <Icon icon="solar:arrow-right-linear" width={16} />
                </button>
                <Link to="/founders" className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 font-medium rounded-md px-8 py-3 text-sm hover:bg-white/5 transition-colors">
                  I&apos;m a Founder Instead
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ ⑨ FAQ ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// FAQ</span>
            <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-8">Investor FAQ</h2></ScrollReveal>
            <div className="divide-y divide-white/[0.06]">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i}>
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
