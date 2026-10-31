import { test, expect } from '@playwright/test';

// Flip with EXPERT_PORTRAITS_READY in src/site.js.
const PORTRAITS = true;
const EXPERT_IDS = ['ingrid-solberg', 'tomas-reyes', 'anika-rao', 'jonas-weber', 'kofi-mensah', 'lea-moreau', 'yuna-park', 'karim-haddad'];

test.describe('LogicPacks landing: smoke', () => {
  test('home is the hero, the launch film, every-app, three rows and a closing line', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Agents and people, one workspace.');
    // The launch film loads over its poster and offers its voiceover.
    await expect(page.getByTestId('media-video').first()).toHaveCSS('opacity', '1', { timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Play with sound' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'Work together.',
      /Every app, every agent, one machine\./,
      'Delegate with guardrails.',
      'Works with your agent.',
      'Where it runs.',
      /Built by Al Jash Trading, Abu Dhabi\. Since 1994\./,
    ]);
    // Row 1 clip plays too.
    const together = page.locator('#together [data-testid="media-video"]');
    await together.scrollIntoViewIfNeeded();
    await expect(together).toHaveCSS('opacity', '1', { timeout: 15_000 });
    await expect(page.getByTestId('goal-diagram')).toBeVisible();
    await expect(page.getByTestId('agent-tile')).toHaveCount(20);
    await expect(page.locator('[data-testid="agent-tile"] svg')).toHaveCount(12);
    await expect(page.getByText(/Request assistance|coming soon/i)).toHaveCount(0);
    await expect(page.getByTestId('expert-card')).toHaveCount(0);
  });

  test('the films, posters and portraits are served', async ({ request }) => {
    const files = [
      ['/launch.mp4', 'video/mp4'],
      ['/launch.jpg', 'image/jpeg'],
      ['/together.mp4', 'video/mp4'],
      ['/together.jpg', 'image/jpeg'],
      ['/every-app.mp4', 'video/mp4'],
      ['/every-app.jpg', 'image/jpeg'],
      ['/bg/fluted.webm', 'video/webm'],
      ['/bg/fluted.mp4', 'video/mp4'],
      ['/bg/fluted.jpg', 'image/jpeg'],
      ['/bg/wave.webm', 'video/webm'],
      ['/bg/wave.mp4', 'video/mp4'],
      ['/bg/wave.jpg', 'image/jpeg'],
      ...(PORTRAITS ? EXPERT_IDS.map((id) => [`/experts/${id}.webp`, 'image/webp']) : []),
    ];
    for (const [path, type] of files) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()['content-type'], path).toContain(type);
    }
  });

  test('setup.md is served as text when it is in the build', async ({ request }) => {
    const response = await request.get('/setup.md');
    const type = response.headers()['content-type'] ?? '';
    // Until setup.md ships, the SPA fallback answers with HTML: then skip.
    test.skip(type.includes('text/html'), 'public/setup.md is not in this build yet');
    expect(response.status()).toBe(200);
  });

  test('Connect your agent copies the setup prompt', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await page.getByRole('button', { name: 'Connect your agent' }).first().click();
    await expect(page.getByText(/Paste it into Claude Code/)).toBeVisible();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('https://logicpacks.io/setup.md');
  });

  test('What’s new lists Request assistance with eight loaded portraits, then every-app', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'What’s new' }).click();
    await expect(page).toHaveURL(/\/new$/);
    await expect(page).toHaveTitle("What's new in LogicPacks");
    await expect(page.getByRole('heading', { name: /Request assistance\./ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Every app, every agent, one machine\./ })).toBeAttached();
    await expect(page.getByTestId('expert-card')).toHaveCount(PORTRAITS ? 8 : 0);
    if (!PORTRAITS) return;
    const imgs = page.locator('[data-testid="expert-card"] img');
    for (let i = 0; i < 8; i++) {
      const img = imgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0), { timeout: 10_000 }).toBe(true);
    }
    await expect(page.getByText('Sample experts. Portraits are illustrative.')).toBeVisible();
  });

  test('reduced motion shows everything without animation and keeps backgrounds still', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await page.locator('#closing-title').scrollIntoViewIfNeeded();
    await expect(page.locator('#closing-title')).toHaveCSS('opacity', '1');
    const playing = await page.$$eval('[data-testid="motion-bg"]', (vs) => vs.filter((v) => !v.paused).length);
    expect(playing).toBe(0);
    await context.close();
  });

  test('the header hides on the way down and returns on the way up', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header.lp-header');
    await page.mouse.wheel(0, 1600);
    await expect(header).toHaveAttribute('data-hidden', 'true');
    await page.mouse.wheel(0, -400);
    await expect(header).toHaveAttribute('data-hidden', 'false');
  });

  for (const [path, heading] of [['/privacy', 'What we store'], ['/terms', 'Law']]) {
    test(`${path} is real HTML that reads without JavaScript`, async ({ request, browser }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toContain('Al Jash Trading (Establishment), Abu Dhabi, UAE');
      expect(html).toContain('CN-1030597');
      expect(html).toContain(heading);
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await context.close();
    });
  }

  for (const [path, md, phrase] of [
    ['/', '/index.md', 'Agents and people, one workspace.'],
    ['/story', '/story.md', 'Public beta'],
    ['/research', '/research.md', '139/139 passed'],
    ['/pricing', '/pricing.md', '$99'],
    ['/new', '/new.md', 'Request assistance'],
  ]) {
    test(`${path} reads without JavaScript and has a markdown twin`, async ({ request, browser }) => {
      const html = await (await request.get(path)).text();
      expect(html).toContain(phrase);
      expect(html).toContain('CN-1030597');
      expect(html).toContain(`type="text/markdown" href="${md}"`);
      expect(html).toContain('"foundingDate":"1994"');
      const twin = await (await request.get(md)).text();
      expect(twin).toContain(phrase);
      expect(twin).toContain('Al Jash Trading');
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await context.close();
    });
  }

  test('llms.txt and about.md give agents the plain facts', async ({ request }) => {
    const llms = await (await request.get('/llms.txt')).text();
    expect(llms).toMatch(/^# LogicPacks\n\n> /);
    expect(llms).toContain('[About LogicPacks](/about.md)');
    const about = await (await request.get('/about.md')).text();
    for (const text of ['Established: 1994', 'CN-1030597', '$99 per workspace / month', 'never stores or proxies model API keys', 'pending']) {
      expect(about).toContain(text);
    }
  });

  test('the footer names the operator and links privacy and terms', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toContainText(/© \d{4} LogicPacks by Al Jash Trading, Abu Dhabi, UAE/);
    await footer.getByRole('link', { name: 'Privacy' }).click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  });

  test('Download for Mac opens the download page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Download for Mac' }).first().click();
    await expect(page).toHaveURL(/\/download$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Download LogicPacks.');
    await expect(page).toHaveTitle('Download LogicPacks');
  });

  for (const path of ['/download', '/new', '/story', '/research', '/pricing', '/whats-new']) {
    test(`${path} loads directly (SPA fallback)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }

  for (const path of ['/', '/download', '/new', '/privacy', '/terms', '/story', '/research', '/pricing']) {
    test(`no horizontal scroll at phone width on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
