'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, RoundedBox, ContactShadows } from '@react-three/drei';
import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   4K PROCEDURAL TEXTURE ENGINE (CACHED SINGLETON)
───────────────────────────────────────────────────────── */
let cachedTextures: {
  screenTexture: THREE.CanvasTexture;
  brushedMap: THREE.CanvasTexture;
  microGrainMap: THREE.CanvasTexture;
  lensGrooveMap: THREE.CanvasTexture;
  pcbCircuitMap: THREE.CanvasTexture;
  batteryFoilMap: THREE.CanvasTexture;
} | null = null;

function getPBRTextures() {
  if (cachedTextures) return cachedTextures;
  if (typeof window === 'undefined') {
    return {
      screenTexture: null as any,
      brushedMap: null as any,
      microGrainMap: null as any,
      lensGrooveMap: null as any,
      pcbCircuitMap: null as any,
      batteryFoilMap: null as any,
    };
  }

  /* 1. 4K DISPLAY SCREEN TEXTURE (2048 x 4096) */
  const cScreen = document.createElement('canvas');
  cScreen.width = 2048; cScreen.height = 4096;
  const ctxS = cScreen.getContext('2d');
  if (ctxS) {
    const grad = ctxS.createLinearGradient(0, 0, 2048, 4096);
    grad.addColorStop(0.00, '#060210');
    grad.addColorStop(0.25, '#2e1065');
    grad.addColorStop(0.50, '#581c87');
    grad.addColorStop(0.75, '#1e0836');
    grad.addColorStop(1.00, '#040108');
    ctxS.fillStyle = grad;
    ctxS.fillRect(0, 0, 2048, 4096);

    // Dynamic Island Notch
    ctxS.fillStyle = '#000000';
    ctxS.beginPath();
    ctxS.roundRect(824, 120, 400, 110, 55);
    ctxS.fill();

    // Lockscreen Time "9:00 AM"
    ctxS.fillStyle = '#ffffff';
    ctxS.font = '700 280px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctxS.textAlign = 'center';
    ctxS.fillText('9:00 AM', 1024, 620);

    // Lockscreen Date "FRIDAY, AUGUST 22"
    ctxS.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctxS.font = '600 85px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctxS.fillText('FRIDAY, AUGUST 22', 1024, 760);

    // Hackathon Event Pass Card
    ctxS.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctxS.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctxS.lineWidth = 10;
    ctxS.beginPath();
    ctxS.roundRect(200, 1100, 1648, 2200, 80);
    ctxS.fill();
    ctxS.stroke();

    // Subtitle
    ctxS.shadowColor = '#a855f7';
    ctxS.shadowBlur = 40;
    ctxS.fillStyle = '#a855f7';
    ctxS.font = '800 95px -apple-system, BlinkMacSystemFont, sans-serif';
    ctxS.fillText('⚡ MAD REG 2026', 1024, 1340);
    ctxS.shadowBlur = 0;

    // Main Event Title "APP RADIC - 26"
    ctxS.fillStyle = '#ffffff';
    ctxS.font = '700 135px -apple-system, BlinkMacSystemFont, sans-serif';
    ctxS.fillText('APP RADIC - 26', 1024, 1580);

    // Event Date & Time Badge
    ctxS.fillStyle = 'rgba(168, 85, 247, 0.25)';
    ctxS.strokeStyle = '#c084fc';
    ctxS.lineWidth = 6;
    ctxS.beginPath();
    ctxS.roundRect(350, 1820, 1348, 170, 40);
    ctxS.fill();
    ctxS.stroke();

    ctxS.fillStyle = '#f3e8ff';
    ctxS.font = '700 70px sans-serif';
    ctxS.fillText('📅 AUGUST 22nd • 9:00 AM', 1024, 1930);

    // Track Badges
    const tracks = ['AI & ML', 'WEB3', 'IoT', 'CLOUD'];
    tracks.forEach((tr, idx) => {
      const bx = 280 + (idx % 2) * 780;
      const by = 2140 + Math.floor(idx / 2) * 220;
      ctxS.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctxS.beginPath();
      ctxS.roundRect(bx, by, 700, 170, 35);
      ctxS.fill();
      ctxS.fillStyle = '#ffffff';
      ctxS.font = '600 70px sans-serif';
      ctxS.fillText(tr, bx + 350, by + 110);
    });

    // Action Button
    const btnGrad = ctxS.createLinearGradient(300, 2800, 1748, 2800);
    btnGrad.addColorStop(0, '#7c3aed');
    btnGrad.addColorStop(1, '#c084fc');
    ctxS.fillStyle = btnGrad;
    ctxS.beginPath();
    ctxS.roundRect(300, 2800, 1448, 240, 70);
    ctxS.fill();

    ctxS.fillStyle = '#ffffff';
    ctxS.font = '800 90px sans-serif';
    ctxS.fillText('REGISTER NOW →', 1024, 2950);

    // Home Indicator Bar
    ctxS.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctxS.beginPath();
    ctxS.roundRect(724, 3880, 600, 28, 14);
    ctxS.fill();
  }

  const screenTexture = new THREE.CanvasTexture(cScreen);
  screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
  screenTexture.magFilter = THREE.LinearFilter;
  screenTexture.generateMipmaps = true;
  screenTexture.anisotropy = 8;

  /* 2. Brushed Titanium Map (512 x 512) */
  const c1 = document.createElement('canvas'); c1.width = 512; c1.height = 512;
  const ctx1 = c1.getContext('2d');
  if (ctx1) {
    ctx1.fillStyle = '#808080'; ctx1.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512; const y = Math.random() * 512;
      const len = 30 + Math.random() * 80;
      const val = Math.floor(110 + Math.random() * 110);
      ctx1.fillStyle = `rgb(${val},${val},${val})`;
      ctx1.fillRect(x, y, 1.8, len);
    }
  }
  const brushedMap = new THREE.CanvasTexture(c1);
  brushedMap.wrapS = THREE.RepeatWrapping; brushedMap.wrapT = THREE.RepeatWrapping;
  brushedMap.repeat.set(2, 4);

  /* 3. Micro-Grain Scattering Map (256 x 256) */
  const c2 = document.createElement('canvas'); c2.width = 256; c2.height = 256;
  const ctx2 = c2.getContext('2d');
  if (ctx2) {
    const img = ctx2.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = Math.floor(140 + Math.random() * 40);
      img.data[i] = n; img.data[i + 1] = n; img.data[i + 2] = n; img.data[i + 3] = 255;
    }
    ctx2.putImageData(img, 0, 0);
  }
  const microGrainMap = new THREE.CanvasTexture(c2);
  microGrainMap.wrapS = THREE.RepeatWrapping; microGrainMap.wrapT = THREE.RepeatWrapping;
  microGrainMap.repeat.set(6, 6);

  /* 4. Lens Groove Map (256 x 256) */
  const c3 = document.createElement('canvas'); c3.width = 256; c3.height = 256;
  const ctx3 = c3.getContext('2d');
  if (ctx3) {
    ctx3.fillStyle = '#808080'; ctx3.fillRect(0, 0, 256, 256);
    for (let r = 12; r < 120; r += 6) {
      ctx3.beginPath(); ctx3.arc(128, 128, r, 0, Math.PI * 2);
      ctx3.strokeStyle = `rgba(220,220,220,0.65)`;
      ctx3.lineWidth = 2.4; ctx3.stroke();
    }
  }
  const lensGrooveMap = new THREE.CanvasTexture(c3);

  /* 5. A19 PRO Logic Board Circuit Texture (512 x 512) */
  const c4 = document.createElement('canvas'); c4.width = 512; c4.height = 512;
  const ctx4 = c4.getContext('2d');
  if (ctx4) {
    ctx4.fillStyle = '#06160c'; ctx4.fillRect(0, 0, 512, 512);
    ctx4.strokeStyle = '#00ff66'; ctx4.lineWidth = 3.5;
    for (let i = 0; i < 45; i++) {
      ctx4.beginPath();
      const x1 = Math.random() * 512; const y1 = Math.random() * 512;
      const x2 = x1 + (Math.random() - 0.5) * 200; const y2 = y1 + (Math.random() - 0.5) * 200;
      ctx4.moveTo(x1, y1); ctx4.lineTo(x2, y1); ctx4.lineTo(x2, y2);
      ctx4.stroke();
    }
    ctx4.fillStyle = '#f59e0b';
    for (let i = 0; i < 80; i++) {
      ctx4.fillRect(Math.random() * 500, Math.random() * 500, 8, 4);
    }
    ctx4.fillStyle = '#12131c'; ctx4.fillRect(160, 160, 192, 192);
    ctx4.strokeStyle = '#38bdf8'; ctx4.lineWidth = 4; ctx4.strokeRect(160, 160, 192, 192);
    ctx4.fillStyle = '#ffffff'; ctx4.font = 'bold 28px sans-serif';
    ctx4.textAlign = 'center';
    ctx4.fillText(' A19', 256, 250);
    ctx4.font = 'bold 18px sans-serif'; ctx4.fillStyle = '#38bdf8';
    ctx4.fillText('PRO', 256, 280);
  }
  const pcbCircuitMap = new THREE.CanvasTexture(c4);

  /* 6. Battery Foil Texture (256 x 256) */
  const c5 = document.createElement('canvas'); c5.width = 256; c5.height = 256;
  const ctx5 = c5.getContext('2d');
  if (ctx5) {
    ctx5.fillStyle = '#0c0d12'; ctx5.fillRect(0, 0, 256, 256);
    ctx5.fillStyle = 'rgba(255,255,255,0.8)'; ctx5.font = '20px sans-serif';
    ctx5.fillText('', 25, 45);
    ctx5.fillStyle = 'rgba(255,255,255,0.55)'; ctx5.font = '12px sans-serif';
    ctx5.fillText('Rechargeable', 25, 75);
    ctx5.fillText('Lithium Battery A3171', 25, 95);
    ctx5.fillText('3.86V - 4600mAh', 25, 115);
    ctx5.fillStyle = '#0284c7'; ctx5.fillRect(25, 160, 206, 2);
  }
  const batteryFoilMap = new THREE.CanvasTexture(c5);

  cachedTextures = {
    screenTexture: screenTexture as THREE.CanvasTexture,
    brushedMap: brushedMap as THREE.CanvasTexture,
    microGrainMap: microGrainMap as THREE.CanvasTexture,
    lensGrooveMap: lensGrooveMap as THREE.CanvasTexture,
    pcbCircuitMap: pcbCircuitMap as THREE.CanvasTexture,
    batteryFoilMap: batteryFoilMap as THREE.CanvasTexture,
  };

  return cachedTextures;
}

