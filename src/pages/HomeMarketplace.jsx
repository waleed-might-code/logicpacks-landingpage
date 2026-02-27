import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import HeroScene from '../components/HeroScene';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

/* ──────────────────────────────────────────────────────────
   MARKETPLACE / BUYER LANDING PAGE
   
   Clean, dark, minimal — same visual language as the developer
   page. No glow orbs, no rainbow gradients.
   
   Audience: Non-technical business owners, operators,
   e-commerce owners, agency clients who want to ADD features
   to their apps — not build from scratch.
   ────────────────────────────────────────────────────────── */

/* ── Trending Packs ── */
const TRENDING = [
  { name: 'AI Virtual Try-On', desc: 'Customers try products on themselves using AI.', icon: 'solar:magic-stick-3-linear', installs: '8.2k', tag: 'AI', time: '2 min' },
  { name: 'One-Click Payments', desc: 'Stripe, PayPal, Apple Pay — all in one pack.', icon: 'solar:card-linear', installs: '6.1k', tag: 'Finance', time: '60 sec' },
  { name: 'Smart Dashboard', desc: 'Revenue, users, and growth — live analytics.', icon: 'solar:chart-2-linear', installs: '8.7k', tag: 'Analytics', time: '3 min' },
  { name: 'AI Chatbot', desc: 'GPT-powered support chatbot. Answers 24/7.', icon: 'solar:chat-round-dots-linear', installs: '5.8k', tag: 'AI', time: '5 min' },
  { name: 'User Login System', desc: 'Google, Apple, email — secure and tested.', icon: 'solar:shield-keyhole-linear', installs: '12.4k', tag: 'Essential', time: '90 sec' },
  { name: 'Email Campaigns', desc: 'Templates, scheduling, delivery tracking.', icon: 'solar:letter-linear', installs: '5.3k', tag: 'Marketing', time: '4 min' },
];

/* ── Categories ── */
const CATEGORIES = [
  { id: 'ai', label: 'AI & Machine Learning', icon: 'solar:magic-stick-3-linear', count: '24', desc: 'Virtual try-on, chatbots, image generation, smart search' },
  { id: 'payments', label: 'Payments & Finance', icon: 'solar:card-linear', count: '18', desc: 'Checkout, subscriptions, invoicing, multi-currency' },
  { id: 'analytics', label: 'Analytics & Dashboards', icon: 'solar:chart-2-linear', count: '15', desc: 'Revenue tracking, user analytics, real-time data' },
  { id: 'auth', label: 'Login & Security', icon: 'solar:shield-keyhole-linear', count: '12', desc: 'Social login, 2FA, role-based access, sessions' },
  { id: 'marketing', label: 'Marketing & Email', icon: 'solar:letter-linear', count: '14', desc: 'Email campaigns, push notifications, SMS, A/B testing' },
  { id: 'ecommerce', label: 'E-Commerce', icon: 'solar:bag-heart-linear', count: '20', desc: 'Product catalogs, carts, wishlists, reviews' },
  { id: 'automation', label: 'Automation', icon: 'solar:bolt-circle-linear', count: '16', desc: 'Task scheduling, webhooks, triggers, workflows' },
  { id: 'content', label: 'Content & Media', icon: 'solar:gallery-wide-linear', count: '11', desc: 'Image generation, uploads, video processing, CMS' },
];

