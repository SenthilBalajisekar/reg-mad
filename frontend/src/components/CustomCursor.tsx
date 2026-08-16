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
      {/* Background Radial Mouse Tracker Glow */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-radial-glow" />
    </>
  );
}
