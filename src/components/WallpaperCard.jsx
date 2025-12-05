import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Download } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { downloadImage } from '../utils/downloadUtils';

function WallpaperCard({ wallpaper, onClick }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(wallpaper.id);

    const handleFavoriteClick = useCallback((e) => {
        e.stopPropagation();
        toggleFavorite(wallpaper);
    }, [toggleFavorite, wallpaper]);

    const handleDownloadClick = useCallback((e) => {
        e.stopPropagation();
        downloadImage(wallpaper.image, `${wallpaper.title}.png`);
    }, [wallpaper.image, wallpaper.title]);

    const handleCardClick = useCallback(() => {
        onClick && onClick(wallpaper);
    }, [onClick, wallpaper]);

    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <motion.div
            className="wallpaper-card glass-card"
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={handleCardClick}
        >
            <div className="wallpaper-card-container">
                {isLoading && (
                    <div className="wallpaper-card-skeleton" />
                )}
                <img
                    src={wallpaper.thumbnail || wallpaper.image}
                    alt={wallpaper.title}
                    className={`wallpaper-card-image prevent-download ${isLoading ? 'loading' : 'loaded'}`}
                    draggable="false"
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    onLoad={handleImageLoad}
                    onError={(e) => {
                        if (e.target.src !== wallpaper.image) {
                            e.target.src = wallpaper.image;
                        }
                    }}
                />

                <button
                    onClick={handleFavoriteClick}
                    className="favorite-btn"
                    aria-label="Toggle favorite"
                >
                    <Heart
                        size={20}
                        color={favorite ? '#fe2c55' : '#fff'}
                        fill={favorite ? '#fe2c55' : 'none'}
                    />
                </button>

                <button
                    onClick={handleDownloadClick}
                    className="download-btn-card"
                    aria-label="Download wallpaper"
                >
                    <Download
                        size={18}
                        color="#fff"
                    />
                </button>

                <div className="wallpaper-card-overlay">
                    <h3>{wallpaper.title}</h3>
                    <p>{wallpaper.resolution}</p>
                </div>
            </div>
        </motion.div>
    );
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(WallpaperCard);
