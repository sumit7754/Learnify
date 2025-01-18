// src/layouts/HomeLayout/components/Background3D.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion'; // Changed this line

function Background3D() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 -z-0">
      <Canvas>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
      </Canvas>
    </motion.div>
  );
}

export default Background3D;
