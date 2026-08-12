"use client";

import { useEffect, useState, useRef } from "react";

interface StatCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function StatCounter({ value, duration = 1500, suffix = "", prefix = "" }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease out quad formula
            const easeValue = percentage * (2 - percentage);
            setCount(Math.floor(easeValue * value));

            if (percentage < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  // Format big numbers like ₹50,000
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div ref={elementRef} className="font-orbitron text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-purple-300 tracking-tighter drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </div>
  );
}

