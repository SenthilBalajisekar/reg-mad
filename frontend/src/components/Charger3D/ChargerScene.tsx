'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, RoundedBox, ContactShadows } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   4K PHOTOREALISTIC PROCEDURAL TEXTURES (PBR ENGINE)
───────────────────────────────────────────────────────── */
let cachedPBR: {
  faceplateTexture: THREE.CanvasTexture;
  phoneScreenTexture: THREE.CanvasTexture;
  pcbTraceTexture: THREE.CanvasTexture;
  brushedMetalTexture: THREE.CanvasTexture;
} | null = null;

function getPBRTextures() {
  if (cachedPBR) return cachedPBR;
  if (typeof window === 'undefined') {
    return {
      faceplateTexture: null as any,
      phoneScreenTexture: null as any,
      pcbTraceTexture: null as any,
      brushedMetalTexture: null as any,
    };
  }

  // 1. PURE MATTE WHITE FACEPLATE WITH REFINED MAGNET ICON (2048 x 2048)
  const cFace = document.createElement('canvas');
  cFace.width = 2048; cFace.height = 2048;
  const ctxF = cFace.getContext('2d');
  if (ctxF) {
    ctxF.fillStyle = '#ffffff';
    ctxF.fillRect(0, 0, 2048, 2048);

    ctxF.strokeStyle = 'rgba(203, 213, 225, 0.45)';
    ctxF.lineWidth = 16;
    ctxF.beginPath();
    ctxF.arc(1024, 1024, 780, 0, Math.PI * 2);
    ctxF.stroke();

    ctxF.strokeStyle = '#475569';
    ctxF.fillStyle = '#475569';
    ctxF.lineWidth = 42;
    ctxF.lineCap = 'round';

    ctxF.beginPath();
    ctxF.arc(1024, 1000, 150, Math.PI, 0, false);
    ctxF.stroke();

    ctxF.beginPath();
    ctxF.moveTo(874, 1000);
    ctxF.lineTo(874, 1140);
    ctxF.moveTo(1174, 1000);
    ctxF.lineTo(1174, 1140);
    ctxF.stroke();

    ctxF.fillStyle = '#0284c7';
    ctxF.fillRect(853, 1130, 42, 42);
    ctxF.fillStyle = '#38bdf8';
    ctxF.fillRect(1153, 1130, 42, 42);
  }
  const faceplateTexture = new THREE.CanvasTexture(cFace);

  // 2. PHOTOREALISTIC SMARTPHONE DISPLAY (CHARGING WIDGET) (2048 x 4096)
  const cPhone = document.createElement('canvas');
  cPhone.width = 2048; cPhone.height = 4096;
  const ctxP = cPhone.getContext('2d');
  if (ctxP) {
    const grad = ctxP.createLinearGradient(0, 0, 2048, 4096);
    grad.addColorStop(0.0, '#030712');
    grad.addColorStop(0.4, '#0b132b');
    grad.addColorStop(1.0, '#020617');
    ctxP.fillStyle = grad;
    ctxP.fillRect(0, 0, 2048, 4096);

    // Dynamic Island Notch
    ctxP.fillStyle = '#000000';
    ctxP.beginPath();
    ctxP.roundRect(784, 120, 480, 140, 70);
    ctxP.fill();

    // Lockscreen Time "9:41"
    ctxP.fillStyle = '#ffffff';
    ctxP.font = '700 320px -apple-system, BlinkMacSystemFont, sans-serif';
    ctxP.textAlign = 'center';
    ctxP.fillText('9:41', 1024, 760);

    // MagSafe Green Charging Ring Widget
    ctxP.strokeStyle = '#10b981';
    ctxP.shadowColor = '#34d399';
    ctxP.shadowBlur = 80;
    ctxP.lineWidth = 48;
    ctxP.beginPath();
    ctxP.arc(1024, 2048, 520, 0, Math.PI * 2);
    ctxP.stroke();

    // Inner Emerald Glow
    ctxP.fillStyle = 'rgba(16, 185, 129, 0.12)';
    ctxP.beginPath();
    ctxP.arc(1024, 2048, 480, 0, Math.PI * 2);
    ctxP.fill();

    // Emissive Lightning Bolt
    ctxP.shadowBlur = 0;
    ctxP.fillStyle = '#34d399';
    ctxP.beginPath();
    ctxP.moveTo(1050, 1780);
    ctxP.lineTo(910, 2060);
    ctxP.lineTo(1030, 2060);
    ctxP.lineTo(990, 2320);
    ctxP.lineTo(1150, 2020);
    ctxP.lineTo(1030, 2020);
    ctxP.closePath();
    ctxP.fill();

    // "75% Charged" Text
    ctxP.fillStyle = '#ecfdf5';
    ctxP.font = '700 140px sans-serif';
    ctxP.fillText('75% CHARGED', 1024, 2800);

    // Event Subtitle
    ctxP.fillStyle = 'rgba(56, 189, 248, 0.9)';
    ctxP.font = '600 96px sans-serif';
    ctxP.fillText('⚡ MAD REG HACKATHON 2026', 1024, 3500);
  }
  const phoneScreenTexture = new THREE.CanvasTexture(cPhone);

  // 3. PHOTOREALISTIC FR4 PCB LOGIC BOARD TEXTURE (2048 x 2048)
  const cPcb = document.createElement('canvas');
  cPcb.width = 2048; cPcb.height = 2048;
  const ctxB = cPcb.getContext('2d');
  if (ctxB) {
    ctxB.fillStyle = '#0f172a';
    ctxB.fillRect(0, 0, 2048, 2048);

    ctxB.strokeStyle = 'rgba(217, 119, 6, 0.3)';
    ctxB.lineWidth = 6;
    for (let y = 100; y < 1950; y += 120) {
      ctxB.beginPath();
      ctxB.moveTo(100, y);
      ctxB.lineTo(1950, y);
      ctxB.stroke();
    }

    ctxB.strokeStyle = '#d97706';
    ctxB.lineWidth = 12;
    for (let i = 0; i < 28; i++) {
      const x = 200 + (i * 60);
      ctxB.beginPath();
      ctxB.moveTo(x, 200);
      ctxB.lineTo(x, 1850);
      ctxB.stroke();
    }

    // Gold Solder Pads & Microchip Footprints
    ctxB.fillStyle = '#f59e0b';
    for (let i = 0; i < 40; i++) {
      const x = (i % 8) * 220 + 200;
      const y = Math.floor(i / 8) * 350 + 200;
      ctxB.fillRect(x, y, 45, 45);
    }
  }
  const pcbTraceTexture = new THREE.CanvasTexture(cPcb);

  // 4. FINE BRUSHED ALUMINUM METALLIC TEXTURE (1024 x 1024)
  const cMetal = document.createElement('canvas');
  cMetal.width = 1024; cMetal.height = 1024;
  const ctxM = cMetal.getContext('2d');
  if (ctxM) {
    ctxM.fillStyle = '#334155';
    ctxM.fillRect(0, 0, 1024, 1024);
    ctxM.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 4000; i++) {
      ctxM.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 120, 1);
    }
  }
  const brushedMetalTexture = new THREE.CanvasTexture(cMetal);
  brushedMetalTexture.wrapS = THREE.RepeatWrapping;
  brushedMetalTexture.wrapT = THREE.RepeatWrapping;
  brushedMetalTexture.repeat.set(4, 4);

  cachedPBR = { faceplateTexture, phoneScreenTexture, pcbTraceTexture, brushedMetalTexture };
  return cachedPBR;
}

