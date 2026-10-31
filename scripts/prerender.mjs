// After `vite build`: write static HTML for pages that must read without
// JavaScript (the legal pages). dist/<name>.html is served at /<name> by
// Cloudflare Pages, ahead of the SPA fallback in _redirects.
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'vite';

const ROUTES = [
  ['/privacy', 'privacy.html', 'Privacy · LogicPacks'],
  ['/terms', 'terms.html', 'Terms · LogicPacks'],
];

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { render } = await vite.ssrLoadModule('/src/prerender.jsx');
  const shell = readFileSync('dist/index.html', 'utf8');
  for (const [url, file, title] of ROUTES) {
    const html = render(url);
    if (!html.includes('Aljash Trading')) throw new Error(`${url} rendered without the operator`);
    const page = shell
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
    writeFileSync(`dist/${file}`, page);
    console.log(`prerendered ${url} -> dist/${file} (${page.length} bytes)`);
  }
} finally {
  await vite.close();
}
