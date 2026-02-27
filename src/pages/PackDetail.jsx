import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { PACKS, TYPE_LABELS, TYPE_COLORS } from '../data/packs';
import { PACK_DETAILS, PACK_MINI } from '../data/packDetails';
import ScrollReveal from '../components/ScrollReveal';
import Terminal from '../components/Terminal';
import { useBeta } from '../components/BetaModal';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'changelog', label: 'Changelog' },
];

const CHANGELOG_COLORS = {
  patch: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  feature: 'bg-green-500/15 text-green-400 border-green-500/20',
  breaking: 'bg-red-500/15 text-red-400 border-red-500/20',
  improvement: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
};

const STEP_ICONS = {
  fail: { icon: '✕', color: 'text-red-400' },
  warn: { icon: '⟳', color: 'text-yellow-400' },
  pass: { icon: '✓', color: 'text-green-500' },
};

export default function PackDetail() {
  const { slug } = useParams();
  const pack = PACKS.find(p => p.slug === slug);
  const detail = PACK_DETAILS[slug];
  const [activeTab, setActiveTab] = useState('overview');
  const [installClicked, setInstallClicked] = useState(false);
  const { openBetaModal } = useBeta();

  if (!pack) {
    return (
      <section className="pt-14 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon icon="solar:box-minimalistic-linear" className="text-neutral-700 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-white mb-2">Pack Not Found</h1>
          <p className="text-neutral-500 text-sm mb-6">The pack you&apos;re looking for doesn&apos;t exist.</p>
          <Link to="/store" className="text-green-500 text-sm hover:underline">← Back to Marketplace</Link>
        </div>
      </section>
    );
  }

  const handleInstall = () => {
    openBetaModal();
  };

  // Related packs from detail data or fallback to same-type packs
  const relatedSlugs = detail?.related || [];
  const relatedPacks = relatedSlugs
    .map(s => {
      const found = PACKS.find(p => p.slug === s);
      if (found) return found;
      const mini = PACK_MINI[s];
      if (mini) return { slug: s, name: mini.name, icon: mini.icon, iconColor: mini.color, bgColor: mini.bg, borderColor: mini.border, type: mini.type };
      return null;
    })
    .filter(Boolean)
    .slice(0, 4);

  // Fallback related if no detail data
  const fallbackRelated = relatedPacks.length > 0
    ? relatedPacks
    : PACKS.filter(p => p.type === pack.type && p.slug !== pack.slug).slice(0, 4);

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-14 border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-neutral-600">
            <Link to="/store" className="hover:text-white transition-colors">Marketplace</Link>
            <Icon icon="solar:alt-arrow-right-linear" width={12} />
            <span className="hover:text-white transition-colors cursor-pointer">{TYPE_LABELS[pack.type] || pack.type}</span>
            <Icon icon="solar:alt-arrow-right-linear" width={12} />
            <span className="text-neutral-400">{pack.name}</span>
          </nav>
        </div>
      </div>

      {/* Pack Hero */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 rounded-xl ${pack.bgColor} border ${pack.borderColor} flex items-center justify-center shrink-0`}>
                    <Icon icon={pack.icon} className={`${pack.iconColor} text-3xl`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{pack.name}</h1>
                      {pack.verified && <Icon icon="solar:verified-check-bold" className="text-green-500 text-lg" />}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-medium border ${TYPE_COLORS[pack.type]}`}>{TYPE_LABELS[pack.type]}</span>
                      <span className="text-neutral-600 text-xs">by <span className="text-neutral-400">{pack.author}</span></span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal><p className="text-neutral-400 text-base leading-relaxed max-w-2xl mb-6">{pack.desc}</p></ScrollReveal>
              {detail?.tags && (
                <ScrollReveal>
                  <div className="flex flex-wrap gap-2">
                    {detail.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-neutral-500 font-mono">{tag}</span>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Right — Install Card */}
            <div className="w-full md:w-80 shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <ScrollReveal>
                <button
                  onClick={handleInstall}
                  className={`w-full font-semibold rounded-md py-3 text-sm transition-colors mb-4 flex items-center justify-center gap-2 ${
                    installClicked
                      ? 'bg-white/10 text-green-400'
                      : 'bg-green-500 text-black hover:bg-green-400'
                  }`}
                >
                  {installClicked ? (
                    <><Icon icon="solar:check-circle-linear" width={16} /> Installed!</>
                  ) : (
                    <><Icon icon="solar:download-minimalistic-linear" width={16} /> Install Pack</>
                  )}
                </button>
                <div className="text-xs font-mono text-neutral-500 bg-white/[0.02] border border-white/[0.04] rounded-md px-3 py-2.5 mb-5 select-all cursor-pointer hover:border-green-500/20 transition-colors">
                  lp install {slug}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-600">Version</span><span className="text-white font-mono text-xs">{pack.version}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-600">Installs</span><span className="text-white font-mono text-xs">{pack.installs}</span></div>
                  {detail?.runtime && <div className="flex justify-between"><span className="text-neutral-600">Runtime</span><span className="text-white font-mono text-xs">{detail.runtime}</span></div>}
                  <div className="flex justify-between"><span className="text-neutral-600">License</span><span className="text-white font-mono text-xs">{detail?.license || 'MIT'}</span></div>
                  {detail?.updated && <div className="flex justify-between"><span className="text-neutral-600">Updated</span><span className="text-white font-mono text-xs">{detail.updated}</span></div>}
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tests</span>
                    <span className="text-green-500 font-mono text-xs flex items-center gap-1"><Icon icon="solar:check-circle-linear" width={12} />Passing</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.04] flex gap-3">
                  <button onClick={openBetaModal} className="flex-1 text-center border border-white/[0.08] text-neutral-400 text-xs font-medium py-2 rounded-md hover:bg-white/5 hover:text-white transition-all">GitHub</button>
                  <button onClick={openBetaModal} className="flex-1 text-center border border-white/[0.08] text-neutral-400 text-xs font-medium py-2 rounded-md hover:bg-white/5 hover:text-white transition-all">Report</button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      {detail && (
        <section className="border-b border-white/[0.06] sticky top-14 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8">
            <div className="flex gap-0 -mb-px overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-3.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'text-white' : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-px bg-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tab Content */}
      {detail ? (
        <section className="max-w-[1440px] mx-auto px-6 md:px-8 py-10 md:py-14">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
              {/* Main */}
              <div className="min-w-0">
                <ScrollReveal>
                  <h2 className="text-xl text-white font-medium tracking-tight mb-4">About</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">{detail.overview.about}</p>
                </ScrollReveal>

                {detail.overview.features && (
                  <ScrollReveal>
                    <h3 className="text-lg text-white font-medium tracking-tight mb-3">Key Features</h3>
                    <ul className="space-y-2 text-sm text-neutral-400 mb-8">
                      {detail.overview.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Icon icon="solar:check-circle-linear" className="text-green-500 text-base mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                )}

                {detail.overview.quickStart && (
                  <ScrollReveal>
                    <h3 className="text-lg text-white font-medium tracking-tight mb-3">Quick Start</h3>
                    <Terminal title="Terminal" copyCommand={detail.overview.quickStart.code}>
                      <pre className="text-neutral-400 text-xs leading-relaxed whitespace-pre-wrap">{detail.overview.quickStart.code}</pre>
                    </Terminal>
                  </ScrollReveal>
                )}

                {detail.overview.selfHealing && (
                  <ScrollReveal>
                    <h3 className="text-lg text-white font-medium tracking-tight mb-3 mt-8">Self-Healing</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-4">{detail.overview.selfHealing.desc}</p>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 text-xs font-mono text-neutral-400 space-y-1.5 mb-8">
                      {detail.overview.selfHealing.steps.map((step, i) => {
                        const s = STEP_ICONS[step.type] || STEP_ICONS.warn;
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <span className={s.color}>{s.icon}</span> {step.text}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollReveal>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {detail.scopes && (
                  <ScrollReveal>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                      <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Scopes Required</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.scopes.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono text-neutral-400 bg-white/[0.03] border border-white/[0.04]">{s}</span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {detail.actions && (
                  <ScrollReveal>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                      <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Actions</h4>
                      <div className="space-y-2">
                        {detail.actions.map(a => (
                          <div key={a} className="flex items-center gap-2 text-xs">
                            <Icon icon="solar:play-linear" className="text-green-500/60 text-xs" />
                            <span className="text-neutral-300 font-mono">{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {detail.compatible && (
                  <ScrollReveal>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                      <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Compatible With</h4>
                      <div className="space-y-2">
                        {detail.compatible.map(c => (
                          <Link key={c.slug} to={`/pack/${c.slug}`} className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors">
                            <Icon icon="solar:widget-linear" className="text-neutral-600" />
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </aside>
            </div>
          )}

          {/* CONTRACTS TAB */}
          {activeTab === 'contracts' && (
            <div className="max-w-3xl">
              <ScrollReveal>
                <h2 className="text-xl text-white font-medium tracking-tight mb-2">Pack Manifest</h2>
                <p className="text-neutral-500 text-sm mb-6">The contract that defines this pack&apos;s inputs, outputs, scopes, tests, and telemetry.</p>
                <pre className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5 overflow-x-auto text-sm leading-[1.7] font-mono text-neutral-400">
                  <code>{detail.contracts}</code>
                </pre>
              </ScrollReveal>
            </div>
          )}

          {/* DEPENDENCIES TAB */}
          {activeTab === 'dependencies' && (
            <div className="max-w-3xl">
              <ScrollReveal>
                <h2 className="text-xl text-white font-medium tracking-tight mb-2">Dependencies</h2>
                <p className="text-neutral-500 text-sm mb-6">Packages and packs this pack depends on.</p>
                <div className="divide-y divide-white/[0.04]">
                  {detail.deps.map(d => (
                    <div key={d.name} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                          d.type === 'pack'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-white/[0.03] text-neutral-500 border border-white/[0.04]'
                        }`}>{d.type}</span>
                        <span className="text-sm text-white font-mono">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-neutral-600">{d.version}</span>
                        <span className={`text-[10px] font-mono ${d.required ? 'text-neutral-400' : 'text-neutral-700'}`}>
                          {d.required ? 'required' : 'optional'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          )}

          {/* CHANGELOG TAB */}
          {activeTab === 'changelog' && (
            <div className="max-w-3xl">
              <ScrollReveal>
                <h2 className="text-xl text-white font-medium tracking-tight mb-2">Changelog</h2>
                <p className="text-neutral-500 text-sm mb-6">Recent updates, patches, and releases.</p>
                <div className="divide-y divide-white/[0.06]">
                  {detail.changelog.map(c => (
                    <div key={c.ver} className="py-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-white text-sm font-medium">{c.ver}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-medium border ${CHANGELOG_COLORS[c.type] || CHANGELOG_COLORS.patch}`}>{c.type}</span>
                        <span className="text-neutral-700 text-xs ml-auto font-mono">{c.date}</span>
                      </div>
                      <h4 className="text-white text-sm font-medium mb-1">{c.title}</h4>
                      <p className="text-neutral-500 text-sm leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          )}
        </section>
      ) : (
        /* Fallback details for packs without rich detail data */
        <section className="border-b border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            <div className="p-8">
              <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">What&apos;s Included</h3>
              <ul className="space-y-3">
                {['Production-ready code', 'Contract tests', 'TypeScript types', 'API documentation', 'Self-healing hooks'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-neutral-400 text-sm">
                    <Icon icon="solar:check-circle-linear" className="text-green-500 shrink-0" width={14} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8">
              <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Compatibility</h3>
              <ul className="space-y-3">
                {['Logic Packs v2.0+', 'Node.js 18+', 'Python 3.10+', 'Docker support', 'CI/CD ready'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-neutral-400 text-sm">
                    <Icon icon="solar:check-circle-linear" className="text-green-500/50 shrink-0" width={14} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8">
              <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Stats</h3>
              <div className="space-y-4">
                <div><span className="text-neutral-600 text-xs block mb-1">Downloads</span><span className="text-white text-lg font-semibold">{pack.installs}</span></div>
                <div><span className="text-neutral-600 text-xs block mb-1">Version</span><span className="text-white text-sm font-mono">{pack.version}</span></div>
                <div><span className="text-neutral-600 text-xs block mb-1">Author</span><span className="text-white text-sm">{pack.author}</span></div>
                <div><span className="text-neutral-600 text-xs block mb-1">License</span><span className="text-white text-sm">MIT</span></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Packs */}
      {fallbackRelated.length > 0 && (
        <section className="border-t border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-14">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-xl text-white font-medium tracking-tight">Related Packs</h2>
              <Link to="/store" className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
                View all <Icon icon="solar:arrow-right-linear" width={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fallbackRelated.map(rp => (
                <Link
                  to={`/pack/${rp.slug}`}
                  key={rp.slug}
                  className="group block border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.02] hover:border-white/[0.1] transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-lg ${rp.bgColor || 'bg-white/5'} border ${rp.borderColor || 'border-white/10'} flex items-center justify-center shrink-0`}>
                      <Icon icon={rp.icon} className={`${rp.iconColor || 'text-neutral-400'} text-base`} />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium group-hover:text-green-500 transition-colors">{rp.name}</div>
                      <div className="text-neutral-600 text-[10px]">{TYPE_LABELS[rp.type] || rp.type}</div>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors flex items-center gap-1">
                    View Pack <Icon icon="solar:arrow-right-linear" width={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
