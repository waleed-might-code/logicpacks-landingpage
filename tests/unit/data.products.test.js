import { describe, it, expect } from 'vitest';
import { PRODUCTS, PRODUCT_CATEGORIES, PRODUCT_MINI } from '../../src/data/products';

const CATEGORY_IDS = PRODUCT_CATEGORIES.map((c) => c.id);
const REQUIRED_FIELDS = ['slug', 'name', 'price', 'category', 'desc', 'icon'];

describe('PRODUCTS dataset', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(PRODUCTS)).toBe(true);
    expect(PRODUCTS.length).toBeGreaterThan(0);
  });

  it('every product has all required fields', () => {
    for (const product of PRODUCTS) {
      for (const field of REQUIRED_FIELDS) {
        expect(product[field], `${product.slug || '?'}.${field}`).not.toBeUndefined();
      }
    }
  });

  it('slugs are unique and url-safe', () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it('prices are positive numbers', () => {
    for (const p of PRODUCTS) {
      expect(typeof p.price, p.slug).toBe('number');
      expect(p.price, p.slug).toBeGreaterThan(0);
    }
  });

  it('originalPrice, when present, is higher than the sale price', () => {
    for (const p of PRODUCTS) {
      if (p.originalPrice != null) {
        expect(p.originalPrice, p.slug).toBeGreaterThan(p.price);
      }
    }
  });

  it('every product category is a known category id (excluding "all")', () => {
    const real = CATEGORY_IDS.filter((id) => id !== 'all');
    for (const p of PRODUCTS) {
      expect(real, `unknown category on ${p.slug}`).toContain(p.category);
    }
  });
});

describe('PRODUCT_CATEGORIES', () => {
  it('starts with an "all" bucket and has unique ids', () => {
    expect(CATEGORY_IDS).toContain('all');
    expect(new Set(CATEGORY_IDS).size).toBe(CATEGORY_IDS.length);
  });

  it('every non-"all" category has at least one product', () => {
    for (const id of CATEGORY_IDS.filter((c) => c !== 'all')) {
      const count = PRODUCTS.filter((p) => p.category === id).length;
      expect(count, `category "${id}" has no products`).toBeGreaterThan(0);
    }
  });
});

describe('PRODUCT_MINI referential integrity', () => {
  it('every mini key maps to a real product slug', () => {
    const slugs = new Set(PRODUCTS.map((p) => p.slug));
    for (const slug of Object.keys(PRODUCT_MINI)) {
      expect(slugs.has(slug), `PRODUCT_MINI["${slug}"]`).toBe(true);
    }
  });

  it('mini price matches the full product price', () => {
    const bySlug = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));
    for (const [slug, mini] of Object.entries(PRODUCT_MINI)) {
      if (mini.price != null && bySlug[slug]) {
        expect(mini.price, `${slug} price mismatch`).toBe(bySlug[slug].price);
      }
    }
  });
});
