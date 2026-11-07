import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { EstimateProvider } from './components/EstimateContext';
import { Footer, Header, StickyBar } from './components/Chrome';
import useReveal from './components/useReveal';
import Home from './pages/Home';
import Homes from './pages/Homes';
import Business from './pages/Business';
import Work from './pages/Work';
import About from './pages/About';
import NotFound from './pages/NotFound';

const TITLES = {
  '/': 'Southwest Pro Painting | Homes and businesses in Southwest Minnesota',
  '/homes': 'Home painting | Southwest Pro Painting',
  '/business': 'Business painting | Southwest Pro Painting',
  '/work': 'Our work | Southwest Pro Painting',
  '/about': 'About Ryan | Southwest Pro Painting',
};

function PageEffects() {
  const { pathname, search } = useLocation();
  useReveal();
  useEffect(() => {
    document.title = TITLES[pathname] || 'Page not found | Southwest Pro Painting';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  useEffect(() => {
    // keep the filtered Work view scrolled to the gallery when a filter is applied from the home page
    if (pathname === '/work' && search) {
      requestAnimationFrame(() => document.querySelector('.filters')?.scrollIntoView({ block: 'start' }));
    }
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <EstimateProvider>
      <a className="skip" href="#main">Skip to content</a>
      <PageEffects />
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/homes" element={<Homes />} />
          <Route path="/business" element={<Business />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <StickyBar />
    </EstimateProvider>
  );
}
