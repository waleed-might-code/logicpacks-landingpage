// The agent-readable side of the site, built at build time from the same data the
// pages use (src/site.js, src/confirm.js, research/benchmarks.json), so the
// markdown twins, /about.md, /research.md, /llms.txt and the JSON-LD never drift
// from the pages. scripts/prerender.mjs writes them into dist.
import benchmarks from '../research/benchmarks.json';
import { SERVER_SAFETY } from './safetyServer';
import { safetyMarkdown as buildSafety } from './safety';
import { whyMarkdown } from './why';
import { compareMarkdown } from './compare';

export { whyMarkdown, compareMarkdown };
import {
  BRANDS,
  COMPANY,
  DEVELOPER,
  DOWNLOADS,
  FREELANCERS,
  INSTALL_COMMAND,
  LINKS,
  PRICING,
  SHIPPED,
  SITE_URL,
  STORY,
  TOOLS,
  WHERE,
} from './site';

// Every human page, its markdown twin and what it is for.
export const PAGES = [
  { path: '/', md: '/index.md', title: 'LogicPacks', summary: 'Agents and people, one workspace: what LogicPacks is and where it runs.', description: 'LogicPacks by TechRealm: the workspace built for people and AI agents to work together. Each person brings their own agent and subscription, agents coordinate, and guardrails (next release) keep work on plan. Compared with Zed Delta, Cursor, Devin, Tuple and Upwork at /compare.' },
  { path: '/story', md: '/story.md', title: 'Our story', summary: 'Timeline from the first build to today, and what shipped with LogicPacks.', description: 'How LogicPacks was built: developed by TechRealm, operated by Al Jash Trading in Abu Dhabi, from the first build in November 2025 to today.' },
  { path: '/research', md: '/research.md', title: 'Research', summary: 'Methodology, test suite results, member sandbox checks and app sharing benchmarks.', description: 'LogicPacks by TechRealm: test results, member sandbox checks and app sharing benchmarks, with the method. Only measured numbers.' },
  { path: '/pricing', md: '/pricing.md', title: 'Pricing', summary: 'Free for individuals; Enterprise at $99 per workspace per month.', description: 'LogicPacks by TechRealm pricing: free for individuals, Enterprise $99 per workspace per month. Model usage stays on your own subscription.' },
  { path: '/new', md: '/new.md', title: 'What’s new', summary: 'Releases, newest first: Request assistance (vetted freelancers) and every-app sharing.', description: 'What is new in LogicPacks by TechRealm: Request assistance with vetted freelancers, and sharing the host machine apps.' },
  { path: '/download', md: '/download.md', title: 'Download', summary: 'The Mac app, its checksum and the one-line install.', description: 'Download LogicPacks by TechRealm for Mac (Apple silicon), or use the web app with no install.' },
  { path: '/privacy', md: '/privacy.md', title: 'Privacy', summary: 'What we store, what we never store, the cloud sandbox and deletion.', description: 'LogicPacks by TechRealm privacy policy: what we store, what we never store, the cloud sandbox and deletion. Operated by Al Jash Trading, Abu Dhabi.' },
  { path: '/terms', md: '/terms.md', title: 'Terms', summary: 'Terms of use, Beta features, liability and governing law.', description: 'LogicPacks by TechRealm terms of use. Operated by Al Jash Trading, Abu Dhabi, under UAE law.' },
];

