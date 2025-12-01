import React, { useState, useEffect, useMemo } from 'react';
import WallpaperCard from './WallpaperCard';
import DetailModal from './DetailModal';
import { Monitor } from 'lucide-react';

function Desktop() {
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);

    useEffect(() => {
        fetchWallpapers();
    }, []);

    const fetchWallpapers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/wallpapers');
            const data = await response.json();
            setWallpapers(data);
        } catch (err) {
            console.error('Error fetching wallpapers:', err);
            setError(err.message);
        } finally {
            <p>Loading desktop wallpapers...</p>
                </div >
            </section >
        );
}

if (error) {
    return (
        <section id="desktop" className="container" style={{ padding: '6rem 20px 4rem', minHeight: '80vh' }}>
            <div className="error-message">
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Failed to load wallpapers</p>
                <p style={{ color: 'var(--text-muted)' }}>{error}</p>
                <button className="btn-primary" onClick={fetchWallpapers} style={{ marginTop: '1.5rem' }}>
                    Try Again
                </button>
            </div>
        </section>
    );
}

return (
    <section id="desktop" className="container" style={{ padding: '6rem 20px 4rem', minHeight: '80vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <Monitor color="var(--primary-color)" size={40} />
            <h1 className="neon-text" style={{ fontSize: '2.5rem', margin: 0 }}>
                Desktop Wallpapers
            </h1>
            <span style={{
                background: 'var(--glass-bg)',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '1rem',
                Desktop wallpapers are filtered by landscape aspect ratio
                </p>
    </div>
) : (
    <div className="wallpaper-grid">
        {desktopWallpapers.map(wp => (
            <WallpaperCard key={wp.id} wallpaper={wp} onClick={setSelectedWallpaper} />
        ))}
    </div>
)}

<DetailModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
    </section >
);
}

export default Desktop;
