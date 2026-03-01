import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { PACKS, TYPE_LABELS, TYPE_COLORS } from '../data/packs';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

const CATEGORIES = ['all', 'logic', 'ui', 'automation', 'creative', 'provider'];

export default function Store() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { openBetaModal } = useBeta();

  const filtered = useMemo(() => {
    return PACKS.filter(p => {
      const matchesType = activeFilter === 'all' || p.type === activeFilter;
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [activeFilter, search]);

  const featured = PACKS.filter(p => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="pt-14 border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Icon icon="solar:widget-5-linear" className="text-green-500 text-lg" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-mono font-medium">Marketplace</span>
            </div>
          </ScrollReveal>
          <ScrollReveal><h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-4">Pack Marketplace</h1></ScrollReveal>
          <ScrollReveal><p className="text-neutral-500 text-base md:text-lg max-w-xl mb-8">Discover verified packs built by the community. Install in seconds, compose instantly.</p></ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" width={16} />
                <input type="text" placeholder="Search packs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#111] border border-white/[0.06] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-green-500/30 transition-colors" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setActiveFilter(c)} className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all border ${activeFilter === c ? 'bg-white text-black border-white' : 'border-white/[0.06] text-neutral-500 hover:text-white hover:bg-white/5'}`}>
                    {c === 'all' ? 'All' : TYPE_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pack Grid */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(pack => (
              <ScrollReveal key={pack.slug}>
                <Link to={`/pack/${pack.slug}`} className="block group">
                  <div className="p-5 rounded-xl border border-white/[0.06] bg-[#0f0f0f] hover:bg-[#131313] hover:border-white/10 transition-all h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${pack.bgColor} border ${pack.borderColor} flex items-center justify-center`}>
                          <Icon icon={pack.icon} className={`${pack.iconColor} text-base`} />
                        </div>
                        <div>
                          <h3 className="text-white text-sm font-medium group-hover:text-green-500 transition-colors">{pack.name}</h3>
                          <span className="text-neutral-600 text-[10px] font-mono">{pack.version}</span>
                        </div>
                      </div>
                      {pack.verified && (
                        <div className="flex items-center gap-1 text-green-500/60 text-[10px]">
                          <Icon icon="solar:verified-check-bold" width={12} />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed mb-4">{pack.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${TYPE_COLORS[pack.type]}`}>{TYPE_LABELS[pack.type]}</span>
                      <div className="flex items-center gap-3 text-neutral-600 text-[10px]">
                        <span className="flex items-center gap-1"><Icon icon="solar:download-minimalistic-linear" width={10} />{pack.installs}</span>
                        <span>{pack.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Icon icon="solar:box-minimalistic-linear" className="text-neutral-700 text-4xl mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">No packs found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Staff Picks */}
      {featured.length > 0 && (
        <section className="border-b border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-12">
            <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Staff Picks</span>
            <ScrollReveal><h2 className="text-2xl font-semibold text-white tracking-tight mb-8">Featured Packs</h2></ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featured.map(pack => (
                <ScrollReveal key={pack.slug}>
                  <Link to={`/pack/${pack.slug}`} className="group block p-6 rounded-xl border border-green-500/10 bg-green-500/[0.02] hover:bg-green-500/[0.04] hover:border-green-500/20 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg ${pack.bgColor} border ${pack.borderColor} flex items-center justify-center`}>
                        <Icon icon={pack.icon} className={`${pack.iconColor} text-lg`} />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-medium group-hover:text-green-500 transition-colors">{pack.name}</h3>
                        <span className="text-neutral-600 text-[10px] font-mono">{pack.version} · {pack.installs} installs</span>
                      </div>
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed">{pack.desc}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6 border-b border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[30vw] h-[30vw] bg-green-500/[0.04] blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <ScrollReveal><h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">Build a Pack. Share It.</h2></ScrollReveal>
          <ScrollReveal><p className="text-neutral-500 text-base mb-8">Create reusable packs and publish them to the marketplace. Help the community build faster.</p></ScrollReveal>
          <ScrollReveal>
            <div className="flex gap-3 justify-center">
              <button onClick={openBetaModal} className="bg-white text-black font-semibold rounded-md px-7 py-3 text-sm hover:bg-neutral-200 transition-colors">Publish a Pack</button>
              <button onClick={openBetaModal} className="border border-white/10 text-neutral-300 font-medium rounded-md px-7 py-3 text-sm hover:bg-white/5 transition-colors">Read the Docs</button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

