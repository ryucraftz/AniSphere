import React, { useState, useEffect, useMemo } from 'react';
import WallpaperCard from './WallpaperCard';
import FilterBar from './FilterBar';
import DetailModal from './DetailModal';
import { useSearch } from '../context/SearchContext';

function WallpaperGrid() {
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { searchQuery } = useSearch();

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

    // Filter wallpapers based on search query
    const filteredWallpapers = useMemo(() => {
        if (!searchQuery.trim()) {
            return wallpapers;
        }

        const query = searchQuery.toLowerCase();
        return wallpapers.filter(wp => {
            // Search in title
            const titleMatch = wp.title?.toLowerCase().includes(query);

            // Search in filename/id (supports subword matching)
            const filenameMatch = wp.id?.toLowerCase().includes(query);

            return titleMatch || filenameMatch;
        });
    }, [wallpapers, searchQuery]);

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-color)' }}>Loading wallpapers...</div>;
    if (error) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

    return (
        <section id="trending" className="container" style={{ padding: '4rem 20px' }}>
            <h2 className="neon-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Wallpapers'}
            </h2>

            <FilterBar />

            {filteredWallpapers.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'var(--text-muted)'
                }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No wallpapers found</p>
                    <p style={{ fontSize: '1rem' }}>Try a different search term</p>
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
