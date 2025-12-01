import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import WallpaperCard from './WallpaperCard';
import DetailModal from './DetailModal';
import { Heart } from 'lucide-react';

function Favorites() {
    const { favorites } = useFavorites();
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);

    return (
        <section id="favorites" className="container" style={{ padding: '4rem 20px', minHeight: '60vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Heart color="var(--secondary-color)" fill="var(--secondary-color)" size={32} />
                <h2 className="neon-text" style={{ fontSize: '2rem', margin: 0 }}>
                    My Favorites
                </h2>
                <span style={{
                    background: 'var(--glass-bg)',
                    padding: '0.2rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    border: '1px solid var(--glass-border)'
                }}>
                    {favorites.length}
                </span>
            </div>

            {favorites.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'var(--text-muted)',
                    background: 'var(--glass-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)'
                }}>
                    <Heart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No favorites yet</p>
                    <p style={{ fontSize: '1rem' }}>Start exploring and heart the wallpapers you love!</p>
                </div>
            ) : (
                <div className="wallpaper-grid">
                    {favorites.map(wp => (
                        <WallpaperCard key={wp.id} wallpaper={wp} onClick={setSelectedWallpaper} />
                    ))}
                </div>
            )}

            <style>{`
                .wallpaper-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
                    gap: 12px;
                }
                
                @media (min-width: 768px) {
                    .wallpaper-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 20px;
                    }
                }
            `}</style>

            <DetailModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
        </section>
    );
}

export default Favorites;
