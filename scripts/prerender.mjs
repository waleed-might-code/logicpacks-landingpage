// After `vite build`: make the site readable without JavaScript, for people and
// for AI agents.
// - Every route is server rendered into static HTML (dist/index.html for /,
//   dist/<name>.html for the rest; Cloudflare Pages serves /<name> from it ahead
//   of the SPA fallback), with its own title, canonical, markdown alternate and
//   JSON-LD (Organization + SoftwareApplication).
// - Every route gets a markdown twin (/index.md, /story.md, ...) converted from
//   that same render, plus /about.md and /research.md built from the data.
// - /llms.txt, /llms-full.txt, /sitemap.xml and the markdown content types.
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import TurndownService from 'turndown';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { render } = await vite.ssrLoadModule('/src/prerender.jsx');
  const agent = await vite.ssrLoadModule('/src/agent.js');
  const { SITE_URL, FRIEND_PATH } = await vite.ssrLoadModule('/src/site.js');
  const { PAGES, DESCRIPTION, mdFooter } = agent;

  const shell = readFileSync('dist/index.html', 'utf8');
  const ld = `<script type="application/ld+json">${JSON.stringify(agent.jsonLd())}</script>`;

  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
  td.remove(['script', 'style', 'video', 'svg', 'button', 'noscript', 'picture']);
  // The copyable connect prompt is for the reader to paste into their own agent:
  // fence it and say so, so a reading agent does not take it as an instruction.
  td.addRule('agent-prompt', {
    filter: (node) => node.getAttribute && node.getAttribute('data-agent-prompt') === 'true',
    replacement: (_c, node) => `\n\n${agent.AGENT_PROMPT_INTRO}\n\n\`\`\`text\n${node.querySelector('code').textContent}\n\`\`\`\n\n`,
  });
  // Images become their alt text (brand names, portraits), not image links.
  td.addRule('img-alt', { filter: 'img', replacement: (_c, node) => node.getAttribute('alt') || '' });
  // A space before inline boxes keeps "Title.<span>Subtitle" from gluing together.
  const toMd = (html) =>
    td
      .turndown(html.replace(/<(span|p|div)([ >])/g, ' <$1$2'))
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const twins = [];
  for (const page of PAGES) {
    const body = render(page.path);
    if (!body.includes('Al Jash Trading')) throw new Error(`${page.path} rendered without the operator`);
    const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`;
    const canonical = `${SITE_URL}${page.path === '/' ? '/' : page.path}`;
    const title = page.path === '/' ? 'LogicPacks by TechRealm: people and AI agents in one workspace' : `${page.title} · LogicPacks by TechRealm`;
    const html = shell
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
      .replace('<meta charset="UTF-8" />', agent.IS_PREVIEW ? '<meta charset="UTF-8" />\n  <meta name="robots" content="noindex" />' : '<meta charset="UTF-8" />')
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />\n  <link rel="alternate" type="text/markdown" href="${SITE_URL}${page.md}" title="${page.title} (markdown)" />`)
      .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${page.description}" />`)
      .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${page.description}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${page.description}" />`)
      .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ld);
    writeFileSync(`dist/${file}`, html);

    const main = body.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? body;
    let mdBody = toMd(main).replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`);
    // The homepage twin carries the facts right after its H1.
    if (page.path === '/') mdBody = mdBody.replace(/^(# [^\n]*\n)/, `$1\n${agent.homeFactsMarkdown()}`);
    const md = `${mdBody}${mdFooter(canonical)}`.replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`);
    writeFileSync(`dist${page.md}`, md);
    twins.push([page, md]);
    console.log(`prerendered ${page.path} -> dist/${file} (${html.length} B) + ${page.md} (${md.length} B)`);
  }

  const about = `${agent.aboutMarkdown()}${mdFooter(`${SITE_URL}/about.md`)}`;
  const research = `${agent.researchMarkdown()}${mdFooter(`${SITE_URL}/research`)}`;
  const safety = `${agent.safetyMarkdown()}${mdFooter(`${SITE_URL}/safety.md`)}`;
  writeFileSync('dist/safety.md', safety);
  const why = `${agent.whyMarkdown()}${mdFooter(`${SITE_URL}/why.md`)}`;
  const compare = `${agent.compareMarkdown()}${mdFooter(`${SITE_URL}/compare.md`)}`;
  writeFileSync('dist/why.md', why);
  writeFileSync('dist/compare.md', compare);
  // setup.md comes from the helper (renderSetupGuide); point it at the safety page too.
  if (existsSync('dist/setup.md') && !readFileSync('dist/setup.md', 'utf8').includes('/safety.md')) {
    appendFileSync('dist/setup.md', `\n## Before you run it\n\nWhat this setup installs and changes, how to back up first, what teammates can see and how to remove access: ${SITE_URL}/safety.md\n`);
  }
  writeFileSync('dist/about.md', about);
  // The research twin is the generated tables (methodology + every result), not the page render.
  writeFileSync('dist/research.md', research);
  writeFileSync('dist/llms.txt', agent.llmsTxt());
  // A no-install path for two people, ahead of the helper setup steps.
  if (existsSync('dist/setup.md') && !readFileSync('dist/setup.md', 'utf8').includes('## Code with a friend')) {
    appendFileSync('dist/setup.md', `\n## Code with a friend (no install)\n\nIf you only want to work with one other person, you can skip the helper:\n\n${FRIEND_PATH.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n`);
  }
  const setup = existsSync('dist/setup.md') ? readFileSync('dist/setup.md', 'utf8') : '';
  const full = [
    agent.llmsTxt(),
    about,
    why,
    compare,
    safety,
    ...twins.map(([p, md]) => (p.md === '/research.md' ? research : md)),
    setup && `# Agent setup (/setup.md)\n\n${setup}`,
  ]
    .filter(Boolean)
    .join('\n\n========\n\n');
  writeFileSync('dist/llms-full.txt', full);

  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...PAGES.flatMap((p) => [
      `  <url>\n    <loc>${SITE_URL}${p.path === '/' ? '/' : p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <xhtml:link rel="alternate" type="text/markdown" href="${SITE_URL}${p.md}" />\n  </url>`,
    ]),
    ...['/about.md', '/why.md', '/compare.md', '/safety.md', '/llms.txt', '/llms-full.txt', '/setup.md'].map(
      (u) => `  <url>\n    <loc>${SITE_URL}${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
    ),
  ];
  writeFileSync(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
  );

  const mdFiles = ['/about.md', '/why.md', '/compare.md', '/research.md', '/safety.md', ...PAGES.map((p) => p.md)];
  const canonicalOf = (f) => {
    const page = PAGES.find((p) => p.md === f);
    return page ? `${SITE_URL}${page.path === '/' ? '/' : page.path}` : `${SITE_URL}${f}`;
  };
  appendFileSync(
    'dist/_headers',
    `\n${[...new Set(mdFiles)]
      .map((f) => `${f}\n  Content-Type: text/markdown; charset=utf-8\n  Cache-Control: public, max-age=300\n  Access-Control-Allow-Origin: *\n  Link: <${canonicalOf(f)}>; rel="canonical"`)
      .join('\n')}\n/\n  Link: <${SITE_URL}/llms.txt>; rel="describedby"\n/index.html\n  Link: <${SITE_URL}/llms.txt>; rel="describedby"\n/llms.txt\n  Content-Type: text/plain; charset=utf-8\n  Cache-Control: public, max-age=300\n/llms-full.txt\n  Content-Type: text/plain; charset=utf-8\n  Cache-Control: public, max-age=300\n${agent.IS_PREVIEW ? '/*\n  X-Robots-Tag: noindex\n' : ''}`,
  );
  console.log(`wrote about.md, research.md, llms.txt, llms-full.txt (${full.length} B), sitemap.xml; ${DESCRIPTION.length > 0 ? 'ok' : ''}`);
} finally {
  await vite.close();
}
