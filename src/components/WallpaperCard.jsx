import React from 'react';
import { motion } from 'framer-motion';

function WallpaperCard({ wallpaper, onClick }) {
    const [isLoading, setIsLoading] = React.useState(true);

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
        .wallpaper-card:hover img {
          transform: scale(1.1);
        }
        .wallpaper-card:hover {
            box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.3) !important;
            border-color: var(--primary-color) !important;
        }
      `}</style>
        </motion.div>
    );
}

export default WallpaperCard;
