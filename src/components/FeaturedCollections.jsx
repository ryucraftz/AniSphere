import React from 'react';
import { motion } from 'framer-motion';
import { COLLECTIONS } from '../data/mockData';
import ScrollScene from './ScrollScene';
import { useSearch } from '../context/SearchContext';

function FeaturedCollections() {
    const { setSelectedCollection, setSearchQuery } = useSearch();

    const handleCollectionClick = (collection) => {
        // Only allow One Piece collection for now
        if (collection.id === 1) {
            setSelectedCollection(collection);
            setSearchQuery(''); // Clear search when selecting collection
            // Scroll to wallpapers section
            document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="container" style={{ padding: '4rem 20px', position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0, top: -50, width: '300px', height: '300px', zIndex: 0 }}>
                <ScrollScene />
            </div>
            <h2 className="neon-text" style={{ fontSize: '2rem', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>Featured Collections</h2>
            <div className="collections-scroll" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', position: 'relative', zIndex: 1 }}>
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
                            cursor: col.id === 1 ? 'pointer' : 'default',
                            flexShrink: 0,
                            opacity: col.id === 1 ? 1 : 0.7
                        }}
                    >
                        <img src={col.image} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                        {col.id !== 1 && (
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
                }
            `}</style>
        </section>
    );
}

export default FeaturedCollections;
