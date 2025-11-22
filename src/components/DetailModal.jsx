import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Tag } from 'lucide-react';

function DetailModal({ wallpaper, onClose }) {
    if (!wallpaper) return null;

    const handleDownload = async () => {
        try {
            const response = await fetch(wallpaper.image);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${wallpaper.title}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backdropFilter: 'blur(5px)'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="glass"
                    style={{
                        width: '90%',
                        maxWidth: '1000px',
                        maxHeight: '90vh',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        background: '#13141c'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(0,0,0,0.5)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            color: '#fff',
                            cursor: 'pointer',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                        <img
                            src={wallpaper.image}
                            alt={wallpaper.title}
                            className="prevent-download"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '60vh', background: '#000' }}
                        />
                    </div>

                    <div className="modal-content" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{wallpaper.title}</h2>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: '#ccc' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={16} /> Anime, Sci-Fi</span>
                                <span>{wallpaper.width}x{wallpaper.height}</span>
                            </div>
                            <p style={{ color: '#aaa', maxWidth: '600px' }}>
                                High-quality immersive wallpaper featuring {wallpaper.title}. Optimized for desktop and mobile screens.
                            </p>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="neon-box download-btn"
                            style={{
                                padding: '1rem 2rem',
                                background: 'var(--primary-color)',
                                color: '#000',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '1.1rem'
                            }}
                        >
                            <Download size={20} /> Download
                        </button>
                    </div>
                    <style>{`
                        @media (max-width: 768px) {
                            .modal-content {
                                flex-direction: column;
                                padding: 1.5rem !important;
                                gap: 1.5rem !important;
                            }
                            .download-btn {
                                width: 100%;
                                justify-content: center;
                            }
                            h2 { 
                                font-size: 1.5rem !important; 
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                max-width: 100%;
                                display: block;
                            }
                        }
                    `}</style>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default DetailModal;

