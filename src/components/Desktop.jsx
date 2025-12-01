import React, { useState, useEffect } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import WallpaperCard from './WallpaperCard';
import DetailModal from './DetailModal';
import GoogleSignInButton from './GoogleSignInButton';
import { Monitor, RefreshCw, Star, LogOut } from 'lucide-react';

function Desktop() {
    const { isAuthenticated, accessToken, logout } = useGoogleAuth();
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
            // Call Google Drive API directly
            const driveResponse = await fetch(
                'https://www.googleapis.com/drive/v3/files?' + new URLSearchParams({
                    q: "starred = true and mimeType contains 'image/' and trashed = false",
                    fields: 'files(id, name, mimeType, description, createdTime, modifiedTime, size, thumbnailLink, webContentLink)',
                    orderBy: 'modifiedTime desc',
                    pageSize: '100',
                }),
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            if (!driveResponse.ok) {
                const errorData = await driveResponse.json();
                console.error('Drive API error:', errorData);
                throw new Error('Failed to fetch Drive files');
            }

            const data = await driveResponse.json();
            const files = data.files || [];

            // Transform to wallpaper format
            const wallpapers = files.map((file) => {
                const tags = file.description ? file.description.split(',').map((t) => t.trim()) : [];
                return {
                    id: file.id,
                    title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                    image: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
                    downloadUrl: file.webContentLink,
                    category: tags[0] || 'Desktop',
                    tags: tags.length > 1 ? tags.slice(1) : ['wallpaper'],
                    resolution: 'Unknown',
                    size: file.size ? `${(parseInt(file.size) / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
                    uploadDate: file.createdTime,
                    source: 'google-drive',
                };
            });

            setWallpapers(wallpapers);
        } catch (err) {
            console.error('Error fetching Drive favorites:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated()) {
        return (
            <section id="desktop" className="container" style={{ padding: '6rem 20px 4rem', minHeight: '80vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <Monitor color="var(--primary-color)" size={40} />
                    <h1 className="neon-text" style={{ fontSize: '2.5rem', margin: 0 }}>
                        Desktop Wallpapers
                    </h1>
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
        <section id="desktop" className="container" style={{ padding: '6rem 20px 4rem', minHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={fetchDriveWallpapers}>
                            Try Again
                        </button>
                        <button
                            className="btn-logout"
                            onClick={logout}
                            style={{
                                padding: '0.8rem 2rem',
                                borderRadius: '99px',
                                fontSize: '1rem'
                            }}
                        >
                            <LogOut size={18} />
                            Sign Out & Retry
                        </button>
                    </div>
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
