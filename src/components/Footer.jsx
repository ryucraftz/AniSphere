import React from 'react';
import { Github, Twitter, Instagram, Disc } from 'lucide-react';

function Footer() {
    return (
        <footer style={{
            background: '#0b0c11',
            padding: '4rem 0',
            marginTop: '4rem',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ maxWidth: '300px' }}>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>AniSphere</h3>
                        <p style={{ color: '#888', lineHeight: '1.6' }}>
                            Immersive anime wallpapers for the next generation. Experience the depth of your favorite worlds.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Explore</h4>
                        <ul style={{ color: '#888', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><a href="#" className="hover-link">Wallpapers</a></li>
                            <li><a href="#" className="hover-link">Collections</a></li>
                            <li><a href="#" className="hover-link">Artists</a></li>
                            <li><a href="#" className="hover-link">Submit</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Legal</h4>
                        <ul style={{ color: '#888', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><a href="#" className="hover-link">Terms of Service</a></li>
                            <li><a href="#" className="hover-link">Privacy Policy</a></li>
                            <li><a href="#" className="hover-link">Copyright</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: '#888' }}><Twitter size={20} /></a>
                            <a href="#" style={{ color: '#888' }}><Instagram size={20} /></a>
                            <a href="#" style={{ color: '#888' }}><Disc size={20} /></a>
                            <a href="#" style={{ color: '#888' }}><Github size={20} /></a>
                        </div>
                    </div>
                </div>

                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    textAlign: 'center',
                    color: '#555',
                    fontSize: '0.9rem'
                }}>
                    &copy; 2025 AniSphere. All rights reserved.
                </div>
            </div>
            <style>{`
        .hover-link:hover {
          color: var(--primary-color);
        }
        @media (max-width: 768px) {
          .container > div:first-child {
            flex-direction: column;
            gap: 2rem !important;
          }
        }
      `}</style>
        </footer>
    );
}

export default Footer;
