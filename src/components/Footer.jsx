import React from 'react';
import { Github, Twitter, Instagram, Disc } from 'lucide-react';

function Footer() {
    return (
        <footer id="about" style={{
            background: 'var(--footer-bg)',
            padding: '4rem 0',
            marginTop: '4rem',
            borderTop: '1px solid var(--glass-border)',
            color: 'var(--text-color)'
        }}>
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '3rem' }}>
                    <div className="footer-description">
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
        }

                            /* Desktop Styles */
                            @media (min-width: 768px) {
                                footer > div > div:first-child {
                                flex - direction: row;
                            gap: 2rem;
            }
            
            footer > div > div:first-child > div {
                                text - align: left;
            }
            
            footer > div > div:first-child > div > div {
                                justify - content: flex-start;
            }

                            .footer-description {
                                max - width: 300px;
            }
        }
      `}</style>
                    </footer>
                    );
}

                    export default Footer;
