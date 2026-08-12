"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { 
  Smartphone, 
  Cpu, 
  Globe, 
  ShieldAlert, 
  HeartHandshake, 
  Award,
  Zap,
  Code,
  Users,
  Trophy,
  ArrowRight,
  Sparkles
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroLoader from "@/components/IntroLoader";
import CustomCursor from "@/components/CustomCursor";
import Countdown from "@/components/Countdown";
import StatCounter from "@/components/StatCounter";
import AccordionItem from "@/components/AccordionItem";
import { EVENT_CONFIG } from "@/config/event";

// 3D phone — dynamic import (no SSR, needs WebGL)
const PhoneScene = dynamic(() => import("@/components/Phone3D/PhoneScene"), { ssr: false });

const iconMap: Record<string, React.ComponentType<any>> = {
  Smartphone, Cpu, Globe, ShieldAlert, HeartHandshake, Award
};

// Section color palettes — deep space cyber gradients for obsidian background
const SECTION_GRADIENTS = [
  // Hero: deep space purple
  { bg: "linear-gradient(180deg, #09051d 0%, #150a36 50%, #08041a 100%)" },
  // Stats: midnight navy
  { bg: "linear-gradient(180deg, #060412 0%, #0a0820 100%)" },
  // About: obsidian violet
  { bg: "linear-gradient(180deg, #0a061e 0%, #170d3d 50%, #0b0722 100%)" },
  // Tracks: deep cyan space
  { bg: "linear-gradient(180deg, #04091a 0%, #081230 50%, #050a1d 100%)" },
  // Timeline: deep periwinkle indigo
  { bg: "linear-gradient(180deg, #060924 0%, #0d1240 50%, #070928 100%)" },
  // Prizes: deep warm magenta amber space
  { bg: "linear-gradient(180deg, #1f041a 0%, #38072c 50%, #1c0316 100%)" },
  // Rules/FAQ: deep violet space
  { bg: "linear-gradient(180deg, #0f0a28 0%, #1a0f3d 50%, #09051b 100%)" }
];




