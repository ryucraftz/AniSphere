import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            zIndex: 100,
            padding: '0.5rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap' }}>
                <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    AniSphere
                </div>

                {/* Desktop Nav */}
                <nav className="desktop-nav">
                    <ul style={{ display: 'flex', gap: '2rem' }}>
                        <li className="nav-item"><a href="#">Home</a></li>
                        <li className="nav-item"><a href="#">Categories</a></li>
                        <li className="nav-item"><a href="#">3D Wallpapers</a></li>
                        <li className="nav-item"><a href="#">Collections</a></li>
                        <li className="nav-item"><a href="#">About</a></li>
                    </ul>
                </nav>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Search color="var(--text-color)" size={20} style={{ cursor: 'pointer' }} />
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
                            background: '#0b0c11',
                            zIndex: 99,
                            paddingTop: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%' }}>
                            {['Home', 'Categories', '3D Wallpapers', 'Collections', 'About'].map((item) => (
                                <li key={item} className="nav-item" style={{ width: '100%', textAlign: 'center' }}>
                                    <a
                                        href="#"
                                        onClick={() => setIsMenuOpen(false)}
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
        
        /* Mobile First Styles */
        .desktop-nav { display: none; }
        .mobile-toggle { display: block; }
        header { padding: 0.8rem 0; }
        .logo { font-size: 1.3rem; }
        
        /* Desktop Styles */
        @media (min-width: 768px) {
          .desktop-nav { display: flex; }
          .mobile-toggle { display: none; }
          header { padding: 1rem 0; }
          .logo { font-size: 1.5rem; }
        }
      `}</style>
        </header>
    );
}

export default Header;
