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
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE_URL}/api/registrations/dashboard/stats`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          setLiveTeamsCount(data.totalTeams ?? data.totalRegistrations ?? 0);
          if (data.isRegistrationOpen !== undefined) {
            setIsRegistrationOpen(data.isRegistrationOpen);
          }
        }
      } catch {
        // Backend server offline, gracefully keep default
      }
    };
    fetchStats();
    // Poll stats periodically to reflect live admin toggles
    const interval = setInterval(fetchStats, 5000);
    window.addEventListener("registrationStatusChanged", fetchStats);
    return () => {
      clearInterval(interval);
      window.removeEventListener("registrationStatusChanged", fetchStats);
    };
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

  const currentCount = liveTeamsCount ?? 0;
  const maxTeams = EVENT_CONFIG.maxTotalTeams || 25;
  const isLimitReached = currentCount >= maxTeams;
  const isClosed = timeLeft.isExpired || isLimitReached || !isRegistrationOpen;

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
          REGISTRATION
        </span>
        <span className="text-2xl md:text-4xl font-orbitron font-extrabold text-neon-pink text-glow-pink tracking-widest uppercase">
          CLOSES
        </span>
        <span className="text-xs font-mono text-pink-300/90 font-bold mt-1 bg-pink-950/60 px-3.5 py-1 rounded-full border border-pink-500/40 shadow-sm">
          {isLimitReached 
            ? `Team Limit Reached (${maxTeams}/${maxTeams} Teams Filled)` 
            : (!isRegistrationOpen ? "Closed by Administrator" : "Deadline Has Passed")}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1.5 mb-1">
        <span className="text-xs md:text-sm font-mono tracking-[0.25em] text-emerald-600 font-black uppercase">
          REGISTRATION OPENS
        </span>
        <span className="text-[11px] md:text-xs font-mono text-blue-700 font-extrabold tracking-wider bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200 shadow-sm">
          {currentCount} / {maxTeams} Teams Registered
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {timeBlocks.map((block, index) => (
          <div key={block.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="glass-panel w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-xl border border-slate-200 bg-white shadow-md">
                <span className="text-lg md:text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-indigo-900">
                  {block.value}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] font-mono tracking-wider text-slate-600 mt-2 font-bold">
                {block.label}
              </span>
            </div>
            {index < 3 && (
              <span className="text-lg md:text-2xl font-bold text-violet-600 mx-1 md:mx-2 -mt-4 animate-pulse">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
