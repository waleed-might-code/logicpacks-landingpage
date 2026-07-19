// ── useStack ──
// The user's composed pack stack, persisted to localStorage and hydrated from
// a `?stack=slug,slug` share URL on first load. Returns the selected slugs plus
// mutators. Kept intentionally small and dependency-free so any component can
// read/write the same stack.

import { useState, useEffect, useCallback } from 'react';
import { PACKS } from '../data/packs';

const STORAGE_KEY = 'lp_stack_v1';
const VALID_SLUGS = new Set(PACKS.map(p => p.slug));

function sanitize(slugs) {
  const seen = new Set();
  const out = [];
  for (const s of slugs) {
    if (VALID_SLUGS.has(s) && !seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

function readInitial() {
  // A share URL (?stack=...) always wins so links reproduce a stack exactly.
  try {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('stack');
    if (shared) return sanitize(shared.split(','));
  } catch { /* ignore */ }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return sanitize(JSON.parse(raw));
  } catch { /* ignore */ }
  return [];
}

export function useStack() {
  const [slugs, setSlugs] = useState(readInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch { /* quota / private mode — non-fatal */ }
  }, [slugs]);

  const has = useCallback(slug => slugs.includes(slug), [slugs]);

  const add = useCallback(slug => {
    if (!VALID_SLUGS.has(slug)) return;
    setSlugs(prev => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const remove = useCallback(slug => {
    setSlugs(prev => prev.filter(s => s !== slug));
  }, []);

  const toggle = useCallback(slug => {
    if (!VALID_SLUGS.has(slug)) return;
    setSlugs(prev => (prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]));
  }, []);

  const clear = useCallback(() => setSlugs([]), []);

  const set = useCallback(next => setSlugs(sanitize(next)), []);

  return { slugs, has, add, remove, toggle, clear, set };
}
