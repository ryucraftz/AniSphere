import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WallpaperGrid from './components/WallpaperGrid';
import FeaturedCollections from './components/FeaturedCollections';
import Footer from './components/Footer';
import ThreeBackground from './components/ThreeBackground';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <SearchProvider>
      <div className="app">
        <ThreeBackground />
        <Header />
        <main>
          <Hero />
          <FeaturedCollections />
          <WallpaperGrid />
        </main>
        <Footer />
      </div>
    </SearchProvider>
  );
}

export default App;
