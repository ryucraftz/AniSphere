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
            setLoading(false);
        }
    };

    // Filter wallpapers by aspect ratio (landscape for desktop)
    const desktopWallpapers = useMemo(() => {
        const filtered = wallpapers.filter(wp => {
            // First check: exclude based on title keywords
            const title = wp.title?.toLowerCase() || '';
            if (title.includes('mobile') || title.includes('phone') || title.includes('vertical') || title.includes('portrait')) {
                return false;
            }

            // Second check: if resolution data exists, use it
            if (wp.resolution && wp.resolution !== 'Unknown' && wp.resolution.includes('x')) {
                const parts = wp.resolution.toLowerCase().split('x');
                if (parts.length === 2) {
                    const width = parseInt(parts[0].trim());
                    const height = parseInt(parts[1].trim());
                    if (!isNaN(width) && !isNaN(height) && height > 0) {
                        const aspectRatio = width / height;
                        // Desktop wallpapers: landscape (aspect ratio > 1)
                        // Typically 16:9 (1.78), 16:10 (1.6), 21:9 (2.33)
                        // Exclude portrait: 9:16 (0.56), 10:16 (0.625)
                        return aspectRatio > 1.0;
                    }
                }
            }

            // If no resolution data, default to EXCLUDE to be safe
            // This prevents showing unknown aspect ratio images
            return false;
        });

        console.log(`Desktop filter: ${filtered.length} of ${wallpapers.length} wallpapers (landscape only)`);
        return filtered;
    }, [wallpapers]);

    if (loading) {
        return (
            <section id="desktop" className="container" style={{ padding: '6rem 20px 4rem', minHeight: '80vh' }}>
                <div className="loading-skeleton">
                    <p>Loading desktop wallpapers...</p>
                </div>
            </section>
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
                    border: '1px solid var(--glass-border)'
                }}>
                    {desktopWallpapers.length}
                </span>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Wallpapers optimized for desktop screens (excluding vertical/mobile formats)
            </p>

            {desktopWallpapers.length === 0 ? (
                <div className="empty-state">
                    <Monitor size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No desktop wallpapers found</p>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
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
        </section>
    );
}

export default Desktop;
