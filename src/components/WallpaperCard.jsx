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
        >
            <div className="wallpaper-card-container">
                {isLoading && (
                    <div className="wallpaper-card-skeleton" />
                )}
                <img
                    src={wallpaper.image}
                    alt={wallpaper.title}
                    className={`wallpaper-card-image prevent-download ${isLoading ? 'loading' : 'loaded'}`}
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                    onLoad={() => setIsLoading(false)}
                />

                <button
                    onClick={handleFavoriteClick}
                    className="favorite-btn"
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

export default WallpaperCard;
