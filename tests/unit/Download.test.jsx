import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

afterEach(() => {
  vi.resetModules();
  vi.doUnmock('../../src/site');
});

async function renderDownload(mac) {
  vi.doMock('../../src/site', async (importOriginal) => {
    const site = await importOriginal();
    return { ...site, DOWNLOADS: { ...site.DOWNLOADS, mac: { ...site.DOWNLOADS.mac, ...mac } } };
  });
  const { default: Download } = await import('../../src/pages/Download');
  return render(
    <MemoryRouter>
      <Download />
    </MemoryRouter>,
  );
}

describe('Download page', () => {
  it('does not offer a dead link before the release is filled in', async () => {
    await renderDownload({ url: null, sha256: null });
    expect(screen.queryByRole('link', { name: /Download \.dmg/ })).toBeNull();
    expect(screen.getByText('The .dmg is on the way')).toBeInTheDocument();
    expect(screen.getByText(/Published here with the release/)).toBeInTheDocument();
  });

  it('links the DMG and shows its SHA-256 once the ship step sets them', async () => {
    const sha = 'a'.repeat(64);
    await renderDownload({ url: 'https://logicpacks.io/releases/LogicPacks.dmg', sha256: sha, version: '1.0.0' });
    expect(screen.getByRole('link', { name: /Download \.dmg/ })).toHaveAttribute(
      'href',
      'https://logicpacks.io/releases/LogicPacks.dmg',
    );
    expect(screen.getByText(sha)).toBeInTheDocument();
    expect(screen.getByText(/Version 1\.0\.0/)).toBeInTheDocument();
    expect(screen.getByText('curl -fsSL https://logicpacks.io/install.sh | bash')).toBeInTheDocument();
  });

  it('lists Windows, iOS and our cloud as coming soon', async () => {
    await renderDownload({});
    expect(screen.getByRole('heading', { name: 'Windows' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'iPhone and iPad' })).toBeInTheDocument();
    expect(screen.getAllByText('Coming soon')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'Our cloud' })).toBeInTheDocument();
    expect(document.body.innerHTML).not.toContain('app.logicpacks.io');
    expect(screen.getByRole('button', { name: 'Copy prompt' })).toBeInTheDocument();
  });
});
