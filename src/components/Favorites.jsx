import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import WallpaperCard from './WallpaperCard';
import DetailModal from './DetailModal';
import Desktop from './Desktop';
import { Heart } from 'lucide-react';

function Favorites() {
    const { favorites } = useFavorites();
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const [activeTab, setActiveTab] = useState('local'); // 'local' or 'desktop'

    return (
        <section id="favorites" className="container" style={{ padding: '4rem 20px', minHeight: '60vh' }}>
            {/* Tab Navigation */}
            <div className="favorites-tabs">
                <button
                    className={`tab-btn ${activeTab === 'local' ? 'active' : ''}`}
                    onClick={() => setActiveTab('local')}
                >
                    <Heart size={20} />
                    Local Favorites
                    <span className="tab-count">{favorites.length}</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'desktop' ? 'active' : ''}`}
                    onClick={() => setActiveTab('desktop')}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    Desktop
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'local' ? (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', marginTop: '2rem' }}>
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

                    <DetailModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
                </>
            ) : (
                <Desktop />
            )}

            <style>{`
                .favorites-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid var(--glass-border);
                    overflow-x: auto;
                }
                
                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 1.5rem;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }
                
                .tab-btn:hover {
                    color: var(--text-color);
                    background: var(--glass-bg);
                }
                
                .tab-btn.active {
                    color: var(--primary-color);
                    border-bottom-color: var(--primary-color);
                }
                
                .tab-count {
                    background: var(--glass-bg);
                    padding: 0.1rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    border: 1px solid var(--glass-border);
                }
                
                .tab-btn.active .tab-count {
                    background: var(--primary-color);
                    color: var(--bg-color);
                    border-color: var(--primary-color);
                }
                
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
        </section>
    );
}

export default Favorites;
