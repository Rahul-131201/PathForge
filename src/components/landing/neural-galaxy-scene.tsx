"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";

// AI Core Component - Central glowing sphere
function AiCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
      meshRef.current.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.1;
      meshRef.current.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.1;
      meshRef.current.scale.z = 1 + Math.sin(Date.now() * 0.003) * 0.1;
    }

    if (glowRef.current) {
      glowRef.current.scale.x = 1 + Math.sin(Date.now() * 0.004) * 0.3;
      glowRef.current.scale.y = 1 + Math.sin(Date.now() * 0.004) * 0.3;
      glowRef.current.scale.z = 1 + Math.sin(Date.now() * 0.004) * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main AI Core Sphere */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.8, 6]} />
        <meshPhongMaterial
          color="#00ffff"
          emissive="#0088ff"
          emissiveIntensity={2}
          shininess={100}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.85, 6]} />
        <meshBasicMaterial
          color="#00ffff"
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#0088ff"
          transparent={true}
          opacity={0.15}
        />
      </mesh>

      {/* Inner energy pulses */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <torusGeometry args={[1.2 + i * 0.3, 0.1, 16, 32]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
            transparent={true}
            opacity={0.4 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main Scene
function Scene() {
  const camera = useThree((state) => state.camera);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouseRef.current.x * 5 - camera.position.x) * 0.05;
    camera.position.y += (mouseRef.current.y * 3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, 5]} intensity={0.8} color="#00ffff" />
      <pointLight position={[0, 10, -10]} intensity={0.6} color="#ff00ff" />

      {/* Blue Gradient Background */}
      <color attach="background" args={["#0a1f3f"]} />

      {/* AI Core */}
      <AiCore />

      {/* Glass effect fog */}
      <fog attach="fog" args={["#0f2847", 20, 100]} />

      <Preload all />
    </>
  );
}

export default function NeuralGalaxyScene() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-blue-900/20 to-slate-900/20 backdrop-blur-xl border border-blue-400/20">
      <Canvas
        camera={{
          position: [0, 0, 12],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
