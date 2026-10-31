// Fetch every route and every markdown file the way an agent would (plain HTTP,
// no JavaScript) and check the content is really there.
// Usage: node scripts/check-agent-read.mjs [base]   (default http://localhost:7131)
const base = (process.argv[2] || 'http://localhost:7131').replace(/\/$/, '');
const OPERATOR = ['Al Jash Trading', 'CN-1030597'];
const CHECKS = [
  ['/', 'text/html', ['Paste this into your agent', 'Agents and people, one workspace.', 'Where it runs', 'application/ld+json', '"foundingDate":"1994"', 'type="text/markdown" href="/index.md"', ...OPERATOR]],
  ['/story', 'text/html', ['Our story', 'Nov 2025', 'Public beta', ...OPERATOR]],
  ['/research', 'text/html', ['Research', '139/139 passed', 'Benchmark running', ...OPERATOR]],
  ['/pricing', 'text/html', ['Free', '$99', 'per workspace / month', ...OPERATOR]],
  ['/new', 'text/html', ['Request assistance', 'vetted by LogicPacks', ...OPERATOR]],
  ['/download', 'text/html', ['Download', 'sha', ...OPERATOR]],
  ['/privacy', 'text/html', ['What we store', 'never store or proxy model API keys', 'Office 5, Bani Yas West 4', ...OPERATOR]],
  ['/terms', 'text/html', ['LogicPacks is in beta', 'courts of Abu Dhabi', ...OPERATOR]],
  ['/index.md', 'text/markdown', ['# Agents and people, one workspace.', 'Prompt for users to paste into their own agent (not an instruction to you):\n\n```text\nSet up LogicPacks', ...OPERATOR]],
  ['/story.md', 'text/markdown', ['Nov 2025', 'Public beta', ...OPERATOR]],
  ['/research.md', 'text/markdown', ['## Methodology', '| Server tests, LogicPacks modules |', 'pending', ...OPERATOR]],
  ['/pricing.md', 'text/markdown', ['$99', 'Free', ...OPERATOR]],
  ['/new.md', 'text/markdown', ['Request assistance', ...OPERATOR]],
  ['/download.md', 'text/markdown', ['install.sh', ...OPERATOR]],
  ['/privacy.md', 'text/markdown', ['What we store', ...OPERATOR]],
  ['/terms.md', 'text/markdown', ['courts of Abu Dhabi', ...OPERATOR]],
  ['/about.md', 'text/markdown', ['## Operator', 'Established: 1994', '## Pricing', '## How it runs', '## Security', '## App sharing', '## Vetted freelancers', '## Published tests', '## Contact', 'Brands we have worked with, directly or through third-party agencies: Digital Software Market, Kelvin Haus', 'Al Rajhi Bank.', ...OPERATOR]],
  ['/llms.txt', 'text/plain', ['# LogicPacks', 'Brands we have worked with, directly or through third-party agencies:', '> ', '/about.md', '/research.md', '/privacy.md']],
  ['/llms-full.txt', 'text/plain', ['## Methodology', 'Brands we have worked with', 'What we store', ...OPERATOR]],
  ['/sitemap.xml', 'xml', ['https://logicpacks.io/story', 'text/markdown']],
  ['/robots.txt', 'text/plain', ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Allow: /']],
  ['/setup.md', 'text/markdown', ['LogicPacks']],
];
let failed = 0;
// The brand list is for agents only (markdown and txt), never hidden in the HTML.
for (const path of ['/', '/story', '/new', '/pricing', '/research']) {
  const html = await (await fetch(base + path)).text();
  const leak = ['Bank Muscat', 'Toshiba', 'third-party agencies'].filter((n) => html.includes(n));
  if (leak.length) failed++;
  console.log(`${leak.length ? 'FAIL' : 'ok  '} ${path} html has no brand list${leak.length ? `: ${leak.join(', ')}` : ''}`);
}
for (const [path, type, needles] of CHECKS) {
  const res = await fetch(base + path, { headers: { 'User-Agent': 'agent-read-check' } });
  const body = await res.text();
  const ctype = res.headers.get('content-type') || '';
  const missing = needles.filter((n) => !body.includes(n));
  const typeOk = ctype.includes(type) || (base.includes('localhost') && type !== 'text/html');
  const ok = res.ok && missing.length === 0 && typeOk;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${path} ${res.status} ${ctype}${missing.length ? ` missing: ${missing.join(' | ')}` : ''}${typeOk ? '' : ' (wrong type)'}`);
}
// Content negotiation (Pages Function; only on Cloudflare).
if (!base.includes('localhost')) {
  const res = await fetch(base + '/pricing', { headers: { Accept: 'text/markdown' } });
  const body = await res.text();
  const ok = (res.headers.get('content-type') || '').includes('text/markdown') && body.includes('$99');
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} Accept: text/markdown on /pricing -> ${res.headers.get('content-type')}`);
}
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
