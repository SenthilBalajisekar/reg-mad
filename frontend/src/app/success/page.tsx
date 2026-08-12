"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Download, 
  Home, 
  Loader2, 
  AlertCircle,
  Calendar,
  MapPin,
  Tag
} from "lucide-react";

import { EVENT_CONFIG } from "@/config/event";
import CustomCursor from "@/components/CustomCursor";

interface RegistrationDetails {
  registrationId: string;
  status: string;
  registeredAt: string;
  team: {
    id: number;
    teamName: string;
    track: string;
    problemStatement: string;
    technologyStack: string;
  };
  members: Array<{
    fullName: string;
    email: string;
    phone: string;
    collegeName: string;
    department: string;
    year: number;
    studentId: string;
    role: string;
  }>;
}

function SuccessDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const regId = searchParams.get("regId");
  const [details, setDetails] = useState<RegistrationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!regId) {
      setError("No Registration ID provided.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_BASE_URL}/api/registrations/${regId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch registration data.");
        }
        const data = await response.json();
        setDetails(data);
      } catch (err: any) {
        console.error(err);
        setError("Could not retrieve registration details from database.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [regId]);

  // Client-side PDF generation using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    if (!cardRef.current || !details) return;
    setDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Retain high quality
        backgroundColor: "#030014",
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`HACK-2026-CONFIRMATION-${details.registrationId}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Error compiling PDF. Please print page or take a screenshot.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-neon-blue" size={36} />
        <span className="font-mono text-xs tracking-widest text-slate-400">RETRIEVING REGISTRATION RECORD...</span>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center gap-4">
        <AlertCircle className="text-red-500" size={48} />
        <h2 className="font-orbitron font-bold text-xl uppercase tracking-wider text-slate-200">Retrieval Failed</h2>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed">{error || "Record not found."}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-2 px-6 py-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
        >
          BACK TO HOME
        </button>
      </div>
    );
  }

  return (
    <>
      {/* SUCCESS MESSAGE */}
      <div className="text-center flex flex-col items-center gap-4 max-w-xl z-20 mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-orbitron font-black text-3xl md:text-5xl tracking-wide uppercase text-white">
            YOU'RE IN!
          </h1>
          <p className="text-sm font-mono tracking-widest text-slate-400 uppercase mt-1">
            Welcome to the Hackathon
          </p>
        </motion.div>
      </div>

      {/* CONFIRMATION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-xl z-20"
      >
        <div 
          ref={cardRef} 
          id="receipt-card"
          className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 bg-[#060416] flex flex-col gap-6 relative"
        >
          <div className="flex justify-between items-start border-b border-white/5 pb-4">
            <div className="flex flex-col">
              <span className="font-orbitron font-extrabold text-sm tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                MOBILE APP CLUB
              </span>
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                Tech Hackathon 2026
              </span>
            </div>
            
            <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold tracking-widest uppercase">
              {details.status}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-4 bg-[#0a0820]/60 rounded-xl border border-white/5 text-center">
            <span className="text-[9px] font-mono text-slate-500 tracking-wider uppercase mb-1">
              REGISTRATION ID
            </span>
            <span className="font-orbitron font-black text-2xl md:text-4xl text-neon-blue text-glow-blue tracking-wider">
              {details.registrationId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex flex-col gap-1 col-span-2 border-b border-white/5 pb-2">
              <span className="text-[9px] text-slate-500 uppercase">TEAM NAME</span>
              <span className="text-slate-200 text-sm font-bold">{details.team.teamName}</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
              <span className="text-[9px] text-slate-500 uppercase">TEAM LEADER</span>
              <span className="text-slate-300">
                {details.members.find(m => m.role === "leader")?.fullName || "N/A"}
              </span>
            </div>

            <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
              <span className="text-[9px] text-slate-500 uppercase">MEMBERS COUNT</span>
              <span className="text-slate-300">{details.members.length} Members</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-white/5 pb-2 col-span-2">
              <span className="text-[9px] text-slate-500 uppercase">COLLEGE / INSTITUTION</span>
              <span className="text-slate-300 truncate max-w-md">{details.members[0]?.collegeName}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 uppercase">TRACK CATEGORY</span>
              <span className="text-slate-300">{details.team.track}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 uppercase">REGISTRATION DATE</span>
              <span className="text-slate-300">
                {new Date(details.registeredAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
          </div>

          <div className="mt-2 border-t border-white/5 pt-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase">
              <Calendar size={12} className="text-neon-purple" />
              <span>DATES: {EVENT_CONFIG.eventDate}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase">
              <MapPin size={12} className="text-neon-purple" />
              <span>VENUE: {EVENT_CONFIG.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase">
              <Tag size={12} className="text-neon-purple" />
              <span>TEAM SIZE: {EVENT_CONFIG.minTeamSize}-{EVENT_CONFIG.maxTeamSize} MEMBERS</span>
            </div>
          </div>

          <div className="flex flex-col items-center mt-2 opacity-30 select-none">
            <div className="h-[25px] w-[180px] bg-gradient-to-r from-transparent via-slate-400 to-transparent flex items-center justify-between" style={{ backgroundImage: "repeating-linear-gradient(90deg, #ccc, #ccc 2px, transparent 2px, transparent 6px)" }} />
            <span className="text-[8px] font-mono text-slate-400 mt-1">SECURE TRANSACTION KEY // {details.registrationId}</span>
          </div>
        </div>
      </motion.div>

      {/* ACTIONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-xl z-20"
      >
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="w-full sm:w-1/2 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-xs font-mono font-bold uppercase tracking-widest text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
        >
          {downloading ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              DOWNLOADING...
            </>
          ) : (
            <>
              <Download size={14} />
              DOWNLOAD PDF
            </>
          )}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full sm:w-1/2 py-3 rounded-lg glass-panel text-xs font-mono font-bold uppercase tracking-widest text-slate-300 hover:text-white border border-white/5 hover:border-white/10 flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Home size={14} />
          BACK TO HOME
        </button>
      </motion.div>
    </>
  );
}

export default function Success() {
  return (
    <div className="relative min-h-screen bg-[#030014] text-slate-100 flex flex-col items-center justify-center px-4 py-16">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none z-0" />
      <div className="absolute inset-0 scanline-overlay opacity-10 pointer-events-none z-10" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-neon-blue" size={36} />
          <span className="font-mono text-xs tracking-widest text-slate-400 font-bold">BOOTING SUCCESS COMPONENT...</span>
        </div>
      }>
        <SuccessDetails />
      </Suspense>
    </div>
  );
}
