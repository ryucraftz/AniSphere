import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '1rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    <Search color="white" size={20} style={{ cursor: 'pointer' }} />
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        {isMenuOpen ? <X color="white" size={24} /> : <Menu color="white" size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', background: 'rgba(19, 20, 28, 0.95)', backdropFilter: 'blur(10px)' }}
                    >
                        <ul style={{ display: 'flex', flexDirection: 'column', padding: '2rem', gap: '1.5rem', alignItems: 'center' }}>
                            <li className="nav-item"><a href="#" onClick={() => setIsMenuOpen(false)}>Home</a></li>
                            <li className="nav-item"><a href="#" onClick={() => setIsMenuOpen(false)}>Categories</a></li>
                            <li className="nav-item"><a href="#" onClick={() => setIsMenuOpen(false)}>3D Wallpapers</a></li>
                            <li className="nav-item"><a href="#" onClick={() => setIsMenuOpen(false)}>Collections</a></li>
                            <li className="nav-item"><a href="#" onClick={() => setIsMenuOpen(false)}>About</a></li>
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
        .desktop-nav { display: flex; }
        .mobile-toggle { display: none; }
        
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: block; }
          header { padding: 0.8rem 0 !important; }
          .logo { font-size: 1.3rem !important; }
          .container { padding: 0 1.5rem; }
        }
      `}</style>
        </header>
    );
}

export default Header;
