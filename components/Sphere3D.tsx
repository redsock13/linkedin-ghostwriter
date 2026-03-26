"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleSphere() {
  const meshRef = useRef<THREE.Points>(null!);
  const ringRef = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0.3, y: 0 });

  const { positions, colors } = useMemo(() => {
    const N = 3200;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const radius = 2.1 + (Math.random() - 0.5) * 0.06;
      pos[i * 3] = Math.cos(theta) * r * radius;
      pos[i * 3 + 1] = y * radius;
      pos[i * 3 + 2] = Math.sin(theta) * r * radius;
      const t = (y + 1) / 2;
      col[i * 3] = 0.0 + t * 0.22;   // R — bleu → cyan
      col[i * 3 + 1] = 0.3 + t * 0.4;
      col[i * 3 + 2] = 0.7 + t * 0.3;
    }
    return { positions: pos, colors: col };
  }, []);

  const ringPositions = useMemo(() => {
    const N = 500;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const r = 2.7 + (Math.random() - 0.5) * 0.12;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useFrame((_, delta) => {
    targetRot.current.x += (mouse.current.y * 0.4 - targetRot.current.x) * 0.05;
    targetRot.current.y += (mouse.current.x * 0.6 - targetRot.current.y) * 0.05;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12 + (targetRot.current.y - meshRef.current.rotation.y) * 0.03;
      meshRef.current.rotation.x += (targetRot.current.x - meshRef.current.rotation.x) * 0.03;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.08;
      ringRef.current.rotation.x = 0.35;
    }
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  const ringGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(ringPositions, 3));
    return g;
  }, [ringPositions]);

  return (
    <>
      <points ref={meshRef} geometry={geom}>
        <pointsMaterial size={0.028} vertexColors sizeAttenuation transparent opacity={0.85} />
      </points>
      <points ref={ringRef} geometry={ringGeom}>
        <pointsMaterial size={0.018} color="#38bdf8" sizeAttenuation transparent opacity={0.4} />
      </points>
      {/* Inner glow orb */}
      <mesh>
        <sphereGeometry args={[1.85, 32, 32]} />
        <meshBasicMaterial color="#0057ff" transparent opacity={0.025} />
      </mesh>
    </>
  );
}

function FloatingPins() {
  const pins = useMemo(() => [
    { pos: [2.1, 0.6, 0.8] as [number,number,number], color: "#0057ff" },
    { pos: [-1.8, 1.0, 1.2] as [number,number,number], color: "#0ea5e9" },
    { pos: [0.5, -2.0, 1.1] as [number,number,number], color: "#38bdf8" },
    { pos: [-1.2, -0.8, 1.8] as [number,number,number], color: "#0057ff" },
    { pos: [1.6, -1.2, -0.9] as [number,number,number], color: "#0ea5e9" },
  ], []);
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => {
      if (m) m.position.y = pins[i].pos[1] + Math.sin(clock.elapsedTime * 0.9 + i * 1.3) * 0.07;
    });
  });
  return (
    <>
      {pins.map((p, i) => (
        <mesh key={i} position={p.pos} ref={el => { if (el) refs.current[i] = el; }}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </>
  );
}

export default function Sphere3D() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} dpr={[1, 2]} style={{ background: "transparent" }}>
        <ambientLight intensity={0.5} />
        <ParticleSphere />
        <FloatingPins />
      </Canvas>
    </div>
  );
}
