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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden"
        >
          {/* Subtle grid lines in loader */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

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
                  <span className="text-xs uppercase tracking-[0.4em] text-blue-600 font-mono font-bold">
                    System Booting
                  </span>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-[0.2em] font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900">
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
                  <h2 className="text-2xl md:text-5xl font-black tracking-[0.1em] font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700">
                    DREAM IT . CODE IT . LAUNCH IT
                  </h2>
                  <p className="text-sm font-mono text-blue-700 tracking-[0.3em] uppercase font-bold">
                    Build the Unexpected
                  </p>
                  <p className="text-xs font-mono text-amber-600 tracking-[0.3em] uppercase font-extrabold">
                    POWERED BY ISTE
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
