"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Unconditional hook declarations at the top level
  const innerSpringConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorXSpringInner = useSpring(cursorX, innerSpringConfig);
  const cursorYSpringInner = useSpring(cursorY, innerSpringConfig);

  const outerSpringConfig = { damping: 30, stiffness: 150, mass: 0.8 };
  const cursorXSpringOuter = useSpring(cursorX, outerSpringConfig);
  const cursorYSpringOuter = useSpring(cursorY, outerSpringConfig);

  useEffect(() => {
    // Hide cursor on touch/mobile devices
    const isTouch = window.matchMedia("(max-width: 768px)").matches;
    if (isTouch) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
      
      // Update global document mouse CSS variables for background radial glow
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Background Radial Mouse Tracker Glow - Always active once cursor moves */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-radial-glow" />

      {/* Floating magnetic cursor rings, hidden on mobile or before mouse moves */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-neon-blue rounded-full pointer-events-none z-50 mix-blend-screen shadow-[0_0_8px_#00f0ff] transition-opacity duration-300"
        style={{
          x: cursorXSpringInner,
          y: cursorYSpringInner,
          opacity: isVisible ? 1 : 0
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-neon-purple/50 rounded-full pointer-events-none z-50 transition-opacity duration-300"
        style={{
          x: cursorXSpringOuter,
          y: cursorYSpringOuter,
          translateX: -10,
          translateY: -10,
          opacity: isVisible ? 1 : 0
        }}
      />
    </>
  );
}
