"use client";

import { useEffect, useState } from "react";
import { EVENT_CONFIG } from "../config/event";

interface TimeRemaining {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(EVENT_CONFIG.registrationDeadline) - +new Date();
      
      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00", isExpired: true });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
        isExpired: false
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds }
  ];

  if (timeLeft.isExpired) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-mono tracking-widest text-slate-700">REGISTRATION HAS</span>
        <span className="text-xl md:text-3xl font-orbitron font-bold text-neon-pink text-glow-pink">CLOSED</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-neon-blue uppercase text-glow-blue">
        Registration Closes In
      </span>
      <div className="flex items-center gap-2 md:gap-4">
        {timeBlocks.map((block, index) => (
          <div key={block.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="glass-panel w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-lg border border-slate-800 bg-opacity-70">
                <span className="text-lg md:text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                  {block.value}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] font-mono tracking-wider text-slate-700 mt-2">
                {block.label}
              </span>
            </div>
            {index < 3 && (
              <span className="text-lg md:text-2xl font-bold text-neon-purple mx-1 md:mx-2 -mt-4 animate-pulse">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