/* ─────────────────────────────────────────────────────────
   DEEP SPACE FLOATING DUST PARTICLES
───────────────────────────────────────────────────────── */
function SpaceParticles() {
  const count = 180;
  const [positions, opacity] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return [pos, 0.5];
  }, []);

  const ptsRef = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ptsRef.current) {
      ptsRef.current.rotation.y = clock.elapsedTime * 0.03;
      ptsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <Points ref={ptsRef} positions={positions} stride={3}>
      <PointMaterial transparent color="#38bdf8" size={0.06} sizeAttenuation depthWrite={false} opacity={opacity} />
    </Points>
  );
}

/* ─────────────────────────────────────────────────────────
   PULSING ELECTROMAGNETIC ENERGY RINGS
───────────────────────────────────────────────────────── */
function EnergyRings({ energyIntensity }: { energyIntensity: number }) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.elapsedTime * 3;
      ringRef.current.children.forEach((child, idx) => {
        const scale = 1 + ((t + idx * 0.4) % 1.5) * 0.6;
        const opacity = Math.max(0, (1 - (scale - 1) / 0.9)) * energyIntensity;
        child.scale.set(scale, scale, 1);
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#00f0ff'),
          transparent: true,
          opacity: opacity * 0.7,
        });
      });
    }
  });

  if (energyIntensity <= 0.01) return null;

  return (
    <group ref={ringRef} position={[0, 0, -0.15]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i}>
          <torusGeometry args={[1.2, 0.025, 16, 64]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   ELECTRIC LIGHTNING ARC SPARKS (MAGNETIC CONNECT SNAP)
───────────────────────────────────────────────────────── */
function MagneticSparks({ sparkIntensity }: { sparkIntensity: number }) {
  const sparksRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (sparksRef.current && sparkIntensity > 0.05) {
      sparksRef.current.rotation.z = clock.elapsedTime * 15;
      sparksRef.current.children.forEach((child) => {
        child.scale.setScalar(0.8 + Math.sin(clock.elapsedTime * 40) * 0.3);
      });
    }
  });

  if (sparkIntensity <= 0.05) return null;

  return (
    <group ref={sparksRef} position={[0, 0, -0.1]}>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.3, Math.sin(angle) * 1.3, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.3, 0.04, 0.02]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={sparkIntensity * 0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   ROLE-REVERSED 3D SCENE: SMARTPHONE ASSEMBLING + CHARGER FLY-IN
───────────────────────────────────────────────────────── */
function Scene3DGroup({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const phoneMainGroupRef = useRef<THREE.Group>(null);
  const chargerPuckRef = useRef<THREE.Group>(null);
  const standRef = useRef<THREE.Group>(null);

  // 5 Exploded Smartphone Component Layer Refs
  const layerPhoneGlassRef = useRef<THREE.Group>(null);
  const layerPhoneCameraRef = useRef<THREE.Group>(null);
  const layerPhoneLogicBoardRef = useRef<THREE.Group>(null);
  const layerPhoneBatteryRef = useRef<THREE.Group>(null);
  const layerPhoneChassisRef = useRef<THREE.Group>(null);

  const textures = getPBRTextures();

  useFrame(({ clock }) => {
    const p = Math.max(0, Math.min(1, scrollProgress.get()));
    const time = clock.elapsedTime;

    if (!groupRef.current) return;

    const floatY = Math.sin(time * 1.5) * 0.12;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1100;
    
    const basePosY = floatY;
    const baseScale = isMobile ? 0.45 : isTablet ? 0.58 : 0.72;

    // --- 5-STAGE SEQUENCE: 1. PHONE EXPLODED ASSEMBLY -> 2. PHONE SPIN -> 3. CHARGER FLY-IN -> 4. CHARGING -> 5. HERO DOCK ---
    let targetRotX = 0.4;
    let targetRotY = 0.25;
    let targetRotZ = 0;
    let targetPosX = 0;
    let targetPosY = basePosY;
    let targetPosZ = 0;

    // Stage 1: Smartphone Exploded Assembly (Scroll 0.0 to 0.30) - Facing Right Side initially & shifted left
    if (p <= 0.30) {
      const factor = p / 0.30;
      targetRotX = THREE.MathUtils.lerp(0.35, 0.25, factor);
      targetRotY = THREE.MathUtils.lerp(1.25, 0.50, factor);
      targetRotZ = THREE.MathUtils.lerp(0.15, 0, factor);
      targetPosX = THREE.MathUtils.lerp(-1.6, 0, factor);
    } 
    // Stage 2: Smartphone turns to BACKSIDE at Members section (Scroll 0.30 to 0.55)
    else if (p <= 0.55) {
      const factor = (p - 0.30) / 0.25;
      targetRotY = THREE.MathUtils.lerp(0.50, Math.PI + 0.15, factor); // Rotates 180° to expose backside to viewer
      targetRotX = THREE.MathUtils.lerp(0.25, 0.30, factor);
      targetRotZ = THREE.MathUtils.lerp(0, -0.05, factor);
    } 
    // Stage 3: Charger flies in & snaps to BACKSIDE of phone (Scroll 0.55 to 0.75)
    else if (p <= 0.75) {
      const factor = (p - 0.55) / 0.20;
      targetRotY = THREE.MathUtils.lerp(Math.PI + 0.15, Math.PI + 0.15, factor); // Holds backside view
      targetRotX = THREE.MathUtils.lerp(0.30, 0.25, factor);
      targetRotZ = THREE.MathUtils.lerp(-0.05, -0.05, factor);
    } 
    // Stage 4: Wireless Charging Energy Wave on Backside (Scroll 0.75 to 0.88)
    else if (p <= 0.88) {
      const factor = (p - 0.75) / 0.13;
      targetRotY = THREE.MathUtils.lerp(Math.PI + 0.15, Math.PI + 0.15, factor); // Holds backside view
      targetRotX = THREE.MathUtils.lerp(0.25, 0.30, factor);
      targetRotZ = THREE.MathUtils.lerp(-0.05, 0, factor);
    } 
    // Stage 5: Smartphone turns back to NORMAL FRONTSIDE position at Last Section (Scroll 0.88 to 1.0)
    else {
      const factor = (p - 0.88) / 0.12;
      targetRotX = THREE.MathUtils.lerp(0.30, 1.25, factor);
      targetRotY = THREE.MathUtils.lerp(Math.PI + 0.15, Math.PI * 2, factor); // Turns back to front display view
      targetPosY = basePosY + THREE.MathUtils.lerp(0, -0.5, factor);
      targetPosZ = THREE.MathUtils.lerp(0, 0.5, factor);
    }

    // Smooth Group Transforms
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.08);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.08);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.08);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPosZ, 0.08);
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x || baseScale, baseScale, 0.08));

    // --- STAGE 1: SMARTPHONE EXPLODED ASSEMBLY AT START (Scroll 0.0 to 0.30) ---
    let explodeDistance = 0;
    if (p <= 0.30) {
      explodeDistance = 1.0 - (p / 0.30);
    } else {
      explodeDistance = 0;
    }

    // Explode 5 Smartphone Layers along Z-axis
    if (layerPhoneGlassRef.current) layerPhoneGlassRef.current.position.z = THREE.MathUtils.lerp(0.115, 6.00, explodeDistance);
    if (layerPhoneCameraRef.current) layerPhoneCameraRef.current.position.z = THREE.MathUtils.lerp(-0.13, 3.80, explodeDistance);
    if (layerPhoneLogicBoardRef.current) layerPhoneLogicBoardRef.current.position.z = THREE.MathUtils.lerp(0.0, 1.80, explodeDistance);
    if (layerPhoneBatteryRef.current) layerPhoneBatteryRef.current.position.z = THREE.MathUtils.lerp(-0.05, 0.40, explodeDistance);
    if (layerPhoneChassisRef.current) layerPhoneChassisRef.current.position.z = THREE.MathUtils.lerp(-0.10, -2.60, explodeDistance);

    // --- STAGE 3, 4, 5: MAGNETIC CHARGER PUCK FLY-IN FROM RIGHT SIDE OF SCREEN ---
    if (chargerPuckRef.current) {
      if (p < 0.52) {
        // Offscreen top-right of screen (Local -6, 5, -4 maps to World +6, 5, +4)
        chargerPuckRef.current.position.set(-6, 5, -4);
        chargerPuckRef.current.rotation.set(0, 0, 0);
        chargerPuckRef.current.scale.set(0, 0, 0);
      } else if (p <= 0.72) {
        // Flying in from RIGHT side of screen & snapping flush against phone backplate
        const snapFactor = (p - 0.52) / 0.20;
        const curveSnap = Math.pow(snapFactor, 0.8);

        const px = THREE.MathUtils.lerp(-6, 0, curveSnap); // Local -6 -> World +6 (RIGHT SIDE of screen)
        const py = THREE.MathUtils.lerp(5, 0, curveSnap);
        const pz = THREE.MathUtils.lerp(-4, -0.12, curveSnap);

        chargerPuckRef.current.position.set(px, py, pz);
        chargerPuckRef.current.scale.setScalar(THREE.MathUtils.lerp(0.4, 1, curveSnap));
      } else {
        // Fully snapped flush against rear backplate of smartphone
        chargerPuckRef.current.position.set(0, 0, -0.12);
        chargerPuckRef.current.scale.set(1, 1, 1);
      }
    }

    // --- STAGE 5: DISPLAY STAND BASE VISIBILITY ---
    if (standRef.current) {
      const standOpacity = Math.max(0, Math.min(1, (p - 0.88) / 0.10));
      standRef.current.scale.setScalar(standOpacity);
    }
  });

  const pVal = scrollProgress.get();
  const sparkIntensity = pVal >= 0.65 && pVal <= 0.76 ? Math.sin(((pVal - 0.65) / 0.11) * Math.PI) : 0;
  const energyIntensity = pVal >= 0.72 && pVal <= 0.94 ? 1 : 0;

  return (
    <group ref={groupRef}>

      {/* ═══════════════════════════════════════════════════════════
          MAGNETIC SNAP LIGHTNING SPARKS
      ═══════════════════════════════════════════════════════════ */}
      <MagneticSparks sparkIntensity={sparkIntensity} />

      {/* ═══════════════════════════════════════════════════════════
          PRIMARY 3D SMARTPHONE (EXPLODED & ASSEMBLED LAYERS)
      ═══════════════════════════════════════════════════════════ */}
      <group ref={phoneMainGroupRef}>

        {/* LAYER 1: FRONT OLED GLASS DISPLAY SCREEN & DYNAMIC ISLAND */}
        <group ref={layerPhoneGlassRef} position={[0, 0, 0.115]}>
          <mesh>
            <planeGeometry args={[2.10, 4.40]} />
            <meshStandardMaterial
              map={textures.phoneScreenTexture || undefined}
              roughness={0.05}
              metalness={0.1}
              emissive="#000000"
            />
          </mesh>
        </group>

        {/* LAYER 2: REAR TRIPLE CAMERA BUMP MATRIX MODULE */}
        <group ref={layerPhoneCameraRef} position={[-0.55, 1.45, -0.13]}>
          <RoundedBox args={[0.85, 0.85, 0.08]} radius={0.15} smoothness={6}>
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </RoundedBox>
          {[[-0.2, 0.2], [0.2, 0.2], [0, -0.2]].map(([cx, cy], idx) => (
            <mesh key={idx} position={[cx, cy, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.06, 32]} />
              <meshStandardMaterial color="#020617" metalness={0.98} roughness={0.05} />
            </mesh>
          ))}
        </group>

        {/* LAYER 3: MOTHERBOARD LOGIC BOARD & A-BIONIC CHIPSET ARRAY */}
        <group ref={layerPhoneLogicBoardRef} position={[0, 0, 0.0]}>
          <mesh>
            <boxGeometry args={[1.80, 3.80, 0.03]} />
            <meshStandardMaterial map={textures.pcbTraceTexture || undefined} color="#1e293b" roughness={0.3} metalness={0.3} />
          </mesh>
          {/* Central A-Bionic CPU Microchip */}
          <mesh position={[0, 0.6, 0.028]}>
            <boxGeometry args={[0.55, 0.55, 0.04]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
          </mesh>
          {/* Microchip Silver Pin Leads */}
          <mesh position={[0, 0.6, 0.025]}>
            <boxGeometry args={[0.62, 0.62, 0.015]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.05} />
          </mesh>
          {/* SMD Capacitors & RAM Modules */}
          {[...Array(14)].map((_, i) => {
            const x = (i % 2 === 0 ? 0.5 : -0.5);
            const y = -1.2 + (i * 0.22);
            return (
              <group key={i} position={[x, y, 0.025]}>
                <mesh>
                  <boxGeometry args={[0.12, 0.08, 0.03]} />
                  <meshStandardMaterial color={i % 2 === 0 ? "#334155" : "#b45309"} roughness={0.3} />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* LAYER 4: LITHIUM-ION BATTERY & MAGSAFE MAGNET ARRAY */}
        <group ref={layerPhoneBatteryRef} position={[0, -0.2, -0.05]}>
          {/* Dark Lithium-Ion Battery Block */}
          <mesh>
            <boxGeometry args={[1.60, 2.80, 0.06]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Embedded MagSafe Neodymium Magnet Ring Array */}
          <group position={[0, 0.2, -0.04]}>
            <mesh>
              <torusGeometry args={[0.65, 0.04, 16, 64]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.08} />
            </mesh>
            {[...Array(16)].map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 0.65, Math.sin(angle) * 0.65, 0]} rotation={[0, 0, angle]}>
                  <boxGeometry args={[0.06, 0.08, 0.03]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.99} roughness={0.05} />
                </mesh>
              );
            })}
          </group>
        </group>

        {/* LAYER 5: TITANIUM CHASSIS FRAME & BACK GLASS SHELL */}
        <group ref={layerPhoneChassisRef} position={[0, 0, -0.10]}>
          <RoundedBox args={[2.2, 4.5, 0.18]} radius={0.25} smoothness={8}>
            <meshStandardMaterial
              color="#475569"
              bumpMap={textures.brushedMetalTexture || undefined}
              bumpScale={0.008}
              metalness={0.90}
              roughness={0.20}
            />
          </RoundedBox>
          {/* Chamfered Metallic Edge Trim */}
          <RoundedBox args={[2.24, 4.54, 0.16]} radius={0.26} smoothness={8}>
            <meshStandardMaterial color="#f1f5f9" metalness={0.99} roughness={0.05} />
          </RoundedBox>
        </group>

      </group>

      {/* ═══════════════════════════════════════════════════════════
          FLY-IN MAGNETIC CHARGER PUCK (SCENES 3, 4, 5)
      ═══════════════════════════════════════════════════════════ */}
      <group ref={chargerPuckRef} position={[0, 0, -0.22]}>
        {/* Matte White Top Faceplate Disc */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.20, 1.20, 0.04, 64]} />
          <meshStandardMaterial
            map={textures.faceplateTexture || undefined}
            color="#ffffff"
            roughness={0.20}
            metalness={0.05}
          />
        </mesh>
        {/* Metallic Bevel Ring */}
        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[1.205, 0.02, 16, 64]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.99} roughness={0.08} />
        </mesh>
        {/* Wound Copper Charging Coil */}
        <group position={[0, 0, -0.04]}>
          {[1.0, 0.88, 0.76, 0.64].map((r, idx) => (
            <mesh key={idx}>
              <torusGeometry args={[r, 0.035, 16, 64]} />
              <meshStandardMaterial color="#ea580c" emissive="#9a3412" emissiveIntensity={0.15} metalness={0.99} roughness={0.12} />
            </mesh>
          ))}
        </group>
        {/* Space Gray Aluminum Puck Chassis */}
        <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.18, 64]} />
          <meshStandardMaterial color="#475569" bumpMap={textures.brushedMetalTexture || undefined} metalness={0.90} roughness={0.20} />
        </mesh>
        {/* USB-C Braided Cable */}
        <group position={[0, -1.25, -0.12]}>
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.08, 0.10, 0.28, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.7, -0.08]} rotation={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ═══════════════════════════════════════════════════════════
          DISPLAY DOCK STAND (SCENE 5 HERO SHOT BASE)
      ═══════════════════════════════════════════════════════════ */}
      <group ref={standRef} position={[0, -1.8, 0]}>
        <mesh>
          <boxGeometry args={[4.5, 0.4, 3.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[4.3, 0.02, 3.0]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   EXPORTED FULL-SCREEN CANVAS COMPONENT (4K PBR RENDERER)
───────────────────────────────────────────────────────── */
export default function ChargerScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        {/* High-Key Studio Lighting Rig */}
        <ambientLight intensity={1.15} />
        <directionalLight position={[6, 8, 12]} intensity={7.5} color="#ffffff" />
        <directionalLight position={[-8, 6, 12]} intensity={6.0} color="#f8fafc" />
        <directionalLight position={[0, 2, 14]} intensity={5.0} color="#ffffff" />
        <directionalLight position={[0, 12, 6]} intensity={4.5} color="#e0f2fe" />
        <directionalLight position={[0, -8, 6]} intensity={3.5} color="#ffffff" />

        {/* Soft Contact Shadows */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.35} scale={10} blur={2.5} far={4} />

        <Suspense fallback={null}>
          <SpaceParticles />
          <Scene3DGroup scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
