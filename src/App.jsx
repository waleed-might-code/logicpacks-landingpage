import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { BetaProvider } from './components/BetaModal';
import AccessGate from './components/AccessGate';
import HomeRouter from './pages/HomeRouter';
import CLI from './pages/CLI';
import Store from './pages/Store';
import PackDetail from './pages/PackDetail';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Ventures from './pages/Ventures';
import Founders from './pages/Founders';
import Investors from './pages/Investors';
import Ambassadors from './pages/Ambassadors';
import Courses from './pages/Courses';
import BetaAccess from './pages/BetaAccess';
import AmbassadorApply from './pages/AmbassadorApply';

export default function App() {
  return (
    <AccessGate>
      <BetaProvider>
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
          </Route>
        </Routes>
      </BetaProvider>
    </AccessGate>
  );
}

