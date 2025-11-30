import React from 'react';
import { motion } from 'framer-motion';

function Hero() {
    const scrollToTrending = () => {
        const element = document.getElementById('trending');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section style={{ minHeight: '90vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '80px' }}>
            <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>

                {/* Text Content */}
                <div style={{ flex: 1, maxWidth: '600px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="neon-text" style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: 600 }}>
                            NEXT GEN WALLPAPERS
                        </h2>
                        <h1
                            style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}
                        >
                            Discover <span className="gradient-text-animate">Immersive</span> <br /> Anime Worlds
                        </h1>
                        <p
                            style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.6 }}
                        >
                            Experience anime like never before with our curated collection of high-resolution, cinematic, and 3D wallpapers.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <motion.button
                                className="btn-primary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={scrollToTrending}
                            >
                                Explore Collection
                            </motion.button>
                            <motion.button
                                style={{
                                    padding: '0.8rem 2rem',
                                    borderRadius: '99px',
                                    background: 'transparent',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-color)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                                whileHover={{ scale: 1.05, borderColor: 'var(--primary-color)' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Learn More
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Image (GIF) */}
                <div className="hero-image" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    {/* Background Glow */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(37, 244, 238, 0.2) 0%, transparent 70%)',
                        zIndex: -1,
                        filter: 'blur(50px)'
                    }} />

                    <motion.img
                        src="https://i.giphy.com/Tgvn82bqJT36lkVqDZ.webp"
                        alt="One Piece Luffy"
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            width: '100%',
                            maxWidth: '450px',
                            height: 'auto',
                            borderRadius: '20px',
                            zIndex: 1
                        }}
                        whileHover={{ scale: 1.02, rotate: 2 }}
                    />
                </div>
            </div>

            <style>{`
        /* Mobile Styles */
        @media (max-width: 768px) {
            .container {
                flex-direction: column-reverse !important;
                text-align: center;
            }
            .hero-image {
                margin-bottom: 2rem;
                width: 100%;
            }
            h1 {
                font-size: 2.5rem !important;
            }
            p {
                margin: 0 auto 2rem auto !important;
            }
            div[style*="display: flex; gap: 1rem"] {
                justify-content: center;
            }
        }
      `}</style>
        </section>
    );
}

export default Hero;
