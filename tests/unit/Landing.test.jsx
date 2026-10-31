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

  it('has the three cards, the sync section and the coming-soon section', () => {
    renderAt('/');
    for (const name of ['Code together', 'Any app, with recipes', 'Invite with one link']) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: /Sync to the cloud\./ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Every app, every agent, one machine\./ })).toBeInTheDocument();
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
