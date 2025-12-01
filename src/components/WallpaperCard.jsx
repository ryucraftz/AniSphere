import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Download } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { downloadImage } from '../utils/downloadUtils';

function WallpaperCard({ wallpaper, onClick }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(wallpaper.id);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavorite(wallpaper);
    };

    return (
        <motion.div
            className="wallpaper-card glass-card"
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => onClick && onClick(wallpaper)}
            style={{
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                marginBottom: '20px',
            }}
        >
            <div style={{ position: 'relative', paddingBottom: '150%' /* Aspect ratio */ }}>
                {isLoading && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #1e1f2e 25%, #2a2b3d 50%, #1e1f2e 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'skeleton-loading 1.5s infinite',
                            zIndex: 1
                        }}
                    />
                )}
                <img
                    src={wallpaper.image}
                    alt={wallpaper.title}
                    className="prevent-download"
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                    onLoad={() => setIsLoading(false)}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s, opacity 0.3s',
                        opacity: isLoading ? 0 : 1
                    }}
                />

                <button
                    onClick={handleFavoriteClick}
                    className="favorite-btn"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '35px',
                        height: '35px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 3,
                        transition: 'all 0.3s ease',
                        opacity: 1,
                        transform: 'scale(1)',
                    }}
                >
                    <Heart
                        size={20}
                        color={favorite ? '#fe2c55' : '#fff'}
                        fill={favorite ? '#fe2c55' : 'none'}
                    />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(wallpaper.image, `${wallpaper.title}.png`);
                    }}
                    className="download-btn-card"
                    style={{
                        position: 'absolute',
                        top: '55px',
                        right: '10px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '35px',
                        height: '35px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 3,
                        transition: 'all 0.3s ease',
                        opacity: 1,
                        transform: 'scale(1)',
                    }}
                >
                    <Download
                        size={18}
                        color="#fff"
                    />
                </button>

                <div className="overlay" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '1rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                    opacity: 0,
                    transition: 'all 0.3s ease-in-out',
                    backdropFilter: 'blur(2px)',
                    zIndex: 2
                }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{wallpaper.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{wallpaper.resolution}</p>
                </div>
            </div>
            <style>{`
        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .wallpaper-card:hover .overlay {
          opacity: 1;
        }
        .favorite-btn:hover, .download-btn-card:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            transform: scale(1.1);
        }
        .wallpaper-card:hover img {
          transform: scale(1.1);
        }
        .wallpaper-card:hover {
            box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.3) !important;
            border-color: var(--primary-color) !important;
        }
      `}</style>
        </motion.div >
    );
}

export default WallpaperCard;
