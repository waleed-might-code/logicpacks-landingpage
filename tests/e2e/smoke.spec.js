import { test, expect } from '@playwright/test';

test.describe('LogicPacks landing: smoke', () => {
  test('home renders the hero, launch media and sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('The best place for agents and humans to work together.');
    await expect(page.getByAltText(/The LogicPacks app/)).toBeVisible();
    await expect(page.getByRole('heading', { name: /Sync to the cloud\./ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Every app, every agent, one machine\./ })).toBeAttached();
    // No launch.mp4 shipped yet: the video stays hidden behind the screenshot.
    await expect(page.getByTestId('media-video').first()).toHaveCSS('opacity', '0');
  });

  test('Download for Mac opens the download page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Download for Mac' }).first().click();
    await expect(page).toHaveURL(/\/download$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Download LogicPacks.');
    await expect(page).toHaveTitle('Download LogicPacks');
  });

  test('/download loads directly (SPA fallback)', async ({ page }) => {
    await page.goto('/download');
    await expect(page.getByRole('heading', { name: 'LogicPacks for Mac' })).toBeVisible();
  });

  test('Install with your agent copies the prompt', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await page.getByRole('button', { name: 'Install with your agent' }).first().click();
    await expect(page.getByText(/Paste it into Claude Code/)).toBeVisible();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('Install LogicPacks on this Mac');
  });

  for (const path of ['/', '/download']) {
    test(`no horizontal scroll at phone width on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
