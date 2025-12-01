import React, { useState, useEffect } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useSearch } from '../context/SearchContext';

function Header({ onNavigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();

    // Auto-close search modal on mobile after typing
    useEffect(() => {
        if (searchQuery && isSearchOpen) {
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                const timer = setTimeout(() => {
                    setIsSearchOpen(false);
                }, 800);
                return () => clearTimeout(timer);
            }
        }
    }, [searchQuery, isSearchOpen]);

    const handleNavClick = (item) => {
        if (item === 'Home') {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (item === 'Favorites') {
            onNavigate('favorites');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (item === 'Desktop') {
            onNavigate('desktop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (item === 'Collections') {
            onNavigate('home');
            setTimeout(() => {
                document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else if (item === 'About') {
            onNavigate('home');
            setTimeout(() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
        setIsMenuOpen(false);
    };

    return (
        <header className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '0.3rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', width: '100%', padding: '0 1rem' }}>
                <div
                    className="logo neon-text"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--primary-color)', cursor: 'pointer' }}
                    onClick={() => handleNavClick('Home')}
                >
                    <img src="/Logo.webp" alt="AniSphere Logo" style={{ height: '2rem', width: 'auto' }} />
                    ANI<span style={{ color: 'var(--text-color)' }}>SPHERE</span>
                </div>

                {/* Desktop Nav */}
                <nav className="desktop-nav">
                    <ul style={{ display: 'flex', gap: '2rem' }}>
                        <li className="nav-item">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }}>Home</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Collections'); }}>Collections</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Desktop'); }}>Desktop</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Favorites'); }}>Favorites</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('About'); }}>About</a>
                        </li>
                    </ul>
                </nav>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Search
                        color="var(--text-color)"
                        size={20}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    />
                    <ThemeToggle />
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        {isMenuOpen ? <X color="var(--text-color)" size={24} /> : <Menu color="var(--text-color)" size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: '100vh', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            background: 'rgba(11, 12, 17, 0.95)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 99,
                            paddingTop: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%' }}>
                            {['Home', 'Collections', 'Desktop', 'Favorites', 'About'].map((item) => (
                                <li key={item} className="nav-item" style={{ width: '100%', textAlign: 'center' }}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick(item);
                                        }}
                                        style={{ fontSize: '1.5rem', display: 'block', padding: '1rem' }}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="search-backdrop"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="search-modal"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Search color="var(--primary-color)" size={24} />
                                <input
                                    type="text"
                                    placeholder="Search wallpapers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="search-input"
                                />
                                {searchQuery && (
                                    <X
                                        color="var(--text-muted)"
                                        size={24}
                                        style={{ cursor: 'pointer', minWidth: '24px' }}
                                        onClick={() => setSearchQuery('')}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style>{`
        .nav-item a {
          font-weight: 500;
          transition: color 0.3s;
          font-size: 1.1rem;
        }
        .nav-item a:hover {
          color: var(--primary-color);
          text-shadow: 0 0 5px var(--primary-color);
        }
        
        .search-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 101;
        }
        
        .search-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: var(--bg-color);
            z-index: 102;
            padding: 1.5rem;
            display: flex;
            align-items: flex-start;
            padding-top: 80px;
        }
        
        .search-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text-color);
            font-size: 16px;
            padding: 0.75rem 0;
        }
        
        .desktop-nav { display: none; }
        .mobile-toggle { display: block; }
        header { padding: 0.8rem 0; }
        .logo { font-size: 1.3rem; }
        
        @media (min-width: 768px) {
          .desktop-nav { display: flex; }
          .mobile-toggle { display: none; }
          header { padding: 1rem 0; }
          .logo { font-size: 1.5rem !important; }
          
          .search-backdrop {
              background: transparent;
              backdrop-filter: none;
          }
          
          .search-modal {
              top: 60px;
              left: 50%;
              transform: translateX(-50%);
              width: 90%;
              max-width: 600px;
              height: auto;
              background: var(--glass-bg);
              backdrop-filter: blur(10px);
              border: 1px solid var(--glass-border);
              border-radius: 15px;
              padding: 1.5rem;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
              align-items: center;
              padding-top: 1.5rem;
          }
          
          .search-input {
              font-size: 1.1rem;
              padding: 0.5rem 0;
          }
        }
      `}</style>
        </header>
    );
}

export default Header;
