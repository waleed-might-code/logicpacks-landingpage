import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import ScrollReveal from '../components/ScrollReveal';

/* ──────────────────────────────────────────────────────────
   BETA ACCESS PAGE — /beta
   Apply for early access + join community
   ────────────────────────────────────────────────────────── */

const COMMUNITY_LINK = 'https://chat.whatsapp.com/HxaG4RUxAEe4m77DgrUTYS?mode=gi_t';

const PERKS = [
  { icon: 'solar:star-linear', title: 'Early access to all packs', desc: 'Be the first to install new packs before they hit the public marketplace.' },
  { icon: 'solar:chat-round-dots-linear', title: 'Direct founder access', desc: 'Talk directly to the team building Logic Packs. Your feedback shapes the product.' },
  { icon: 'solar:tag-price-linear', title: 'Founding member pricing', desc: 'Lock in special pricing that will never be available again after launch.' },
  { icon: 'solar:users-group-rounded-linear', title: 'Private community', desc: 'Join a group of builders, founders, and operators who are shaping the future of software.' },
  { icon: 'solar:gift-linear', title: 'Free Pro during beta', desc: 'Full Pro access while we are in beta. No credit card required.' },
  { icon: 'solar:medal-ribbon-star-linear', title: 'Beta badge & credit', desc: 'Get recognized as a founding member with a permanent badge on your profile.' },
];

export default function BetaAccess() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.beta-reveal',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out' }
    );

    return () => {
      tl.kill();
      gsap.set('.beta-reveal', { clearProps: 'all' });
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
            <div className="beta-reveal flex items-center gap-2.5 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
              <p className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-medium font-mono">Beta Program</p>
            </div>
            <h1 className="beta-reveal text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-white mb-6">
              Get early access.
            </h1>
            <p className="beta-reveal text-base md:text-lg text-neutral-400 leading-relaxed max-w-xl mb-8">
              Logic Packs is currently in private beta. Apply below to get early access, or join our community to follow along and connect with other early adopters.
            </p>
            <div className="beta-reveal">
              <a
                href={COMMUNITY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/[0.1] text-white font-medium rounded-md px-6 py-3 text-sm hover:bg-white/[0.05] transition-colors"
              >
                <Icon icon="simple-icons:whatsapp" width={16} className="text-green-500" />
                Join the Community on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PERKS ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Perks</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Why Join Early</h2></ScrollReveal>
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

      {/* ═══ APPLICATION FORM ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Apply</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Request Access</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Fill out the form and we&apos;ll get back to you within 48 hours.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 p-8 md:p-12">
            {submitted ? (
              <ScrollReveal>
                <div className="max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/[0.08] border border-green-500/20 flex items-center justify-center mb-6">
                    <Icon icon="solar:check-circle-bold" width={32} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl text-white font-semibold tracking-tight mb-3">Application received!</h3>
                  <p className="text-neutral-400 text-base leading-relaxed mb-8">
                    Thanks for your interest in Logic Packs. We&apos;ll review your application and get back to you within 48 hours. In the meantime, join the community to connect with other early adopters.
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
                    <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all"
                      placeholder="Your name"
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
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">I am a...</label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all appearance-none"
                    >
                      <option value="" className="bg-[#111]">Select your role</option>
                      <option value="founder" className="bg-[#111]">Founder / CEO</option>
                      <option value="developer" className="bg-[#111]">Developer / Engineer</option>
                      <option value="business-owner" className="bg-[#111]">Business Owner</option>
                      <option value="agency" className="bg-[#111]">Agency / Freelancer</option>
                      <option value="investor" className="bg-[#111]">Investor</option>
                      <option value="other" className="bg-[#111]">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">What would you use Logic Packs for? <span className="text-neutral-700">(optional)</span></label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all resize-none"
                      placeholder="e.g., I want to add AI features to my e-commerce store..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3.5 text-sm hover:bg-neutral-200 transition-colors"
                  >
                    <Icon icon="solar:rocket-2-linear" width={16} />
                    Apply for Beta Access
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
              Join the community. <span className="text-neutral-500 italic">Build together.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-neutral-500 text-base leading-relaxed max-w-xl mb-8">
              Connect with founders, developers, and operators who are building with Logic Packs. Share ideas, get help, and be part of the journey.
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

