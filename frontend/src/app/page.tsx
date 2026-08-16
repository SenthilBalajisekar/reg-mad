"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
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
  Sparkles,
  Crown,
  FileText,
  Megaphone,
  Coins,
  GraduationCap,
  User,
  Edit3,
  Check
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroLoader from "@/components/IntroLoader";
import CustomCursor from "@/components/CustomCursor";
import Countdown from "@/components/Countdown";
import StatCounter from "@/components/StatCounter";
import AccordionItem from "@/components/AccordionItem";
import { EVENT_CONFIG } from "@/config/event";

// 3D Magnetic Charger background animation — dynamic import (no SSR)
const ChargerScene = dynamic(() => import("@/components/Charger3D/ChargerScene"), { ssr: false });

const iconMap: Record<string, React.ComponentType<any>> = {
  Smartphone, Cpu, Globe, ShieldAlert, HeartHandshake, Award, Crown, FileText, Megaphone, Coins, GraduationCap
};

export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [memberNames, setMemberNames] = useState<Record<string, string>>({});
  const [realTimeStats, setRealTimeStats] = useState<{
    teamsCount: number;
    participantsCount: number;
    isLoaded: boolean;
  }>({
    teamsCount: 0,
    participantsCount: 0,
    isLoaded: false
  });

  const { scrollYProgress } = useScroll();

  // Load saved club member names from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mac_club_member_names");
    if (saved) {
      try {
        setMemberNames(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved member names", e);
      }
    }
  }, []);

  const handleMemberNameChange = (id: string, name: string) => {
    const updated = { ...memberNames, [id]: name };
    setMemberNames(updated);
    localStorage.setItem("mac_club_member_names", JSON.stringify(updated));
  };

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
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          3D MAGNETIC CHARGER SCROLL ANIMATION
      ═══════════════════════════════════════════ */}
      <ChargerScene scrollProgress={scrollYProgress} />

      {/* Cursor glow tracker */}
      <CustomCursor />

      {/* Sticky navigation */}
      <Navbar />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 pt-24 pb-16 overflow-hidden z-10">

        <div className="max-w-4xl flex flex-col items-center text-center gap-5 md:gap-6 mt-6 md:mt-12 mx-auto">
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black font-orbitron tracking-[0.2em] md:tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 drop-shadow-sm"
          >
            APP RADIX - 26
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-300 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-slate-800 bg-white/90 backdrop-blur-md shadow-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            {EVENT_CONFIG.collegeName ? `${EVENT_CONFIG.collegeName} PRESENTS` : "PRESENTS"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-2xl sm:text-4xl md:text-6xl font-black font-orbitron tracking-tight leading-tight md:leading-none text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 drop-shadow-sm"
          >
            DREAM IT . CODE IT . LAUNCH IT
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <h2 className="text-sm sm:text-lg md:text-2xl font-mono uppercase tracking-[0.2em] md:tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 font-bold">
              {EVENT_CONFIG.tagline}
            </h2>
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-amber-600 font-extrabold">
              ⚡ {EVENT_CONFIG.poweredBy} ⚡
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs md:text-sm text-slate-700 max-w-xl leading-relaxed font-sans p-4 md:p-5 rounded-xl bg-white/90 border border-slate-200 backdrop-blur-md shadow-lg"
          >
            Turn your ideas into real-world solutions. Team up, build something meaningful, and showcase your creativity at our college hackathon.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-2 md:mt-4 w-full"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-mono uppercase tracking-widest text-white text-center font-bold shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.55)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              REGISTER NOW →
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg glass-panel text-xs font-mono uppercase tracking-widest text-slate-800 font-bold text-center border border-slate-300 bg-white hover:border-violet-500 transition-all duration-300 shadow-md"
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
            <Countdown teamsCount={realTimeStats.teamsCount} isLoaded={realTimeStats.isLoaded} />
          </motion.div>
        </div>

        {/* Scroll indicator arrow at bottom of hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-300"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-violet-400/50 flex items-start justify-center pt-1"
          >
            <div className="w-1 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </motion.div>
          <span className="text-[9px] font-mono tracking-widest uppercase text-cyan-300 font-bold">SCROLL</span>
        </motion.div>
      </section>

      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section className="relative py-14 z-30">
        {/* Themed divider glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />

        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          {[
            { value: 5, label: "HACKATHON HOURS", suffix: "H", prefix: "" },
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
              <span className="text-xs md:text-sm font-mono tracking-[0.25em] text-blue-700 font-extrabold uppercase mt-2">
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
              className="text-[10px] md:text-xs font-mono tracking-[0.35em] uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600"
            >
              Discover the Event
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-2xl sm:text-4xl md:text-5xl font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 uppercase"
            >
              WHAT IS THE HACKATHON?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-base sm:text-lg md:text-xl font-bold tracking-wide max-w-2xl leading-relaxed mx-auto font-sans glass-panel p-6 md:p-7 rounded-2xl bg-white border border-slate-200 shadow-lg text-slate-800"
            >
              To build the mobile app based on the SDG goals. The Problem Statement will be given on the spot.
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
                  className="glass-panel p-6 rounded-xl flex flex-col gap-4 border border-slate-200 bg-white relative overflow-hidden group cursor-default shadow-md"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300 relative z-10">
                    <Icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-orbitron text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 mt-2 relative z-10">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans relative z-10">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ TRACKS SECTION ═══════════════ */}
      <section id="tracks" className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center flex flex-col gap-3">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] md:text-xs font-mono tracking-[0.35em] uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600"
            >
              Challenge Categories
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 via-violet-600 to-pink-600 uppercase"
            >
              CHALLENGE TRACKS
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xs md:text-sm text-slate-700 font-semibold max-w-xl leading-relaxed mx-auto font-sans glass-panel p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-md"
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
                  className="glass-panel p-6 rounded-xl flex flex-col gap-4 border border-slate-200 bg-white group cursor-default relative overflow-hidden shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 transition-all duration-300">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-orbitron text-xs md:text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 uppercase">{track.name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans mt-2">{track.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ TIMELINE SECTION ═══════════════ */}
      <section id="timeline" className="relative py-24 px-6 z-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-16">
          <div className="text-center flex flex-col gap-3">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] md:text-xs font-mono tracking-[0.35em] uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
            >
              Event Milestones
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-amber-500 uppercase drop-shadow-sm"
            >
              EVENT TIMELINE
            </motion.h2>
          </div>

          {/* Desktop timeline */}
          <div className="hidden lg:grid grid-cols-6 gap-6 relative w-full pt-10">
            <div className="absolute top-[82px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-amber-500 opacity-80" />
            {EVENT_CONFIG.timeline.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <span className="text-[10px] font-mono tracking-widest mb-2 font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600">{item.date}</span>
                <div className="w-12 h-12 rounded-full bg-white border-2 border-violet-500 flex items-center justify-center mb-6 relative z-10 shadow-md group-hover:border-pink-500 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all duration-300">
                  <span className="font-orbitron text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">{item.phase}</span>
                </div>
                <h3 className="font-orbitron text-[11px] md:text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-violet-800 to-pink-700 mb-2 uppercase">{item.title}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans px-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile timeline */}
          <div className="lg:hidden flex flex-col gap-10 relative w-full pl-6 md:pl-12 border-l-2 border-gradient-to-b from-blue-500 via-purple-500 to-pink-500">
            {EVENT_CONFIG.timeline.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative group flex flex-col gap-2"
              >
                <div className="absolute -left-[37px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-white border-2 border-violet-500 shadow-md flex items-center justify-center z-10">
                  <span className="font-orbitron text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">{item.phase}</span>
                </div>
                <span className="text-[10px] font-mono tracking-widest font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">{item.date}</span>
                <h3 className="font-orbitron text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-violet-800 to-pink-700 uppercase">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CLUB MEMBERS SECTION ═══════════════ */}
      <section id="members" className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="text-center flex flex-col gap-3">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] md:text-xs font-mono tracking-[0.35em] uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600"
            >
              Executive Leadership
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 uppercase"
            >
              CLUB MEMBERS
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xs md:text-sm text-slate-700 font-semibold max-w-xl leading-relaxed mx-auto font-sans glass-panel p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-md"
            >
              Meet the core executive leadership team driving Mobile App Club 2026.
            </motion.p>
          </div>

          {/* Faculty Coordinator Featured Card */}
          {EVENT_CONFIG.facultyCoordinator && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="relative max-w-md w-full rounded-2xl flex flex-col items-center text-center p-7 glass-panel overflow-hidden border-2 border-indigo-300 bg-gradient-to-b from-white via-indigo-50/40 to-white shadow-xl transition-all duration-300 group -mb-4"
            >
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-mono font-extrabold tracking-widest bg-gradient-to-r from-blue-600 to-violet-600 text-white uppercase shadow-sm">
                AP/IT
              </div>

              <div className="w-16 h-16 rounded-full bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center mb-4 relative z-10 shadow-md group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-indigo-700 group-hover:text-violet-600 transition-colors" />
              </div>
              
              <span className="font-mono text-[10px] text-indigo-700 uppercase tracking-widest font-extrabold mb-1">
                {EVENT_CONFIG.facultyCoordinator.tag}
              </span>
              
              <h3 className="font-orbitron text-sm md:text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 uppercase mb-3">
                {EVENT_CONFIG.facultyCoordinator.role}
              </h3>

              <div className="w-full flex flex-col items-center gap-2 relative z-10 pt-3 border-t border-indigo-100">
                <span className="font-orbitron text-base md:text-lg font-black tracking-wide text-slate-900">
                  {EVENT_CONFIG.facultyCoordinator.name}
                </span>

                <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-mono font-extrabold tracking-widest bg-indigo-100 border border-indigo-300 text-indigo-900 uppercase shadow-sm">
                  {EVENT_CONFIG.facultyCoordinator.dept}
                </span>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch w-full max-w-7xl">
            {EVENT_CONFIG.clubMembers.map((member, i) => {
              const Icon = iconMap[member.icon] || Award;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl flex flex-col items-center text-center p-6 glass-panel overflow-hidden border border-slate-200 bg-white shadow-md transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center mb-4 relative z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-violet-600 group-hover:text-amber-500 transition-colors" />
                  </div>
                  
                  <span className="font-mono text-[10px] text-blue-600 uppercase tracking-widest font-bold mb-1">
                    {member.tag}
                  </span>
                  
                  <h3 className="font-orbitron text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-800 uppercase mb-4">
                    {member.role}
                  </h3>

                  <div className="mt-auto w-full flex flex-col items-center gap-2.5 relative z-10 pt-3 border-t border-slate-100">
                    <span className="font-orbitron text-xs md:text-sm font-black tracking-wide text-slate-900">
                      {member.name}
                    </span>

                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest bg-violet-100 border border-violet-300 text-violet-800 uppercase shadow-sm">
                      {member.dept}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ RULES & FAQ SECTION ═══════════════ */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div id="rules" className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] md:text-xs font-mono tracking-[0.35em] uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Conduct & Criteria</span>
            <h2 className="text-2xl md:text-4xl font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 uppercase">RULES & GUIDELINES</h2>
          </div>
          <div className="w-full">
            {EVENT_CONFIG.rules.map((rule, index) => (
              <AccordionItem key={rule.title} title={rule.title} content={rule.detail} index={index} />
            ))}
          </div>
        </div>

        <div id="faq" className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] md:text-xs font-mono tracking-[0.35em] uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">Frequently Asked</span>
            <h2 className="text-2xl md:text-4xl font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 uppercase">QUESTIONS & ANSWERS</h2>
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
        <div className="glass-panel p-10 md:p-16 rounded-2xl border border-slate-200 bg-white relative shadow-xl">
          <h2 className="text-xl md:text-4xl font-black font-orbitron tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 mb-4">Ready to Hack the Future?</h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
            Assemble your team, choose your category, and register today before the deadline expires.
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
