import { describe, it, expect } from 'vitest';
import { filterPacks, filterProducts, featuredPacks } from '../../src/lib/catalog';
import { PACKS } from '../../src/data/packs';
import { PRODUCTS } from '../../src/data/products';

const SAMPLE_PACKS = [
  { slug: 'a', name: 'Auth Pack', desc: 'JWT and OAuth login', type: 'logic', featured: true },
  { slug: 'b', name: 'Dashboard UI', desc: 'Admin charts and tables', type: 'ui', featured: true },
  { slug: 'c', name: 'Web Scraper', desc: 'Puppeteer scraping', type: 'automation', featured: false },
];

describe('filterPacks', () => {
  it('returns everything when type is "all" and search is empty', () => {
    expect(filterPacks(SAMPLE_PACKS, { type: 'all', search: '' })).toHaveLength(3);
  });

  it('defaults to returning everything with no options', () => {
    expect(filterPacks(SAMPLE_PACKS)).toHaveLength(3);
  });

  it('filters by type', () => {
    const res = filterPacks(SAMPLE_PACKS, { type: 'ui' });
    expect(res).toHaveLength(1);
    expect(res[0].slug).toBe('b');
  });

  it('searches name case-insensitively', () => {
    const res = filterPacks(SAMPLE_PACKS, { search: 'AUTH' });
    expect(res.map((p) => p.slug)).toEqual(['a']);
  });

  it('searches description text', () => {
    const res = filterPacks(SAMPLE_PACKS, { search: 'puppeteer' });
    expect(res.map((p) => p.slug)).toEqual(['c']);
  });

  it('combines type and search (AND semantics)', () => {
    expect(filterPacks(SAMPLE_PACKS, { type: 'ui', search: 'auth' })).toHaveLength(0);
    expect(filterPacks(SAMPLE_PACKS, { type: 'logic', search: 'login' })).toHaveLength(1);
  });

  it('ignores surrounding whitespace in the query', () => {
    expect(filterPacks(SAMPLE_PACKS, { search: '   ' })).toHaveLength(3);
    expect(filterPacks(SAMPLE_PACKS, { search: '  auth  ' }).map((p) => p.slug)).toEqual(['a']);
  });

  it('does not mutate the input array', () => {
    const input = [...SAMPLE_PACKS];
    filterPacks(input, { type: 'ui' });
    expect(input).toHaveLength(3);
  });

  it('is null-safe', () => {
    expect(filterPacks(undefined)).toEqual([]);
    expect(filterPacks(null, { search: 'x' })).toEqual([]);
  });

  it('works against the real PACKS dataset', () => {
    const logic = filterPacks(PACKS, { type: 'logic' });
    expect(logic.length).toBeGreaterThan(0);
    expect(logic.every((p) => p.type === 'logic')).toBe(true);
    expect(filterPacks(PACKS, { search: 'stripe' }).map((p) => p.slug)).toContain('payments-pack');
  });
});

describe('filterProducts', () => {
  it('returns a copy of everything for "all"', () => {
    const res = filterProducts(PRODUCTS, 'all');
    expect(res).toHaveLength(PRODUCTS.length);
    expect(res).not.toBe(PRODUCTS);
  });

  it('filters by category', () => {
    const hardware = filterProducts(PRODUCTS, 'hardware');
    expect(hardware.length).toBeGreaterThan(0);
    expect(hardware.every((p) => p.category === 'hardware')).toBe(true);
  });

  it('returns empty for an unknown category', () => {
    expect(filterProducts(PRODUCTS, 'does-not-exist')).toEqual([]);
  });

  it('is null-safe', () => {
    expect(filterProducts(undefined)).toEqual([]);
  });
});

describe('featuredPacks', () => {
  it('returns only featured packs from the sample', () => {
    expect(featuredPacks(SAMPLE_PACKS).map((p) => p.slug)).toEqual(['a', 'b']);
  });

  it('every featured pack in the real dataset is flagged', () => {
    const res = featuredPacks(PACKS);
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((p) => p.featured === true)).toBe(true);
  });
});
