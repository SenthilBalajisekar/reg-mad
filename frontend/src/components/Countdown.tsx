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

interface CountdownProps {
  teamsCount?: number;
  isLoaded?: boolean;
}

export default function Countdown({ teamsCount, isLoaded }: CountdownProps) {
  const [liveTeamsCount, setLiveTeamsCount] = useState<number | null>(teamsCount ?? null);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false
  });

  useEffect(() => {
    if (teamsCount !== undefined) {
      setLiveTeamsCount(teamsCount);
    } else {
      const fetchStats = async () => {
        try {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await fetch(`${API_BASE_URL}/api/registrations/dashboard/stats`);
          if (res.ok) {
            const data = await res.json();
            setLiveTeamsCount(data.totalTeams ?? data.totalRegistrations ?? 0);
          }
        } catch (e) {
          console.error("Could not fetch live stats in Countdown:", e);
        }
      };
      fetchStats();
    }
  }, [teamsCount]);

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

  const MAX_LIMIT = (EVENT_CONFIG as any).maxTotalTeams || 20;
  const currentCount = liveTeamsCount ?? 0;
  const isLimitReached = currentCount >= MAX_LIMIT;
  const isClosed = isLimitReached || timeLeft.isExpired;

  const timeBlocks = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds }
  ];

  if (isClosed) {
    return (
      <div className="flex flex-col items-center gap-2 p-5 rounded-2xl glass-panel border border-pink-500/40 bg-slate-900/80 shadow-2xl">
        <span className="text-xs font-mono tracking-[0.3em] text-slate-300 font-bold uppercase">
          REGISTRATION HAS
        </span>
        <span className="text-2xl md:text-4xl font-orbitron font-extrabold text-neon-pink text-glow-pink tracking-widest uppercase">
          CLOSED
        </span>
        <span className="text-xs font-mono text-pink-300/90 font-bold mt-1 bg-pink-950/60 px-3.5 py-1 rounded-full border border-pink-500/40 shadow-sm">
          {isLimitReached
            ? `20 Teams Limit Reached (${currentCount}/${MAX_LIMIT} Teams Registered)`
            : "Deadline Has Passed"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1.5 mb-1">
        <span className="text-xs md:text-sm font-mono tracking-[0.25em] text-emerald-400 font-black uppercase drop-shadow-[0_0_14px_rgba(52,211,153,0.7)]">
          REGISTRATION IS OPENED
        </span>
        <span className="text-[11px] md:text-xs font-mono text-cyan-300 font-extrabold tracking-wider bg-cyan-950/70 px-3.5 py-1 rounded-full border border-cyan-500/40 shadow-sm">
          {currentCount} / {MAX_LIMIT} Teams Registered (Limit: 20 Teams)
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {timeBlocks.map((block, index) => (
          <div key={block.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="glass-panel w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-lg border border-slate-800 bg-opacity-70">
                <span className="text-lg md:text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                  {block.value}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] font-mono tracking-wider text-slate-400 mt-2 font-bold">
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
