import React, { useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, TorusKnot, MeshDistortMaterial, Html, Environment, OrbitControls } from '@react-three/drei';

function Hero3DElement() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            // Basic rotation
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;

            // Mouse interaction (parallax)
            const { x, y } = state.pointer;
            meshRef.current.rotation.x += y * 0.2;
            meshRef.current.rotation.y += x * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <TorusKnot
                ref={meshRef}
                args={[1, 0.3, 128, 16]}
                position={[0, 0, 0]}
                onClick={() => meshRef.current.scale.setScalar(1.2)}
                onPointerOut={() => meshRef.current.scale.setScalar(1)}
            >
                <MeshDistortMaterial 
                    color="#25f4ee" 
                    attach="material" 
                    distort={0.4} 
                    speed={2} 
                    roughness={0.1} 
                    metalness={0.9} 
                />
            </TorusKnot>
        </Float>
    );
}

function Loader() {
    return <Html center><div style={{ color: 'white' }}>Loading 3D...</div></Html>;
}

function Hero() {
    const scrollToTrending = () => {
        const element = document.getElementById('trending');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section style={{ minHeight: '90vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '80px' }}>
            <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                
                {/* Text Content */}
                <div style={{ flex: 1, maxWidth: '600px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="neon-text" style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: 600 }}>
                            NEXT GEN WALLPAPERS
                        </h2>
                        <h1
                            style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}
                        >
                            Discover <span className="gradient-text-animate">Immersive</span> <br /> Anime Worlds
                        </h1>
                        <p
                            style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.6 }}
                        >
                            Experience anime like never before with our curated collection of high-resolution, cinematic, and 3D wallpapers.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <motion.button
                                className="btn-primary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={scrollToTrending}
                            >
                                Explore Collection
                            </motion.button>
                            <motion.button
                                style={{
                                    padding: '0.8rem 2rem',
                                    borderRadius: '99px',
                                    background: 'transparent',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-color)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                                whileHover={{ scale: 1.05, borderColor: 'var(--primary-color)' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Learn More
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* 3D Element */}
                <div className="hero-3d" style={{ flex: 1, height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                     {/* Fallback/Background Glow */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(37, 244, 238, 0.2) 0%, transparent 70%)',
                        zIndex: -1,
                        filter: 'blur(50px)'
                    }} />
                    
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <Suspense fallback={<Loader />}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} color="#25f4ee" />
                            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6ec7" />
                            <Hero3DElement />
                            <Environment preset="city" />
                            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>

            <style>{`
        /* Mobile Styles */
        @media (max-width: 768px) {
            .container {
                flex-direction: column-reverse !important;
                text-align: center;
            }
            .hero-3d {
                height: 350px !important;
                width: 100%;
            }
            h1 {
                font-size: 2.5rem !important;
            }
            p {
                margin: 0 auto 2rem auto !important;
            }
            div[style*="display: flex; gap: 1rem"] {
                justify-content: center;
            }
        }
      `}</style>
        </section>
    );
}

export default Hero;
