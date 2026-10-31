import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Download from './pages/Download';
import Landing from './pages/Landing';
import WhatsNew from './pages/WhatsNew';
import { Privacy, Terms } from './pages/Legal';

const TITLES = {
  '/': 'LogicPacks',
  '/download': 'Download LogicPacks',
  '/new': 'What\'s new in LogicPacks',
  '/privacy': 'Privacy · LogicPacks',
  '/terms': 'Terms · LogicPacks',
};

// Start each page at the top and give it its own tab title.
function useRouteChrome() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] ?? TITLES['/'];
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export default function App() {
  useRouteChrome();
  return (
    <div className="min-h-screen overflow-x-clip bg-page text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-page"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/download" element={<Download />} />
          <Route path="/new" element={<WhatsNew />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/releases" element={<Navigate to="/new" replace />} />
          {/* The old marketplace routes are gone; send any deep link home. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
