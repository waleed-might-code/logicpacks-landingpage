import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App';
import { AGENT_PROMPT } from '../../src/site';

function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('Landing', () => {
  it('leads with the positioning line', () => {
    renderAt('/');
    expect(
      screen.getByRole('heading', { level: 1, name: /The best place for agents and humans to work together\./ }),
    ).toBeInTheDocument();
  });

  it('sends every "Download for Mac" button to /download', () => {
    renderAt('/');
    const links = screen.getAllByRole('link', { name: /Download for Mac/ });
    expect(links.length).toBeGreaterThanOrEqual(2);
    links.forEach((link) => expect(link).toHaveAttribute('href', '/download'));
  });

  it('has the three cards, the sync section and the Beta every-app section', () => {
    renderAt('/');
    for (const name of ['Code together', 'Any app, with recipes', 'Invite with one link']) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: /Sync to the cloud\./ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Every app, every agent, one machine\./ })).toBeInTheDocument();
  });

  it('labels unreleased work Beta and never says Coming soon', () => {
    const { container } = renderAt('/');
    expect(container.textContent).not.toMatch(/coming soon/i);
    // The any-app card plus the every-app, assistance, context and packs sections.
    expect(screen.getAllByText('Beta').length).toBeGreaterThanOrEqual(5);
  });

  it('has the agents, assistance, context and packs sections', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /Works with your agents\./ })).toBeInTheDocument();
    for (const name of ['Claude Code', 'Codex', 'OpenCode', 'Gemini CLI']) {
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
    }
    expect(screen.getByText('Bring your own subscription. Share it with your team.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Request assistance\./ })).toBeInTheDocument();
    for (const title of ['A curated panel', 'Your own subscription', 'Delegate to a human']) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: /Pack context across apps\./ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Never fine-tune a model\. Use a pack instead\./ })).toBeInTheDocument();
  });

  it('tells the work-together story without calling it enterprise', () => {
    const { container } = renderAt('/');
    expect(screen.getByRole('heading', { name: /See exactly what everyone is doing\./ })).toBeInTheDocument();
    for (const title of ['Follow any thread', 'Save it as a recipe', 'Share your subscription']) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
    expect(container.textContent).not.toMatch(/enterprise/i);
    expect(container.textContent).not.toMatch(/swipe up/i);
  });

  it('copies the agent prompt and says so', async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.assign(navigator, { clipboard: { writeText } });
    renderAt('/');
    fireEvent.click(screen.getAllByRole('button', { name: /Install with your agent/ })[0]);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(AGENT_PROMPT));
    expect(await screen.findByText(/Paste it into Claude Code/)).toBeInTheDocument();
  });

  it('shows the paste-in prompt under the "In your agent" tab', () => {
    renderAt('/');
    fireEvent.click(screen.getByRole('tab', { name: 'In your agent' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Install LogicPacks on this Mac');
  });

  it('keeps user-facing copy free of em dashes', () => {
    const { container } = renderAt('/');
    expect(container.textContent).not.toMatch(/—/);
  });

  it('sends unknown routes home', () => {
    renderAt('/store');
    expect(screen.getByRole('heading', { level: 1, name: /work together/ })).toBeInTheDocument();
  });
});
