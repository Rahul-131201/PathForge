"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import * as THREE from "three";

// ── Roadmap Data ───────────────────────────────────────────────────────────────

const NODES = [
  { id: 0, label: "Your Goal",   pos: [ 0,    2.8,  0  ] as [number,number,number], color: "#fbbf24", size: 0.30, level: 0 },
  { id: 1, label: "Frontend",    pos: [-2.6,  1.2,  0.8] as [number,number,number], color: "#818cf8", size: 0.22, level: 1 },
  { id: 2, label: "Backend",     pos: [ 2.6,  1.2,  0.8] as [number,number,number], color: "#34d399", size: 0.22, level: 1 },
  { id: 3, label: "HTML / CSS",  pos: [-4.0, -0.4,  1.4] as [number,number,number], color: "#f97316", size: 0.17, level: 2 },
  { id: 4, label: "JavaScript",  pos: [-1.6, -0.4,  1.6] as [number,number,number], color: "#facc15", size: 0.17, level: 2 },
  { id: 5, label: "Node.js",     pos: [ 1.6, -0.4,  1.6] as [number,number,number], color: "#4ade80", size: 0.17, level: 2 },
  { id: 6, label: "Database",    pos: [ 4.0, -0.4,  1.4] as [number,number,number], color: "#60a5fa", size: 0.17, level: 2 },
  { id: 7, label: "React",       pos: [-3.4, -1.9,  2.2] as [number,number,number], color: "#38bdf8", size: 0.15, level: 3 },
  { id: 8, label: "TypeScript",  pos: [-1.0, -1.9,  2.4] as [number,number,number], color: "#a78bfa", size: 0.15, level: 3 },
  { id: 9, label: "REST APIs",   pos: [ 1.2, -1.9,  2.4] as [number,number,number], color: "#6ee7b7", size: 0.15, level: 3 },
  { id: 10, label: "SQL / NoSQL",pos: [ 3.6, -1.9,  2.2] as [number,number,number], color: "#93c5fd", size: 0.15, level: 3 },
];

const EDGES: [number, number][] = [
  [0, 1], [0, 2],
  [1, 3], [1, 4],
  [2, 5], [2, 6],
  [3, 7], [4, 7], [4, 8],
  [5, 9], [6, 10],
];

// ── Node ───────────────────────────────────────────────────────────────────────

function RoadmapNode({
  node,
  onHover,
}: {
  node: (typeof NODES)[0];
  onHover: (id: number | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      const pulse = 1 + Math.sin(t * 1.8 + node.id * 0.7) * 0.045;
      meshRef.current.scale.setScalar(hovered ? 1.45 * pulse : pulse);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        hovered ? 4.5 : 2 + Math.sin(t * 2.2 + node.id) * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * (hovered ? 3.5 : 1);
      ringRef.current.scale.setScalar(
        hovered ? 2.0 : 1.5 + Math.sin(t * 1.4 + node.id) * 0.12,
      );
      (ringRef.current.material as THREE.MeshStandardMaterial).opacity = hovered ? 0.95 : 0.3;
    }
  });

  return (
    <group position={node.pos}>
      {/* Spinning glow ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[node.size * 1.35, node.size * 0.09, 8, 48]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={3}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          setHovered(true);
          onHover(node.id);
          window.dispatchEvent(new CustomEvent("cursor-3d-hover", { detail: true }));
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          window.dispatchEvent(new CustomEvent("cursor-3d-hover", { detail: false }));
        }}
      >
        <sphereGeometry args={[node.size, 40, 40]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : node.color}
          emissive={node.color}
          emissiveIntensity={2}
          roughness={0.08}
          metalness={0.85}
          toneMapped={false}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0, node.size + 0.3, 0]}
        center
        occlude={false}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            color: hovered ? "#ffffff" : node.color,
            fontSize:
              node.level === 0 ? "13px" : node.level === 1 ? "11px" : "9.5px",
            fontWeight: node.level === 0 ? 800 : 600,
            fontFamily: "Inter, system-ui, sans-serif",
            textShadow: `0 0 18px ${node.color}, 0 0 6px ${node.color}`,
            whiteSpace: "nowrap",
            transition: "all 0.25s ease",
            background: hovered ? `${node.color}25` : `${node.color}0d`,
            padding: "3px 9px",
            borderRadius: "6px",
            border: `1px solid ${hovered ? node.color + "99" : node.color + "33"}`,
            letterSpacing: "0.03em",
            backdropFilter: "blur(6px)",
          }}
        >
          {node.label}
        </div>
      </Html>
    </group>
  );
}

// ── Flowing Edge ───────────────────────────────────────────────────────────────

function FlowingEdge({
  from,
  to,
  color,
  offset = 0,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  offset?: number;
}) {
  const p1 = useRef<THREE.Mesh>(null!);
  const p2 = useRef<THREE.Mesh>(null!);
  const t1 = useRef(offset);
  const t2 = useRef((offset + 0.5) % 1);

  useFrame(() => {
    t1.current = (t1.current + 0.004) % 1;
    t2.current = (t2.current + 0.004) % 1;
    [
      [p1, t1],
      [p2, t2],
    ].forEach(([ref, prog]) => {
      const r = ref as React.RefObject<THREE.Mesh>;
      const p = prog as React.MutableRefObject<number>;
      if (r.current) {
        r.current.position.set(
          from[0] + (to[0] - from[0]) * p.current,
          from[1] + (to[1] - from[1]) * p.current,
          from[2] + (to[2] - from[2]) * p.current,
        );
      }
    });
  });

  return (
    <group>
      <Line
        points={[from, to]}
        color={color}
        lineWidth={0.7}
        transparent
        opacity={0.2}
      />
      {[p1, p2].map((ref, i) => (
        <mesh key={i} ref={ref}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Scene (mouse-reactive rotation) ──────────────────────────────────────────

function RoadmapScene() {
  const groupRef = useRef<THREE.Group>(null!);
  const [, setHovered] = useState<number | null>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y +=
      (mouse.x * 0.28 - groupRef.current.rotation.y) * 0.045;
    groupRef.current.rotation.x +=
      (-mouse.y * 0.1 - groupRef.current.rotation.x) * 0.045;
  });

  return (
    <group ref={groupRef}>
      {EDGES.map(([a, b], i) => (
        <FlowingEdge
          key={`${a}-${b}`}
          from={NODES[a].pos}
          to={NODES[b].pos}
          color={NODES[a].color}
          offset={i * 0.09}
        />
      ))}
      {NODES.map((node) => (
        <RoadmapNode key={node.id} node={node} onHover={setHovered} />
      ))}
    </group>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0 hidden lg:block">
      <Canvas camera={{ position: [0, 0.6, 9.8], fov: 50 }} dpr={[1, 1.6]}>
        <color attach="background" args={["#05050f"]} />
        <ambientLight intensity={0.45} />
        <pointLight position={[0, 5, 5]} intensity={2} color="#818cf8" />
        <pointLight position={[-6, -3, -2]} intensity={1.1} color="#22d3ee" />
        <pointLight position={[6, -3, -2]} intensity={1.1} color="#f59e0b" />

        <Stars radius={90} depth={44} count={2200} factor={2} fade speed={0.35} />

        <RoadmapScene />

        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={1.5}
            luminanceThreshold={0.16}
            luminanceSmoothing={0.75}
          />
        </EffectComposer>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI * 0.75}
        />
      </Canvas>
    </div>
  );
}