/* ── Use Cases ── */
const USE_CASES = [
  {
    title: 'Add AI virtual try-on to your store',
    desc: 'Your customers upload a selfie, pick a product, and see how it looks on them — instantly. Works with glasses, clothing, jewelry, makeup.',
    before: 'Customers guess if products will look good. High return rates.',
    after: 'Customers see it on themselves first. Returns drop 40%.',
    packs: ['AI Virtual Try-On', 'Product Catalog', 'Image CDN'],
    icon: 'solar:magic-stick-3-linear',
    metric: '40% fewer returns',
  },
  {
    title: 'Launch a customer portal this weekend',
    desc: 'Login, dashboard, billing, support tickets — all wired together. Your customers get a self-service portal. You stop answering the same emails.',
    before: 'Customers email you for every invoice, password reset, and status update.',
    after: 'Customers self-serve. You focus on growing the business.',
    packs: ['Auth Pack', 'Dashboard UI', 'Payments', 'Email Service'],
    icon: 'solar:monitor-smartphone-linear',
    metric: '80% fewer support emails',
  },
  {
    title: 'Add payments in 60 seconds',
    desc: 'Stripe, PayPal, Apple Pay — all handled. Subscriptions, one-time payments, invoices. Enter your Stripe key, done.',
    before: 'Weeks of payment integration. Testing webhooks. Handling edge cases.',
    after: 'One click. Payments work. Subscriptions auto-renew.',
    packs: ['Payments Pack', 'Invoice Generator', 'Webhook Handler'],
    icon: 'solar:card-linear',
    metric: 'Live in 60 seconds',
  },
];

/* ── Featured Packs ── */
const FEATURED_PACKS = [
  { name: 'Auth Pack', desc: 'Complete login system — Google, Apple, email, 2FA.', icon: 'solar:shield-keyhole-linear', installs: '12.4k', rating: '4.9', reviews: '284', tag: 'Essential', slug: 'auth-pack' },
  { name: 'Dashboard UI', desc: 'Admin dashboard with charts, tables, and real-time data.', icon: 'solar:chart-2-linear', installs: '8.7k', rating: '4.8', reviews: '196', tag: 'Analytics', slug: 'dashboard-ui' },
  { name: 'Payments Pack', desc: 'Stripe, PayPal, Apple Pay — subscriptions, invoices.', icon: 'solar:card-linear', installs: '6.1k', rating: '4.9', reviews: '152', tag: 'Finance', slug: 'payments-pack' },
  { name: 'OpenAI Connector', desc: 'Add GPT to your app. Chatbots, content generation.', icon: 'solar:star-linear', installs: '5.8k', rating: '4.7', reviews: '128', tag: 'AI', slug: 'openai-connector' },
  { name: 'Email Service', desc: 'Beautiful emails. Templates, scheduling, tracking.', icon: 'solar:letter-linear', installs: '5.3k', rating: '4.8', reviews: '143', tag: 'Marketing', slug: 'email-service' },
  { name: 'Form Builder', desc: 'Dynamic forms that validate, upload, multi-step flows.', icon: 'solar:clipboard-list-linear', installs: '5.1k', rating: '4.7', reviews: '97', tag: 'UI', slug: 'form-builder' },
];

/* ── Testimonials ── */
const TESTIMONIALS = [
  { quote: "I added payments to my app in literally 60 seconds. I timed it.", name: 'David Chen', role: 'E-commerce Owner', initials: 'DC' },
  { quote: "The AI chatbot pack replaced our $500/month customer support tool.", name: 'Maria Santos', role: 'SaaS Founder', initials: 'MS' },
  { quote: "We installed the dashboard pack and our investors thought we had a full analytics team.", name: 'Alex Kim', role: 'Startup CEO', initials: 'AK' },
  { quote: "Virtual try-on for our eyewear store. Returns dropped 35% in the first month.", name: 'Priya Sharma', role: 'D2C Brand Owner', initials: 'PS' },
  { quote: "Same packs power all 4 of my stores. Saved me $20k in dev costs.", name: 'James Wright', role: 'Serial Entrepreneur', initials: 'JW' },
  { quote: "My developer quoted 3 months for a customer portal. I did it in a weekend.", name: 'Fatima Al-Rashid', role: 'Agency Owner', initials: 'FA' },
];