export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState<{
    teamsCount: number;
    participantsCount: number;
    isLoaded: boolean;
  }>({
    teamsCount: 0,
    participantsCount: 0,
    isLoaded: false
  });

  // Fetch real-time registration stats directly from backend MySQL database
  useEffect(() => {
    const fetchRealTimeStats = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE_URL}/api/registrations/dashboard/stats`);
        if (res.ok) {
          const data = await res.json();
          setRealTimeStats({
            teamsCount: data.totalTeams ?? data.totalRegistrations ?? 0,
            participantsCount: data.totalParticipants ?? 0,
            isLoaded: true
          });
        }
      } catch (e) {
        console.error("Could not fetch live stats:", e);
      }
    };
    fetchRealTimeStats();
  }, []);

  // Mouse motion values for 3D phone parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX.set((e.touches[0].clientX / window.innerWidth  - 0.5) * 2);
        mouseY.set((e.touches[0].clientY / window.innerHeight - 0.5) * 2);
      }
    };
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [mouseX, mouseY]);


  // Framer scroll progress across the full page
  // Track global window scroll — avoids the hydration ref issue with useScroll+target
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

  // Background gradient color transitions mapped to scroll
  const bgOpacity0 = useTransform(smoothProgress, [0, 0.14, 0.28], [1, 0, 0]);
  const bgOpacity1 = useTransform(smoothProgress, [0.05, 0.14, 0.22, 0.28], [0, 1, 1, 0]);
  const bgOpacity2 = useTransform(smoothProgress, [0.2, 0.28, 0.36, 0.42], [0, 1, 1, 0]);
  const bgOpacity3 = useTransform(smoothProgress, [0.35, 0.43, 0.52, 0.58], [0, 1, 1, 0]);
  const bgOpacity4 = useTransform(smoothProgress, [0.50, 0.58, 0.67, 0.73], [0, 1, 1, 0]);
  const bgOpacity5 = useTransform(smoothProgress, [0.65, 0.73, 0.82, 0.88], [0, 1, 1, 0]);
  const bgOpacity6 = useTransform(smoothProgress, [0.80, 0.88, 1.0], [0, 1, 1]);

  const bgOpacities = [bgOpacity0, bgOpacity1, bgOpacity2, bgOpacity3, bgOpacity4, bgOpacity5, bgOpacity6];

  // Animated floating orb positions driven by scroll
  const orb1Y = useTransform(smoothProgress, [0, 1], ["0%", "-60%"]);
  const orb2Y = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);
  const orb3X = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const orb1Scale = useTransform(smoothProgress, [0, 0.4, 0.7, 1], [1, 1.4, 0.9, 1.2]);
  const orb2Scale = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [0.8, 1.3, 1.1, 0.9]);

  // Grid opacity rhythmically pulses on scroll
  const gridOpacity = useTransform(smoothProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0.35, 0.2, 0.4, 0.15, 0.35, 0.25]);

  // Orb color transforms — blue, purple, cyan, magenta space palette
  const orb1BgColor = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "rgba(139,92,246,0.22)",
      "rgba(59,130,246,0.20)",
      "rgba(168,85,247,0.18)",
      "rgba(236,72,153,0.18)",
      "rgba(99,102,241,0.20)"
    ]
  );
  const orb2BgColor = useTransform(
    smoothProgress,
    [0, 0.3, 0.6, 1],
    [
      "rgba(59,130,246,0.18)",
      "rgba(168,85,247,0.20)",
      "rgba(219,39,119,0.18)",
      "rgba(147,51,234,0.18)"
    ]
  );
  const orb3BgColor = useTransform(
    smoothProgress,
    [0, 0.4, 0.7, 1],
    [
      "rgba(99,102,241,0.18)",
      "rgba(56,189,248,0.18)",
      "rgba(236,72,153,0.18)",
      "rgba(124,58,237,0.18)"
    ]
  );

  const pillars = [
    { title: "INNOVATE", desc: "Transform rough concepts into meaningful solutions targeting modern human roadblocks.", icon: Sparkles, color: "from-cyan-500/20 to-blue-500/5", borderGlow: "rgba(0,240,255,0.2)" },
    { title: "BUILD", desc: "Turn drafts and ideas into real-world working technical prototypes with precision.", icon: Code, color: "from-purple-500/20 to-indigo-500/5", borderGlow: "rgba(139,92,246,0.2)" },
    { title: "COLLABORATE", desc: "Assemble teams of 2–3 and coordinate under time-boxed pressure to deliver.", icon: Users, color: "from-pink-500/20 to-rose-500/5", borderGlow: "rgba(236,72,153,0.2)" },
    { title: "IMPACT", desc: "Solve critical issues and pitch your final project directly to industry leaders.", icon: Zap, color: "from-cyan-500/20 to-blue-500/5", borderGlow: "rgba(56,189,248,0.2)" }
  ];

  if (!isIntroComplete) {
    return <IntroLoader onComplete={() => setIsIntroComplete(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-[#060412] text-white selection:bg-violet-600 selection:text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          SCROLL-DRIVEN BACKGROUND — DEEP CYBER DARK MODE
      ═══════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dark Obsidian Base */}
        <div className="absolute inset-0 bg-[#060412]" />

        {/* Gradient background layers — one per section */}
        {SECTION_GRADIENTS.map((theme, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: theme.bg,
              opacity: bgOpacities[i]
            }}
          />
        ))}

        {/* Animated glowing ORB 1 — large, top-left, drifts upward on scroll */}
        <motion.div
          className="absolute rounded-full blur-[130px] pointer-events-none"
          style={{
            width: 600,
            height: 600,
            top: "5%",
            left: "-10%",
            y: orb1Y,
            scale: orb1Scale,
            background: orb1BgColor
          }}
        />

        {/* Animated glowing ORB 2 — medium, bottom-right, drifts down */}
        <motion.div
          className="absolute rounded-full blur-[100px] pointer-events-none"
          style={{
            width: 450,
            height: 450,
            bottom: "10%",
            right: "-5%",
            y: orb2Y,
            scale: orb2Scale,
            background: orb2BgColor
          }}
        />

        {/* Animated glowing ORB 3 — small, center, drifts sideways */}
        <motion.div
          className="absolute rounded-full blur-[90px] pointer-events-none"
          style={{
            width: 280,
            height: 280,
            top: "40%",
            left: "35%",
            x: orb3X,
            background: orb3BgColor
          }}
        />

        {/* Scroll-driven animated grid — opacity pulses per section */}
        <motion.div
          className="absolute inset-0 bg-grid-pattern animate-grid-move"
          style={{ opacity: gridOpacity }}
        />

        {/* Very faint inner shadow vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.04)_100%)]" />
      </div>

      {/* 3D phone — fixed background animation layer for both desktop & mobile screens */}
      <PhoneScene scrollProgress={smoothProgress} mouseX={mouseX} mouseY={mouseY} />

      {/* Cursor glow tracker */}
      <CustomCursor />

      {/* Sticky navigation */}
      <Navbar />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      {/* Responsive layout: centered on mobile, left-aligned on desktop */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 pt-24 pb-16 overflow-hidden z-10">

        <div className="max-w-xl flex flex-col items-center text-center md:items-start md:text-left gap-5 md:gap-6 mt-6 md:mt-12 mx-auto md:ml-8 lg:ml-20">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-violet-500/40 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-violet-300 bg-violet-950/60 shadow-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {EVENT_CONFIG.collegeName} Presents
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black font-orbitron tracking-tight leading-tight md:leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-300 drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]"
          >
            HACK THE FUTURE
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-lg md:text-2xl font-mono uppercase tracking-[0.2em] md:tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-300 to-pink-400 font-bold"
          >
            {EVENT_CONFIG.tagline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs md:text-sm text-slate-200 max-w-xl leading-relaxed font-sans glass-panel p-4 md:p-5 rounded-xl bg-slate-900/85 border border-slate-700/80 shadow-md"
          >
            Turn your ideas into real-world solutions. Team up, build something meaningful, and showcase your creativity at our college hackathon.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3.5 mt-2 md:mt-4 w-full"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-mono uppercase tracking-widest text-white text-center font-bold shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.55)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              REGISTER NOW →
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg glass-panel text-xs font-mono uppercase tracking-widest text-slate-700 text-center hover:text-slate-900 border border-slate-200/90 bg-white/80 hover:border-violet-300 transition-all duration-300"
            >
              EXPLORE HACKATHON ↓
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 md:mt-14 w-full"
          >
            <Countdown />
          </motion.div>
        </div>

        {/* Scroll indicator arrow at bottom of hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-700"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-slate-300 flex items-start justify-center pt-1"
          >
            <div className="w-1 h-2 rounded-full bg-violet-500 animate-pulse" />
          </motion.div>
          <span className="text-[9px] font-mono tracking-widest uppercase text-slate-600">SCROLL</span>
        </motion.div>
      </section>

      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section className="relative py-14 z-30">
        {/* Themed divider glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { value: 5, label: "HACKATHON HOURS", suffix: "H", prefix: "" },
            { value: 20, label: "TOTAL TEAMS", suffix: "", prefix: "" },
            {
              value: realTimeStats.isLoaded ? realTimeStats.teamsCount : 0,
              label: "TEAMS REGISTERED",
              suffix: "",
              prefix: ""
            }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glossy-card p-6 md:p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 relative z-30 transition-all duration-300"
            >
              <StatCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <span className="text-xs md:text-sm font-mono tracking-[0.25em] text-cyan-300 font-extrabold uppercase mt-2">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ ABOUT SECTION ═══════════════ */}
      <section id="about" className="relative py-24 px-6 z-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-12">
          <div className="text-center flex flex-col gap-3">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-blue-600 uppercase"
            >
              Discover the Event
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black font-orbitron tracking-tight text-white drop-shadow-[0_4px_16px_rgba(15,23,42,0.9)] uppercase"
            >
              WHAT IS THE HACKATHON?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-base sm:text-lg md:text-xl text-white font-bold tracking-wide max-w-2xl leading-relaxed mx-auto font-sans glass-panel p-6 md:p-7 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-violet-500/40 shadow-2xl text-white"
            >
              To build the website based on the SDG goals. The Problem Statement will be given on the spot.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glass-panel p-6 rounded-xl flex flex-col gap-4 border border-slate-200 bg-opacity-30 relative overflow-hidden group cursor-default"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="w-12 h-12 rounded-lg bg-white/5 border border-slate-200 flex items-center justify-center text-blue-600 group-hover:text-white group-hover:bg-blue-600/20 transition-colors duration-300 relative z-10">
                    <Icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-orbitron text-sm font-bold tracking-wider text-white mt-2 relative z-10">{pillar.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans relative z-10">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ TRACKS SECTION ═══════════════ */}
      <section id="tracks" className="relative py-24 px-6 z-10">
        {/* Top/bottom teal accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center flex flex-col gap-3">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-teal-600 uppercase"
            >
              Challenge Categories
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black font-orbitron tracking-tight text-white drop-shadow-[0_4px_16px_rgba(15,23,42,0.9)] uppercase"
            >
              CHALLENGE TRACKS
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xs md:text-sm text-white font-semibold max-w-xl leading-relaxed mx-auto font-sans glass-panel p-4 md:p-5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-lg text-white"
            >
              Choose a track that aligns with your tech passion and build a project that solves a critical problem in that domain.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {EVENT_CONFIG.tracks.map((track, i) => {
              const Icon = iconMap[track.icon] || Globe;
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="glass-panel p-6 rounded-xl flex flex-col gap-4 border border-slate-200 group cursor-default relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-400/20 transition-colors duration-500" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 group-hover:border-violet-300 group-hover:text-violet-600 transition-all duration-300">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-orbitron text-xs md:text-sm font-bold tracking-wider text-white uppercase">{track.name}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">{track.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ TIMELINE SECTION ═══════════════ */}
      <section id="timeline" className="relative py-24 px-6 z-10 max-w-7xl mx-auto">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        <div className="flex flex-col items-center gap-16">
          <div className="text-center flex flex-col gap-3">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-blue-600 uppercase"
            >
              Event Milestones
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black font-orbitron tracking-tight text-white drop-shadow-[0_4px_16px_rgba(15,23,42,0.9)] uppercase"
            >
              EVENT TIMELINE
            </motion.h2>
          </div>

          {/* Desktop timeline */}
          <div className="hidden lg:grid grid-cols-6 gap-6 relative w-full pt-10">
            <div className="absolute top-[82px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 opacity-40" />
            {EVENT_CONFIG.timeline.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 mb-2 font-bold group-hover:text-blue-400 transition-colors duration-200">{item.date}</span>
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-violet-500/40 flex items-center justify-center mb-6 relative z-10 shadow-sm group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.35)] transition-all duration-300">
                  <span className="font-orbitron text-xs font-black text-white group-hover:text-cyan-300">{item.phase}</span>
                </div>
                <h3 className="font-orbitron text-[11px] font-bold tracking-widest text-white mb-2 uppercase">{item.title}</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans px-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile timeline */}
          <div className="lg:hidden flex flex-col gap-10 relative w-full pl-6 md:pl-12 border-l border-slate-200">
            {EVENT_CONFIG.timeline.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative group flex flex-col gap-2"
              >
                <div className="absolute -left-[37px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center z-10 group-hover:border-violet-400 group-hover:shadow-[0_0_8px_rgba(124,58,237,0.2)] transition-all duration-300">
                  <span className="font-orbitron text-[10px] font-black text-slate-700 group-hover:text-violet-600">{item.phase}</span>
                </div>
                <span className="text-[9px] font-mono text-violet-600 tracking-widest font-bold">{item.date}</span>
                <h3 className="font-orbitron text-sm font-bold tracking-wider text-slate-900 uppercase">{item.title}</h3>
                <p className="text-xs text-slate-800 leading-relaxed font-sans max-w-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRIZES SECTION ═══════════════ */}
      <section id="prizes" className="relative py-24 px-6 z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="text-center flex flex-col gap-3">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-amber-600 uppercase"
            >
              Victory Rewards
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black font-orbitron tracking-tight text-white drop-shadow-[0_4px_16px_rgba(15,23,42,0.9)] uppercase"
            >
              PRIZE POOL: {EVENT_CONFIG.prizePool}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xs md:text-sm text-white font-semibold max-w-xl leading-relaxed mx-auto font-sans glass-panel p-4 md:p-5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-lg text-white"
            >
              Compete, out-build, and conquer! Trophies, developer goodies, and cash prizes will be awarded to the top three innovations.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end w-full max-w-5xl">
            {EVENT_CONFIG.prizes.map((prize, i) => (
              <motion.div
                key={prize.rank}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className={`relative rounded-2xl flex flex-col items-center text-center p-8 glass-panel overflow-hidden ${
                  prize.premium
                    ? "lg:h-[400px] border-2 border-amber-300/60 shadow-[0_8px_40px_rgba(245,158,11,0.15)] order-first lg:order-none"
                    : "lg:h-[340px] border border-slate-200"
                }`}
              >
                {prize.premium && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-12 bg-yellow-500/20 blur-xl pointer-events-none" />
                )}
                <div className="w-16 h-16 rounded-full bg-white/5 border border-slate-200 flex items-center justify-center mb-6 relative z-10">
                  <Trophy className={`w-8 h-8 ${prize.premium ? "text-amber-500" : "text-slate-700"}`} />
                </div>
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold mb-1">{prize.rank} Place</span>
                <h3 className="font-orbitron text-lg font-black tracking-wider text-white uppercase mb-3">{prize.title}</h3>
                <span className={`text-3xl md:text-5xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${prize.color} tracking-tight mb-4`}>
                  {prize.amount}
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{prize.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ RULES & FAQ SECTION ═══════════════ */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <div id="rules" className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-cyan-400 uppercase">Conduct & Criteria</span>
          <h2 className="text-2xl md:text-4xl font-black font-orbitron tracking-tight text-white drop-shadow-[0_4px_16px_rgba(15,23,42,0.9)] uppercase">RULES & GUIDELINES</h2>
          </div>
          <div className="w-full">
            {EVENT_CONFIG.rules.map((rule, index) => (
              <AccordionItem key={rule.title} title={rule.title} content={rule.detail} index={index} />
            ))}
          </div>
        </div>

        <div id="faq" className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-violet-600 uppercase">Frequently Asked</span>
          <h2 className="text-2xl md:text-4xl font-black font-orbitron tracking-tight text-white drop-shadow-[0_4px_16px_rgba(15,23,42,0.9)] uppercase">QUESTIONS & ANSWERS</h2>
          </div>
          <div className="w-full">
            {EVENT_CONFIG.faqs.slice(0, 5).map((faq, index) => (
              <AccordionItem key={faq.q} title={faq.q} content={faq.a} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA SECTION ═══════════════ */}
      <section className="relative py-20 px-6 z-10 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="glass-panel p-10 md:p-16 rounded-2xl border border-slate-200 relative">
          <div className="absolute w-[200px] h-[200px] bg-blue-600/5 rounded-full blur-[80px] -top-12 -left-12 pointer-events-none" />
          <div className="absolute w-[200px] h-[200px] bg-violet-600/5 rounded-full blur-[80px] -bottom-12 -right-12 pointer-events-none" />
          <h2 className="text-xl md:text-4xl font-black font-orbitron tracking-wide uppercase text-white mb-4">Ready to Hack the Future?</h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
            Registration slots are limited. Assemble your team, choose your category, and register today before the deadline expires.
          </p>
          <Link
            href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-mono uppercase tracking-widest text-white font-bold shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.5)] transition-all duration-300"
          >
            CONFIRM YOUR SPOT NOW <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
