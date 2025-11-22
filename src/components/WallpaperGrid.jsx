import React, { useState, useEffect } from 'react';
import WallpaperCard from './WallpaperCard';
import FilterBar from './FilterBar';
import DetailModal from './DetailModal';

function WallpaperGrid() {
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>Loading wallpapers...</div>;
    if (error) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

    return (
        <section className="container" style={{ padding: '4rem 20px' }}>
            <h2 className="neon-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Trending Wallpapers</h2>

            <FilterBar />

            <div className="wallpaper-grid">
                {wallpapers.map(wp => (
                    <WallpaperCard key={wp.id} wallpaper={wp} onClick={setSelectedWallpaper} />
                ))}
            </div>
            <style>{`
                .wallpaper-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                }
                @media (max-width: 768px) {
                    .wallpaper-grid {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* Smaller cards on mobile */
                        gap: 15px;
                    }
                    .container { padding: 2rem 15px !important; }
                }
            `}</style>

            <DetailModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
        </section>
    );
}

export default WallpaperGrid;
