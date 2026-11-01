import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Download from './pages/Download';
import Landing from './pages/Landing';
import WhatsNew from './pages/WhatsNew';
import { Privacy, Terms } from './pages/Legal';
import Pricing from './pages/Pricing';
import Research from './pages/Research';
import Story from './pages/Story';
import V2 from './pages/V2';

const TITLES = {
  '/': 'LogicPacks by TechRealm: people and AI agents in one workspace',
  '/download': 'Download LogicPacks',
  '/new': 'What\'s new in LogicPacks',
  '/privacy': 'Privacy · LogicPacks by TechRealm',
  '/terms': 'Terms · LogicPacks by TechRealm',
  '/pricing': 'Pricing · LogicPacks by TechRealm',
  '/research': 'Research · LogicPacks by TechRealm',
  '/story': 'Our story · LogicPacks by TechRealm',
  '/v2': 'The best way for teams and AI agents to work together · LogicPacks by TechRealm',
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
  // /v2 is the quiet landing being compared with /: its own header and footer.
  if (useLocation().pathname === '/v2') return <V2 />;
  return (
    <div className="min-h-screen overflow-x-clip bg-page text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-page"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="pt-[72px]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/download" element={<Download />} />
          <Route path="/new" element={<WhatsNew />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/research" element={<Research />} />
          <Route path="/story" element={<Story />} />
          <Route path="/about" element={<Navigate to="/story" replace />} />
          <Route path="/releases" element={<Navigate to="/new" replace />} />
          <Route path="/whats-new" element={<Navigate to="/new" replace />} />
          {/* The old marketplace routes are gone; send any deep link home. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
