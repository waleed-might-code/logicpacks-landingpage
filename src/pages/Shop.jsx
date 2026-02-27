import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/products';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { openBetaModal } = useBeta();

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      {/* ═══ SHOP HERO ═══ */}
      <section className="pt-14">
        <div className="border-b border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Hardware &amp; Merch</span>
                <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-3">Shop</h1>
                <p className="text-neutral-500 text-base leading-relaxed max-w-xl">LPDN nodes for offline app distribution, developer accessories, IoT sensor kits, and Logic Packs merch.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  <span className="text-green-500 text-xs font-mono">Free shipping on LPDN bundles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LPDN HERO BANNER ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto">
          <Link to="/product/lpdn-node" className="group block">
            <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-white/[0.06]">
              {/* Visual */}
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px] bg-gradient-to-br from-green-500/[0.06] to-transparent flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08)_0%,transparent_70%)]" />
                <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
                {/* Stylized LPDN illustration */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-48 h-32 md:w-64 md:h-44 rounded-2xl bg-[#111] border border-white/[0.08] shadow-2xl shadow-green-500/10 group-hover:border-green-500/20 transition-all flex flex-col overflow-hidden">
                    <div className="h-3 bg-white/[0.03] border-b border-white/[0.04] flex items-center px-2 gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <div className="flex-1 p-3 md:p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                          <Icon icon="solar:server-minimalistic-linear" className="text-green-500 text-xs" />
                        </div>
                        <div className="w-16 h-1.5 bg-white/15 rounded-sm" />
                      </div>
                      <div className="w-full h-1 bg-white/[0.08] rounded-sm" />
                      <div className="w-3/4 h-1 bg-white/[0.06] rounded-sm" />
                      <div className="mt-auto flex items-center gap-2">
                        <div className="flex-1 h-2 bg-green-500/20 rounded-sm" />
                        <div className="w-6 h-2 bg-green-500/10 rounded-sm" />
                      </div>
                    </div>
                  </div>
                  {/* Wi-Fi waves */}
                  <div className="mt-4 flex items-center gap-1.5">
                    <div className="w-1 h-3 bg-green-500/30 rounded-full" />
                    <div className="w-1 h-5 bg-green-500/40 rounded-full" />
                    <div className="w-1 h-7 bg-green-500/50 rounded-full" />
                    <div className="w-1 h-5 bg-green-500/40 rounded-full" />
                    <div className="w-1 h-3 bg-green-500/30 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold border bg-green-500/15 text-green-400 border-green-500/20 uppercase tracking-wider">Flagship</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-medium border bg-white/[0.03] text-neutral-500 border-white/[0.06]">New</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight mb-4 group-hover:text-green-50 transition-colors">LPDN Node</h2>
                <p className="text-neutral-500 text-base leading-relaxed mb-6 max-w-md">Logic Pack Distribution Node — install it, connect to its Wi-Fi, and run your entire Logic Packs app ecosystem offline. No internet required.</p>
                <div className="flex items-center gap-6 mb-8">
                  <div>
                    <span className="text-3xl font-semibold text-white">$149</span>
                    <span className="text-neutral-600 text-sm ml-1 line-through">$199</span>
                  </div>
                  <div className="h-6 w-px bg-white/[0.08]" />
                  <div className="flex items-center gap-1.5 text-green-500 text-xs font-mono">
                    <Icon icon="solar:box-minimalistic-linear" width={14} />
                    In Stock
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5"><Icon icon="solar:wifi-router-minimalistic-linear" width={14} className="text-green-500/60" />Built-in Wi-Fi AP</div>
                  <div className="flex items-center gap-1.5"><Icon icon="solar:bolt-circle-linear" width={14} className="text-green-500/60" />Raspberry Pi 5</div>
                  <div className="flex items-center gap-1.5"><Icon icon="solar:shield-check-linear" width={14} className="text-green-500/60" />Pre-configured</div>
                </div>
                <div className="mt-8">
                  <span className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-6 py-3 text-sm group-hover:bg-green-500 group-hover:text-black transition-colors">
                    View Product
                    <Icon icon="solar:arrow-right-linear" width={16} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══ CATEGORY FILTERS ═══ */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 pt-10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {PRODUCT_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`text-xs font-medium px-4 py-2 rounded-md border transition-all ${
                activeCategory === c.id
                  ? 'border-green-500/40 text-green-500 bg-green-500/[0.08]'
                  : 'border-white/[0.08] text-neutral-400 hover:border-white/15 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ PRODUCT GRID ═══ */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(product => (
              <ScrollReveal key={product.slug}>
                {product.comingSoon ? (
                  <div className="product-card block border border-white/[0.06] rounded-xl relative overflow-hidden hover:bg-white/[0.025] transition-all">
                    {/* Coming Soon Overlay */}
                    <div className="absolute inset-0 z-20 bg-[#0a0a0a]/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <Icon icon="solar:clock-circle-linear" className="text-yellow-400 text-2xl mb-2 mx-auto" />
                        <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Coming Soon</p>
                      </div>
                    </div>
                    {product.badge && (
                      <span className={`absolute top-3 right-3 z-10 px-2 py-0.5 rounded text-[9px] font-medium border ${product.badgeColor}`}>{product.badge}</span>
                    )}
                    <div className="aspect-square bg-white/[0.015] flex items-center justify-center relative overflow-hidden border-b border-white/[0.04]">
                      <div className={`w-20 h-20 rounded-2xl ${product.bgColor} border ${product.borderColor} flex items-center justify-center`}>
                        <Icon icon={product.icon} className={`${product.iconColor} text-3xl`} />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white text-sm font-medium truncate mb-1">{product.name}</h3>
                      <p className="text-neutral-600 text-xs leading-relaxed mb-3 line-clamp-2">{product.desc}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                        <div className="text-sm">
                          <span className="text-white font-semibold">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-neutral-700 text-xs line-through ml-1.5">${product.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-yellow-400">Pre-order</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to={`/product/${product.slug}`} className="product-card group block border border-white/[0.06] rounded-xl relative overflow-hidden hover:bg-white/[0.025] transition-all">
                    {product.badge && (
                      <span className={`absolute top-3 right-3 z-10 px-2 py-0.5 rounded text-[9px] font-medium border ${product.badgeColor}`}>{product.badge}</span>
                    )}
                    <div className="aspect-square bg-white/[0.015] flex items-center justify-center relative overflow-hidden border-b border-white/[0.04]">
                      <div className="transition-transform duration-400 group-hover:scale-[1.03]">
                        <div className={`w-20 h-20 rounded-2xl ${product.bgColor} border ${product.borderColor} flex items-center justify-center`}>
                          <Icon icon={product.icon} className={`${product.iconColor} text-3xl`} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white text-sm font-medium truncate mb-1">{product.name}</h3>
                      <p className="text-neutral-600 text-xs leading-relaxed mb-3 line-clamp-2">{product.desc}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                        <div className="text-sm">
                          <span className="text-white font-semibold">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-neutral-700 text-xs line-through ml-1.5">${product.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-green-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-green-500 rounded-full" />
                          In Stock
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Icon icon="solar:box-minimalistic-linear" className="text-neutral-700 text-4xl mb-4 mx-auto" />
            <p className="text-neutral-500 text-sm">No products in this category yet.</p>
          </div>
        )}
      </section>

      {/* ═══ LPDN INFO SECTION ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          {/* Sidebar */}
          <div className="md:col-span-1 flex flex-col p-8 md:p-10 justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// LPDN</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Offline by Design</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Run your entire app ecosystem without internet. The LPDN creates a local Wi-Fi network that serves your Logic Packs apps to any connected device.</p></ScrollReveal>
            </div>
          </div>

          {/* Features */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            <ScrollReveal>
              <div className="p-8 md:p-10 flex flex-col hover:bg-white/[0.015] transition-colors h-full">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
                  <Icon icon="solar:wifi-router-minimalistic-linear" className="text-green-500 text-lg" />
                </div>
                <h3 className="text-lg text-white font-medium tracking-tight mb-2">Local Wi-Fi AP</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">LPDN broadcasts its own Wi-Fi network. Connect any phone, tablet, or laptop — your apps run locally with zero latency.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="p-8 md:p-10 flex flex-col hover:bg-white/[0.015] transition-colors h-full">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <Icon icon="solar:refresh-circle-linear" className="text-neutral-400 text-lg" />
                </div>
                <h3 className="text-lg text-white font-medium tracking-tight mb-2">Auto-Sync</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">When internet is available, the LPDN syncs pack updates, data, and telemetry. Offline-first, online-enhanced.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="p-8 md:p-10 flex flex-col hover:bg-white/[0.015] transition-colors h-full">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <Icon icon="solar:cpu-bolt-linear" className="text-neutral-400 text-lg" />
                </div>
                <h3 className="text-lg text-white font-medium tracking-tight mb-2">IoT Ready</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">Expand with sensor modules, smart relays, and environmental monitors. Build real-world Logic Packs automations.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ HOW LPDN WORKS ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-20 md:py-28">
          <div className="text-center mb-16">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// How It Works</span>
            <ScrollReveal><h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">Setup in 3 minutes</h2></ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden">
            {[
              { num: '01', title: 'Plug In', desc: 'Connect your LPDN to power. It boots in under 30 seconds and creates a Wi-Fi access point.' },
              { num: '02', title: 'Connect', desc: 'Join the LPDN Wi-Fi from any device. Open a browser — the local dashboard loads instantly.' },
              { num: '03', title: 'Deploy', desc: 'Install packs to the node, deploy apps, and let your team or customers use them — no internet needed.' },
            ].map((step, i) => (
              <ScrollReveal key={step.num}>
                <div className={`p-8 md:p-10 text-center hover:bg-white/[0.015] transition-colors ${i > 0 ? 'border-t md:border-t-0 border-white/[0.06]' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                    <span className="text-green-500 font-mono text-sm font-semibold">{step.num}</span>
                  </div>
                  <h3 className="text-white font-medium tracking-tight mb-2">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl text-white font-medium tracking-tight mb-2">Need a custom LPDN setup?</h3>
            <p className="text-neutral-500 text-sm max-w-md">We configure custom LPDN deployments for schools, field operations, clinics, and remote teams. Talk to us about bulk pricing and custom configurations.</p>
          </div>
          <button onClick={openBetaModal} className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-6 py-3 text-sm hover:bg-neutral-200 transition-colors shrink-0">
            Contact Sales
            <Icon icon="solar:arrow-right-linear" width={16} />
          </button>
        </div>
      </section>
    </>
  );
}
