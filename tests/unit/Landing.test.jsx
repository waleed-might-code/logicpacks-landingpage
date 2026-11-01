import { BENCHMARKS } from '../../src/components/Trust';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App';
import { RunningAt } from '../../src/pages/Landing';
import { CONNECT_PROMPT, EXPERT_PORTRAITS_READY, HAS_SETUP, TOOLS } from '../../src/site';

function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('Landing', () => {
  it('leads with the positioning line, the two buttons, the install line and the launch film', () => {
    renderAt('/');
    expect(
      screen.getByRole('heading', { level: 1, name: /Agents and people, one workspace\./ }),
    ).toBeInTheDocument();
    const downloads = screen.getAllByRole('link', { name: /Download for Mac/ });
    expect(downloads.length).toBeGreaterThanOrEqual(2);
    downloads.forEach((link) => expect(link).toHaveAttribute('href', '/download'));
    expect(screen.getAllByRole('button', { name: 'Connect your agent' }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/curl -fsSL https:\/\/logicpacks\.io\/install\.sh/)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'In LogicPacks' })).toHaveAttribute('aria-selected', 'true');
  });

  it('shows the paste-in install prompt under the "In your agent" tab', () => {
    renderAt('/');
    fireEvent.click(screen.getByRole('tab', { name: 'In your agent' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Install LogicPacks on this Mac');
  });

  it('has the nav in order: What’s new, Docs, Download, Sign in', () => {
    renderAt('/');
    const nav = within(screen.getByRole('navigation', { name: 'Main' }));
    const names = nav.getAllByRole('link').map((a) => a.textContent);
    expect(names).toEqual(['LogicPacks', 'What’s new', 'Pricing', 'Docs', 'Download', 'Sign in']);
    // Motion backgrounds: the launch band and the closing line.
    expect(document.querySelectorAll('[data-testid="motion-bg"]')).toHaveLength(2);
    expect(nav.getByRole('link', { name: 'What’s new' })).toHaveAttribute('href', '/new');
  });

  it('has the every-app demo, three rows and a closing line, nothing else', () => {
    renderAt('/');
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual([
      'Work together.',
      'How it compares. Built only for people and agents working together.',
      'Every app, every agent, one machine. People and agents share the host’s apps, from Blender to DaVinci Resolve.',
      'Delegate with guardrails.',
      'Works with your agent.',
      'Where it runs.',
      'Developed by TechRealm. Operated by Al Jash Trading, Abu Dhabi. Since 1994.Try it on your next project.',
    ]);
    expect(screen.getByRole('link', { name: 'Start a shared project' })).toHaveAttribute('href', 'https://app.logicpacks.io');
    expect(screen.getByRole('link', { name: 'Plan a goal' })).toBeInTheDocument();
    expect(screen.getByTestId('goal-diagram')).toHaveTextContent('Drifting');
    expect(screen.getByText(/or an outside team/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /See what’s new/ })).toHaveAttribute('href', '/new');
  });

  it('keeps Request assistance, every-app and expert cards off the main page', () => {
    const { container } = renderAt('/');
    expect(container.textContent).not.toMatch(/Request assistance|Pack context/);
    for (const title of ['The same machine', 'A cursor for everyone', 'Snapshots that merge back']) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
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

  it('copies the connect prompt from the hero and from the copy line; Docs is setup.md once it ships', async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.assign(navigator, { clipboard: { writeText } });
    const { container } = renderAt('/');
    expect(CONNECT_PROMPT).toContain('https://logicpacks.io/setup.md');
    // The prompt is several lines; the copy line shows it as one (truncated) code line.
    expect(screen.getByText((_, element) => element?.tagName === 'CODE' && element.textContent === CONNECT_PROMPT)).toBeInTheDocument();
    const docs = within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Docs' });
    expect(docs).toHaveAttribute('href', HAS_SETUP ? '/setup.md' : 'https://github.com/Majboor/t3code/tree/main/docs');
    if (!HAS_SETUP) expect(container.querySelector('a[href*="setup.md"]')).toBeNull();
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
    expect(screen.getByRole('heading', { level: 1, name: /one workspace/ })).toBeInTheDocument();
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

describe('Trust details', () => {
  it('names the operator in the footer, with privacy, terms and WhatsApp', () => {
    renderAt('/');
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent(/© \d{4} LogicPacks by Al Jash Trading, Abu Dhabi, UAE/);
    expect(within(footer).getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    expect(within(footer).getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
    expect(within(footer).getByRole('link', { name: 'WhatsApp +1 713 632 2262' })).toHaveAttribute('href', 'https://wa.me/17136322262');
    expect(footer.textContent).not.toMatch(/Waleed/i);
  });

  it('explains where it runs: your machine or our sandbox cloud', () => {
    renderAt('/');
    const where = screen.getByRole('heading', { name: 'Where it runs.' }).closest('section');
    expect(where).toHaveTextContent('Your machine');
    expect(where).toHaveTextContent('your login stays on your machine');
    expect(where).toHaveTextContent('Our sandbox cloud');
    expect(where).toHaveTextContent('isolated sandbox user, with no access to the host or to other members');
  });

  it('renders the privacy policy with what we store, what we never store, deletion and the operator', () => {
    const { container } = renderAt('/privacy');
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy' })).toBeInTheDocument();
    for (const text of ['Al Jash Trading (Establishment), Abu Dhabi, UAE', 'CN-1030597', 'Office 5, Bani Yas West 4', 'What we store', 'never store or proxy model API keys', 'isolated sandbox user', 'delete your account', 'Effective 1 November 2026']) {
      expect(container.textContent).toContain(text);
    }
    expect(container.textContent).not.toMatch(/—|Waleed/);
  });

  it('renders the terms with the beta disclaimer and UAE law', () => {
    const { container } = renderAt('/terms');
    expect(screen.getByRole('heading', { level: 1, name: 'Terms' })).toBeInTheDocument();
    for (const text of ['Al Jash Trading (Establishment), Abu Dhabi, UAE', 'CN-1030597', 'Features labelled Beta', 'laws of the United Arab Emirates', 'courts of Abu Dhabi']) {
      expect(container.textContent).toContain(text);
    }
    expect(container.textContent).not.toMatch(/—|Waleed/);
  });

  it('keeps the brand strip off the human page, behind its flag', () => {
    const { container } = renderAt('/');
    expect(screen.queryByRole('region', { name: /Brands we/ })).toBeNull();
    expect(container.querySelector('img[src^="/brands/"]')).toBeNull();
    expect(container.textContent).not.toMatch(/Bank Muscat|Toshiba|Running at|Your team|small team|Aljash/);
  });

  it('labels the connect prompt as text to paste into your own agent', () => {
    renderAt('/');
    expect(screen.getByText('Paste this into your agent:')).toBeInTheDocument();
    expect(document.querySelector('[data-agent-prompt="true"]')).toHaveTextContent('setup.md');
  });

  it('footer links the company site with the licence and address', () => {
    renderAt('/');
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Al Jash Trading' })).toHaveAttribute('href', 'https://aljashtrading.com');
    expect(footer).toHaveTextContent('CN-1030597');
    expect(footer).toHaveTextContent('Office 5, Bani Yas West 4, Bani Yas, Abu Dhabi, UAE');
  });
});

describe('Story, research and pricing', () => {
  it('main page only hints at story, research, pricing and what is new, one line each', () => {
    const { container } = renderAt('/');
    const hints = screen.getAllByTestId('hint');
    expect(hints.map((h) => h.getAttribute('href'))).toEqual(['/story', '/research', '/pricing', '/new']);
    expect(container.textContent).not.toMatch(/testimonial|Virtual sizing|Benchmark running|\$99|access code|waitlist|invite-only/i);
    expect(screen.getByText(/freelancer vetted by LogicPacks/)).toBeInTheDocument();
  });

  it('/story lists the shipped launches', () => {
    renderAt('/story');
    const shipped = screen.getAllByTestId('shipped-card').map((c) => c.textContent);
    for (const name of ['Virtual sizing', 'Virtual try-on', 'Reform', 'TAAS']) {
      expect(shipped.some((t) => t.includes(name))).toBe(true);
    }
  });

  it('/story tells the timeline as a team and never names a founder', () => {
    const { container } = renderAt('/story');
    expect(screen.getByRole('heading', { level: 1, name: /Our story\./ })).toBeInTheDocument();
    for (const when of ['Nov 2025', 'Jan 2026', 'Feb to Oct 2026', 'Nov 2026']) expect(container.textContent).toContain(when);
    expect(container.textContent).toContain('TechRealm');
    expect(container.textContent).not.toMatch(/Waleed|founder/i);
  });

  it('/research shows measured numbers and "Benchmark running" for the rest, never invented values', () => {
    renderAt('/research');
    const bench = screen.getAllByTestId('benchmark').map((r) => r.textContent);
    const metrics = BENCHMARKS.streaming.flatMap((s) => s.metrics);
    expect(bench.length).toBe(metrics.length);
    // Each row shows exactly its measured value from research/benchmarks.json, or "Benchmark running".
    metrics.forEach((m, i) => expect(bench[i]).toContain(m.value == null ? 'Benchmark running' : `${m.value} ${m.unit}`));
    // Every run is listed with its note (e.g. JPEG rows measured before the queue fix), viewer on the same Mac.
    const runs = screen.getAllByTestId('benchmark-run').map((r) => r.textContent);
    expect(runs.length).toBe(BENCHMARKS.runs.length);
    expect(runs.some((t) => t.includes('Measured before the relay queue fix'))).toBe(true);
    expect(document.body.textContent).toContain('viewer on the same Mac');
    expect(screen.getAllByTestId('suite')[0]).toHaveTextContent('9/9 passed');
    expect(screen.getAllByTestId('security-check').some((r) => r.textContent.includes('Refused (401)'))).toBe(true);
  });

  it('/pricing: Individuals free, Enterprise $99 a month with coming-soon features', () => {
    renderAt('/pricing');
    const plans = screen.getAllByTestId('plan');
    expect(plans[0]).toHaveTextContent('Individuals');
    expect(plans[0]).toHaveTextContent('Free');
    expect(plans[1]).toHaveTextContent('Enterprise');
    expect(plans[1]).toHaveTextContent('$99per workspace / month');
    expect(screen.getAllByTestId('coming-soon').length).toBeGreaterThan(0);
    screen.getAllByTestId('coming-soon').forEach((li) => expect(li).toHaveTextContent('Coming soon'));
  });
});
