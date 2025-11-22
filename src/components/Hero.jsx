import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Float, MeshDistortMaterial, Html } from '@react-three/drei';
import { motion } from 'framer-motion';

function Hero3DElement() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            // Basic rotation
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;

            // Mouse interaction (parallax)
            const { x, y } = state.pointer;
            meshRef.current.rotation.x += y * 0.5;
            meshRef.current.rotation.y += x * 0.5;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <TorusKnot
                ref={meshRef}
                args={[1, 0.3, 128, 16]}
                position={[2, 0, 0]}
                onClick={() => meshRef.current.scale.setScalar(1.2)}
                onPointerOut={() => meshRef.current.scale.setScalar(1)}
            >
                <MeshDistortMaterial color="#25f4ee" attach="material" distort={0.3} speed={2} roughness={0.2} metalness={0.8} />
            </TorusKnot>
        </Float>
    );
}

function Loader() {
    return <Html center><div style={{ color: 'white' }}>Loading 3D...</div></Html>;
}

function Hero() {
    return (
        <section style={{ height: '90vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', width: '100%', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <motion.img
                        src="https://i.giphy.com/Tgvn82bqJT36lkVqDZ.webp"
                        alt="One Piece Luffy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            height: 'auto',
                            borderRadius: '15px',
                            display: 'block',
                            margin: '0 auto 1.5rem auto',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                        }}
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '1rem' }}
                    >
                        Discover <span className="gradient-text">Immersive</span> <br /> Anime Worlds
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px' }}
                    >
                        Download high-resolution wallpapers with cinematic depth and 3D detail.
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="neon-box"
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            background: 'var(--primary-color)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explore Wallpapers
                    </motion.button>
                </div>
                <div className="hero-3d-container" style={{ flex: 1, height: '500px', display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
                    <Canvas>
                        <Suspense fallback={<Loader />}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} />
                            <Hero3DElement />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
            <style>{`
        /* Mobile First Styles */
        .container { flex-direction: column; text-align: center; padding-top: 3rem; }
        h1 { font-size: clamp(2.2rem, 5vw, 4rem) !important; line-height: 1.2 !important; }
        p { font-size: clamp(1rem, 2vw, 1.2rem) !important; margin: 0 auto 2rem !important; padding: 0 1rem; }
        .hero-3d-container { display: none !important; }

        /* Desktop Styles */
        @media (min-width: 768px) {
            .container { flex-direction: row; text-align: left; padding-top: 0; }
            h1 { line-height: 1.1 !important; }
            p { margin: 0 0 2rem !important; padding: 0; }
            .hero-3d-container { display: block !important; }
        }
      `}</style>
        </section>
    );
}

export default Hero;
