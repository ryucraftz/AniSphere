import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Detect device type for performance optimization
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth < 768;
};

const isLowEndDevice = () => {
    // Check for low-end devices based on hardware concurrency
    return navigator.hardwareConcurrency <= 4 || isMobile();
};

function ReactiveParticles() {
    // Adaptive particle count based on device
    const count = useMemo(() => {
        if (isLowEndDevice()) return 500;  // Mobile/low-end: 500 particles
        return 1000;  // Desktop: 1000 particles (reduced from 2000)
    }, []);

    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!mesh.current) return;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Simplified mouse interaction for better performance
            particle.mx += (state.pointer.x * 1000 - particle.mx) * 0.01;
            particle.my += (state.pointer.y * 1000 - 1 - particle.my) * 0.01;

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            {/* Simplified geometry: sphere instead of dodecahedron */}
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshPhongMaterial color="#25f4ee" />
        </instancedMesh>
    );
}

function ThreeBackground() {
    // Adaptive DPR based on device
    const dpr = useMemo(() => isLowEndDevice() ? [1, 1] : [1, 2], []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 100], fov: 75 }}
                dpr={dpr}
                performance={{ min: 0.5 }} // Allow quality reduction if needed
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[100, 100, 100]} intensity={1} />
                <ReactiveParticles />
            </Canvas>
        </div>
    );
}

export default ThreeBackground;
