import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AccessGate from '../../src/components/AccessGate';

const CODE = 'buildanything';

function typeCode(code) {
  const inputs = screen.getAllByRole('textbox');
  expect(inputs).toHaveLength(CODE.length);
  code.split('').forEach((ch, i) => {
    fireEvent.change(inputs[i], { target: { value: ch } });
  });
}

describe('AccessGate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders the gate (not the children) when access has not been granted', () => {
    render(
      <AccessGate>
        <div>protected content</div>
      </AccessGate>
    );
    expect(screen.getByText('Enter Access Code')).toBeInTheDocument();
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(CODE.length);
  });

  it('renders children immediately when sessionStorage already grants access', () => {
    sessionStorage.setItem('lp_access_granted', 'true');
    render(
      <AccessGate>
        <div>protected content</div>
      </AccessGate>
    );
    expect(screen.getByText('protected content')).toBeInTheDocument();
    expect(screen.queryByText('Enter Access Code')).not.toBeInTheDocument();
  });

  it('grants access after the correct code is entered', () => {
    render(
      <AccessGate>
        <div>protected content</div>
      </AccessGate>
    );

    act(() => {
      typeCode(CODE);
    });

    // Reveal animation (13 * 60ms) then a 600ms grant delay.
    act(() => {
      vi.advanceTimersByTime(13 * 60 + 600 + 50);
    });

    expect(sessionStorage.getItem('lp_access_granted')).toBe('true');
    expect(screen.getByText('protected content')).toBeInTheDocument();
  });

  it('accepts the code case-insensitively', () => {
    render(
      <AccessGate>
        <div>protected content</div>
      </AccessGate>
    );
    act(() => typeCode(CODE.toUpperCase()));
    act(() => vi.advanceTimersByTime(13 * 60 + 600 + 50));
    expect(screen.getByText('protected content')).toBeInTheDocument();
  });

  it('rejects a wrong code: shakes, clears inputs, keeps children hidden', () => {
    render(
      <AccessGate>
        <div>protected content</div>
      </AccessGate>
    );

    act(() => typeCode('wrongcodexxxx')); // 13 chars, incorrect

    expect(screen.queryByText('protected content')).not.toBeInTheDocument();

    // After the 500ms shake-and-clear window the inputs reset to empty.
    act(() => vi.advanceTimersByTime(600));
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.every((el) => el.value === '')).toBe(true);
    expect(sessionStorage.getItem('lp_access_granted')).toBeNull();
  });

  it('ignores non-alpha characters on input', () => {
    render(
      <AccessGate>
        <div>protected content</div>
      </AccessGate>
    );
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '5' } });
    expect(inputs[0].value).toBe('');
  });
});
