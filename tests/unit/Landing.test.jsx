import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App';
import { CONNECT_PROMPT, EXPERT_PORTRAITS_READY, TOOLS } from '../../src/site';

function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('Landing', () => {
  it('leads with the name, one line and the two buttons', () => {
    renderAt('/');
    expect(screen.getByText('LogicPacks', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Agents and people, one workspace.' })).toBeInTheDocument();
    const downloads = screen.getAllByRole('link', { name: /Download for Mac/ });
    downloads.forEach((link) => expect(link).toHaveAttribute('href', '/download'));
    expect(screen.getAllByRole('button', { name: 'Connect your agent' }).length).toBeGreaterThanOrEqual(1);
  });

  it('has the nav in order: What’s new, Docs, Download, Sign in', () => {
    renderAt('/');
    const nav = within(screen.getByRole('navigation', { name: 'Main' }));
    const names = nav.getAllByRole('link').map((a) => a.textContent);
    expect(names).toEqual(['LogicPacks', 'What’s new', 'Docs', 'Download', 'Sign in']);
    expect(nav.getByRole('link', { name: 'What’s new' })).toHaveAttribute('href', '/new');
  });

  it('has exactly three rows and a closing line, nothing else', () => {
    renderAt('/');
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual([
      'Work together.',
      'Delegate with guardrails.',
      'Works with your agent.',
      'We are a small team.Try it on your next project.',
    ]);
    expect(screen.getByRole('link', { name: 'Start a shared project' })).toHaveAttribute('href', 'https://app.logicpacks.io');
    expect(screen.getByRole('link', { name: 'Plan a goal' })).toBeInTheDocument();
    expect(screen.getByTestId('goal-diagram')).toHaveTextContent('Drifting');
    expect(screen.getByText(/or an outside team/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /See what’s new/ })).toHaveAttribute('href', '/new');
  });

  it('keeps Request assistance, every-app and expert cards off the main page', () => {
    const { container } = renderAt('/');
    expect(container.textContent).not.toMatch(/Request assistance|Every app, every agent|Pack context/);
    expect(screen.queryAllByTestId('expert-card')).toHaveLength(0);
    expect(container.textContent).not.toMatch(/coming soon|enterprise|ledger|orchestrat|context budget/i);
  });

  it('shows every harness and editor, with a CC0 mark or a wordmark', () => {
    renderAt('/');
    const tiles = screen.getAllByTestId('agent-tile');
    expect(tiles.map((t) => t.textContent)).toEqual(TOOLS.map((t) => t.name));
    for (const name of ['Claude Code', 'Codex', 'Cursor', 'VS Code Copilot', 'Zed', 'JetBrains', 'T3 Code']) {
      expect(tiles.some((t) => t.textContent === name)).toBe(true);
    }
    for (const tool of TOOLS) {
      const tile = tiles.find((t) => t.textContent === tool.name);
      expect(Boolean(tile.querySelector('svg')), tool.name).toBe(Boolean(tool.mark));
    }
  });

  it('copies the connect prompt from the hero and from the copy line, without linking setup.md yet', async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.assign(navigator, { clipboard: { writeText } });
    const { container } = renderAt('/');
    expect(CONNECT_PROMPT).toContain('https://logicpacks.io/setup.md');
    // The prompt is several lines; the copy line shows it as one (truncated) code line.
    expect(screen.getByText((_, element) => element?.tagName === 'CODE' && element.textContent === CONNECT_PROMPT)).toBeInTheDocument();
    expect(container.querySelector('a[href*="setup.md"]')).toBeNull();
    fireEvent.click(screen.getAllByRole('button', { name: 'Connect your agent' })[0]);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(CONNECT_PROMPT));
    expect(await screen.findByText(/Paste it into Claude Code/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy the connect prompt' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
  });

  it('keeps user-facing copy free of em dashes on every page', () => {
    for (const path of ['/', '/new', '/download']) {
      const { container, unmount } = renderAt(path);
      expect(container.textContent, path).not.toMatch(/—/);
      expect(container.textContent, path).not.toMatch(/enterprise/i);
      unmount();
    }
  });

  it('sends unknown routes home', () => {
    renderAt('/store');
    expect(screen.getByRole('heading', { level: 1, name: 'Agents and people, one workspace.' })).toBeInTheDocument();
  });
});

describe("What's new", () => {
  it('lists Request assistance with eight sample experts, then every-app', () => {
    renderAt('/new');
    expect(screen.getByRole('heading', { level: 1, name: /What’s new\./ })).toBeInTheDocument();
    const entries = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(entries[0]).toMatch(/^Request assistance\. When an agent is not enough, add an expert who gets it done for you\./);
    expect(entries[1]).toMatch(/^Every app, every agent, one machine\./);
    expect(screen.getAllByText('Beta').length).toBe(2);
    for (const title of ['A curated panel', 'Your own subscription', 'Delegate to a human']) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
    const cards = screen.queryAllByTestId('expert-card');
    expect(cards).toHaveLength(EXPERT_PORTRAITS_READY ? 8 : 0);
    if (!EXPERT_PORTRAITS_READY) return;
    for (const role of ['Blender artist', 'DaVinci colourist', 'Frontend engineer', 'Backend engineer', 'DevOps engineer', 'Motion designer', 'AI/ML engineer', 'QA engineer']) {
      expect(screen.getByText(role)).toBeInTheDocument();
    }
    for (const card of cards) {
      expect(card.querySelector('img').getAttribute('src')).toMatch(/^\/experts\/[a-z-]+\.webp$/);
      expect(card).toHaveTextContent('View profile');
    }
    expect(screen.getByText('Sample experts. Portraits are illustrative.')).toBeInTheDocument();
  });

  it('redirects /releases to /new', () => {
    renderAt('/releases');
    expect(screen.getByRole('heading', { name: /Request assistance\./ })).toBeInTheDocument();
  });
});