/* ── How it works ── */
const STEPS = [
  { n: '01', title: 'Browse', desc: 'Find what you need. AI features, payments, dashboards, login systems — all in one marketplace.', icon: 'solar:magnifer-linear' },
  { n: '02', title: 'Click Install', desc: 'One click. The pack installs into your app automatically. No coding. No configuration files.', icon: 'solar:download-minimalistic-linear' },
  { n: '03', title: 'It Just Works', desc: 'The feature is live. Tested, secure, and ready for your customers. Updates happen automatically.', icon: 'solar:check-circle-linear' },
];

export default function HomeMarketplace() {
  const [, setSearchParams] = useSearchParams();
  const [activeCase, setActiveCase] = useState(0);
  const { openBeta } = useBeta();

  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.mp-hero-reveal',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out' }
    );

    return () => {
      tl.kill();
      gsap.set('.mp-hero-reveal', { clearProps: 'all' });
    };
  }, []);

  return (
    <>
      {/* ═══ VIEW TOGGLE ═══ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[#141414]/90 backdrop-blur-xl border border-white/[0.08] rounded-full p-1 shadow-2xl shadow-black/40">
        <button onClick={() => setSearchParams({ view: 'marketplace' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all bg-white text-black">Marketplace</button>
        <button onClick={() => setSearchParams({ view: 'founder' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all text-neutral-400 hover:text-white">Founders</button>
        <button onClick={() => setSearchParams({ view: 'developer' })} className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all text-neutral-400 hover:text-white">Developers</button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          HERO — 3D sphere background, same as dev/founder pages
      ═══════════════════════════════════════════════════════ */}
      <div className="relative h-screen w-full overflow-hidden pt-14">
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          <main className="flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-24">
            <div className="max-w-3xl space-y-7">
              {/* Status badge */}
              <div className="overflow-hidden">
                <div className="mp-hero-reveal flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                  <p className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-medium font-mono">180+ Packs Available · Install in Seconds</p>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <div className="overflow-hidden">
                  <h1 className="mp-hero-reveal text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] text-white">Add any feature.</h1>
                </div>
                <div className="overflow-hidden">
                  <h1 className="mp-hero-reveal text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] text-neutral-400 italic">One click.</h1>
                </div>
              </div>

              {/* Description */}
              <div className="overflow-hidden max-w-lg">
                <p className="mp-hero-reveal text-sm md:text-base text-neutral-500 leading-relaxed">
                  Payments, AI, dashboards, login systems, chatbots, email — install ready-made features into your app like installing an app on your phone. No coding required.
                  <span className="text-green-500/60 text-xs block mt-3 font-mono uppercase tracking-widest">&gt; Scroll to explore · Hover to attract · Click to reassemble</span>
                </p>
              </div>

              {/* CTAs */}
              <div className="overflow-hidden pt-4">
                <div className="mp-hero-reveal flex flex-wrap pointer-events-auto gap-3">
                  <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-black font-medium rounded-md px-7 py-3 text-sm hover:bg-neutral-200 transition-colors">
                    Browse Marketplace <Icon icon="solar:arrow-right-linear" width={16} />
                  </button>
                  <a href="#how-it-works" className="inline-flex items-center gap-2 border border-white/15 text-white font-medium rounded-md px-7 py-3 text-sm hover:bg-white/5 transition-colors">
                    How It Works <Icon icon="solar:play-circle-linear" width={16} className="text-neutral-400" />
                  </a>
                </div>
              </div>
            </div>
          </main>
          <footer className="pointer-events-auto mp-hero-reveal flex justify-between items-end w-full px-6 pb-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-600">
              <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500/70" width={14} /> Free to start</span>
              <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500/70" width={14} /> No coding needed</span>
              <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500/70" width={14} /> Install in seconds</span>
              <span className="flex items-center gap-1.5"><Icon icon="solar:check-circle-bold" className="text-green-500/70" width={14} /> Cancel anytime</span>
            </div>
          </footer>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-[5] pointer-events-none" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          TRENDING — Marquee-style scrolling packs
      ═══════════════════════════════════════════════════════ */}
      <section className="overflow-hidden border-t border-white/[0.06] relative">
        <div className="flex overflow-hidden py-5 relative items-center">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-6 animate-marquee whitespace-nowrap min-w-full">
            {[0, 1].map((g) => (
              <div key={g} className="flex items-center gap-6 shrink-0">
                {TRENDING.map((pack) => (
                  <button onClick={openBeta} key={`${g}-${pack.name}`} className="flex items-center gap-3 opacity-40 hover:opacity-90 transition-opacity group">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <Icon icon={pack.icon} width={16} className="text-green-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white tracking-tight">{pack.name}</span>
                      <span className="text-[10px] text-neutral-600">{pack.installs} installs · {pack.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS — Same grid pattern as developer page
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          {[
            { val: '180+', desc: 'Ready-to-install packs in the marketplace' },
            { val: '47k+', desc: 'Total installs across all verified packs' },
            { val: '2 min', desc: 'Average time from browse to feature live' },
            { val: '99.9%', desc: 'Uptime guarantee on all verified packs', green: true },
          ].map((s, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className={`p-8 md:p-10 flex flex-col justify-end min-h-[200px] transition-colors ${s.green ? 'bg-green-500/[0.04] hover:bg-green-500/[0.06]' : 'hover:bg-white/[0.02]'}`}>
                <div className={`text-5xl md:text-6xl font-medium tracking-tight mb-3 ${s.green ? 'text-green-500' : 'text-white'}`}>{s.val}</div>
                <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ABOUT — Big statement
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-1">/// Marketplace</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Install &amp; Go</h2></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 p-8 md:p-14 flex flex-col justify-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.05] mb-8">
                Stop rebuilding the same features. <span className="text-neutral-500 italic">Install them.</span>
              </h2>
            </ScrollReveal>
            <div className="flex flex-col md:flex-row gap-10 md:items-end justify-between">
              <ScrollReveal><p className="text-base text-neutral-500 leading-relaxed max-w-xl">Every pack is verified, tested, and production-ready. Login systems, payments, AI features, dashboards — browse what you need, click install, and it works. Like an app store for your app.</p></ScrollReveal>
              <ScrollReveal>
                <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all shrink-0">
                  Browse All <Icon icon="solar:arrow-right-up-linear" width={16} className="text-neutral-500" />
                </button>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CATEGORIES — Grid layout matching dev page modes
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Categories</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">What Do You Need?</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-6">Browse by category. Every pack installs in minutes and updates automatically.</p></ScrollReveal>
            </div>
            <ScrollReveal>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 px-5 py-2.5 rounded-md text-xs font-medium hover:bg-white/5 transition-all w-max">
                View All <Icon icon="solar:arrow-right-up-linear" width={14} className="text-neutral-500" />
              </button>
            </ScrollReveal>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y md:divide-x divide-white/[0.06]">
            {CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 50}>
                <button onClick={openBeta} className="group flex flex-col hover:bg-white/[0.015] transition-colors p-8 h-full text-left w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/[0.06] border border-green-500/[0.12] flex items-center justify-center">
                      <Icon icon={cat.icon} width={20} className="text-green-500" />
                    </div>
                    <span className="text-xs font-mono text-neutral-600">{cat.count} packs</span>
                  </div>
                  <h3 className="text-base text-white font-medium tracking-tight mb-2">{cat.label}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4">{cat.desc}</p>
                  <div className="mt-auto pt-3 border-t border-white/[0.04]">
                    <span className="text-xs text-neutral-600 group-hover:text-neutral-300 transition-colors flex items-center gap-1.5">
                      Browse packs <Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BANNER — Big type statement
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="py-20 md:py-28 px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[0.95] max-w-5xl">Features that <span className="text-neutral-500 italic">just work.</span></h2>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps
      ═══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Process</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Three Steps</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Browse. Install. Done. That simple.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="group flex flex-col hover:bg-white/[0.015] transition-colors p-8 h-full">
                  <span className="font-mono text-green-500 text-xs block mb-4">{step.n}</span>
                  <div className="w-12 h-12 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                    <Icon icon={step.icon} width={22} className="text-white" />
                  </div>
                  <h3 className="text-lg text-white font-medium tracking-tight mb-3">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Terminal demo */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-6 md:px-8 py-12">
            <ScrollReveal>
              <div className="bg-neutral-900/30 border border-white/[0.06] rounded-lg overflow-hidden">
                <div className="h-9 bg-white/[0.02] border-b border-white/[0.04] flex items-center px-4 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <span className="ml-3 text-[11px] text-neutral-600 font-mono">Terminal</span>
                </div>
                <div className="p-5 font-mono text-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">$</span>
                    <span className="text-white">logicpacks install payments-pack</span>
                  </div>
                  <div className="text-neutral-600 text-xs space-y-1.5 pl-4">
                    <div className="flex items-center gap-2"><Icon icon="solar:check-circle-bold" className="text-green-500" width={12} /> Downloading payments-pack@v2.0.3...</div>
                    <div className="flex items-center gap-2"><Icon icon="solar:check-circle-bold" className="text-green-500" width={12} /> Installing dependencies...</div>
                    <div className="flex items-center gap-2"><Icon icon="solar:check-circle-bold" className="text-green-500" width={12} /> Running tests... 24/24 passed</div>
                    <div className="flex items-center gap-2"><Icon icon="solar:check-circle-bold" className="text-green-500" width={12} /> Configuring Stripe webhook...</div>
                  </div>
                  <div className="pt-2 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-green-400 font-semibold">Payments pack installed and live!</span>
                    </div>
                    <div className="text-neutral-700 text-xs mt-1 pl-4">Total time: 47 seconds</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          USE CASES — Before/After with tab selector
      ═══════════════════════════════════════════════════════ */}
      <section id="use-cases" className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Results</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Real Outcomes</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-6">Real businesses. Real results. See what others are installing.</p></ScrollReveal>
            </div>
            <div className="flex flex-col gap-2">
              {USE_CASES.map((uc, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCase(i)}
                  className={`text-left px-4 py-3 rounded-md text-sm font-medium transition-all border ${
                    activeCase === i
                      ? 'bg-white text-black border-white'
                      : 'border-white/[0.06] text-neutral-500 hover:text-white hover:border-white/[0.12] hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon icon={uc.icon} width={16} />
                    <span className="truncate">{uc.title.split(' ').slice(0, 4).join(' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 p-8 md:p-12">
            <ScrollReveal key={activeCase}>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/[0.06] border border-green-500/[0.12] flex items-center justify-center">
                    <Icon icon={USE_CASES[activeCase].icon} width={20} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl text-white font-medium tracking-tight">{USE_CASES[activeCase].title}</h3>
                    <span className="text-xs font-mono text-green-500">{USE_CASES[activeCase].metric}</span>
                  </div>
                </div>
                <p className="text-neutral-400 text-base leading-relaxed max-w-2xl mb-6">{USE_CASES[activeCase].desc}</p>

                {/* Packs used */}
                <div className="mb-8">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-mono block mb-3">Packs used</span>
                  <div className="flex flex-wrap gap-2">
                    {USE_CASES[activeCase].packs.map((p, j) => (
                      <span key={j} className="px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs text-neutral-300 font-medium">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Before / After */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06] rounded-lg overflow-hidden">
                <div className="bg-[#0a0a0a] p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon icon="solar:close-circle-linear" className="text-neutral-600" width={16} />
                    <span className="text-neutral-600 text-xs font-mono uppercase tracking-wider">Before</span>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed">{USE_CASES[activeCase].before}</p>
                </div>
                <div className="bg-[#0a0a0a] p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon icon="solar:check-circle-linear" className="text-green-500" width={16} />
                    <span className="text-green-500 text-xs font-mono uppercase tracking-wider">After installing packs</span>
                  </div>
                  <p className="text-white text-sm leading-relaxed font-medium">{USE_CASES[activeCase].after}</p>
                </div>
              </div>

              <div className="mt-8">
                <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-black font-medium rounded-md px-6 py-3 text-sm hover:bg-neutral-200 transition-colors">
                  Install these packs <Icon icon="solar:arrow-right-linear" width={14} />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TOP PACKS — Featured pack cards
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Popular</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Top Packs</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Most installed packs across the marketplace.</p></ScrollReveal>
            </div>
            <ScrollReveal>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 px-5 py-2.5 rounded-md text-xs font-medium hover:bg-white/5 transition-all w-max mt-6">
                View All 180+ <Icon icon="solar:arrow-right-up-linear" width={14} className="text-neutral-500" />
              </button>
            </ScrollReveal>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y md:divide-x divide-white/[0.06]">
            {FEATURED_PACKS.map((pack, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <button onClick={openBeta} className="group flex flex-col hover:bg-white/[0.015] transition-colors p-8 h-full text-left w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                      <Icon icon={pack.icon} width={20} className="text-green-500" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-wider">{pack.tag}</span>
                  </div>
                  <h3 className="text-base text-white font-medium tracking-tight mb-1.5">{pack.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Icon key={j} icon="solar:star-bold" width={10} className="text-yellow-500/80" />
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-600">{pack.rating} ({pack.reviews})</span>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4">{pack.desc}</p>
                  <div className="mt-auto pt-3 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                      <Icon icon="solar:download-minimalistic-linear" width={12} />{pack.installs}
                    </span>
                    <span className="text-xs text-neutral-600 group-hover:text-green-500 transition-colors flex items-center gap-1">
                      Install <Icon icon="solar:arrow-right-linear" width={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          COMPARISON — Build vs Install
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Compare</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Build vs. Install</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Stop paying developers to reinvent the wheel.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 p-8 md:p-12">
            <ScrollReveal>
              <div className="border border-white/[0.06] rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-3 bg-white/[0.02]">
                  <div className="p-4 md:p-5 border-r border-white/[0.06]">
                    <span className="text-xs font-mono text-neutral-600">Feature</span>
                  </div>
                  <div className="p-4 md:p-5 border-r border-white/[0.06] text-center">
                    <span className="text-xs font-mono text-neutral-500">Build from scratch</span>
                  </div>
                  <div className="p-4 md:p-5 text-center bg-green-500/[0.03]">
                    <span className="text-xs font-mono text-green-500">Install a Pack</span>
                  </div>
                </div>
                {/* Rows */}
                {[
                  { feature: 'Login system', scratch: '2–4 weeks', pack: '90 seconds' },
                  { feature: 'Payment processing', scratch: '3–6 weeks', pack: '60 seconds' },
                  { feature: 'Admin dashboard', scratch: '4–8 weeks', pack: '3 minutes' },
                  { feature: 'Email notifications', scratch: '1–2 weeks', pack: '2 minutes' },
                  { feature: 'AI chatbot', scratch: '6–10 weeks', pack: '5 minutes' },
                  { feature: 'Cost', scratch: '$5,000–$50,000', pack: 'Free – $29/mo' },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-3 border-t border-white/[0.04]">
                    <div className="p-4 md:p-5 border-r border-white/[0.06]">
                      <span className="text-sm text-white font-medium">{row.feature}</span>
                    </div>
                    <div className="p-4 md:p-5 border-r border-white/[0.06] text-center">
                      <span className="text-sm text-neutral-600">{row.scratch}</span>
                    </div>
                    <div className="p-4 md:p-5 text-center bg-green-500/[0.02]">
                      <span className="text-sm text-green-500 font-medium">{row.pack}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TESTIMONIALS — Clean grid
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Proof</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">People Love This</h2></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y md:divide-x divide-white/[0.06]">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="p-8 hover:bg-white/[0.015] transition-colors h-full flex flex-col">
                  <p className="text-neutral-300 text-sm leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                    <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-neutral-400">{t.initials}</div>
                    <div>
                      <p className="text-white text-xs font-medium">{t.name}</p>
                      <p className="text-neutral-600 text-[11px]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HARDWARE TEASER — LPDN Node
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {/* Visual */}
          <div className="p-8 md:p-12 flex items-center justify-center min-h-[400px] relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.03)_0%,transparent_60%)] pointer-events-none" />
            <div className="relative">
              <div className="w-60 h-44 md:w-72 md:h-52 rounded-lg bg-neutral-900/30 border border-white/[0.06] flex flex-col overflow-hidden">
                <div className="h-8 bg-white/[0.02] border-b border-white/[0.04] flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <span className="ml-2 text-[9px] font-mono text-neutral-600">LPDN Node</span>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Icon icon="solar:server-minimalistic-linear" className="text-green-500 text-xs" />
                    </div>
                    <div className="w-20 h-2 bg-white/10 rounded-sm" />
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.06] rounded-sm" />
                  <div className="w-3/4 h-1.5 bg-white/[0.04] rounded-sm" />
                  <div className="mt-auto flex items-center gap-2">
                    <div className="flex-1 h-2.5 bg-green-500/15 rounded-sm" />
                    <div className="w-8 h-2.5 bg-green-500/10 rounded-sm" />
                  </div>
                </div>
              </div>
              {/* Signal bars */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-end gap-1">
                <div className="w-1 h-2 bg-green-500/30 rounded-full" />
                <div className="w-1 h-4 bg-green-500/40 rounded-full" />
                <div className="w-1 h-6 bg-green-500/50 rounded-full" />
                <div className="w-1 h-4 bg-green-500/40 rounded-full" />
                <div className="w-1 h-2 bg-green-500/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-green-500/[0.06] text-green-500 border-green-500/20 uppercase tracking-wider">Hardware</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-white/[0.02] text-neutral-600 border-white/[0.06]">New</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-3">Take your packs offline.</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6 max-w-md">
              The LPDN Node runs your entire app ecosystem without internet. Plug it in, connect to its Wi-Fi, and your apps work anywhere — field offices, remote clinics, events.
            </p>
            <div className="flex items-center gap-6 mb-6">
              <div>
                <span className="text-2xl font-bold text-white">$149</span>
                <span className="text-neutral-600 text-sm ml-1.5 line-through">$199</span>
              </div>
              <div className="h-5 w-px bg-white/[0.08]" />
              <span className="text-green-500 text-xs font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> In Stock
              </span>
            </div>
            <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-black font-medium rounded-md px-6 py-3 text-sm hover:bg-neutral-200 transition-colors w-max">
              View LPDN Node <Icon icon="solar:arrow-right-linear" width={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRICING — Clean 3-tier
      ═══════════════════════════════════════════════════════ */}
      <section id="pricing" className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[200px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Pricing</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Simple Pricing</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Free to start. Upgrade when you grow.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {[
              {
                tier: 'Free',
                price: '$0',
                desc: 'Try any free pack. No credit card.',
                features: ['Access to 100+ free packs', '1 project', 'Community support', 'Basic analytics'],
                cta: 'Start Free',
                highlight: false,
              },
              {
                tier: 'Pro',
                price: '$29',
                unit: '/mo',
                desc: 'Unlimited packs. Unlimited projects.',
                features: ['All 180+ packs', 'Unlimited projects', 'Auto-updates & self-healing', 'Priority support', 'Team collaboration', 'Custom branding'],
                cta: 'Start Pro — 14 days free',
                highlight: true,
              },
              {
                tier: 'Enterprise',
                price: 'Custom',
                desc: 'For organizations. Dedicated support.',
                features: ['Everything in Pro', 'Dedicated infrastructure', 'SLA guarantee', 'Audit & compliance', 'Custom integrations'],
                cta: 'Talk to Sales',
                highlight: false,
              },
            ].map((plan) => (
              <ScrollReveal key={plan.tier}>
                <div className={`p-8 md:p-10 flex flex-col h-full transition-colors ${plan.highlight ? 'bg-green-500/[0.04] hover:bg-green-500/[0.06]' : 'hover:bg-white/[0.02]'}`}>
                  <span className={`text-xs font-mono uppercase tracking-[0.2em] mb-6 ${plan.highlight ? 'text-green-500' : 'text-neutral-600'}`}>{plan.tier}</span>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-medium text-white">{plan.price}</span>
                    {plan.unit && <span className="text-neutral-500 text-sm">{plan.unit}</span>}
                  </div>
                  <p className="text-neutral-500 text-sm mb-8">{plan.desc}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-neutral-400">
                        <Icon icon="solar:check-circle-bold" width={14} className={plan.highlight ? 'text-green-500' : 'text-neutral-700'} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={openBeta}
                    className={`block w-full text-center px-5 py-3 rounded-md text-sm font-medium transition-all ${
                      plan.highlight
                        ? 'bg-white text-black hover:bg-neutral-200'
                        : 'border border-white/[0.1] text-neutral-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 flex flex-col p-8 md:p-10">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// FAQ</span>
            <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight">Questions</h2></ScrollReveal>
          </div>
          <div className="md:col-span-3 divide-y divide-white/[0.06]">
            {[
              { q: 'Do I need to know how to code?', a: 'No. Packs install with one click. You configure them through a simple interface — no code, no terminal, no technical knowledge needed.' },
              { q: 'How fast can I add a feature?', a: 'Most packs install in under 2 minutes. Some (like payments) take 60 seconds. You enter your API key, click install, and it works.' },
              { q: 'What if something breaks?', a: 'Packs are self-healing. They monitor themselves, detect issues, and fix them automatically. You can also roll back to any previous version instantly.' },
              { q: 'Can I use packs with my existing app?', a: 'Yes. Packs work with any modern web app. React, Next.js, Vue, or plain HTML — packs adapt to your stack.' },
              { q: 'Is it really free to start?', a: 'Yes. 100+ packs are completely free. No credit card required. You only pay when you need premium packs or unlimited projects.' },
              { q: 'What about the LPDN hardware?', a: 'The LPDN Node is a separate physical device that lets you run your entire app ecosystem offline. Great for field operations, remote areas, and events. Starts at $149.' },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 40}>
                <details className="group cursor-pointer">
                  <summary className="flex items-center justify-between p-6 md:p-8 text-white text-sm font-medium list-none hover:bg-white/[0.015] transition-colors">
                    {faq.q}
                    <Icon icon="solar:alt-arrow-down-linear" width={16} className="text-neutral-600 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                  </summary>
                  <div className="px-6 md:px-8 pb-6 md:pb-8 -mt-2">
                    <p className="text-neutral-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA — Big type, clean
      ═══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06]">
        <div className="py-28 md:py-40 px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[0.95] max-w-5xl mb-8">
              Your next feature is <span className="text-neutral-500 italic">one click away.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-neutral-500 text-base leading-relaxed max-w-xl mb-10">
              Join thousands of businesses that stopped rebuilding and started installing. Browse the marketplace — your first pack is free.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-wrap gap-3">
              <button onClick={openBeta} className="inline-flex items-center gap-2 bg-white text-black font-medium rounded-md px-8 py-3.5 text-sm hover:bg-neutral-200 transition-colors">
                Browse Marketplace <Icon icon="solar:arrow-right-linear" width={16} />
              </button>
              <button onClick={openBeta} className="inline-flex items-center gap-2 border border-white/15 text-white font-medium rounded-md px-8 py-3.5 text-sm hover:bg-white/5 transition-colors">
                View Hardware
              </button>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-neutral-700 text-xs mt-8 font-mono">Free forever · No credit card · Install your first pack in 60 seconds</p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
