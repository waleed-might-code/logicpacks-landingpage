// Content negotiation for agents: a request for any page with
// `Accept: text/markdown` (and not text/html first) gets that page's markdown
// twin. Everything else passes straight through to the static site.
const TWINS = {
  '/': '/index.md',
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

export async function onRequest({ request, next, env }) {
  const accept = request.headers.get('Accept') || '';
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
    },
  });
}
