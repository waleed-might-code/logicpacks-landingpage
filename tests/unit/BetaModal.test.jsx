import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BetaProvider, useBeta } from '../../src/components/BetaModal';

function Consumer() {
  const { openBeta, openBetaModal } = useBeta();
  return (
    <div>
      <button onClick={openBeta}>open beta</button>
      {/* alias exposed by the provider — should be the same handler */}
      <button onClick={openBetaModal}>open alias</button>
    </div>
  );
}

function renderModal() {
  return render(
    <MemoryRouter>
      <BetaProvider>
        <Consumer />
      </BetaProvider>
    </MemoryRouter>
  );
}

describe('BetaModal / BetaProvider', () => {
  it('does not show the modal until opened', () => {
    renderModal();
    expect(screen.queryByText('Logic Packs is in beta.')).not.toBeInTheDocument();
  });

  it('opens the modal when openBeta is called', () => {
    renderModal();
    fireEvent.click(screen.getByText('open beta'));
    expect(screen.getByText('Logic Packs is in beta.')).toBeInTheDocument();
    expect(screen.getByText('Apply for Beta Access')).toBeInTheDocument();
    expect(screen.getByText('Apply as Ambassador')).toBeInTheDocument();
  });

  it('exposes openBetaModal as an alias that also opens the modal', () => {
    renderModal();
    fireEvent.click(screen.getByText('open alias'));
    expect(screen.getByText('Logic Packs is in beta.')).toBeInTheDocument();
  });

  it('locks body scroll while open and restores it on close', () => {
    renderModal();
    expect(document.body.style.overflow).toBe('');

    fireEvent.click(screen.getByText('open beta'));
    expect(document.body.style.overflow).toBe('hidden');

    // Close via the backdrop (first element with the fixed overlay).
    fireEvent.click(screen.getByText('Logic Packs is in beta.').closest('.relative').previousSibling);
    expect(screen.queryByText('Logic Packs is in beta.')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('beta CTAs link to the right routes', () => {
    renderModal();
    fireEvent.click(screen.getByText('open beta'));
    expect(screen.getByText('Apply for Beta Access').closest('a')).toHaveAttribute('href', '/beta');
    expect(screen.getByText('Apply as Ambassador').closest('a')).toHaveAttribute('href', '/ambassador-apply');
  });
});
