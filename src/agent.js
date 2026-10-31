// The agent-readable side of the site, built at build time from the same data the
// pages use (src/site.js, src/confirm.js, research/benchmarks.json), so the
// markdown twins, /about.md, /research.md, /llms.txt and the JSON-LD never drift
// from the pages. scripts/prerender.mjs writes them into dist.
import benchmarks from '../research/benchmarks.json';
import {
  COMPANY,
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
  { path: '/', md: '/index.md', title: 'LogicPacks', summary: 'Agents and people, one workspace: what LogicPacks is and where it runs.' },
  { path: '/story', md: '/story.md', title: 'Our story', summary: 'Timeline from the first build to the public beta, and what shipped with LogicPacks.' },
  { path: '/research', md: '/research.md', title: 'Research', summary: 'Methodology, test suite results, member sandbox checks and app sharing benchmarks.' },
  { path: '/pricing', md: '/pricing.md', title: 'Pricing', summary: 'Free for individuals; Enterprise at $99 per workspace per month.' },
  { path: '/new', md: '/new.md', title: 'What’s new', summary: 'Releases, newest first: Request assistance (vetted freelancers) and every-app sharing.' },
  { path: '/download', md: '/download.md', title: 'Download', summary: 'The Mac app, its checksum and the one-line install.' },
  { path: '/privacy', md: '/privacy.md', title: 'Privacy', summary: 'What we store, what we never store, the cloud sandbox and deletion.' },
  { path: '/terms', md: '/terms.md', title: 'Terms', summary: 'Terms of use, beta status, liability and governing law.' },
];

export const DESCRIPTION =
  'LogicPacks is a shared workspace where people and their AI agents work on the same project. Free for individuals. Operated by Al Jash Trading, Abu Dhabi.';

export const operatorLine = () =>
  `LogicPacks by ${COMPANY.name}. Operated by ${COMPANY.name} (${COMPANY.form}), ${COMPANY.city}, ${COMPANY.country}, established ${COMPANY.since}. ${COMPANY.licence}. Address: ${COMPANY.address}. Website: ${COMPANY.website}. Contact: WhatsApp ${COMPANY.whatsapp} (${COMPANY.whatsappUrl}).`;

// Appended to every markdown twin, so each file names the operator on its own.
export const mdFooter = () =>
  `\n\n---\n\n${operatorLine()}\n\nAll pages for agents: [/llms.txt](/llms.txt). Plain facts: [/about.md](/about.md).\n`;

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

Neutral facts about LogicPacks, with links to the source pages. Updated ${benchmarks.updated}.

## Operator

- Product: LogicPacks (${SITE_URL})
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

People and agents share the host machine's apps (for example Blender and DaVinci Resolve) through live app views, with a named cursor for each person and agent, and snapshots that merge back. It needs the Mac app; the web app is for code. Benchmarks: ${benchmarks.streaming
    .map((s) => `${s.title} (${s.metrics.map((m) => `${m.label.toLowerCase()}: ${metric(m)}`).join(', ')})`)
    .join('; ')}. See [/research.md](/research.md).

## Vetted freelancers (Request assistance, Beta)

${FREELANCERS} See [/new.md](/new.md).

## Shipped with LogicPacks

${SHIPPED.map((s) => `- ${s.title} (${s.kind})${s.client === 'Our own product' ? ', our own product' : s.client ? ` for ${s.client}${s.client === 'Digital Software Market' ? ' (a sister company of Al Jash Trading)' : ''}` : ''}: ${s.body}`).join('\n')}

## Published tests

${benchmarks.suites.map((s) => `- ${s.title}: ${suite(s)}${s.date ? ` (${s.date})` : ''}`).join('\n')}

Methodology and full tables: [/research.md](/research.md).

## Contact

WhatsApp ${COMPANY.whatsapp} (${COMPANY.whatsappUrl}). Company: ${COMPANY.website}.`;
}

export function llmsTxt() {
  return `# LogicPacks

> ${DESCRIPTION} Every page below has a markdown twin; /about.md lists the plain facts.

LogicPacks by ${COMPANY.name} (${COMPANY.form}), ${COMPANY.city}, ${COMPANY.country}, established ${COMPANY.since}, ${COMPANY.licence}. Currently in public beta.

## Facts

- [About LogicPacks](/about.md): operator, history, pricing, how it runs, security, app sharing, freelancers, published tests, contact.
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
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#app`,
        name: 'LogicPacks',
        url: SITE_URL,
        description: DESCRIPTION,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS 13 or later (Apple silicon), Web',
        softwareVersion: DOWNLOADS.mac.version,
        publisher: { '@id': `${SITE_URL}/#org` },
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
