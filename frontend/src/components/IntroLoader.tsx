"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [stage, setStage] = useState(0); // 0: MAC, 1: HACK THE FUTURE, 2: Exiting

  useEffect(() => {
    // Stage 0 -> Stage 1: 800ms
    const timer1 = setTimeout(() => {
      setStage(1);
    }, 800);

    // Stage 1 -> Exiting: 1600ms
    const timer2 = setTimeout(() => {
      setStage(2);
    }, 1800);

    // Complete: 2200ms
    const timer3 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02000f] overflow-hidden scanline-overlay"
        >
          {/* Subtle grid lines in loader */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          
          {/* Cybernetic glowing background aura */}
          <div className="absolute w-[300px] h-[300px] bg-neon-purple/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute w-[200px] h-[200px] bg-neon-blue/15 rounded-full blur-[80px] pointer-events-none" />

          {/* Glitchy scanner lines */}
          <div className="absolute left-0 right-0 h-[2px] bg-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse pointer-events-none" style={{ top: "40%" }} />

          <div className="relative text-center z-10 px-4">
            <AnimatePresence mode="wait">
              {stage === 0 ? (
                <motion.div
                  key="mac"
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-xs uppercase tracking-[0.4em] text-neon-blue font-mono font-bold text-glow-blue">
                    System Booting
                  </span>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-[0.2em] font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                    MOBILE APP CLUB
                  </h1>
                </motion.div>
              ) : (
                <motion.div
                  key="hack"
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="flex flex-col items-center gap-4"
                >
                  <h2 className="text-4xl md:text-7xl font-black tracking-[0.15em] font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink text-glow-blue">
                    HACK THE FUTURE
                  </h2>
                  <p className="text-sm font-mono text-slate-400 tracking-[0.3em] uppercase">
                    Build the Unexpected
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Tech Progress Bar */}
            <div className="w-[180px] md:w-[260px] h-[3px] bg-slate-800 rounded-full mt-8 overflow-hidden mx-auto border border-slate-900">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink shadow-[0_0_8px_#00f0ff]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
