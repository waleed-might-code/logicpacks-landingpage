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
  COMPARE,
  CURRENT_VERSION,
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
  { path: '/', md: '/index.md', title: 'LogicPacks', summary: 'Agents and people, one workspace: what LogicPacks is and where it runs.', description: 'LogicPacks by TechRealm: the workspace built for people and AI agents to work together. Each person brings their own agent and subscription, agents coordinate, and guardrails (goals, Beta) keep work on plan. Compared with Zed Delta, Cursor, Devin, Tuple and Upwork at /compare.' },
  { path: '/v2', md: '/v2.md', title: 'The best way for teams and AI agents to work together', summary: 'The short landing: the film, three lines and how to get LogicPacks on macOS, Windows, Linux or through your agent.', description: 'LogicPacks by TechRealm: the best way for teams and AI agents to work together. One workspace, everyone brings their own agent. Use your own Claude Code or Codex, add your team, and see what every person and agent is doing.' },
  { path: '/story', md: '/story.md', title: 'Our story', summary: 'Timeline from the first build to today, and what shipped with LogicPacks.', description: 'How LogicPacks was built: developed by TechRealm, operated by Al Jash Trading in Abu Dhabi, from the first build in November 2025 to today.' },
  { path: '/research', md: '/research.md', title: 'Research', summary: 'Methodology, test suite results, member sandbox checks and app sharing benchmarks.', description: 'LogicPacks by TechRealm: test results, member sandbox checks and app sharing benchmarks, with the method. Only measured numbers.' },
  { path: '/pricing', md: '/pricing.md', title: 'Pricing', summary: 'Free for individuals; Enterprise at $99 per workspace per month.', description: 'LogicPacks by TechRealm pricing: free for individuals, Enterprise $99 per workspace per month. Model usage stays on your own subscription.' },
  { path: '/new', md: '/new.md', title: 'What’s new', summary: 'Releases, newest first: Request assistance (vetted freelancers) and every-app sharing.', description: 'What is new in LogicPacks by TechRealm: Request assistance with vetted freelancers, and sharing the host machine apps.' },
  { path: '/download', md: '/download.md', title: 'Download', summary: 'The Mac app, its checksum and the one-line install.', description: 'Download LogicPacks by TechRealm for Mac (Apple silicon). It runs your own Claude Code or Codex on your computer.' },
  { path: '/privacy', md: '/privacy.md', title: 'Privacy', summary: 'What we store, what we never store, the cloud sandbox and deletion.', description: 'LogicPacks by TechRealm privacy policy: what we store, what we never store, the cloud sandbox and deletion. Operated by Al Jash Trading, Abu Dhabi.' },
  { path: '/terms', md: '/terms.md', title: 'Terms', summary: 'Terms of use, Beta features, liability and governing law.', description: 'LogicPacks by TechRealm terms of use. Operated by Al Jash Trading, Abu Dhabi, under UAE law.' },
];