/* ─────────────────────────────────────────────────────────
   SECTION CONFIG — Continuous 360° scroll rotation schedule
───────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    range: [0.00, 0.12], name: 'hero',
    explosion: 0.00, rotY: 0.25, rotX: 0.05,
    posX: 2.3, posY: 0.1, scale: 1.00, glow: '#8b5cf6',
    wirelessCharging: 0.0, chargerExplosion: 0.0, chargerAttach: 0.0,
  },
  {
    range: [0.12, 0.25], name: 'stats',
    explosion: 0.65, rotY: 1.85, rotX: 0.25,
    posX: 1.2, posY: 0.0, scale: 1.05, glow: '#a855f7',
    wirelessCharging: 0.0, chargerExplosion: 0.0, chargerAttach: 0.0,
  },
  {
    range: [0.25, 0.38], name: 'about',
    explosion: 1.00, rotY: 3.45, rotX: -0.18,
    posX: 0.0, posY: 0.1, scale: 1.10, glow: '#c084fc',
    wirelessCharging: 0.0, chargerExplosion: 0.0, chargerAttach: 0.0,
  },
  {
    range: [0.38, 0.50], name: 'tracks',
    explosion: 0.45, rotY: 5.10, rotX: 0.12,
    posX: -0.8, posY: 0.0, scale: 1.02, glow: '#38bdf8',
    wirelessCharging: 0.0, chargerExplosion: 0.0, chargerAttach: 0.0,
  },
  {
    range: [0.50, 0.65], name: 'timeline',
    explosion: 0.00, rotY: 6.28, rotX: 0.08,
    posX: 0.0, posY: 0.0, scale: 1.00, glow: '#10b981',
    wirelessCharging: 0.0, chargerExplosion: 0.0, chargerAttach: 0.0,
  },
  {
    range: [0.65, 0.82], name: 'members',
    explosion: 0.00, rotY: 2.85, rotX: 0.18,
    posX: 1.0, posY: 0.0, scale: 1.02, glow: '#38bdf8',
    wirelessCharging: 1.0, chargerExplosion: 1.00, chargerAttach: 0.0,
  },
  {
    range: [0.82, 1.00], name: 'faq',
    explosion: 0.00, rotY: 2.85, rotX: 0.12,
    posX: 0.0, posY: -0.10, scale: 1.08, glow: '#10b981',
    wirelessCharging: 1.0, chargerExplosion: 0.00, chargerAttach: 1.0,
  },
];

function getSection(sp: number) {
  for (const s of SECTIONS) {
    if (sp >= s.range[0] && sp < s.range[1]) return s;
  }
  return SECTIONS[SECTIONS.length - 1];
}

/* ─────────────────────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────────────────────── */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      arr[i * 3    ] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.025;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#c084fc" size={0.04} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}

