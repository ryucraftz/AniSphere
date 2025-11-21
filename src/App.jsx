import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WallpaperGrid from './components/WallpaperGrid';
import FeaturedCollections from './components/FeaturedCollections';
import ThreeBackground from './components/ThreeBackground';
import Footer from './components/Footer';

function App() {
  return (
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
  );
}

export default App;
