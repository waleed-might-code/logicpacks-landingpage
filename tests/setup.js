import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom does not implement scrolling; the app resets scroll on every route.
window.scrollTo = () => {};

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  localStorage.clear();
});
