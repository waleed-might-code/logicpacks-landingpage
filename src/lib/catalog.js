// ── Pure catalog helpers ──
// Framework-free filtering/search logic shared by the marketplace (Store)
// and storefront (Shop) pages. Kept side-effect free so it can be unit-tested
// in isolation and reused anywhere without pulling in React.

/**
 * Filter a list of packs by type and a free-text search query.
 * Matching is case-insensitive and searches both name and description.
 *
 * @param {Array<object>} packs   Source packs (e.g. PACKS from data/packs).
 * @param {object} [opts]
 * @param {string} [opts.type='all']  Pack type, or 'all' for no type filter.
 * @param {string} [opts.search='']   Free-text query matched against name/desc.
 * @returns {Array<object>} A new filtered array (input is never mutated).
 */
export function filterPacks(packs, { type = 'all', search = '' } = {}) {
  const q = search.trim().toLowerCase();
  return (packs || []).filter((p) => {
    const matchesType = type === 'all' || p.type === type;
    const matchesSearch =
      !q ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.desc && p.desc.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });
}

/**
 * Filter storefront products by category.
 *
 * @param {Array<object>} products      Source products (PRODUCTS from data).
 * @param {string} [category='all']     Category id, or 'all' for everything.
 * @returns {Array<object>} A new filtered array (input is never mutated).
 */
export function filterProducts(products, category = 'all') {
  if (category === 'all') return (products || []).slice();
  return (products || []).filter((p) => p.category === category);
}

/** Only the packs flagged as featured. */
export function featuredPacks(packs) {
  return (packs || []).filter((p) => p.featured);
}
