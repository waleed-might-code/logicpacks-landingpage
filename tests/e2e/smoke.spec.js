import { test, expect } from '@playwright/test';

const ACCESS_CODE = 'buildanything';

/**
 * Type the private-beta access code into the AccessGate character inputs and
 * wait for the protected app to render. The gate stores its grant in
 * sessionStorage, so this must run once per fresh page/context.
 */
async function unlock(page) {
  const inputs = page.locator('input[type="text"]');
  await expect(inputs).toHaveCount(ACCESS_CODE.length);
  for (let i = 0; i < ACCESS_CODE.length; i++) {
    await inputs.nth(i).fill(ACCESS_CODE[i]);
  }
  // Reveal animation (~13*60ms) + 600ms grant delay before the app mounts.
  await expect(page.getByText('Access Granted')).toBeVisible();
  // The grant is committed to sessionStorage only after the delay; wait for it
  // so a subsequent navigation doesn't race the gate back into view.
  await page.waitForFunction(() => sessionStorage.getItem('lp_access_granted') === 'true');
  await expect(page.getByText('Enter Access Code')).toHaveCount(0);
}

test.describe('Logic Packs landing — smoke', () => {
  test('access gate blocks the app and unlocks with the correct code', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Enter Access Code')).toBeVisible();

    // Wrong code keeps the gate up.
    const inputs = page.locator('input[type="text"]');
    for (let i = 0; i < ACCESS_CODE.length; i++) {
      await inputs.nth(i).fill('z');
    }
    await expect(page.getByText('Enter Access Code')).toBeVisible();

    await page.reload();
    await unlock(page);

    // The persona chooser (default home) should now be reachable.
    await expect(page.getByRole('heading', { name: 'What brings you here?' })).toBeVisible({ timeout: 15000 });
  });

  test('persona chooser routes to the marketplace view', async ({ page }) => {
    await page.goto('/');
    await unlock(page);
    await expect(page.getByRole('heading', { name: 'What brings you here?' })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: /Browse Marketplace/i }).click();
    await expect(page).toHaveURL(/view=marketplace/);
  });

  test('marketplace store lists packs and filters by search', async ({ page }) => {
    // Grant access first, then deep-link to the store.
    await page.goto('/');
    await unlock(page);
    await page.goto('/store');

    await expect(page.getByRole('heading', { name: 'Pack Marketplace' })).toBeVisible({ timeout: 15000 });

    // A known pack should be present, and search should narrow the list.
    await expect(page.getByText('Auth Pack').first()).toBeVisible();

    const search = page.getByPlaceholder(/search/i).first();
    await search.fill('payments');
    await expect(page.getByText('Payments Pack').first()).toBeVisible();
    // "Redis Connector" is not featured, so once the search excludes it the
    // pack disappears entirely (the featured strip would keep featured packs).
    await expect(page.getByText('Redis Connector')).toHaveCount(0);
  });

  test('unknown routes render the not-found page', async ({ page }) => {
    await page.goto('/');
    await unlock(page);
    await page.goto('/this-route-does-not-exist');
    // NotFound page renders a 404 marker.
    await expect(page.getByText(/404/).first()).toBeVisible({ timeout: 15000 });
  });
});
