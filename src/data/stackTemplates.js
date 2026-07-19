// ── Stack Builder support data ──
// Starter templates + a lightweight compatibility graph derived from the
// `compatible` lists in packDetails, plus per-pack runtime/scope hints so the
// Stack Builder can aggregate requirements without every pack needing a full
// detail entry.

import { PACK_DETAILS } from './packDetails';
import { PACKS } from './packs';

// Curated starter stacks — one click composes a working, opinionated bundle.
export const STACK_TEMPLATES = [
  {
    id: 'saas-starter',
    name: 'SaaS Starter',
    desc: 'Everything to launch a subscription product: auth, billing, an admin dashboard and a database.',
    icon: 'solar:rocket-2-linear',
    accent: 'text-green-500',
    packs: ['auth-pack', 'payments-pack', 'dashboard-ui', 'postgres-connector', 'email-service'],
  },
  {
    id: 'ai-app',
    name: 'AI Application',
    desc: 'Ship an AI product fast — model access, image generation, object storage and a UI shell.',
    icon: 'solar:magic-stick-3-linear',
    accent: 'text-fuchsia-400',
    packs: ['openai-connector', 'image-gen', 's3-connector', 'dashboard-ui', 'auth-pack'],
  },
  {
    id: 'internal-tool',
    name: 'Internal Tool',
    desc: 'A back-office CRUD app: generated REST API, data tables, dynamic forms and Postgres.',
    icon: 'solar:widget-4-linear',
    accent: 'text-blue-400',
    packs: ['crud-generator', 'data-table', 'form-builder', 'postgres-connector', 'auth-pack'],
  },
  {
    id: 'automation-pipeline',
    name: 'Automation Pipeline',
    desc: 'Scrape, transform and schedule — with PDF output and caching baked in.',
    icon: 'solar:refresh-circle-linear',
    accent: 'text-orange-400',
    packs: ['web-scraper', 'scheduler', 'pdf-generator', 'redis-connector', 's3-connector'],
  },
];

// Reasonable runtime + scope defaults keyed by pack type, used when a pack has
// no full detail entry so aggregation still produces meaningful output.
const TYPE_DEFAULTS = {
  logic: { runtime: 'Python', scopes: ['db.read', 'secrets.read'] },
  ui: { runtime: 'React + TypeScript', scopes: ['ui.render', 'pack.bind'] },
  automation: { runtime: 'Node.js', scopes: ['network.outbound', 'filesystem.write'] },
  creative: { runtime: 'Python', scopes: ['network.outbound', 'secrets.read'] },
  provider: { runtime: 'Python', scopes: ['db.read', 'network.outbound'] },
};

// Runtime for a pack (detail entry wins, else a type default).
export function packRuntime(pack) {
  const d = PACK_DETAILS[pack.slug];
  if (d?.runtime) return d.runtime;
  return TYPE_DEFAULTS[pack.type]?.runtime || 'Python';
}

// Scope/permission list for a pack.
export function packScopes(pack) {
  const d = PACK_DETAILS[pack.slug];
  if (d?.scopes) return d.scopes;
  return TYPE_DEFAULTS[pack.type]?.scopes || [];
}

// Build an undirected compatibility graph: slug -> Set of compatible slugs.
// `compatible` in packDetails is directional; we mirror every edge so a link
// between two packs shows up regardless of which one declared it.
export const COMPAT_GRAPH = (() => {
  const graph = {};
  const add = (a, b) => {
    if (!a || !b || a === b) return;
    (graph[a] ||= new Set()).add(b);
  };
  for (const [slug, detail] of Object.entries(PACK_DETAILS)) {
    for (const c of detail.compatible || []) {
      add(slug, c.slug);
      add(c.slug, slug); // mirror
    }
  }
  return graph;
})();

export function areCompatible(slugA, slugB) {
  return Boolean(COMPAT_GRAPH[slugA]?.has(slugB));
}

// Given the current selection, surface packs that are known-compatible with
// the most selected packs but aren't in the stack yet — ranked suggestions.
export function suggestPacks(selectedSlugs, limit = 4) {
  const selected = new Set(selectedSlugs);
  const score = {};
  for (const slug of selectedSlugs) {
    for (const neighbor of COMPAT_GRAPH[slug] || []) {
      if (selected.has(neighbor)) continue;
      score[neighbor] = (score[neighbor] || 0) + 1;
    }
  }
  return Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug, matches]) => ({ pack: PACKS.find(p => p.slug === slug), matches }))
    .filter(x => x.pack);
}

// Parse "12.4k" / "980" style install counts into a number for summing.
export function parseInstalls(str) {
  if (!str) return 0;
  const s = String(str).trim().toLowerCase();
  const num = parseFloat(s);
  if (Number.isNaN(num)) return 0;
  if (s.endsWith('k')) return Math.round(num * 1000);
  if (s.endsWith('m')) return Math.round(num * 1_000_000);
  return Math.round(num);
}

export function formatInstalls(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
