import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Delay to allow the page to render before scrolling to anchor
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="overflow-x-hidden">
      <Header />
      <ErrorBoundary key={pathname}>
        <Outlet />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

