import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';
import ScrollProgress from './ScrollProgress';
import BackToTop from './BackToTop';
import AmbientTexture from './AmbientTexture';

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Respect the OS "reduce motion" preference for programmatic scrolling.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (hash) {
      // Delay to allow the page to render before scrolling to anchor
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="overflow-x-hidden">
      {/* Skip link — first focusable element, visible only on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100000] focus:rounded-md focus:bg-green-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>
      <AmbientTexture />
      <ScrollProgress />
      <Header />
      {/* Focus target for the skip link. Kept a plain container (not role=main)
          because the home pages render their own <main> landmark. */}
      <div id="main-content" tabIndex={-1} className="outline-none">
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
