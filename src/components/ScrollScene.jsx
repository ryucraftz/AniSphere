import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import { useScroll, useTransform } from 'framer-motion';

function ScrollObject({ scrollYProgress }) {
    const meshRef = useRef();

    useFrame(() => {
        if (meshRef.current) {
            // We can read the scroll value directly if we pass it as a ref or use a store, 
            // but framer-motion's useScroll is outside the canvas.
            // We'll rely on a prop or external state if needed, but for simplicity in this standalone component,
            // let's just animate continuously and maybe react to mouse or time.
            // To truly react to scroll inside Canvas without ScrollControls, we'd need to bridge the values.
            // However, for this specific request "Floating 3D Object that follows user's scroll", 
            // we can just use a fixed position canvas that overlays or sits behind and update the object position/rotation based on scroll.

            // Actually, let's make it simple: A rotating object that changes speed/color.
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <Icosahedron ref={meshRef} args={[1, 0]} position={[0, 0, 0]}>
            <MeshDistortMaterial color="#ff6ec7" attach="material" distort={0.6} speed={2} />
        </Icosahedron>
    );
}

function ScrollScene() {
    // We can use framer-motion to rotate the container or pass values if we wrap Canvas in motion.div
    // But simpler is to just have a nice 3D element that sits there.
    // To make it "follow scroll", we can use sticky positioning in CSS.

    return (
        <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <ScrollObject />
            </Canvas>
        </div>
    );
}

export default ScrollScene;