/* ─────────────────────────────────────────────────────────
   AUTHENTIC 3D APPLE MAGSAFE CHARGER & TEARDOWN ANIMATION
───────────────────────────────────────────────────────── */
function WirelessCharger({
  chargingAmount,
  explosionAmount = 0,
  attachAmount = 0,
  phonePos = [0, 0, 0],
  phoneRot = [0, 0, 0],
}: {
  chargingAmount: number;
  explosionAmount?: number;
  attachAmount?: number;
  phonePos?: [number, number, number];
  phoneRot?: [number, number, number];
}) {
  const padRef = useRef<THREE.Group>(null);
  const ringMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pulseRing1 = useRef<THREE.Mesh>(null);
  const pulseRing2 = useRef<THREE.Mesh>(null);
  const pulseRing3 = useRef<THREE.Mesh>(null);

  // 16 segmented NdFeB magnets array
  const magnetPositions = useMemo(() => {
    const arr: [number, number, number][] = [];
    const count = 16;
    const radius = 0.85;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      arr.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (padRef.current) {
      // 1. Compute Attached World Position on back glass panel
      const rotY = phoneRot[1];
      const attachX = phonePos[0] - 0.20 * Math.sin(rotY);
      const attachY = phonePos[1] - 0.10;
      const attachZ = phonePos[2] - 0.20 * Math.cos(rotY);

      // 2. Position Lerp: Left Side of Screen [-1.8, 0.0, 0.4] when exploded -> Snapped to phone back glass on attach
      const targetX = THREE.MathUtils.lerp(-1.8, attachX, attachAmount);
      const targetY = THREE.MathUtils.lerp(0.0,  attachY, attachAmount);
      const targetZ = THREE.MathUtils.lerp(0.4,  attachZ, attachAmount);

      padRef.current.position.set(targetX, targetY, targetZ);

      // 3. Rotation Lerp: Upright Vertical facing viewer (0.0) when exploded -> Match Phone Rotation on attach
      const targetRotX = THREE.MathUtils.lerp(0.0, phoneRot[0], attachAmount);
      const targetRotY = THREE.MathUtils.lerp(0.0, rotY, attachAmount);

      padRef.current.rotation.set(targetRotX, targetRotY, 0);
      padRef.current.scale.setScalar(chargingAmount * (0.95 + attachAmount * 0.05));
    }

    if (ringMatRef.current) {
      ringMatRef.current.emissiveIntensity = 0.8 + Math.sin(t * 6) * 0.4;
      ringMatRef.current.opacity = Math.min(chargingAmount * 0.98, 0.98);
    }

    // Radial Blue/Cyan Energy Wave Rays (active when attached)
    const rayAlpha = attachAmount * chargingAmount;
    if (pulseRing1.current) {
      const p1 = (t * 0.75) % 1;
      pulseRing1.current.scale.set(1 + p1 * 0.8, 1 + p1 * 0.8, 1);
      pulseRing1.current.position.z = -p1 * 0.35;
      (pulseRing1.current.material as THREE.MeshBasicMaterial).opacity = (1 - p1) * rayAlpha * 0.85;
    }
    if (pulseRing2.current) {
      const p2 = (t * 0.75 + 0.33) % 1;
      pulseRing2.current.scale.set(1 + p2 * 0.8, 1 + p2 * 0.8, 1);
      pulseRing2.current.position.z = -p2 * 0.35;
      (pulseRing2.current.material as THREE.MeshBasicMaterial).opacity = (1 - p2) * rayAlpha * 0.85;
    }
    if (pulseRing3.current) {
      const p3 = (t * 0.75 + 0.66) % 1;
      pulseRing3.current.scale.set(1 + p3 * 0.7, 1 + p3 * 0.7, 1);
      pulseRing3.current.position.z = -p3 * 0.35;
      (pulseRing3.current.material as THREE.MeshBasicMaterial).opacity = (1 - p3) * rayAlpha * 0.85;
    }
  });

  const ef = explosionAmount; // 1.0 when exploded (separated vertically on left side), 0.0 when gathered/assembled

  return (
    <group ref={padRef} position={[-1.8, 0, 0.4]}>
      {/* 1. Aluminum Housing (Rear Shell) & USB Cable (Top of Vertical Stack) */}
      <group position={[0, ef * 1.5, -ef * 0.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.25, 1.25, 0.13, 64]} rotation-x={Math.PI / 2} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.18} transparent opacity={chargingAmount} />
        </mesh>

        {/* Engraved Back Face: Apple Logo & MagSafe Branding */}
        <group position={[0, 0, -0.068]} rotation-y={Math.PI}>
          <mesh position={[0, 0.05, 0.002]}>
            <circleGeometry args={[0.22, 32]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} transparent opacity={chargingAmount} />
          </mesh>
          <mesh position={[0, 0, 0.002]}>
            <torusGeometry args={[0.65, 0.015, 16, 48]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} transparent opacity={chargingAmount * 0.6} />
          </mesh>
        </group>

        {/* Attached USB-C Power Cable */}
        <group position={[0, -1.25, 0]}>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.28, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} transparent opacity={chargingAmount} />
          </mesh>
          <mesh position={[0, -0.65, -0.1]}>
            <cylinderGeometry args={[0.045, 0.045, 1.2, 16]} rotation-x={0.2} />
            <meshStandardMaterial color="#ffffff" roughness={0.35} transparent opacity={chargingAmount} />
          </mesh>
          <group position={[0, -1.4, -0.22]}>
            <mesh>
              <boxGeometry args={[0.18, 0.45, 0.09]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.2} transparent opacity={chargingAmount} />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.12, 0.15, 0.04]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} transparent opacity={chargingAmount} />
            </mesh>
          </group>
        </group>
      </group>

      {/* 2. Heat Shield Disc Plate */}
      <group position={[0, ef * 0.9, -ef * 0.24]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.22, 1.22, 0.02, 64]} rotation-x={Math.PI / 2} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} transparent opacity={chargingAmount * 0.9} />
        </mesh>
      </group>

      {/* 3. Control Circuit Board (Power IC PCB) */}
      <group position={[0, ef * 0.3, -ef * 0.08]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.20, 1.20, 0.025, 64]} rotation-x={Math.PI / 2} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} emissive="#00ff66" emissiveIntensity={0.2} transparent opacity={chargingAmount * 0.95} />
        </mesh>
        {/* Microchips & Power IC */}
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[0.35, 0.35, 0.02]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} transparent opacity={chargingAmount} />
        </mesh>
      </group>

      {/* 4. NdFeB Segmented Magnet Array Ring */}
      <group position={[0, -ef * 0.3, ef * 0.08]}>
        {magnetPositions.map(([x, y, z], i) => (
          <mesh key={`mag-${i}`} position={[x, y, z]} rotation-x={Math.PI / 2}>
            <boxGeometry args={[0.16, 0.22, 0.04]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.96} roughness={0.15} transparent opacity={chargingAmount * 0.95} />
          </mesh>
        ))}
      </group>

      {/* 5. Wireless Charging Copper Coil (Spiraling Copper Wire) */}
      <group position={[0, -ef * 0.9, ef * 0.24]}>
        {[0.4, 0.52, 0.64, 0.76].map((r, i) => (
          <mesh key={`copper-${i}`} position={[0, 0, 0]}>
            <torusGeometry args={[r, 0.035, 16, 48]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.85}
              roughness={0.25}
              emissive="#b45309"
              emissiveIntensity={0.4}
              transparent
              opacity={chargingAmount * 0.95}
            />
          </mesh>
        ))}
      </group>

      {/* 6. Protective Glass / PC Front Pad Face & MagSafe LED Ring (Bottom of Vertical Stack) */}
      <group position={[0, -ef * 1.5, ef * 0.4]}>
        <mesh position={[0, 0, 0.068]}>
          <cylinderGeometry args={[1.16, 1.16, 0.015, 64]} rotation-x={Math.PI / 2} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} transparent opacity={chargingAmount} />
        </mesh>

        <mesh position={[0, 0, 0.076]}>
          <torusGeometry args={[1.12, 0.035, 16, 64]} />
          <meshStandardMaterial
            ref={ringMatRef}
            color="#10b981"
            emissive="#34d399"
            emissiveIntensity={0.9}
            transparent
            opacity={chargingAmount}
          />
        </mesh>
      </group>

      {/* 7. Radial Cyan/Blue Energy Field Rays (Active on Attachment) */}
      <mesh ref={pulseRing1} position={[0, 0, -0.1]}>
        <torusGeometry args={[1.35, 0.04, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={pulseRing2} position={[0, 0, -0.1]}>
        <torusGeometry args={[1.35, 0.04, 16, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={pulseRing3} position={[0, 0, -0.1]}>
        <torusGeometry args={[1.35, 0.04, 16, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function WirelessParticles({ chargingAmount }: { chargingAmount: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      const r = Math.random() * 1.1;
      const theta = Math.random() * Math.PI * 2;
      arr[i * 3]     = Math.cos(theta) * r;
      arr[i * 3 + 1] = -2.0 + Math.random() * 2.2;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (ref.current && chargingAmount > 0.02) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 60; i++) {
        pos[i * 3 + 1] += 0.025;
        if (pos[i * 3 + 1] > 0.6) {
          pos[i * 3 + 1] = -2.0;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (chargingAmount <= 0.02) return null;

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#34d399" size={0.07} sizeAttenuation depthWrite={false} opacity={chargingAmount * 0.85} />
    </Points>
  );
}

/* ─────────────────────────────────────────────────────────
   AUTHENTIC MAGSAFE ON-SCREEN CHARGING WIDGET (⚡ 75% CHARGED)
───────────────────────────────────────────────────────── */
function MagSafeScreenWidget({ chargingAmount }: { chargingAmount: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.8;
    }
  });

  if (chargingAmount <= 0.05) return null;

  return (
    <group position={[0, 0.2, 0.102]} scale={chargingAmount * 0.85}>
      {/* Outer Glowing Green MagSafe Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.65, 0.045, 16, 64]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#34d399"
          emissiveIntensity={1.4}
          transparent
          opacity={chargingAmount * 0.95}
        />
      </mesh>

      {/* Inner Dark Glass Circle Backing */}
      <mesh>
        <circleGeometry args={[0.60, 48]} />
        <meshStandardMaterial
          color="#022c22"
          emissive="#064e3b"
          emissiveIntensity={0.8}
          transparent
          opacity={chargingAmount * 0.88}
        />
      </mesh>

      {/* Center Emissive Lightning Bolt Symbol ⚡ */}
      <mesh position={[0, 0.06, 0.01]} rotation-z={0.25}>
        <boxGeometry args={[0.15, 0.32, 0.01]} />
        <meshStandardMaterial color="#ffffff" emissive="#34d399" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   IPHONE 17 PRO NATURAL TITANIUM MODEL (RIGHT-SIDE LOAD + SILKY 60 FPS ANTI-LAG)
───────────────────────────────────────────────────────── */
function PhoneGroup({
  scrollProgress, mouseX, mouseY,
}: {
  scrollProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const textures = useMemo(() => getPBRTextures(), []);

  const groupRef    = useRef<THREE.Group>(null);
  const frontRef    = useRef<THREE.Group>(null);
  const backRef     = useRef<THREE.Group>(null);
  const camRef      = useRef<THREE.Group>(null);
  const btnLRef     = useRef<THREE.Group>(null);
  const btnRRef     = useRef<THREE.Group>(null);
  const internalRef = useRef<THREE.Group>(null);

  const screenLight   = useRef<THREE.PointLight>(null);
  const rimLight      = useRef<THREE.PointLight>(null);
  const chargingLight = useRef<THREE.PointLight>(null);

  const internalMats = useRef<THREE.MeshStandardMaterial[]>([]);

  /* ── INITIAL STATE: IMMEDIATELY LOADS ON THE RIGHT SIDE (posX: 2.3) ── */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const ls = useRef({
    rotY: 0.25, rotX: 0.05,
    posX: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 2.3,
    posY: 0.1,
    scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.68 : 1.0,
    explosion: 0,
    wirelessCharging: 0,
    chargerExplosion: 0,
    chargerAttach: 0,
    glowColor: new THREE.Color('#8b5cf6'),
  });
  const targetGlow = useRef(new THREE.Color('#8b5cf6'));

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    const smoothDelta = Math.min(delta, 0.033);
    const sp = Math.max(0, Math.min(1, scrollProgress.get()));
    const mx = mouseX.get() * 0.10;
    const my = mouseY.get() * 0.06;
    const t  = clock.elapsedTime;

    const target = getSection(sp);
    targetGlow.current.set(target.glow);

    /* Responsive position and scale targets for Mobile vs Desktop */
    const targetX = isMobile ? 0 : target.posX;
    const targetY = isMobile ? target.posY * 0.4 : target.posY;
    const targetScale = isMobile ? target.scale * 0.58 : target.scale;

    /* Silky-smooth 60 FPS anti-lag frame interpolation */
    const L = THREE.MathUtils.damp(0, 1, 14, smoothDelta);
    ls.current.rotY             = THREE.MathUtils.lerp(ls.current.rotY,             target.rotY + mx,           L);
    ls.current.rotX             = THREE.MathUtils.lerp(ls.current.rotX,             target.rotX - my,           L);
    ls.current.posX             = THREE.MathUtils.lerp(ls.current.posX,             targetX,                    L);
    ls.current.posY             = THREE.MathUtils.lerp(ls.current.posY,             targetY,                    L);
    ls.current.scale            = THREE.MathUtils.lerp(ls.current.scale,            targetScale,                L);
    ls.current.explosion        = THREE.MathUtils.lerp(ls.current.explosion,        target.explosion,           L * 0.95);
    ls.current.wirelessCharging = THREE.MathUtils.lerp(ls.current.wirelessCharging, target.wirelessCharging ?? 0, L * 0.95);
    ls.current.chargerExplosion = THREE.MathUtils.lerp(ls.current.chargerExplosion, target.chargerExplosion ?? 0, L * 0.95);
    ls.current.chargerAttach    = THREE.MathUtils.lerp(ls.current.chargerAttach,    target.chargerAttach ?? 0,    L * 0.95);
    ls.current.glowColor.lerp(targetGlow.current, 0.08);

    const ef = ls.current.explosion;
    const wc = ls.current.wirelessCharging;
    const assembled = 1 - ef;

    /* ── Main Phone Group Rotation & Float ── */
    const floatWobble = assembled * 0.015;
    groupRef.current.rotation.y  = ls.current.rotY + Math.sin(t * 0.35) * floatWobble;
    groupRef.current.rotation.x  = ls.current.rotX + Math.sin(t * 0.22) * floatWobble * 0.8;
    groupRef.current.position.x  = ls.current.posX;
    groupRef.current.position.y  = ls.current.posY + Math.sin(t * 0.45) * 0.04 * assembled;
    groupRef.current.scale.setScalar(ls.current.scale);

    /* ── FRONT DISPLAY ASSEMBLY ── */
    if (frontRef.current) {
      frontRef.current.position.z = ef * 2.1;
      frontRef.current.rotation.x = ef * 0.36;
      frontRef.current.rotation.y = ef * 0.08;
    }

    /* ── BACK FROSTED GLASS & APPLE LOGO ── */
    if (backRef.current) {
      backRef.current.position.z = ef * -2.1;
      backRef.current.rotation.x = ef * -0.32;
    }

    /* ── TRIPLE CAMERA SYSTEM ── */
    if (camRef.current) {
      camRef.current.position.x = 0.0 - ef * 0.25;
      camRef.current.position.y = 1.48 + ef * 0.95;
      camRef.current.position.z = -0.10 - ef * 2.35;
      camRef.current.rotation.z = ef * 0.55;
      camRef.current.rotation.x = ef * -0.25;
    }

    /* ── ACTION BUTTON + VOLUME BUTTONS (LEFT) ── */
    if (btnLRef.current) {
      btnLRef.current.position.x = -ef * 1.05;
      btnLRef.current.position.z =  ef * 0.55;
      btnLRef.current.rotation.z =  ef * 0.35;
    }

    /* ── SIDE POWER BUTTON (RIGHT) ── */
    if (btnRRef.current) {
      btnRRef.current.position.x =  ef * 1.05;
      btnRRef.current.position.z =  ef * 0.55;
      btnRRef.current.rotation.z = -ef * 0.35;
    }

    /* ── INTERNAL HARDWARE TEARDOWN COMPONENTS ── */
    if (internalRef.current) {
      internalRef.current.position.z = -0.05 - ef * 0.25;
    }
    internalMats.current.forEach(mat => {
      mat.opacity = Math.min(ef * 1.35, 0.96);
    });

    /* ── LIGHTS ── */
    if (screenLight.current) {
      screenLight.current.color.copy(ls.current.glowColor);
      screenLight.current.intensity = 1.6 + ef * 1.8;
      screenLight.current.position.z = 1.3 + ef * 2.0;
    }
    if (rimLight.current) {
      rimLight.current.color.copy(ls.current.glowColor);
      rimLight.current.intensity = 0.6 + ef * 0.8;
    }
    if (chargingLight.current) {
      chargingLight.current.intensity = wc * 3.5;
    }
  });

  const imat = (mat: THREE.MeshStandardMaterial | null) => {
    if (mat && !internalMats.current.includes(mat)) internalMats.current.push(mat);
  };

  return (
    <>
      {/* ── 3D Wireless Charging Pad & MagSafe Energy Aura (World Coordinates) ── */}
      <WirelessCharger
        chargingAmount={ls.current.wirelessCharging}
        explosionAmount={ls.current.chargerExplosion}
        attachAmount={ls.current.chargerAttach}
        phonePos={[ls.current.posX, ls.current.posY, 0]}
        phoneRot={[ls.current.rotX, ls.current.rotY, 0]}
      />
      <WirelessParticles chargingAmount={ls.current.wirelessCharging} />

      <group ref={groupRef}>

        {/* ── Grounding Contact Shadow ── */}
        <ContactShadows
          position={[0, -2.45, 0]}
          opacity={0.65}
          scale={8.5}
          blur={2.0}
          far={3.0}
          color="#000000"
        />

      {/* ── Dynamic Lights ── */}
      <pointLight ref={screenLight} position={[0, 0, 1.3]} intensity={1.6} distance={8} />
      <pointLight ref={rimLight}    position={[0, 2.2, -2.2]} intensity={0.6} distance={7} color="#a855f7" />
      <pointLight ref={chargingLight} position={[0, -1.8, 0]} intensity={0} distance={6} color="#10b981" />

      {/* ══════════════════════════════════
          FRONT VIEW (4K DIRECT CANVAS MAPPED OLED DISPLAY)
      ══════════════════════════════════ */}
      <group ref={frontRef}>
        {/* OLED Screen Mesh */}
        <mesh position={[0, 0.1, 0.092]} castShadow receiveShadow>
          <planeGeometry args={[1.96, 3.96]} />
          <meshStandardMaterial
            map={textures.screenTexture || undefined}
            roughness={0.04}
            metalness={0.1}
            emissive={new THREE.Color('#3b0764')}
            emissiveIntensity={0.18}
          />
        </mesh>

        {/* MagSafe Charging Ring & Lightning Bolt On-Screen Widget */}
        <MagSafeScreenWidget chargingAmount={ls.current.chargerAttach} />

        {/* Ceramic Shield Glass Reflection Layer */}
        <mesh position={[0, 0.1, 0.096]}>
          <planeGeometry args={[1.96, 3.96]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.02}
            metalness={0.05}
            transparent
            opacity={0.06}
          />
        </mesh>
      </group>

      {/* ══════════════════════════════════
          ANODIZED NATURAL TITANIUM CHASSIS
      ══════════════════════════════════ */}
      <RoundedBox args={[2.08, 4.42, 0.17]} radius={0.21} smoothness={6} castShadow receiveShadow>
        <meshStandardMaterial
          color="#94959a"
          metalness={0.96}
          roughness={0.20}
          bumpMap={textures.brushedMap || undefined}
          bumpScale={0.012}
        />
      </RoundedBox>

      {/* Titanium Beveled Outer Rail */}
      <RoundedBox args={[2.14, 4.48, 0.15]} radius={0.23} smoothness={6}>
        <meshStandardMaterial
          color="#a8a9ae"
          metalness={0.98}
          roughness={0.18}
          side={THREE.BackSide}
        />
      </RoundedBox>

      {/* Antenna Bands on Frame */}
      {[-1.8, 1.8].map((y, i) => (
        <group key={i}>
          <mesh position={[1.05, y, 0]}>
            <boxGeometry args={[0.02, 0.03, 0.175]} />
            <meshStandardMaterial color="#505156" roughness={0.4} />
          </mesh>
          <mesh position={[-1.05, y, 0]}>
            <boxGeometry args={[0.02, 0.03, 0.175]} />
            <meshStandardMaterial color="#505156" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* BOTTOM VIEW: USB-C Port, Speaker & Mic Holes */}
      <group position={[0, -2.21, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.34, 0.02, 0.09]} />
          <meshStandardMaterial color="#05050d" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.01, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {[0.35, 0.50, 0.65, 0.80].map((x, i) => (
          <mesh key={`spk-${i}`} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        ))}
        {[-0.35, -0.50, -0.65].map((x, i) => (
          <mesh key={`mic-${i}`} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        ))}
      </group>

      {/* ══════════════════════════════════
          INTERNAL HARDWARE TEARDOWN COMPONENTS
      ══════════════════════════════════ */}
      <group ref={internalRef}>
        {/* Logic Board (Mainboard with A19 PRO Processor) */}
        <group position={[0, 0.5, -0.06]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.72, 2.6, 0.022]} />
            <meshStandardMaterial
              ref={imat}
              map={textures.pcbCircuitMap || undefined}
              color="#ffffff"
              emissive="#00ff66"
              emissiveIntensity={0.3}
              transparent opacity={0}
            />
          </mesh>
          {/* A19 PRO Processor Chip */}
          <mesh position={[0, 0.5, 0.026]} castShadow receiveShadow>
            <boxGeometry args={[0.68, 0.68, 0.03]} />
            <meshStandardMaterial
              ref={imat}
              color="#12131c"
              emissive="#38bdf8"
              emissiveIntensity={0.4}
              transparent opacity={0}
              metalness={0.9}
              bumpMap={textures.brushedMap || undefined}
              bumpScale={0.02}
            />
          </mesh>
          {[[-0.45, 0.0], [0.45, 0.0], [-0.45, -0.4], [0.45, -0.4]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.024]} castShadow receiveShadow>
              <boxGeometry args={[0.28, 0.22, 0.024]} />
              <meshStandardMaterial
                ref={imat}
                color="#0a180a"
                emissive="#005500"
                emissiveIntensity={0.4}
                transparent opacity={0}
              />
            </mesh>
          ))}
        </group>

        {/* Rechargeable Lithium Battery (4600mAh) */}
        <group position={[-0.15, -1.0, -0.07]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.34, 1.95, 0.06]} />
            <meshStandardMaterial
              ref={imat}
              map={textures.batteryFoilMap || undefined}
              color="#ffffff"
              transparent opacity={0}
              metalness={0.6}
            />
          </mesh>
        </group>

        {/* Taptic Engine Module */}
        <group position={[0.62, -1.65, -0.07]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.42, 0.05]} />
            <meshStandardMaterial
              ref={imat}
              color="#1e293b"
              metalness={0.88}
              roughness={0.3}
              transparent opacity={0}
            />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════
          BACK VIEW: FROSTED SATIN REAR GLASS
      ══════════════════════════════════ */}
      <group ref={backRef}>
        {/* Satin Frosted Rear Panel */}
        <RoundedBox args={[2.06, 4.40, 0.05]} radius={0.20} smoothness={6} position={[0, 0, -0.065]} castShadow receiveShadow>
          <meshStandardMaterial
            color="#58595e"
            metalness={0.15}
            roughness={0.32}
            bumpMap={textures.microGrainMap || undefined}
            bumpScale={0.005}
          />
        </RoundedBox>

        {/* Chrome Metallic Apple Emblem */}
        <mesh position={[0, 0.1, -0.092]}>
          <circleGeometry args={[0.20, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={1.0}
            roughness={0.01}
          />
        </mesh>
      </group>

      {/* ══════════════════════════════════
          FULL-WIDTH TOP CAMERA ISLAND
      ══════════════════════════════════ */}
      <group ref={camRef} position={[0.0, 1.48, -0.10]}>
        {/* Full-width Wide Camera Plateau Housing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.78, 1.22, 0.045]} />
          <meshStandardMaterial
            color="#1e1f23"
            metalness={0.4}
            roughness={0.08}
          />
        </mesh>

        {/* Lens 1: Top-Left */}
        <group position={[-0.50, 0.22, 0.04]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.04, 24]} rotation-x={Math.PI / 2} />
            <meshStandardMaterial color="#02020a" roughness={0.04} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.022]} castShadow receiveShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.008, 24]} rotation-x={Math.PI / 2} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.02}
              metalness={0.9}
              bumpMap={textures.lensGrooveMap || undefined}
              bumpScale={0.008}
            />
          </mesh>
          <mesh position={[0, 0, 0.023]}>
            <torusGeometry args={[0.15, 0.015, 16, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={1.0} roughness={0.02} />
          </mesh>
        </group>

        {/* Lens 2: Bottom-Left */}
        <group position={[-0.50, -0.24, 0.04]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.04, 24]} rotation-x={Math.PI / 2} />
            <meshStandardMaterial color="#02020a" roughness={0.04} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.022]} castShadow receiveShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.008, 24]} rotation-x={Math.PI / 2} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.02}
              metalness={0.9}
              bumpMap={textures.lensGrooveMap || undefined}
              bumpScale={0.008}
            />
          </mesh>
          <mesh position={[0, 0, 0.023]}>
            <torusGeometry args={[0.15, 0.015, 16, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={1.0} roughness={0.02} />
          </mesh>
        </group>

        {/* Lens 3: Center Big Periscope Telephoto Lens */}
        <group position={[0.02, 0.0, 0.04]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.04, 24]} rotation-x={Math.PI / 2} />
            <meshStandardMaterial color="#02020a" roughness={0.04} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.022]} castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.008, 24]} rotation-x={Math.PI / 2} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.02}
              metalness={0.9}
              bumpMap={textures.lensGrooveMap || undefined}
              bumpScale={0.008}
            />
          </mesh>
          <mesh position={[0, 0, 0.023]}>
            <torusGeometry args={[0.17, 0.015, 16, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={1.0} roughness={0.02} />
          </mesh>
        </group>

        {/* TrueTone Dual Flash (Top Right) */}
        <mesh position={[0.54, 0.28, 0.035]}>
          <circleGeometry args={[0.075, 20]} />
          <meshStandardMaterial color="#fffbebe" emissive="#fef08a" emissiveIntensity={0.7} />
        </mesh>

        {/* LiDAR Scanner (Bottom Right) */}
        <mesh position={[0.54, -0.22, 0.035]}>
          <circleGeometry args={[0.07, 24]} />
          <meshStandardMaterial color="#000000" roughness={0.05} metalness={0.9} />
        </mesh>
      </group>

      {/* ══════════════════════════════════
          LEFT SIDE VIEW: ACTION BUTTON, VOLUME UP, VOLUME DOWN
      ══════════════════════════════════ */}
      <group ref={btnLRef}>
        <mesh position={[-1.06, 1.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.042, 0.18, 0.09]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.95}
            roughness={0.22}
            emissive="#1d4ed8"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[-1.06, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.042, 0.28, 0.09]} />
          <meshStandardMaterial
            color="#8c8d92"
            metalness={0.95}
            roughness={0.22}
          />
        </mesh>
        <mesh position={[-1.06, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.042, 0.28, 0.09]} />
          <meshStandardMaterial
            color="#8c8d92"
            metalness={0.95}
            roughness={0.22}
          />
        </mesh>
      </group>

      {/* ══════════════════════════════════
          RIGHT SIDE VIEW: SIDE POWER KEY
      ══════════════════════════════════ */}
      <group ref={btnRRef}>
        <mesh position={[1.06, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.042, 0.45, 0.10]} />
          <meshStandardMaterial
            color="#8c8d92"
            metalness={0.95}
            roughness={0.22}
          />
        </mesh>
      </group>

    </group>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   SILKY 60 FPS LIGHTING RIG
───────────────────────────────────────────────────────── */
function Scene({
  scrollProgress, mouseX, mouseY,
}: {
  scrollProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  return (
    <>
      <ambientLight intensity={0.6} color="#38bdf8" />
      
      {/* Primary Key Light with Optimized 1024 Shadow Mapping */}
      <directionalLight
        position={[-5, 7, 6]}
        intensity={1.7}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[5, -3, -3]} intensity={0.8} color="#f8fafc" />
      <directionalLight position={[0, 7, -5]} intensity={0.6} color="#c084fc" />
      <pointLight position={[0, 0, 4]} intensity={0.7} color="#ffffff" distance={8} />

      <Particles />
      <Suspense fallback={null}>
        <PhoneGroup scrollProgress={scrollProgress} mouseX={mouseX} mouseY={mouseY} />
      </Suspense>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN EXPORT (SILKY-SMOOTH 60 FPS ULTRA-LIGHT SCENE)
───────────────────────────────────────────────────────── */
export default function PhoneScene({
  scrollProgress, mouseX, mouseY,
}: {
  scrollProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const [dpr, setDpr] = useState<[number, number]>([1.0, 1.5]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      setDpr(isMobile ? [0.75, 1.25] : [1.0, Math.min(1.5, window.devicePixelRatio)]);
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          precision: 'highp',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <Scene scrollProgress={scrollProgress} mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  );
}
