import { test, expect } from '@playwright/test';

// Flip with EXPERT_PORTRAITS_READY in src/site.js.
const PORTRAITS = false;
const EXPERT_IDS = ['ingrid-solberg', 'tomas-reyes', 'anika-rao', 'jonas-weber', 'kofi-mensah', 'lea-moreau', 'yuna-park', 'karim-haddad'];

test.describe('LogicPacks landing: smoke', () => {
  test('home is the hero film, three rows and a closing line', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Agents and people, one workspace.');
    // The launch film loads over its poster and offers its voiceover.
    await expect(page.getByTestId('media-video').first()).toHaveCSS('opacity', '1', { timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Play with sound' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'Work together.',
      'Delegate with guardrails.',
      'Works with your agent.',
      /We are a small team\./,
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

  test('Download for Mac opens the download page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Download for Mac' }).first().click();
    await expect(page).toHaveURL(/\/download$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Download LogicPacks.');
    await expect(page).toHaveTitle('Download LogicPacks');
  });

  for (const path of ['/download', '/new']) {
    test(`${path} loads directly (SPA fallback)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }

  for (const path of ['/', '/download', '/new']) {
    test(`no horizontal scroll at phone width on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
