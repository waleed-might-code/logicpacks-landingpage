import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { BetaProvider } from './components/BetaModal';
import AccessGate from './components/AccessGate';

// Route-level code splitting — each page loads on demand so the first paint
// isn't blocked on the whole marketplace + Three.js hero downloading up front.
const HomeRouter = lazy(() => import('./pages/HomeRouter'));
const CLI = lazy(() => import('./pages/CLI'));
const Store = lazy(() => import('./pages/Store'));
const PackDetail = lazy(() => import('./pages/PackDetail'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Ventures = lazy(() => import('./pages/Ventures'));
const Founders = lazy(() => import('./pages/Founders'));
const Investors = lazy(() => import('./pages/Investors'));
const Ambassadors = lazy(() => import('./pages/Ambassadors'));
const Courses = lazy(() => import('./pages/Courses'));
const BetaAccess = lazy(() => import('./pages/BetaAccess'));
const AmbassadorApply = lazy(() => import('./pages/AmbassadorApply'));
const Payments = lazy(() => import('./pages/Payments'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="h-6 w-6 rounded-full border-2 border-white/10 border-t-green-500 animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AccessGate>
      <BetaProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomeRouter />} />
              <Route path="/cli" element={<CLI />} />
              <Route path="/store" element={<Store />} />
              <Route path="/pack/:slug" element={<PackDetail />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/ventures" element={<Ventures />} />
              <Route path="/founders" element={<Founders />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/ambassadors" element={<Ambassadors />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/beta" element={<BetaAccess />} />
              <Route path="/ambassador-apply" element={<AmbassadorApply />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BetaProvider>
    </AccessGate>
  );
}
