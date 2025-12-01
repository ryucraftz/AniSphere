import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import WallpaperCard from './WallpaperCard';
import DetailModal from './DetailModal';
import { Heart } from 'lucide-react';

function Favorites() {
    const { favorites } = useFavorites();
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);

    return (
        <section id="favorites" className="container" style={{ padding: '6rem 20px 4rem', minHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <Heart color="var(--secondary-color)" size={40} />
                <h1 className="neon-text" style={{ fontSize: '2.5rem', margin: 0 }}>
                    My Favorites
                </h1>
                <span className="badge" style={{
                    background: 'var(--glass-bg)',
                    padding: '0.3rem 1rem',
                    borderRadius: '20px',
                    fontSize: '1rem',
                    border: '1px solid var(--glass-border)'
                }}>
                    {favorites.length}
                </span>
            </div>

            {favorites.length === 0 ? (
                <div className="empty-state">
                    <Heart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No favorites yet</p>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                        Start adding wallpapers to your favorites by clicking the heart icon
                    </p>
                </div>
            ) : (
                <div className="wallpaper-grid">
                    {favorites.map(wp => (
                        <WallpaperCard key={wp.id} wallpaper={wp} onClick={setSelectedWallpaper} />
                    ))}
                </div>
            )}

            <DetailModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
        </section>
    );
}

export default Favorites;
