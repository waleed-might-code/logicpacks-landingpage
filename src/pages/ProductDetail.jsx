import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { PRODUCTS, PRODUCT_MINI } from '../data/products';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = PRODUCTS.find(p => p.slug === slug);

  const [activeTab, setActiveTab] = useState('description');
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [cartAdded, setCartAdded] = useState(false);
  const { openBetaModal } = useBeta();

  if (!product) {
    return (
      <section className="pt-14 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon icon="solar:box-minimalistic-linear" className="text-neutral-700 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-white mb-2">Product Not Found</h1>
          <p className="text-neutral-500 text-sm mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/shop" className="text-green-500 text-sm hover:underline">← Back to Shop</Link>
        </div>
      </section>
    );
  }

  // Set default size for apparel products
  if (product.hasSizes && product.sizes && selectedSize === null) {
    // We'll handle this in the render — just pick M or index 2
  }

  const changeQty = (d) => setQty(prev => Math.max(1, Math.min(10, prev + d)));

  const handleAddToCart = () => {
    openBetaModal();
  };

  const relatedProducts = (product.related || [])
    .map(id => PRODUCT_MINI[id])
    .filter(Boolean)
    .map((mini, _, arr) => {
      const slug = Object.keys(PRODUCT_MINI).find(k => PRODUCT_MINI[k] === mini);
      return { ...mini, slug };
    });

  const categoryLabel = product.category === 'hardware' ? 'Hardware'
    : product.category === 'accessories' ? 'Accessories'
    : product.category === 'apparel' ? 'Apparel' : product.category;

  return (
    <>
      {/* Breadcrumb */}
      <section className="pt-14 border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-neutral-600">
            <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
            <Icon icon="solar:alt-arrow-right-linear" width={12} />
            <span className="hover:text-white transition-colors cursor-pointer">{categoryLabel}</span>
            <Icon icon="solar:alt-arrow-right-linear" width={12} />
            <span className="text-neutral-400">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Hero */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-white/[0.06]">
            {/* Image */}
            <div className="relative aspect-square md:aspect-auto md:min-h-[520px] bg-white/[0.015] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)]" />
              <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
              <ScrollReveal>
                <div className="relative z-10">
                  <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl ${product.bgColor} ${product.borderColor} border flex items-center justify-center shadow-2xl`}>
                    <Icon icon={product.icon} className={`${product.iconColor} text-6xl md:text-7xl`} />
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Info */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              {/* Badges */}
              {product.badges && product.badges.length > 0 && (
                <ScrollReveal>
                  <div className="flex items-center gap-2 mb-4">
                    {product.badges.map((b, i) => (
                      <span key={i} className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${b.cls} uppercase tracking-wider`}>{b.text}</span>
                    ))}
                  </div>
                </ScrollReveal>
              )}

              <ScrollReveal>
                <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">{product.name}</h1>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-neutral-500 text-base leading-relaxed mb-6 max-w-md">{product.desc}</p>
              </ScrollReveal>

              {/* Price */}
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-semibold text-white">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-neutral-600 text-lg ml-2 line-through">${product.originalPrice}</span>
                  )}
                </div>
              </ScrollReveal>

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <ScrollReveal>
                  <div className="flex flex-wrap gap-3 mb-8 text-xs text-neutral-500">
                    {product.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Icon icon={h.icon} width={14} className="text-green-500/60" />
                        {h.text}
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {/* Size Selector (apparel only) */}
              {product.hasSizes && product.sizes && (
                <ScrollReveal>
                  <div className="mb-6">
                    <span className="text-xs text-neutral-500 uppercase tracking-widest block mb-3">Size</span>
                    <div className="flex gap-2">
                      {product.sizes.map((s, i) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-10 h-10 rounded-md border text-xs font-medium transition-all ${
                            (selectedSize === s || (selectedSize === null && i === 2))
                              ? 'border-green-500/60 text-green-500 bg-green-500/[0.08]'
                              : 'border-white/[0.08] text-neutral-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Quantity + Add to Cart */}
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-white/[0.08] rounded-md overflow-hidden">
                    <button
                      className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:bg-white/5 transition-colors active:scale-[0.92]"
                      onClick={() => changeQty(-1)}
                    >
                      <Icon icon="solar:minus-circle-linear" width={18} />
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center text-white text-sm font-medium border-x border-white/[0.08]">{qty}</span>
                    <button
                      className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:bg-white/5 transition-colors active:scale-[0.92]"
                      onClick={() => changeQty(1)}
                    >
                      <Icon icon="solar:add-circle-linear" width={18} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 font-semibold rounded-md py-3 text-sm transition-colors flex items-center justify-center gap-2 ${
                      cartAdded
                        ? 'bg-white/10 text-green-400'
                        : product.inStock
                          ? 'bg-green-500 text-black hover:bg-green-400'
                          : 'bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    {cartAdded ? (
                      <><Icon icon="solar:check-circle-linear" width={18} /> Added!</>
                    ) : product.inStock ? (
                      <><Icon icon="solar:cart-large-minimalistic-linear" width={18} /> Add to Cart</>
                    ) : (
                      <><Icon icon="solar:bell-linear" width={18} /> Notify Me</>
                    )}
                  </button>
                </div>
              </ScrollReveal>

              {/* Stock Status */}
              <ScrollReveal>
                <div className="flex items-center gap-2 mb-6">
                  {product.inStock ? (
                    <>
                      <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                      <span className="text-green-500 text-xs font-mono">In Stock — Ships within 3-5 days</span>
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full" />
                      <span className="text-yellow-400 text-xs font-mono">Coming Soon — Pre-order available</span>
                    </>
                  )}
                </div>
              </ScrollReveal>

              {/* Quick Specs */}
              {product.quickSpecs && product.quickSpecs.length > 0 && (
                <ScrollReveal>
                  <div className="border-t border-white/[0.06] pt-6 space-y-3">
                    {product.quickSpecs.map((s, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-neutral-600">{s.label}</span>
                        <span className="text-white font-mono text-xs">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-white/[0.06] sticky top-14 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="flex gap-0 -mb-px overflow-x-auto">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specs', label: 'Specifications' },
              { id: 'included', label: "What's Included" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-3.5 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 hover:text-white transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'text-white after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-px after:bg-green-500' : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 py-10 md:py-14">
        {/* DESCRIPTION TAB */}
        {activeTab === 'description' && (
          <div className="max-w-3xl">
            {product.description && (
              <>
                <h2 className="text-xl text-white font-medium tracking-tight mb-4">{product.description.title}</h2>
                {product.description.paragraphs?.map((p, i) => (
                  <p key={i} className="text-neutral-400 text-sm leading-relaxed mb-6">{p}</p>
                ))}

                {/* Use Cases */}
                {product.description.useCases && (
                  <>
                    <h3 className="text-lg text-white font-medium tracking-tight mb-3">Use Cases</h3>
                    <ul className="space-y-2 text-sm text-neutral-400 mb-8">
                      {product.description.useCases.map((uc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Icon icon="solar:check-circle-linear" className="text-green-500 text-base mt-0.5 shrink-0" />
                          <span><strong className="text-white">{uc.title}</strong> — {uc.text}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* How It Works */}
                {product.description.howItWorks && (
                  <>
                    <h3 className="text-lg text-white font-medium tracking-tight mb-3">How It Works</h3>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5 text-xs font-mono text-neutral-400 space-y-2">
                      {product.description.howItWorks.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-green-500">→</span> {step}
                        </div>
                      ))}
                      {product.description.howItWorksNote && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/[0.04]">
                          <span className="text-neutral-600">{product.description.howItWorksNote}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Comparison table (for Pro) */}
                {product.description.comparison && (
                  <div className="divide-y divide-white/[0.06] bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden mb-8">
                    <div className="grid grid-cols-3 text-xs font-medium uppercase tracking-wider">
                      {product.description.comparison.headers.map((h, i) => (
                        <div key={i} className={`p-3 ${i === 0 ? 'text-neutral-600' : i === 1 ? 'text-neutral-400' : 'text-green-400'}`}>{h}</div>
                      ))}
                    </div>
                    {product.description.comparison.rows.map((row, i) => (
                      <div key={i} className="grid grid-cols-3 text-sm">
                        <div className="p-3 text-neutral-500">{row[0]}</div>
                        <div className="p-3 text-neutral-400">{row[1]}</div>
                        <div className="p-3 text-white">{row[2]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* SPECIFICATIONS TAB */}
        {activeTab === 'specs' && (
          <div className="max-w-3xl">
            <h2 className="text-xl text-white font-medium tracking-tight mb-6">Technical Specifications</h2>
            {product.specs && product.specs.length > 0 && (
              <div className="divide-y divide-white/[0.06]">
                {product.specs.map((spec, i) => (
                  <div key={i} className="grid grid-cols-[140px_1fr] py-3">
                    <span className="text-neutral-600 text-sm">{spec.label}</span>
                    <span className="text-white text-sm">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WHAT'S INCLUDED TAB */}
        {activeTab === 'included' && (
          <div className="max-w-3xl">
            <h2 className="text-xl text-white font-medium tracking-tight mb-6">What's in the Box</h2>
            {product.included && product.included.length > 0 && (
              <ul className="space-y-3">
                {product.included.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Icon icon="solar:check-circle-linear" className="text-green-500 text-base shrink-0" />
                    <span className="text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-14">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-xl text-white font-medium tracking-tight">You Might Also Like</h2>
              <Link to="/shop" className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
                View all <Icon icon="solar:arrow-right-linear" width={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(rp => (
                <Link to={`/product/${rp.slug}`} key={rp.slug} className="group block border border-white/[0.06] rounded-xl overflow-hidden hover:bg-white/[0.02] hover:border-white/[0.1] transition-all">
                  <div className="aspect-square bg-white/[0.015] flex items-center justify-center">
                    <div className={`w-14 h-14 rounded-xl ${rp.bg} ${rp.border} border flex items-center justify-center`}>
                      <Icon icon={rp.icon} className={`${rp.color} text-2xl`} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white text-sm font-medium mb-1">{rp.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-semibold">${rp.price}</span>
                      <span className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors flex items-center gap-1">
                        View <Icon icon="solar:arrow-right-linear" width={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
