"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingOrb({
  position,
  color,
  scale,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.08 * speed;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.12 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.18}
          roughness={0.1}
          metalness={0.8}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // eslint-disable-next-line react-hooks/purity
      arr[i * 3] = (Math.random() - 0.5) * 20;
      // eslint-disable-next-line react-hooks/purity
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      // eslint-disable-next-line react-hooks/purity
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 70 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#6366f1" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#a855f7" />
        <Stars
          radius={80}
          depth={40}
          count={3000}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />
        <FloatingOrb position={[-4, 2, -3]} color="#6366f1" scale={2.5} speed={0.8} />
        <FloatingOrb position={[4, -1.5, -4]} color="#22d3ee" scale={2} speed={1.2} />
        <FloatingOrb position={[1, 3, -5]} color="#a855f7" scale={1.5} speed={0.6} />
        <FloatingOrb position={[-2, -3, -2]} color="#6366f1" scale={1} speed={1.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
}
