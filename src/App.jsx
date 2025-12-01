import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { SearchProvider } from './context/SearchContext';

// Lazy load heavy components
const ThreeBackground = lazy(() => import('./components/ThreeBackground'));
const WallpaperGrid = lazy(() => import('./components/WallpaperGrid'));
const FeaturedCollections = lazy(() => import('./components/FeaturedCollections'));
const Favorites = lazy(() => import('./components/Favorites'));
const Desktop = lazy(() => import('./components/Desktop'));

// Loading fallback
const PageLoader = () => (
  <div style={{
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--primary-color)'
  }}>
    <div className="loader">Loading...</div>
  </div>
);

function App() {
  const [currentView, setCurrentView] = React.useState('home');

  return (
    <ErrorBoundary>
      <SearchProvider>
        <div className="app">
          <Helmet>
            <title>AniSphere - Anime Wallpapers</title>
            <meta name="description" content="Discover and download high-quality anime wallpapers. AniSphere offers a vast collection of stunning anime backgrounds for your devices." />
          </Helmet>
          <Suspense fallback={<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: 'var(--bg-color)' }} />}>
            <ThreeBackground />
          </Suspense>
          <Header onNavigate={setCurrentView} />
          <main>
            {currentView === 'home' ? (
              <>
                <Hero />
                <Suspense fallback={<PageLoader />}>
                  <FeaturedCollections />
                  <WallpaperGrid />
                </Suspense>
              </>
            ) : currentView === 'favorites' ? (
              <Suspense fallback={<PageLoader />}>
                <Favorites />
              </Suspense>
            ) : currentView === 'desktop' ? (
              <Suspense fallback={<PageLoader />}>
                <Desktop />
              </Suspense>
            ) : null}
          </main>
          <ScrollToTop />
          <Footer />
        </div>
      </SearchProvider>
    </ErrorBoundary>
  );
}

export default App;
