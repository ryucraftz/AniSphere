import React, { useState, useEffect } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import WallpaperCard from './WallpaperCard';
import DetailModal from './DetailModal';
import GoogleSignInButton from './GoogleSignInButton';
import { Monitor, RefreshCw, Star } from 'lucide-react';

function Desktop() {
    const { isAuthenticated, accessToken } = useGoogleAuth();
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);

    useEffect(() => {
        if (isAuthenticated()) {
            fetchDriveWallpapers();
        }
    }, [isAuthenticated]);

    const fetchDriveWallpapers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/drive-favorites', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Drive favorites');
            }

            const data = await response.json();
            setWallpapers(data);
        } catch (err) {
            console.error('Error fetching Drive favorites:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated()) {
        return (
            <section id="desktop" className="container" style={{ padding: '4rem 20px', minHeight: '60vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Monitor color="var(--primary-color)" size={32} />
                    <h2 className="neon-text" style={{ fontSize: '2rem', margin: 0 }}>
                        Desktop Wallpapers
                    </h2>
                </div>

                <div className="signin-prompt">
                    <Star size={64} className="floating-icon" style={{ marginBottom: '1.5rem', opacity: 0.7 }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Sign in to access your starred wallpapers
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px' }}>
                        Connect your Google account to view images you've starred in Google Drive as desktop wallpapers.
                    </p>
                    <GoogleSignInButton />
                </div>
            </section>
        );
    }

    return (
        <section id="desktop" className="container" style={{ padding: '4rem 20px', minHeight: '60vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Monitor color="var(--primary-color)" size={32} />
                    <h2 className="neon-text" style={{ fontSize: '2rem', margin: 0 }}>
                        Desktop Wallpapers
                    </h2>
                    <span style={{
                        background: 'var(--glass-bg)',
                        padding: '0.2rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        border: '1px solid var(--glass-border)'
                    }}>
                        {wallpapers.length}
                    </span>
                </div>
                <button
                    className="btn-refresh"
                    onClick={fetchDriveWallpapers}
                    disabled={loading}
                >
                    <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                    Refresh
                </button>
            </div>

            {loading && wallpapers.length === 0 ? (
                <div className="loading-skeleton">
                    <p>Loading your starred wallpapers...</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Failed to load wallpapers</p>
                    <p style={{ color: 'var(--text-muted)' }}>{error}</p>
                    <button className="btn-primary" onClick={fetchDriveWallpapers} style={{ marginTop: '1rem' }}>
                        Try Again
                    </button>
                </div>
            ) : wallpapers.length === 0 ? (
                <div className="empty-state">
                    <Star size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No starred wallpapers yet</p>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                        Star images in your Google Drive to see them here!
                    </p>
                </div>
            ) : (
                <div className="wallpaper-grid">
                    {wallpapers.map(wp => (
                        <WallpaperCard key={wp.id} wallpaper={wp} onClick={setSelectedWallpaper} />
                    ))}
                </div>
            )}

            <DetailModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
        </section>
    );
}

export default Desktop;
