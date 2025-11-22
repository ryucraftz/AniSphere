import React from 'react';
import { Github, Twitter, Instagram, Disc } from 'lucide-react';

function Footer() {
    return (
        <footer style={{
            background: 'var(--footer-bg)',
            padding: '4rem 0',
            marginTop: '4rem',
            borderTop: '1px solid var(--glass-border)',
            color: 'var(--text-color)'
        }}>
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ maxWidth: '300px' }}>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>AniSphere</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Immersive anime wallpapers for the next generation. Experience the depth of your favorite worlds.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Explore</h4>
                        <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><a href="#" className="hover-link">Wallpapers</a></li>
                            <li><a href="#" className="hover-link">Collections</a></li>
                            <li><a href="#" className="hover-link">Artists</a></li>
                            <li><a href="#" className="hover-link">Submit</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Legal</h4>
                        <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><a href="#" className="hover-link">Terms of Service</a></li>
                            <li><a href="#" className="hover-link">Privacy Policy</a></li>
                            <li><a href="#" className="hover-link">Copyright</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: 'var(--text-muted)' }}><Twitter size={20} /></a>
                            <a href="#" style={{ color: 'var(--text-muted)' }}><Instagram size={20} /></a>
                            <a href="#" style={{ color: 'var(--text-muted)' }}><Disc size={20} /></a>
                            <a href="#" style={{ color: 'var(--text-muted)' }}><Github size={20} /></a>
                        </div>
                    </div>
                </div>

                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--glass-border)',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem'
                }}>
                    &copy; 2025 AniSphere. All rights reserved.
                </div>
            </div>
            <style>{`
        .hover-link:hover {
          color: var(--primary-color);
        }
        
        /* Mobile First Styles */
        .container > div:first-child {
            flex-direction: column;
            gap: 2rem;
        }

        /* Desktop Styles */
        @media (min-width: 768px) {
            .container > div:first-child {
                flex-direction: row;
                gap: 2rem;
            }
        }
      `}</style>
        </footer>
    );
}

export default Footer;
