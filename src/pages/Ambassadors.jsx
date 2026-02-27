import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

const STATS = [
  { value: '240+', label: 'Ambassadors', green: false },
  { value: '38', label: 'Countries', green: false },
  { value: '1,200+', label: 'Events Hosted', green: true },
  { value: '15k+', label: 'Developers Reached', green: false },
];

const GOALS = [
  { icon: 'solar:users-group-rounded-linear', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', title: 'Grow the Community', desc: 'Introduce developers, students, and creators to the Logic Packs ecosystem. Host meetups, workshops, and online sessions in your region.' },
  { icon: 'solar:book-2-linear', color: 'text-neutral-400', bg: 'bg-white/5', border: 'border-white/10', title: 'Educate & Empower', desc: 'Teach others how to build with packs — from first prototype to production apps. Create tutorials, guides, and code-alongs.' },
  { icon: 'solar:chat-round-dots-linear', color: 'text-neutral-400', bg: 'bg-white/5', border: 'border-white/10', title: 'Advocate & Feedback', desc: 'Be the voice of your community. Share feedback with the LP team, shape the roadmap, and represent developers in your region.' },
  { icon: 'solar:code-square-linear', color: 'text-neutral-400', bg: 'bg-white/5', border: 'border-white/10', title: 'Build & Ship', desc: 'Lead by example — build real apps on Logic Packs, publish packs to the marketplace, and showcase what\'s possible.' },
  { icon: 'solar:share-circle-linear', color: 'text-neutral-400', bg: 'bg-white/5', border: 'border-white/10', title: 'Content & Reach', desc: 'Create content — blogs, videos, tweets, threads — that spreads awareness and demonstrates the power of the pack ecosystem.' },
  { icon: 'solar:hand-shake-linear', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', title: 'Bridge & Connect', desc: 'Connect local developers with the global LP ecosystem — universities, hackathons, tech communities, and startup circles.' },
];

const REWARDS = [
  {
    icon: 'solar:t-shirt-linear', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20',
    title: 'Exclusive Swag',
    desc: 'Limited-edition Logic Packs merchandise — tees, hoodies, stickers, and LPDN accessories — shipped to your door.',
    items: ['Welcome kit on acceptance', 'Quarterly swag drops', 'Event-exclusive merch'],
    checkColor: 'text-green-500/60',
  },
  {
    icon: 'solar:diploma-verified-linear', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20',
    title: 'Certificates',
    desc: 'Official Logic Packs Ambassador certification — verifiable, shareable, and recognized across the ecosystem.',
    items: ['Digital certificate with unique ID', 'LinkedIn-verifiable badge', 'Tier-based progression'],
    checkColor: 'text-blue-400/60',
  },
  {
    icon: 'solar:star-shine-linear', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
    title: 'Recognition',
    desc: 'Get featured on the Logic Packs website, social channels, and community spotlights. Your work gets seen.',
    items: ['Featured on website & socials', 'Speaker opportunities', 'Community spotlight stories'],
    checkColor: 'text-purple-400/60',
  },
  {
    icon: 'solar:global-linear', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
    title: 'Connections',
    desc: 'Direct access to the LP team, private Slack channels, and a global network of ambassadors, founders, and investors.',
    items: ['Private ambassador Slack', 'Monthly AMA with LP founders', 'Investor & founder network'],
    checkColor: 'text-emerald-400/60',
  },
];

const PLATFORM_PERKS = [
  { icon: 'solar:wallet-money-linear', title: 'Free Platform Credits', desc: '$200/month in compute credits for personal projects and demos.' },
  { icon: 'solar:rocket-2-linear', title: 'Early Access', desc: 'Beta access to new features, packs, and platform updates before public launch.' },
  { icon: 'solar:presentation-graph-linear', title: 'Event Sponsorship', desc: 'Budget for hosting workshops, hackathons, and meetups in your city.' },
  { icon: 'solar:letter-linear', title: 'Reference Letters', desc: 'Official reference letters from the LP team for jobs, grad school, or visa applications.' },
  { icon: 'solar:square-academic-cap-linear', title: 'Free Course Access', desc: 'Full access to all Logic Packs courses — Full Stack, Python, React, Automation, and more.' },
];

const TIERS = [
  { icon: 'solar:shield-star-linear', iconColor: 'text-orange-400', circleBg: 'bg-orange-500/10', circleBorder: 'border-orange-500/20', name: 'Bronze Ambassador', sub: 'Entry level · 0–3 months', desc: 'Welcome kit, digital certificate, private Slack access, $100/mo credits, 1 event budget.', cardCls: 'border-white/[0.06]' },
  { icon: 'solar:shield-star-linear', iconColor: 'text-neutral-300', circleBg: 'bg-neutral-400/10', circleBorder: 'border-neutral-400/20', name: 'Silver Ambassador', sub: 'Active · 3–6 months', desc: 'Premium swag drops, featured on website, $200/mo credits, 3 event budgets, speaker invitations.', cardCls: 'border-white/[0.06]' },
  { icon: 'solar:shield-star-linear', iconColor: 'text-yellow-400', circleBg: 'bg-yellow-500/10', circleBorder: 'border-yellow-500/20', name: 'Gold Ambassador', sub: 'Leadership · 6+ months', desc: 'All Silver perks + annual summit invite, LP team 1:1s, co-branded content, reference letters, $500/mo credits, Ventures priority access.', cardCls: 'border-green-500/20 bg-green-500/[0.02] hover:bg-green-500/[0.04]' },
  { icon: 'solar:crown-star-linear', iconColor: 'text-purple-400', circleBg: 'bg-purple-500/10', circleBorder: 'border-purple-500/20', name: 'Platinum Ambassador', sub: 'Elite · By invitation', desc: 'All Gold perks + revenue share on referred signups, equity pathway, advisory role, travel sponsorship, LPDN hardware kit.', cardCls: 'border-purple-500/20' },
];

const STEPS = [
  { num: '01', green: true, title: 'Apply', desc: 'Fill out the form below. Tell us about yourself, your community, and why you want to represent LP.' },
  { num: '02', green: true, title: 'Onboard', desc: 'Get your welcome kit, join private channels, complete onboarding training, and meet your cohort.' },
  { num: '03', green: false, title: 'Contribute', desc: 'Host events, create content, build apps, give talks. Log your activities in the ambassador dashboard.' },
  { num: '04', green: true, title: 'Level Up', desc: 'Earn points, unlock tiers, get recognized. Top ambassadors get invited to the annual LP Summit.' },
];

const AMBASSADORS = [
  {
    initials: 'SK', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    name: 'Sara Kim', sub: 'Seoul, South Korea · Gold',
    badge: 'Gold', badgeCls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    quote: '"I hosted 12 workshops this year and helped 200+ Korean developers build their first LP app. The community is everything."',
    stats: '12 events · 3 published packs · 200+ devs reached',
  },
  {
    initials: 'MO', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    name: 'Marcus Osei', sub: 'Accra, Ghana · Silver',
    badge: 'Silver', badgeCls: 'bg-neutral-400/15 text-neutral-300 border-neutral-400/20',
    quote: '"LP gave me a platform to teach automation to students who\'d never coded. Now three of them have apps live on the marketplace."',
    stats: '8 events · 15 tutorials · 500+ devs reached',
  },
  {
    initials: 'LP', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    name: 'Lucía Pereira', sub: 'Buenos Aires, Argentina · Platinum',
    badge: 'Platinum', badgeCls: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    quote: '"From ambassador to advisor. I now help shape the LP roadmap for Latin America and mentor new ambassadors across 6 countries."',
    stats: '30+ events · Advisory role · 2k+ devs reached',
  },
];

const CONTRIBUTIONS = [
  'Host workshops',
  'Create content',
  'Build open-source packs',
  'University outreach',
  'Translate docs',
  'Mentorship',
];

const FAQS = [
  { q: 'Who can become an ambassador?', a: 'Anyone passionate about technology and community building — students, developers, educators, content creators. No prior Logic Packs experience required (we\'ll teach you).' },
  { q: 'How much time does it require?', a: 'Around 5–10 hours per month. This can be a mix of hosting one event, creating a piece of content, or engaging with the community online. It\'s flexible.' },
  { q: 'Is there compensation?', a: 'The program provides platform credits, swag, certificates, event budgets, and at Platinum tier, revenue share. It\'s designed as a community role with real benefits, not a paid position.' },
  { q: 'Can I represent a university or organization?', a: 'Absolutely! We love university ambassadors. We provide extra support for campus chapters — event kits, workshop materials, and student group budgets.' },
  { q: 'What\'s the cohort cycle?', a: 'We run quarterly cohorts. Once accepted, you\'re an ambassador indefinitely as long as you remain active. We accept rolling applications between cohorts too.' },
];

export default function Ambassadors() {
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
      {/* ═══ HERO ═══ */}
      <section className="pt-14 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[50vw] h-[50vw] bg-green-500/[0.04] blur-[150px] rounded-full translate-y-[-10%]" />
        </div>
        <div className="relative z-10 border-b border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-24 md:py-36 text-center">
            <ScrollReveal>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                <span className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-mono">Applications Open — Cohort 3</span>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-6">
                Become a<br /><span className="text-green-500">Logic Packs</span> <span className="text-neutral-500 italic">Ambassador</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                Represent the future of software in your community. Teach, build, inspire — and earn recognition, swag, certificates, and direct connections with our team.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={openBetaModal} className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-neutral-200 transition-colors">
                  Apply Now <Icon icon="solar:arrow-right-linear" width={16} />
                </button>
                <a href="#program" className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 font-medium rounded-md px-8 py-3 text-sm hover:bg-white/5 transition-colors">
                  Learn More
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.06]">
          {STATS.map((s) => (
            <div key={s.label} className="p-6 md:p-8 text-center hover:bg-white/[0.015] transition-colors">
              <div className={`text-3xl md:text-4xl font-semibold ${s.green ? 'text-green-500' : 'text-white'} tracking-tight mb-1`}>{s.value}</div>
              <p className="text-neutral-600 text-xs font-mono uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ GOALS & AIMS ═══ */}
      <section id="program" className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 p-8 md:p-10 flex flex-col justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Mission</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Goals &<br />Aims</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">The Ambassador Program exists to grow the Logic Packs community through education, advocacy, and real impact.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y md:divide-x divide-white/[0.06]">
            {GOALS.map((g) => (
              <ScrollReveal key={g.title}>
                <div className="p-8 hover:bg-white/[0.015] transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${g.bg} border ${g.border} flex items-center justify-center mb-5`}>
                    <Icon icon={g.icon} className={`${g.color} text-lg`} />
                  </div>
                  <h3 className="text-white text-sm font-medium tracking-tight mb-2">{g.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{g.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOU GET — Rewards ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="mb-12">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Rewards</span>
            <ScrollReveal><h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">What You Get</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-sm mt-3 max-w-xl">Every ambassador receives tangible rewards for their impact. The more you contribute, the more you unlock.</p></ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REWARDS.map((r) => (
              <ScrollReveal key={r.title}>
                <div className="border border-white/[0.06] rounded-xl p-8 hover:bg-white/[0.015] transition-all group">
                  <div className={`w-14 h-14 rounded-xl ${r.bg} border ${r.border} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                    <Icon icon={r.icon} className={`${r.color} text-2xl`} />
                  </div>
                  <h3 className="text-white text-lg font-medium tracking-tight mb-2">{r.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4">{r.desc}</p>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    {r.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Icon icon="solar:check-circle-linear" className={r.checkColor} width={13} />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ADDITIONAL PERKS ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-white/[0.06]">
          {/* Platform Perks */}
          <div className="p-8 md:p-14">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Platform Perks</span>
            <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-6">More Than Just Swag</h2></ScrollReveal>
            <ScrollReveal>
              <div className="space-y-4">
                {PLATFORM_PERKS.map((p) => (
                  <div key={p.title} className="flex items-start gap-3 p-4 border border-white/[0.06] rounded-lg hover:bg-white/[0.015] transition-colors">
                    <Icon icon={p.icon} className="text-green-500 mt-0.5 shrink-0" width={18} />
                    <div>
                      <h4 className="text-white text-sm font-medium">{p.title}</h4>
                      <p className="text-neutral-500 text-xs mt-1">
                        {p.title === 'Free Course Access' ? (
                          <>Full access to all <Link to="/courses" className="text-green-500 hover:underline">Logic Packs courses</Link> — Full Stack, Python, React, Automation, and more.</>
                        ) : p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Ambassador Tiers */}
          <div className="p-8 md:p-14 border-t md:border-t-0 border-white/[0.06]">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Tiers</span>
            <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-6">Ambassador Levels</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-6">Level up as you contribute more. Each tier unlocks additional perks and responsibilities.</p></ScrollReveal>
            <div className="space-y-4">
              {TIERS.map((t) => (
                <ScrollReveal key={t.name}>
                  <div className={`border ${t.cardCls} rounded-lg p-5 hover:bg-white/[0.015] transition-colors`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-full ${t.circleBg} border ${t.circleBorder} flex items-center justify-center`}>
                        <Icon icon={t.icon} className={`${t.iconColor} text-base`} />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium">{t.name}</h4>
                        <span className="text-neutral-600 text-[10px] font-mono">{t.sub}</span>
                      </div>
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed">{t.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {STEPS.map((s) => (
            <ScrollReveal key={s.num}>
              <div className="p-8 md:p-10 text-center hover:bg-white/[0.015] transition-colors">
                <div className={`w-12 h-12 rounded-full ${s.green ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'} border flex items-center justify-center mx-auto mb-5`}>
                  <span className={`${s.green ? 'text-green-500' : 'text-neutral-400'} font-mono text-sm font-semibold`}>{s.num}</span>
                </div>
                <h3 className="text-white text-lg font-medium tracking-tight mb-2">{s.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ FEATURED AMBASSADORS ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Spotlight</span>
          <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-10">Featured Ambassadors</h2></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AMBASSADORS.map((a) => (
              <ScrollReveal key={a.name}>
                <div className="border border-white/[0.06] rounded-xl p-8 hover:bg-white/[0.015] transition-colors">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-full ${a.color} border flex items-center justify-center text-sm font-semibold`}>{a.initials}</div>
                    <div>
                      <span className="text-white text-sm font-medium block">{a.name}</span>
                      <span className="text-neutral-600 text-xs">{a.sub}</span>
                    </div>
                    <span className={`ml-auto px-2 py-0.5 rounded text-[9px] font-semibold ${a.badgeCls} border uppercase`}>{a.badge}</span>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed italic mb-4">{a.quote}</p>
                  <div className="flex gap-3 text-[10px] font-mono text-neutral-600">
                    {a.stats.split(' · ').map((stat, i) => (
                      <span key={i}>{i > 0 && <span className="mr-3">·</span>}{stat}</span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ APPLICATION FORM ═══ */}
      <section id="apply" className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-2xl mx-auto">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Apply</span>
            <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Join the Program</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-10">Applications are reviewed on a rolling basis. We'll get back to you within 1 week.</p></ScrollReveal>
            <ScrollReveal>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Full Name</label>
                    <input type="text" placeholder="Your name" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Email</label>
                    <input type="email" placeholder="you@email.com" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Country / City</label>
                    <input type="text" placeholder="Accra, Ghana" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Current Role</label>
                    <select className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors">
                      <option value="" className="bg-[#0a0a0a]">Select…</option>
                      <option value="student" className="bg-[#0a0a0a]">Student</option>
                      <option value="dev" className="bg-[#0a0a0a]">Developer</option>
                      <option value="educator" className="bg-[#0a0a0a]">Educator / Instructor</option>
                      <option value="community" className="bg-[#0a0a0a]">Community Organizer</option>
                      <option value="creator" className="bg-[#0a0a0a]">Content Creator</option>
                      <option value="other" className="bg-[#0a0a0a]">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Social / Portfolio Links</label>
                  <input type="text" placeholder="GitHub, Twitter, LinkedIn, Blog, YouTube…" className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">Why do you want to be an ambassador?</label>
                  <textarea rows={3} placeholder="Tell us about your community, what excites you about Logic Packs, and what you'd do as an ambassador." className="w-full bg-transparent border border-white/[0.06] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/40 transition-colors placeholder:text-neutral-700 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-widest font-medium block mb-2">What would you contribute? <span className="text-neutral-700">(check all that apply)</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {CONTRIBUTIONS.map((c) => (
                      <label key={c} className="flex items-center gap-2 border border-white/[0.06] rounded-lg px-4 py-3 cursor-pointer hover:bg-white/[0.015] transition-colors">
                        <input type="checkbox" className="accent-green-500 w-3.5 h-3.5" />
                        <span className="text-neutral-400 text-xs">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full bg-white text-black font-semibold rounded-lg px-6 py-4 text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                  Submit Application
                </button>
                <p className="text-neutral-700 text-xs text-center">Rolling admissions. We respond within 1 week.</p>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// FAQ</span>
            <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-8">Common Questions</h2></ScrollReveal>
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
    </>
  );
}