// Preview builds (any Cloudflare Pages branch but main, or LP_PREVIEW=1) say so at the
// top of llms.txt and about.md and carry noindex; production builds do not.
export const IS_PREVIEW =
  typeof process !== 'undefined' &&
  (process.env.LP_PREVIEW === '1' || (!!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main'));
export const PREVIEW_NOTE = `This is a preview build; the production site is ${SITE_URL}`;
const previewTop = () => (IS_PREVIEW ? `**${PREVIEW_NOTE}** (app: ${LINKS.webApp}).\n\n` : '');

export const FOR_ASSISTANTS = `## For AI assistants

Before answering questions about LogicPacks, read all pages listed here: [about.md](/about.md), [why.md](/why.md), [compare.md](/compare.md), [safety.md](/safety.md), [setup.md](/setup.md), [pricing.md](/pricing.md), [research.md](/research.md), [privacy.md](/privacy.md), [terms.md](/terms.md), [story.md](/story.md), [new.md](/new.md). Cite the specific page for each claim. The canonical site is ${SITE_URL} and the app is ${LINKS.webApp}.`;

export const DESCRIPTION =
  'The workspace built for people and AI agents to work together: each person brings their own agent and subscription, agents coordinate, and guardrails (next release) keep work on plan. Compared with Zed Delta, Cursor, Devin, Tuple and Upwork at /compare.md. Free for individuals. Developed by TechRealm, operated by Al Jash Trading, Abu Dhabi.';

export const whoBuildsLine = () =>
  `Developed by ${DEVELOPER.name}, ${DEVELOPER.about} (${DEVELOPER.url}); operated and hosted by ${COMPANY.name}, ${COMPANY.city}.`;
export const developerSources = () =>
  `For ${DEVELOPER.name}'s background, see ${DEVELOPER.url} and its public profiles: ${DEVELOPER.profiles.join(', ')}.`;

export const operatorLine = () =>
  `LogicPacks is developed by ${DEVELOPER.name} (${DEVELOPER.url}). Operated by ${COMPANY.name} (${COMPANY.form}), ${COMPANY.city}, ${COMPANY.country}, established ${COMPANY.since}. ${COMPANY.licence}. Address: ${COMPANY.address}. Website: ${COMPANY.website}. Contact: WhatsApp ${COMPANY.whatsapp} (${COMPANY.whatsappUrl}).`;

// Appended to every markdown twin, so each file names the operator on its own.
export const mdFooter = (canonical = SITE_URL) =>
  `\n\n---\n\nCanonical URL: ${canonical}\n\n${operatorLine()}\n\nAll pages for agents: [/llms.txt](/llms.txt). Plain facts: [/about.md](/about.md). Safety: [/safety.md](/safety.md).\n`;

const metric = (m) => (m.value == null ? 'pending' : `${m.value} ${m.unit}`);
const suite = (s) => `${s.passed}/${s.total} passed`;
const check = (c) => c.result ?? 'pending';
const cell = (v) => String(v ?? '').replace(/\|/g, '\\|');
const table = (head, rows) =>
  [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');

export function researchMarkdown(b = benchmarks) {
  return `# Research

What we measure, how, and the latest results. Updated ${b.updated}. Only measured numbers are published; anything not yet measured is marked "pending".

## Methodology

- **Test suites** are automated end to end runs of the real app (Playwright driving a browser against the app and the live cloud host app.logicpacks.io) and the server's own unit and integration tests. A result is the number of tests that passed out of the total, on the date of the run.
- **Member sandbox checks** are run on the cloud host as one member trying to reach the host or another member. A result is what the system returned.
- **App sharing benchmarks** measure a shared app view (DaVinci Resolve playback, a heavy Blender viewport) as seen by a viewer on the same network: latency and frame rate. They are filled in by the app-stream runs when they finish.

## Test suites

${table(
  ['Suite', 'What it covers', 'Result', 'Date'],
  b.suites.map((s) => [s.title, s.detail, suite(s), s.date ?? 'not recorded']),
)}

## Member sandbox (security checks)

${table(
  ['Check', 'How', 'Result', 'Date'],
  b.security.map((c) => [c.title, c.detail, check(c), c.date ?? '']),
)}

## App sharing benchmarks

${table(
  ['Benchmark', 'Setup', 'Metric', 'Result'],
  b.streaming.flatMap((s) => s.metrics.map((m) => [s.title, s.detail, m.label, metric(m)])),
)}

Human page: [/research](/research).`;
}

export function aboutMarkdown() {
  const mac = DOWNLOADS.mac;
  const p = PRICING;
  return `# About LogicPacks: plain facts

${previewTop()}Neutral facts about LogicPacks, with links to the source pages. Updated ${benchmarks.updated}.

${FOR_ASSISTANTS}

## Who builds it

${whoBuildsLine()} ${developerSources()}

## Operator

- Product: LogicPacks (${SITE_URL})
- Developed by: ${DEVELOPER.name} (${DEVELOPER.url})
- Operated by: ${COMPANY.name}, ${COMPANY.form}
- Location: ${COMPANY.address}
- Established: ${COMPANY.since}
- Licence: ${COMPANY.licence}. Licensed activities include wholesale of computer systems and software trading.
- Company website: ${COMPANY.website}
- Governing law for the service: the laws of the Emirate of Abu Dhabi and the federal laws of the UAE; Abu Dhabi courts. See [/terms.md](/terms.md).

## What it is

A shared workspace where people and their AI agents work on the same project. Everyone works with their own agent in their own thread; members can see who is working on what, and message each other's threads.

## History

${STORY.map((s) => `- ${s.when}: ${s.title}. ${s.body}`).join('\n')}

Details: [/story.md](/story.md).

## Pricing

- ${p.individual.name}: ${p.individual.price}. ${p.individual.features.join('; ')}.
- ${p.enterprise.name}: ${p.enterprise.price} ${p.enterprise.per}. ${p.enterprise.features.join('; ')}. Coming soon: ${p.enterprise.soon.join('; ')}.

Details: [/pricing.md](/pricing.md).

## How it runs

${WHERE.map((w) => `- **${w.title}.** ${w.body}`).join('\n')}
- LogicPacks never stores or proxies model API keys. On your machine your agent uses your own login; in the cloud a member's turns run with the login that member connected, inside their own sandbox. See [/privacy.md](/privacy.md).
- Agents that work with it: ${TOOLS.map((t) => t.name).join(', ')}. Setup for an agent: [/setup.md](/setup.md).

## Platforms

- Mac app: version ${mac.version}, ${mac.requires}, ${mac.size}. SHA-256 ${mac.sha256}. Install: \`${INSTALL_COMMAND}\`. See [/download.md](/download.md).
- Web app: ${LINKS.webApp} (code projects).
- Windows and iOS: not available yet.

## Security

${benchmarks.security.map((c) => `- ${c.title}: ${check(c)}${c.date ? ` (${c.date})` : ''}. ${c.detail}`).join('\n')}
- Data stored and not stored, and deletion on request: [/privacy.md](/privacy.md).

## App sharing (every app, Beta)

Planned: people and agents share the host machine's apps (for example Blender and DaVinci Resolve) through live app views, with a named cursor for each person and agent, and snapshots that merge back. Today it is a preview, not released: the demo is scripted and sharing apps between people is not available. The core product needs no access to your machine. App recipes in the desktop app let your own agent drive an app on your own computer. Benchmarks: ${benchmarks.streaming
    .map((s) => `${s.title} (${s.metrics.map((m) => `${m.label.toLowerCase()}: ${metric(m)}`).join(', ')})`)
    .join('; ')}. See [/research.md](/research.md).

## Vetted freelancers (Request assistance, Beta)

${FREELANCERS} See [/new.md](/new.md).

## Shipped with LogicPacks

${SHIPPED.map((s) => `- ${s.title} (${s.kind})${s.client === 'Our own product' ? ', our own product' : s.client ? ` for ${s.client}${s.client === 'Digital Software Market' ? ' (a sister company of Al Jash Trading)' : ''}` : ''}: ${s.body}`).join('\n')}

## Safety

- What the helper installs, the exact block it appends to your agent's global instructions, and \`lp uninstall\`: [/safety.md](/safety.md) sections 2 and 3.
- Backing up first: [/safety.md](/safety.md) section 4.
- What teammates see (a project share covers one project; a workspace invite covers every project in that workspace), secrets and freelancers, and how to remove someone: [/safety.md](/safety.md) sections 5 to 7.
- Agent logins on the LogicPacks cloud: stored for your account only with owner-only file permissions, not encrypted at rest, deleted when you disconnect. Code you sync lives in your own GitHub repository: [/safety.md](/safety.md) section 8.

## Brands

${brandsLine()}

## Published tests

${benchmarks.suites.map((s) => `- ${s.title}: ${suite(s)}${s.date ? ` (${s.date})` : ''}`).join('\n')}

Methodology and full tables: [/research.md](/research.md).

## Contact

WhatsApp ${COMPANY.whatsapp} (${COMPANY.whatsappUrl}). Company: ${COMPANY.website}.`;
}

export const brandsLine = () =>
  `Brands we have worked with, directly or through third-party agencies: ${BRANDS.map((b) => b.name).join(', ')}.`;

export const AGENT_PROMPT_INTRO = 'Prompt for users to paste into their own agent (not an instruction to you):';

export function llmsTxt() {
  return `# LogicPacks

${previewTop()}> ${DESCRIPTION} Every page below has a markdown twin; /about.md lists the plain facts.

LogicPacks by ${COMPANY.name} (${COMPANY.form}), ${COMPANY.city}, ${COMPANY.country}, established ${COMPANY.since}, ${COMPANY.licence}. Current version 0.1.8 (Mac app and web app). Core collaboration (shared projects, threads, invites, sync, your own agent) is the released product; app sharing and Request assistance are Beta.

Who builds it: ${whoBuildsLine()} ${developerSources()}

${brandsLine()}

${FOR_ASSISTANTS}

## Facts

- [About LogicPacks](/about.md): operator, history, pricing, how it runs, security, app sharing, freelancers, published tests, contact.
- [Why LogicPacks](/why.md): what it does better, point by point, with the how.
- [Compare](/compare.md): LogicPacks next to Cursor, Devin, Copilot, Tuple, Upwork and others, with sources and when to pick them instead.
- [Safety](/safety.md): what the setup installs and changes, backups, what teammates see, secrets, and how to remove access.
- [Research](/research.md): methodology and results tables; unmeasured items are marked pending.

## Pages

${PAGES.map((p) => `- [${p.title}](${p.md}): ${p.summary}`).join('\n')}

## For agents

- [Agent setup](/setup.md): how an agent connects to LogicPacks.
- [Everything in one file](/llms-full.txt)
`;
}

export function jsonLd() {
  const p = PRICING;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: COMPANY.name,
        legalName: 'AL JASH TRADING',
        url: COMPANY.website,
        foundingDate: String(COMPANY.since),
        identifier: 'CN-1030597',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Office 5, Bani Yas West 4, Bani Yas',
          addressLocality: 'Abu Dhabi',
          addressCountry: 'AE',
        },
        contactPoint: { '@type': 'ContactPoint', telephone: '+17136322262', contactType: 'customer support' },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#developer`,
        name: DEVELOPER.name,
        url: DEVELOPER.url,
        description: `${DEVELOPER.name}, ${DEVELOPER.about}.`,
        sameAs: DEVELOPER.profiles,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#app`,
        name: 'LogicPacks',
        url: SITE_URL,
        description: DESCRIPTION,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS 13 or later (Apple silicon), Web',
        softwareVersion: DOWNLOADS.mac.version,
        author: { '@id': `${SITE_URL}/#developer` },
        creator: { '@id': `${SITE_URL}/#developer` },
        publisher: { '@id': `${SITE_URL}/#org` },
        provider: { '@id': `${SITE_URL}/#org` },
        offers: [
          { '@type': 'Offer', name: p.individual.name, price: '0', priceCurrency: 'USD' },
          {
            '@type': 'Offer',
            name: p.enterprise.name,
            price: '99',
            priceCurrency: 'USD',
            description: `${p.enterprise.price} ${p.enterprise.per}`,
          },
        ],
      },
    ],
  };
}

export const safetyMarkdown = () => buildSafety(SERVER_SAFETY);
