import React, { useState, useEffect, useMemo } from 'react';
import WallpaperCard from './WallpaperCard';
import FilterBar from './FilterBar';
import DetailModal from './DetailModal';
import { useSearch } from '../context/SearchContext';
import { X } from 'lucide-react';

function WallpaperGrid() {
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { searchQuery, selectedCollection, clearFilters } = useSearch();

    useEffect(() => {
        const fetchWallpapers = async () => {
            try {
                const response = await fetch('/api/wallpapers');
                const data = await response.json();
                setWallpapers(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchWallpapers();
    }, []);

    // Filter wallpapers based on search query and collection
    const filteredWallpapers = useMemo(() => {
        let filtered = wallpapers;

        // Filter by collection
        if (selectedCollection) {
            const collectionKeywords = {
                1: [
                    'one piece', 'kaizoku', 'nakama', 'grand line', 'new world', 'yonko',
                    'devil fruit', 'akuma no mi', 'paramecia', 'zoan', 'logia', 'haki',
                    'kenbunshoku', 'busoshoku', 'haoshoku', 'fish-man', 'gyojin', 'merfolk',
                    'luffy', 'zoro', 'nami', 'usopp', 'sanji', 'chopper', 'robin', 'franky',
                    'brook', 'jimbei', 'jinbe', 'thousand sunny', 'going merry', 'shanks',
                    'whitebeard', 'blackbeard', 'roger', 'ace', 'sabo', 'dressrosa', 'wano',
                    'marineford', 'alabasta', 'skypiea', 'sabaody', 'elbaf', 'mariejois',
                    'enies lobby', 'thriller bark', 'impel down', 'law', 'kid', 'doflamingo',
                    'buggy', 'akainu', 'kizaru', 'aokiji', 'garp', 'sengoku', 'mihawk',
                    'boa hancock', 'crocodile', 'moria', 'cipher pol', 'reverie', 'poneglyph'
                ]
            };

            const keywords = collectionKeywords[selectedCollection.id] || [];
            filtered = filtered.filter(wp => {
                const title = wp.title?.toLowerCase() || '';
                const id = wp.id?.toLowerCase() || '';
                return keywords.some(keyword => title.includes(keyword) || id.includes(keyword));
            });
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(wp => {
                const titleMatch = wp.title?.toLowerCase().includes(query);
                const filenameMatch = wp.id?.toLowerCase().includes(query);
                return titleMatch || filenameMatch;
            });
        }

        return filtered;
    }, [wallpapers, searchQuery, selectedCollection]);

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-color)' }}>Loading wallpapers...</div>;
    if (error) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

    return (
        <section id="trending" className="container" style={{ padding: '4rem 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className="neon-text" style={{ fontSize: '2rem', margin: 0 }}>
                    {selectedCollection
                        ? `${selectedCollection.title} Collection`
                        : searchQuery
                            ? `Search Results for "${searchQuery}"`
                            : 'Trending Wallpapers'
                    }
                </h2>
                {(selectedCollection || searchQuery) && (
                    <button
                        onClick={clearFilters}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            color: 'var(--text-color)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'var(--primary-color)'}
                        onMouseLeave={(e) => e.target.style.background = 'var(--glass-bg)'}
                    >
                        <X size={16} />
                        Clear Filter
                    </button>
                )}
            </div>

            <FilterBar />

            {filteredWallpapers.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'var(--text-muted)'
                }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No wallpapers found</p>
                    <p style={{ fontSize: '1rem' }}>Try a different search term or collection</p>
                </div>
            ) : (
                <div className="wallpaper-grid">
                    {filteredWallpapers.map(wp => (
                        <WallpaperCard key={wp.id} wallpaper={wp} onClick={setSelectedWallpaper} />
                    ))}
                </div>
            )}
            <style>{`
                /* Mobile First Grid */
                .wallpaper-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
                    gap: 12px;
                }
                .container { padding: 2rem 12px; }

                /* Desktop Styles */
                @media (min-width: 768px) {
                    .wallpaper-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 20px;
                    }
                    .container { padding: 4rem 20px; }
                }
            `}</style>

            <DetailModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
        </section>
    );
}

export default WallpaperGrid;
