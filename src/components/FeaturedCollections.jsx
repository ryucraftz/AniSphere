import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLLECTIONS } from '../data/mockData';
import ScrollScene from './ScrollScene';
import { useSearch } from '../context/SearchContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function FeaturedCollections() {
    const { setSelectedCollection, setSearchQuery } = useSearch();
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // -10 buffer
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const handleCollectionClick = (collection) => {
        // Allow One Piece and Wuthering Waves collections
        if (collection.id === 1 || collection.id === 2) {
            setSelectedCollection(collection);
            setSearchQuery(''); // Clear search when selecting collection
            // Scroll to wallpapers section
            document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const buttonStyle = {
        padding: '10px',
        borderRadius: '50%',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        transition: 'all 0.2s',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
    };

    return (
        <section id="collections" className="container" style={{ padding: '4rem 20px', position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0, top: -50, width: '300px', height: '300px', zIndex: 0 }}>
                <ScrollScene />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                <h2 className="neon-text" style={{ fontSize: '2rem', margin: 0 }}>Featured Collections</h2>
                <div className="scroll-buttons" style={{ display: 'flex', gap: '10px' }}>
                    <AnimatePresence>
                        {canScrollLeft && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={scrollLeft}
                                className="glass"
                                style={buttonStyle}
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={24} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <motion.button
                        animate={{ opacity: canScrollRight ? 1 : 0.5, pointerEvents: canScrollRight ? 'auto' : 'none' }}
                        onClick={scrollRight}
                        className="glass"
                        style={buttonStyle}
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </motion.button>
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="collections-scroll"
                style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', position: 'relative', zIndex: 1, scrollBehavior: 'smooth' }}
            >
                {COLLECTIONS.map(col => (
                    <motion.div
                        key={col.id}
                        className="glass collection-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleCollectionClick(col)}
                        style={{
                            minWidth: '300px',
                            height: '200px',
                            borderRadius: '15px',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: (col.id === 1 || col.id === 2) ? 'pointer' : 'default',
                            flexShrink: 0,
                            opacity: (col.id === 1 || col.id === 2) ? 1 : 0.7
                        }}
                    >
                        <img src={col.image} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                        {(col.id !== 1 && col.id !== 2) && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(255, 110, 199, 0.8)',
                                color: '#fff',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                backdropFilter: 'blur(5px)',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                            }}>
                                Coming Soon
                            </div>
                        )}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            padding: '1.5rem',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>{col.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>
            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                .collections-scroll::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .collections-scroll {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                @media (max-width: 768px) {
                    .collection-card {
                        min-width: 250px !important;
                        height: 160px !important;
                    }
                    .container { padding: 2rem 15px !important; }
                    .scroll-buttons { display: none !important; }
                }
            `}</style>
        </section>
    );
}

export default FeaturedCollections;
