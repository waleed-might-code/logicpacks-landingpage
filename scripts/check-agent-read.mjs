// Fetch every route and every markdown file the way an agent would (plain HTTP,
// no JavaScript) and check the content is really there.
// Usage: node scripts/check-agent-read.mjs [base]   (default http://localhost:7131)
const base = (process.argv[2] || 'http://localhost:7131').replace(/\/$/, '');
const OPERATOR = ['Al Jash Trading', 'CN-1030597'];
const CHECKS = [
  ['/', 'text/html', ['Agents and people, one workspace.', 'Where it runs', 'application/ld+json', '"foundingDate":"1994"', 'type="text/markdown" href="/index.md"', ...OPERATOR]],
  ['/story', 'text/html', ['Our story', 'Nov 2025', 'Public beta', ...OPERATOR]],
  ['/research', 'text/html', ['Research', '139/139 passed', 'Benchmark running', ...OPERATOR]],
  ['/pricing', 'text/html', ['Free', '$99', 'per workspace / month', ...OPERATOR]],
  ['/new', 'text/html', ['Request assistance', 'vetted by LogicPacks', ...OPERATOR]],
  ['/download', 'text/html', ['Download', 'sha', ...OPERATOR]],
  ['/privacy', 'text/html', ['What we store', 'never store or proxy model API keys', 'Office 5, Bani Yas West 4', ...OPERATOR]],
  ['/terms', 'text/html', ['LogicPacks is in beta', 'courts of Abu Dhabi', ...OPERATOR]],
  ['/index.md', 'text/markdown', ['# Agents and people, one workspace.', ...OPERATOR]],
  ['/story.md', 'text/markdown', ['Nov 2025', 'Public beta', ...OPERATOR]],
  ['/research.md', 'text/markdown', ['## Methodology', '| Server tests, LogicPacks modules |', 'pending', ...OPERATOR]],
  ['/pricing.md', 'text/markdown', ['$99', 'Free', ...OPERATOR]],
  ['/new.md', 'text/markdown', ['Request assistance', ...OPERATOR]],
  ['/download.md', 'text/markdown', ['install.sh', ...OPERATOR]],
  ['/privacy.md', 'text/markdown', ['What we store', ...OPERATOR]],
  ['/terms.md', 'text/markdown', ['courts of Abu Dhabi', ...OPERATOR]],
  ['/about.md', 'text/markdown', ['## Operator', 'Established: 1994', '## Pricing', '## How it runs', '## Security', '## App sharing', '## Vetted freelancers', '## Published tests', '## Contact', ...OPERATOR]],
  ['/llms.txt', 'text/plain', ['# LogicPacks', '> ', '/about.md', '/research.md', '/privacy.md']],
  ['/llms-full.txt', 'text/plain', ['## Methodology', 'What we store', ...OPERATOR]],
  ['/sitemap.xml', 'xml', ['https://logicpacks.io/story', 'text/markdown']],
  ['/robots.txt', 'text/plain', ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Allow: /']],
  ['/setup.md', 'text/markdown', ['LogicPacks']],
];
let failed = 0;
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
