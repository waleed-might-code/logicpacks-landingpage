import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure the DOM and any per-test storage is reset between tests so state
// (e.g. the AccessGate's sessionStorage flag) never leaks across cases.
afterEach(() => {
  cleanup();
  sessionStorage.clear();
  localStorage.clear();
});
