import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

const BENEFITS = [
  { icon: 'solar:wallet-money-linear', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', title: 'Platform Credits', desc: '$500–$10,000 in compute credits for API, packs, and automation runs.' },
  { icon: 'solar:star-bold', color: 'text-neutral-400', bg: 'bg-white/5', border: 'border-white/10', title: 'Marketplace Featuring', desc: 'Your app prominently listed in the Pack Store with a "Ventures" badge.' },
  { icon: 'solar:eye-linear', color: 'text-neutral-400', bg: 'bg-white/5', border: 'border-white/10', title: 'Investor Visibility', desc: 'Your app goes live on the investor deal board with real-time metrics.' },
  { icon: 'solar:user-speak-rounded-linear', color: 'text-neutral-400', bg: 'bg-white/5', border: 'border-white/10', title: 'Mentorship', desc: 'Weekly office hours with Logic Packs engineers and past founders.' },
  { icon: 'solar:server-square-linear', color: 'text-neutral-400', bg: 'bg-white/5', border: 'border-white/10', title: 'Infrastructure', desc: 'Priority access to new packs, dedicated runtime, faster self-healing.' },
  { icon: 'solar:presentation-graph-linear', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', title: 'Demo Day', desc: 'Scale-tier founders present to the full investor network quarterly.' },
];

const TIERS = [
  {
    name: 'Spark', color: 'text-yellow-400', badgeCls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    cardCls: 'border-white/[0.06]', amount: '$500', duration: '4-week program',
    reqs: ['Working prototype on Logic Packs', '≥1 pack installed', 'Basic tests passing'],
    includes: ['$500 platform credits', 'Marketplace listing', 'Community Slack access', 'Basic analytics dashboard'],
    includeColor: 'text-green-500/60',
    btnCls: 'border border-white/10 text-neutral-300 hover:bg-white/5', btnLabel: 'Apply for Spark',
  },
  {
    name: 'Launch', color: 'text-green-400', badgeCls: 'bg-green-500/15 text-green-400 border-green-500/20',
    cardCls: 'border-green-500/20 bg-green-500/[0.02] hover:bg-green-500/[0.04]', amount: '$2,500', duration: '8-week program',
    popular: true,
    reqs: ['MVP with users', '≥3 packs installed', '80%+ test coverage', 'Active self-healing'],
    includes: ['Everything in Spark', '$2,500 platform credits', 'Dedicated mentor', 'Featured marketplace placement', 'Investor board listing', 'Weekly check-ins', 'Full analytics dashboard'],
    includeColor: 'text-green-500',
    btnCls: 'bg-green-500 text-black hover:bg-green-400', btnLabel: 'Apply for Launch',
  },
  {
    name: 'Scale', color: 'text-purple-400', badgeCls: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    cardCls: 'border-purple-500/20', amount: '$10,000+', duration: '12-week program',
    reqs: ['100+ users or $1k+ MRR', 'Full pack stack', 'Verified status'],
    includes: ['Everything in Launch', '$10,000+ platform credits', 'Investor matching', 'Demo day presentation slot', 'Custom infrastructure', 'Priority self-healing', 'Direct investor introductions'],
    includeColor: 'text-purple-400',
    btnCls: 'border border-purple-500/20 text-purple-300 hover:bg-purple-500/5', btnLabel: 'Apply for Scale',
  },
];

const REQUIREMENTS = [
  { title: 'Built on Logic Packs', desc: 'Any mode — UI, Logic, Notebook, Canvas.' },
  { title: 'At least one pack installed', desc: 'With tests passing. Telemetry enabled.' },
  { title: 'Telemetry enabled', desc: 'So investors can see real data. Transparency is the trust layer.' },
  { title: 'Brief pitch', desc: 'What it does, who it\'s for, why now. Keep it under 200 words.' },
  { title: 'Your pack stack', desc: 'Which packs you use and how they\'re wired together.' },
];

const INCUBATING = [
  { icon: 'solar:cart-large-minimalistic-linear', iconColor: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', name: 'ShopStack', tier: 'Launch', tierCls: 'bg-green-500/15 text-green-400 border-green-500/20', packs: 'Auth + Payments + Dashboard', users: '2.4k users', progress: 65, week: 'Week 5 of 8' },
  { icon: 'solar:document-text-linear', iconColor: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', name: 'InvoiceBot', tier: 'Spark', tierCls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', packs: 'Payments + PDF + Scheduler', users: '340 users', progress: 75, week: 'Week 3 of 4' },
  { icon: 'solar:heart-pulse-linear', iconColor: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', name: 'ClinicOS', tier: 'Launch', tierCls: 'bg-green-500/15 text-green-400 border-green-500/20', packs: 'Auth + CRUD + LPDN', users: '890 users', progress: 40, week: 'Week 3 of 8' },
  { icon: 'solar:chat-round-dots-linear', iconColor: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', name: 'FeedbackLoop', tier: 'Graduated', tierCls: 'bg-white/10 text-neutral-400 border-white/10', packs: 'Auth + Email + Form Builder', users: '$12k MRR', usersGreen: true, progress: 100, week: 'Completed', weekRight: '✓ Alumni' },
];

const STORIES = [
  { initials: 'AK', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400', name: 'Amir Khalil', sub: 'ShopStack · Launch → Scale', quote: '"We went from 0 to 2,400 users in 6 weeks. The credits let us ship without worrying about compute costs, and the investor board brought us 14 backers within a week."', stats: '2,400 users · $8.2k MRR' },
  { initials: 'RM', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400', name: 'Riya Mehta', sub: 'FeedbackLoop · Scale (Graduated)', quote: '"The mentorship was the real unlock. Our mentor helped us restructure our pack stack, which cut API costs by 40% and pushed us to $12k MRR."', stats: '5,100 users · $12k MRR · Graduated' },
  { initials: 'JL', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', name: 'Jordan Lee', sub: 'ClinicOS · Launch', quote: '"We\'re running offline with LPDN for clinics that have spotty internet. The Spark credits gave us room to experiment, and now we\'re in Launch with 890 users."', stats: '890 users · $3.4k MRR' },
];

const FAQS = [
  { q: 'Do I give up equity?', a: 'No. LP Ventures uses a credit/revenue-share model, not equity. Investors fund your app with credits and earn a proportional share of revenue. You keep full ownership.' },
  { q: 'How fast do I get credits?', a: 'Instantly upon acceptance. Credits are deposited directly into your Logic Packs workspace within minutes of approval.' },
  { q: 'What if I don\'t use all my credits?', a: 'Unused credits remain in your workspace for 90 days after your program ends. After that, they expire. We encourage you to use them for growth — that\'s what investors expect.' },
  { q: 'Can I upgrade tiers mid-program?', a: 'Yes! If you hit the requirements for the next tier during your program, you can apply to upgrade. Your mentor will help you through the transition.' },
  { q: 'What happens after graduation?', a: 'You remain on the investor board as an alumni app. You keep your Ventures badge, marketplace featuring, and can continue to receive investor credits. Many graduates also become mentors for new cohorts.' },
];

export default function Founders() {
  const [openFaq, setOpenFaq] = useState(null);
  const { openBetaModal } = useBeta();

  const handleSubmit = (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Application Submitted ✓';
    btn.classList.add('bg-green-500', 'text-black');
    setTimeout(() => { btn.textContent = 'Submit Application'; btn.classList.remove('bg-green-500'); }, 3000);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-14 border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-3 flex items-center gap-2 text-xs text-neutral-600">
          <Link to="/ventures" className="hover:text-white transition-colors">Ventures</Link>
          <Icon icon="solar:alt-arrow-right-linear" width={12} />
          <span className="text-neutral-400">For Founders</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[50vw] h-[50vw] bg-green-500/[0.04] blur-[150px] rounded-full translate-y-[-10%]" />
        </div>
        <div className="relative z-10 border-b border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-24 md:py-36 text-center">
            <ScrollReveal>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                <span className="text-xs font-mono text-green-500/80 tracking-wider">23 spots remaining this cohort</span>
              </div>
            </ScrollReveal>
            <ScrollReveal><h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-6">Get Funded.<br /><span className="text-neutral-500 italic">Ship Faster.</span></h1></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">Apply to Logic Packs Ventures and receive instant credits, infrastructure, mentorship, and investor visibility — without giving up equity upfront.</p></ScrollReveal>
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={openBetaModal} className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-neutral-200 transition-colors">Apply Now <Icon icon="solar:arrow-right-linear" width={16} /></button>
                <a href="#requirements" className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 font-medium rounded-md px-8 py-3 text-sm hover:bg-white/5 transition-colors">View Requirements</a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 p-8 md:p-10 flex flex-col justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Benefits</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">What You Get</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Everything you need to go from prototype to funded product.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-x divide-white/[0.06]">
            {BENEFITS.map((b) => (
              <ScrollReveal key={b.title}>
                <div className="p-8 hover:bg-white/[0.015] transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${b.bg} border ${b.border} flex items-center justify-center mb-5`}>
                    <Icon icon={b.icon} className={`${b.color} text-lg`} />
                  </div>
                  <h3 className="text-white text-sm font-medium tracking-tight mb-2">{b.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{b.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Incubation Tiers */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="mb-12">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Tiers</span>
            <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight">Choose Your Tier</h2></ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((t) => (
              <ScrollReveal key={t.name}>
                <div className={`border ${t.cardCls} rounded-xl p-8 transition-all flex flex-col relative ${!t.popular ? 'hover:bg-white/[0.015]' : ''}`}>
                  {t.popular && <div className="absolute -top-3 left-8 px-3 py-0.5 bg-green-500 text-black text-[10px] font-semibold rounded uppercase tracking-wider">Most Popular</div>}
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${t.badgeCls} border uppercase tracking-wider self-start mb-6`}>{t.name}</span>
                  <div className="text-4xl font-semibold text-white tracking-tight mb-1">{t.amount}</div>
                  <span className="text-neutral-600 text-xs font-mono block mb-1">in platform credits</span>
                  <span className="text-neutral-700 text-xs block mb-6">{t.duration}</span>
                  <h4 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-4">Requirements</h4>
                  <ul className="space-y-2 text-xs text-neutral-500 mb-6">
                    {t.reqs.map((r) => (
                      <li key={r} className="flex items-start gap-2"><Icon icon="solar:check-circle-linear" className="text-neutral-600 mt-0.5 shrink-0" width={13} />{r}</li>
                    ))}
                  </ul>
                  <h4 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-4">Includes</h4>
                  <ul className="space-y-2 text-xs text-neutral-500 mb-8 flex-grow">
                    {t.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2"><Icon icon="solar:check-circle-linear" className={`${t.includeColor} mt-0.5 shrink-0`} width={13} />{inc}</li>
                    ))}
                  </ul>
                  <button onClick={openBetaModal} className={`block w-full text-center font-semibold rounded-md px-6 py-3 text-sm transition-colors ${t.btnCls}`}>{t.btnLabel}</button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + Currently Incubating */}
      <section id="requirements" className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-white/[0.06]">
          <div className="p-8 md:p-14">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Requirements</span>
            <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">What We Look For</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-8">We keep the bar simple. If your app runs on Logic Packs and has real users (or a clear path to them), you're eligible.</p></ScrollReveal>
            <ScrollReveal>
              <div className="space-y-4">
                {REQUIREMENTS.map((r) => (
                  <div key={r.title} className="flex items-start gap-3 p-4 border border-white/[0.06] rounded-lg hover:bg-white/[0.015] transition-colors">
                    <Icon icon="solar:check-square-linear" className="text-green-500 mt-0.5 shrink-0" width={18} />
                    <div>
                      <h4 className="text-white text-sm font-medium">{r.title}</h4>
                      <p className="text-neutral-500 text-xs mt-1">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
          <div className="p-8 md:p-14 border-t md:border-t-0 border-white/[0.06]">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Active Cohort</span>
            <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-8">Currently Incubating</h2></ScrollReveal>
            <div className="space-y-4">
              {INCUBATING.map((app) => (
                <ScrollReveal key={app.name}>
                  <div className={`border border-white/[0.06] rounded-lg p-5 ${app.progress === 100 ? 'bg-white/[0.01]' : 'hover:bg-white/[0.015]'} transition-colors`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg ${app.bg} border ${app.border} flex items-center justify-center`}>
                        <Icon icon={app.icon} className={`${app.iconColor} text-base`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white text-sm font-medium truncate">{app.name}</h3>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${app.tierCls} border uppercase`}>{app.tier}</span>
                        </div>
                        <span className="text-neutral-600 text-[10px] font-mono">{app.packs}</span>
                      </div>
                      <span className={`${app.usersGreen ? 'text-green-500' : 'text-neutral-500'} text-xs font-mono`}>{app.users}</span>
                    </div>
                    <div className="relative h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-600" style={{ width: `${app.progress}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-neutral-600 font-mono">
                      <span>{app.week}</span>
                      <span>{app.weekRight || `${app.progress}%`}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Stories</span>
          <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-10">From the Founders</h2></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STORIES.map((s) => (
              <ScrollReveal key={s.name}>
                <div className="border border-white/[0.06] rounded-xl p-8 hover:bg-white/[0.015] transition-colors">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-full ${s.color} border flex items-center justify-center text-sm font-semibold`}>{s.initials}</div>
                    <div><span className="text-white text-sm font-medium block">{s.name}</span><span className="text-neutral-600 text-xs">{s.sub}</span></div>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed italic">{s.quote}</p>
                  <span className="text-green-500 text-xs font-mono block mt-4">{s.stats}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-2xl mx-auto">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Apply</span>
            <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Submit Your Application</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-10">We review within 48 hours. Accepted founders receive credits instantly.</p></ScrollReveal>
            <ScrollReveal>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Your Name</label>
                    <input type="text" placeholder="Jane Doe" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Email</label>
                    <input type="email" placeholder="you@email.com" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">App Name</label>
                  <input type="text" placeholder="My Awesome App" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">App Description</label>
                  <textarea rows={3} placeholder="What does your app do? Who is it for?" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700 resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">App URL <span className="text-neutral-700">(if deployed)</span></label>
                    <input type="url" placeholder="https://myapp.logicpacks.dev" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Tier Applying For</label>
                    <select className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors">
                      <option value="" className="bg-[#0a0a0a]">Select tier…</option>
                      <option value="spark" className="bg-[#0a0a0a]">Spark ($500 credits · 4 weeks)</option>
                      <option value="launch" className="bg-[#0a0a0a]">Launch ($2,500 credits · 8 weeks)</option>
                      <option value="scale" className="bg-[#0a0a0a]">Scale ($10,000+ credits · 12 weeks)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Pack Stack Used</label>
                  <input type="text" placeholder="Auth, Payments, Dashboard, LPDN…" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Why should we fund this?</label>
                  <textarea rows={4} placeholder="Your pitch — what makes this special, what traction you have, where you're going." className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700 resize-none" />
                </div>
                <button type="submit" className="w-full bg-white text-black font-semibold rounded-lg px-6 py-4 text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">Submit Application</button>
                <p className="text-neutral-700 text-xs text-center">We review within 48 hours. You'll receive an email with next steps.</p>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// FAQ</span>
            <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-8">Founder FAQ</h2></ScrollReveal>
            <div className="divide-y divide-white/[0.06]">
              {FAQS.map((f, i) => (
                <div key={i} className="faq-item">
                  <button className="w-full flex items-center justify-between py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-white text-sm font-medium pr-4">{f.q}</span>
                    <Icon icon="solar:alt-arrow-down-linear" className={`text-neutral-600 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} width={16} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-[300px] pb-3' : 'max-h-0'}`}>
                    <p className="text-neutral-500 text-sm leading-relaxed">{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-20 text-center">
          <ScrollReveal><h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">Ready to join the next cohort?</h2></ScrollReveal>
          <ScrollReveal><p className="text-neutral-500 text-base mb-8">23 spots remaining. Applications reviewed within 48 hours.</p></ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={openBetaModal} className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-neutral-200 transition-colors">Apply Now <Icon icon="solar:arrow-right-linear" width={16} /></button>
              <Link to="/investors" className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 font-medium rounded-md px-8 py-3 text-sm hover:bg-white/5 transition-colors">View Investor Board</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
