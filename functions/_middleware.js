// Content negotiation for agents: a request for any page with
// `Accept: text/markdown` (and not text/html first) gets that page's markdown
// twin. Everything else passes straight through to the static site.
const TWINS = {
  '/': '/index.md',
  '/v2': '/v2.md',
  '/story': '/story.md',
  '/research': '/research.md',
  '/pricing': '/pricing.md',
  '/new': '/new.md',
  '/download': '/download.md',
  '/privacy': '/privacy.md',
  '/terms': '/terms.md',
  '/about': '/about.md',
  '/why': '/why.md',
  '/compare': '/compare.md',
  '/safety': '/safety.md',
};

// A/B test on "/" only: A is the current page, B is /v2 served in place (same URL).
// The variant sticks for 30 days in the lp_ab cookie; ?ab=a or ?ab=b forces one.
// Crawlers, AI agents and command-line clients always get A, the canonical page.
const BOTS = /bot|crawl|spider|slurp|claude|anthropic|gpt|openai|perplexity|google-extended|facebookexternalhit|embedly|preview|headless|lighthouse|curl|wget|python|node-fetch|undici|axios|httpx|go-http|java\/|okhttp|libwww/i;
const DAYS_30 = 60 * 60 * 24 * 30;

async function abHome(request, next, env, url) {
  const forced = (url.searchParams.get('ab') || '').toLowerCase();
  const cookie = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)lp_ab=([ab])\b/)?.[1];
  const bot = BOTS.test(request.headers.get('User-Agent') || '');
  let variant;
  if (forced === 'a' || forced === 'b') variant = forced;
  else if (bot) variant = 'a';
  else variant = cookie || (Math.random() < 0.5 ? 'a' : 'b');

  let res = variant === 'b' ? await env.ASSETS.fetch(new URL('/v2', url)) : await next();
  if (variant === 'b' && !res.ok) {
    variant = 'a';
    res = await next();
  }
  const out = new HTMLRewriter().on('html', { element: (el) => el.setAttribute('data-variant', variant) }).transform(res);
  const headers = new Headers(out.headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.append('Vary', 'Cookie');
  headers.set('Link', '<https://logicpacks.io/llms.txt>; rel="describedby"');
  if (!bot || forced) headers.append('Set-Cookie', `lp_ab=${variant}; Path=/; Max-Age=${DAYS_30}; SameSite=Lax; Secure`);
  return new Response(out.body, { status: out.status, headers });
}

export async function onRequest({ request, next, env }) {
  const accept = request.headers.get('Accept') || '';
  const home = new URL(request.url);
  if (request.method === 'GET' && home.pathname === '/' && !accept.includes('text/markdown')) return abHome(request, next, env, home);
  if (request.method !== 'GET' || !accept.includes('text/markdown')) return next();
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const twin = TWINS[path];
  if (!twin) return next();
  const md = await env.ASSETS.fetch(new URL(twin, url));
  if (!md.ok) return next();
  return new Response(md.body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      Vary: 'Accept',
      Link: '<https://logicpacks.io/llms.txt>; rel="describedby"',
    },
  });
}
