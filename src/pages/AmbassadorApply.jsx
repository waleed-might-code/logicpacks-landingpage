import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import ScrollReveal from '../components/ScrollReveal';

/* ──────────────────────────────────────────────────────────
   AMBASSADOR APPLICATION PAGE — /ambassador-apply
   Apply to become a Logic Packs ambassador + join community
   ────────────────────────────────────────────────────────── */

const COMMUNITY_LINK = 'https://chat.whatsapp.com/HxaG4RUxAEe4m77DgrUTYS?mode=gi_t';

const PERKS = [
  { icon: 'solar:medal-ribbon-star-linear', title: 'Official ambassador title', desc: 'Get recognized as an official Logic Packs Ambassador with a verified badge on your profile.' },
  { icon: 'solar:tag-price-linear', title: 'Free Pro access forever', desc: 'Ambassadors get lifetime Pro access — no charge, no limits, no expiry.' },
  { icon: 'solar:wallet-money-linear', title: 'Revenue share', desc: 'Earn a share of revenue from users you refer. The more you grow the community, the more you earn.' },
  { icon: 'solar:gift-linear', title: 'Exclusive merch & swag', desc: 'Get exclusive Logic Packs merchandise, stickers, and limited-edition gear shipped to your door.' },
  { icon: 'solar:star-linear', title: 'Early feature access', desc: 'Test new features before anyone else. Your feedback directly shapes what we build next.' },
  { icon: 'solar:users-group-rounded-linear', title: 'Private ambassador network', desc: 'Join an exclusive group of ambassadors, founders, and the Logic Packs core team.' },
];

const WHAT_YOU_DO = [
  { icon: 'solar:share-circle-linear', title: 'Share & promote', desc: 'Share Logic Packs with your network — social media, communities, events, and word of mouth.' },
  { icon: 'solar:document-text-linear', title: 'Create content', desc: 'Write tutorials, make videos, or post about your experience building with Logic Packs.' },
  { icon: 'solar:chat-round-dots-linear', title: 'Support the community', desc: 'Help newcomers, answer questions, and be a friendly face in the community.' },
  { icon: 'solar:lightbulb-linear', title: 'Give feedback', desc: 'Share honest feedback about the product. Ambassadors have a direct line to the team.' },
];

