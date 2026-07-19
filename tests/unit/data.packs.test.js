import { describe, it, expect } from 'vitest';
import { PACKS, TYPE_LABELS, TYPE_COLORS } from '../../src/data/packs';
import { PACK_DETAILS, PACK_MINI } from '../../src/data/packDetails';

const VALID_TYPES = Object.keys(TYPE_LABELS);
const REQUIRED_FIELDS = ['slug', 'name', 'type', 'desc', 'author', 'version', 'icon'];

describe('PACKS dataset', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(PACKS)).toBe(true);
    expect(PACKS.length).toBeGreaterThan(0);
  });

  it('every pack has all required fields', () => {
    for (const pack of PACKS) {
      for (const field of REQUIRED_FIELDS) {
        expect(pack[field], `${pack.slug || '?'}.${field}`).toBeTruthy();
      }
    }
  });

  it('slugs are unique', () => {
    const slugs = PACKS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('slugs are url-safe (lowercase, hyphen-separated)', () => {
    for (const p of PACKS) {
      expect(p.slug, p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it('every pack type has a label and color mapping', () => {
    for (const p of PACKS) {
      expect(VALID_TYPES, `unknown type on ${p.slug}`).toContain(p.type);
      expect(TYPE_COLORS[p.type], `missing color for ${p.type}`).toBeTruthy();
    }
  });

  it('version strings look like semver tags (vX.Y.Z)', () => {
    for (const p of PACKS) {
      expect(p.version, p.slug).toMatch(/^v\d+\.\d+\.\d+$/);
    }
  });
});

describe('TYPE_LABELS / TYPE_COLORS', () => {
  it('define the same set of type keys', () => {
    expect(Object.keys(TYPE_COLORS).sort()).toEqual(Object.keys(TYPE_LABELS).sort());
  });
});

describe('PACK_DETAILS referential integrity', () => {
  it('every detailed pack slug exists in PACKS', () => {
    const packSlugs = new Set(PACKS.map((p) => p.slug));
    for (const slug of Object.keys(PACK_DETAILS)) {
      expect(packSlugs.has(slug), `PACK_DETAILS["${slug}"] has no matching pack`).toBe(true);
    }
  });

  it('compatible-pack references point at real packs', () => {
    const packSlugs = new Set(PACKS.map((p) => p.slug));
    for (const [slug, detail] of Object.entries(PACK_DETAILS)) {
      for (const compat of detail.compatible || []) {
        expect(packSlugs.has(compat.slug), `${slug} → ${compat.slug}`).toBe(true);
      }
    }
  });

  it('PACK_MINI keys all correspond to real packs', () => {
    const packSlugs = new Set(PACKS.map((p) => p.slug));
    for (const slug of Object.keys(PACK_MINI)) {
      expect(packSlugs.has(slug), `PACK_MINI["${slug}"]`).toBe(true);
    }
  });
});