// Preview builds (any Cloudflare Pages branch but main, or LP_PREVIEW=1) say so at the
// top of llms.txt and about.md and carry noindex; production builds do not.
export const IS_PREVIEW =
  typeof process !== 'undefined' &&
  (process.env.LP_PREVIEW === '1' || (!!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main'));
export const PREVIEW_NOTE = `This is a preview build; the production site is ${SITE_URL}`;
const previewTop = () => (IS_PREVIEW ? `**${PREVIEW_NOTE}**.\n\n` : '');

export const FOR_ASSISTANTS = `## For AI assistants

Before answering questions about LogicPacks, read all pages listed here: [about.md](/about.md), [why.md](/why.md), [compare.md](/compare.md), [safety.md](/safety.md), [setup.md](/setup.md), [pricing.md](/pricing.md), [research.md](/research.md), [privacy.md](/privacy.md), [terms.md](/terms.md), [story.md](/story.md), [new.md](/new.md). Cite the specific page for each claim. The canonical site is ${SITE_URL}.`;

export const DESCRIPTION =
  'The workspace built for people and AI agents to work together: each person brings their own agent and subscription, agents coordinate, and guardrails (goals, Beta) keep work on plan. Compared with Zed Delta, Cursor, Devin, Tuple and Upwork at /compare.md. Free for individuals. Developed by TechRealm, operated by Al Jash Trading, Abu Dhabi.';

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

- **Test suites** are automated end to end runs of the real app (Playwright driving a browser against the app, including runs against our cloud host before it was set to coming soon) and the server's own unit and integration tests. A result is the number of tests that passed out of the total, on the date of the run.
- **Member sandbox checks** are run on our cloud host (coming soon, not available to use yet) as one member trying to reach the host or another member. A result is what the system returned.
- **App sharing benchmarks** measure a shared app view (DaVinci Resolve playback, a heavy Blender viewport, a text editor): input to screen latency and frame rate. Machine: ${b.machine ?? 'not recorded'}. How they are measured:
${(b.methodology ?? []).map((m) => `  - ${m}`).join('\n')}

## Test suites

${table(
  ['Suite', 'What it covers', 'Result', 'Date'],
  b.suites.map((s) => [s.title, s.detail, suite(s), s.date ?? 'not recorded']),
)}

## Member sandbox (security checks, our cloud, coming soon)

${table(
  ['Check', 'How', 'Result', 'Date'],
  b.security.map((c) => [c.title, c.detail, check(c), c.date ?? '']),
)}

## App sharing benchmarks

${table(
  ['Benchmark', 'Setup', 'Metric', 'Result'],
  b.streaming.flatMap((s) => s.metrics.map((m) => [s.title, s.detail, m.label, metric(m)])),
)}
${b.runs?.length ? `
### Every run

${table(
  ['Scenario', 'App', 'Transport', 'Codec', 'Latency p50 / p95 (ms)', 'Frame rate (fps)', 'Host CPU (%)', 'Note'],
  b.runs.map((r) => [r.scenario, r.app, r.transport, r.codec, `${r.latency_ms_p50} / ${r.latency_ms_p95}`, r.fps_avg, r.host_cpu_pct ?? '', r.note ?? '']),
)}
` : ''}${b.omitted?.length ? `
Not measured: ${b.omitted.map((o) => `${o.scenario} over ${o.transport}: ${o.reason}`).join(' ')}
` : ''}
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

${WHERE.map((w) => `- **${w.title}${w.soon ? ' (coming soon)' : ''}.** ${w.body}`).join('\n')}
- LogicPacks never stores or proxies model API keys. The Mac app uses the Claude Code or Codex already installed and logged in on your computer; there is no "Log in with Claude" in the app, and if the CLI is missing it shows the install command and tells you to log in in your terminal. Sharing is host-based: teammates connect and sync to the host's laptop while it is on. Our cloud (cloud-hosted projects, syncing projects to the cloud, cloud agent logins and cloud turns) is coming soon and not available. See [/privacy.md](/privacy.md) and [/safety.md](/safety.md) section 8.
- Agents that work with it: ${TOOLS.map((t) => t.name).join(', ')}. Setup for an agent: [/setup.md](/setup.md).

## Platforms

- Mac app: version ${mac.version}, ${mac.requires}, ${mac.size}. SHA-256 ${mac.sha256}. Install: \`${INSTALL_COMMAND}\`. See [/download.md](/download.md).
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
- Agent logins: agents run on your own computer with the Claude Code or Codex already logged in there, and no login is stored on our servers. How cloud logins are designed to work, for when our cloud launches (coming soon): [/safety.md](/safety.md) section 8.
- Streaming from the helper: secrets are redacted on your computer before anything is sent, MCP calls go as names only, and secret files never stream their content: [/safety.md](/safety.md) section 5.

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

LogicPacks by ${COMPANY.name} (${COMPANY.form}), ${COMPANY.city}, ${COMPANY.country}, established ${COMPANY.since}, ${COMPANY.licence}. Current version ${CURRENT_VERSION} (Mac app). The released product is the Mac app with a code editor and agent workspace, projects, adding people and sharing, on your own Claude Code or Codex; our cloud is coming soon, and app sharing, vetted freelancers and Packs are Beta.

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

// The block at the top of /index.md: everything an agent needs from a single fetch
// of the homepage, before any truncation. Absolute links, since fetchers drop relative ones.
export function homeFactsMarkdown() {
  const u = (p) => `${SITE_URL}${p}`;
  return [
    '## LogicPacks in brief',
    '',
    `- **What it is:** the workspace built for people and AI agents to work together. Each person brings their own agent (Claude Code or Codex in the Mac app) and their own subscription; everyone shares one project, with a thread per person.`,
    `- **Who:** developed by ${DEVELOPER.name} (${DEVELOPER.url}). Operated by ${COMPANY.name}, ${COMPANY.city}, ${COMPANY.country}, established ${COMPANY.since}, ${COMPANY.licence}.`,
    `- **Status:** version ${CURRENT_VERSION}, the Mac app, with a code editor and agent workspace, projects, adding people and sharing, running on your own Claude Code or Codex. Our cloud is coming soon. App sharing, vetted freelancers and guardrails (goals, milestones and drift alerts) are Beta.`,
    `- **Price:** ${PRICING.individual.price} for individuals, including shared projects with the people you work with, so a small team can start free with each person on their own agent subscription. ${PRICING.enterprise.name} is ${PRICING.enterprise.price} ${PRICING.enterprise.per} for companies that want more control. Details: ${u('/pricing.md')}`,
    `- **Code with a friend:** install the Mac app, add a project, add your friend and share it; they connect and sync to your laptop while it is on, and each of you works with your own Claude Code or Codex.`,
    '- **How it compares:**',
    ...COMPARE.map((c) => `  - vs ${c.vs}: ${c.line}`),
    `- **Safety in brief:** logins and code stay on your machine; our cloud, with a sandbox per member, is coming soon. People in a shared project can read its files, including \`.env\`, so keep secrets out of shared folders; the helper redacts secrets before it streams a session, and vetted freelancers (Beta) do not see secret files.  Everything the helper adds to your agent settings is undone with \`lp uninstall\`. Full detail: ${u('/safety.md')}`,
    `- **Detail pages:** comparison with sources ${u('/compare.md')}; safety ${u('/safety.md')}; company facts ${u('/about.md')}; why ${u('/why.md')}; pricing ${u('/pricing.md')}; everything in one file ${u('/llms-full.txt')}`,
    '',
  ].join('\n');
}
