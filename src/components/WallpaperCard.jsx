import React from 'react';
import { motion } from 'framer-motion';

function WallpaperCard({ wallpaper, onClick }) {
    return (
        <motion.div
            className="wallpaper-card glass"
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => onClick && onClick(wallpaper)}
            style={{
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                marginBottom: '20px'
            }}
        >
            <div style={{ position: 'relative', paddingBottom: '150%' /* Aspect ratio */ }}>
                <img
                    src={wallpaper.image}
                    alt={wallpaper.title}
                    className="prevent-download"
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s'
                    }}
                />
                <div className="overlay" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '1rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s'
                }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{wallpaper.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{wallpaper.resolution}</p>
                </div>
            </div>
            <style>{`
        .wallpaper-card:hover .overlay {
          opacity: 1;
        }
        .wallpaper-card:hover img {
          transform: scale(1.1);
        }
      `}</style>
        </motion.div>
    );
}

export default WallpaperCard;