export default function AmbassadorApply() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    social: '',
    audience: '',
    why: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.amb-reveal',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out' }
    );

    return () => {
      tl.kill();
      gsap.set('.amb-reveal', { clearProps: 'all' });
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would POST to an API
    setSubmitted(true);
  };

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="pt-14">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 pt-20 md:pt-28 pb-16">
          <div className="max-w-3xl">
            <div className="amb-reveal flex items-center gap-2.5 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
              <p className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-medium font-mono">Ambassador Program</p>
            </div>
            <h1 className="amb-reveal text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-white mb-6">
              Become an <span className="text-neutral-400 italic">ambassador.</span>
            </h1>
            <p className="amb-reveal text-base md:text-lg text-neutral-400 leading-relaxed max-w-xl mb-8">
              Help spread the word about Logic Packs and get rewarded. Ambassadors get free Pro access, revenue share, exclusive merch, and a direct line to the founding team.
            </p>
            <div className="amb-reveal flex flex-wrap gap-3">
              <a
                href="#apply"
                className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-6 py-3 text-sm hover:bg-neutral-200 transition-colors"
              >
                <Icon icon="solar:pen-new-square-linear" width={16} />
                Apply Now
              </a>
              <a
                href={COMMUNITY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/[0.1] text-white font-medium rounded-md px-6 py-3 text-sm hover:bg-white/[0.05] transition-colors"
              >
                <Icon icon="simple-icons:whatsapp" width={16} className="text-green-500" />
                Join Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT AMBASSADORS GET ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Perks</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">What You Get</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Being an ambassador comes with real benefits — not just a title.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y md:divide-x divide-white/[0.06]">
            {PERKS.map((perk, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="p-8 hover:bg-white/[0.015] transition-colors h-full">
                  <div className="w-10 h-10 rounded-lg bg-green-500/[0.06] border border-green-500/[0.12] flex items-center justify-center mb-4">
                    <Icon icon={perk.icon} width={20} className="text-green-500" />
                  </div>
                  <h3 className="text-base text-white font-medium tracking-tight mb-2">{perk.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{perk.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT AMBASSADORS DO ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Role</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">What You Do</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">It&apos;s simple — share what you love, help others, and grow with us.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col">
            {WHAT_YOU_DO.map((item, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className={`group grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] ${i < WHAT_YOU_DO.length - 1 ? 'border-b border-white/[0.06]' : ''} hover:bg-white/[0.015] transition-colors`}>
                  <div className="p-6 md:p-8 flex flex-col justify-center items-center border-r border-white/[0.06]">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] group-hover:border-green-500/20 group-hover:bg-green-500/[0.06] flex items-center justify-center transition-all">
                      <Icon icon={item.icon} width={20} className="text-neutral-400 group-hover:text-green-500 transition-colors" />
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="text-base text-white font-medium tracking-tight mb-1">{item.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ APPLICATION FORM ═══ */}
      <section id="apply" className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Apply</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Apply Now</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Tell us about yourself. We review every application personally.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 p-8 md:p-12">
            {submitted ? (
              <ScrollReveal>
                <div className="max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/[0.08] border border-green-500/20 flex items-center justify-center mb-6">
                    <Icon icon="solar:check-circle-bold" width={32} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl text-white font-semibold tracking-tight mb-3">Application submitted!</h3>
                  <p className="text-neutral-400 text-base leading-relaxed mb-8">
                    Thanks for applying to be a Logic Packs Ambassador. We review every application personally and will get back to you within a few days. In the meantime, join the community!
                  </p>
                  <a
                    href={COMMUNITY_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-6 py-3 text-sm hover:bg-neutral-200 transition-colors"
                  >
                    <Icon icon="simple-icons:whatsapp" width={16} className="text-green-600" />
                    Join Community on WhatsApp
                  </a>
                </div>
              </ScrollReveal>
            ) : (
              <ScrollReveal>
                <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">Social / Website <span className="text-neutral-700">(primary link)</span></label>
                    <input
                      type="url"
                      value={formData.social}
                      onChange={(e) => setFormData(prev => ({ ...prev, social: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all"
                      placeholder="https://twitter.com/you or your website"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">Audience size <span className="text-neutral-700">(approx)</span></label>
                    <select
                      required
                      value={formData.audience}
                      onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all appearance-none"
                    >
                      <option value="" className="bg-[#111]">Select range</option>
                      <option value="0-500" className="bg-[#111]">0 – 500</option>
                      <option value="500-2k" className="bg-[#111]">500 – 2,000</option>
                      <option value="2k-10k" className="bg-[#111]">2,000 – 10,000</option>
                      <option value="10k-50k" className="bg-[#111]">10,000 – 50,000</option>
                      <option value="50k+" className="bg-[#111]">50,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">Why do you want to be an ambassador?</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.why}
                      onChange={(e) => setFormData(prev => ({ ...prev, why: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all resize-none"
                      placeholder="Tell us about yourself, your community, and why you're excited about Logic Packs..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3.5 text-sm hover:bg-neutral-200 transition-colors"
                  >
                    <Icon icon="solar:medal-ribbon-star-linear" width={16} />
                    Submit Application
                  </button>
                </form>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* ═══ COMMUNITY CTA ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="py-20 md:py-28 px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight leading-[0.95] max-w-4xl mb-6">
              Join the community. <span className="text-neutral-500 italic">Grow together.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-neutral-500 text-base leading-relaxed max-w-xl mb-8">
              Connect with ambassadors, founders, developers, and the Logic Packs team. Share ideas, get support, and be part of something big.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <a
              href={COMMUNITY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3.5 text-sm hover:bg-neutral-200 transition-colors"
            >
              <Icon icon="simple-icons:whatsapp" width={16} className="text-green-600" />
              Join WhatsApp Community
            </a>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-neutral-700 text-xs mt-6 font-mono">Free · No spam · 500+ members</p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

