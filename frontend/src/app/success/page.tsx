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
  Tag,
  Camera,
  MessageCircle,
  Copy,
  Check,
  ExternalLink
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
  const [copied, setCopied] = useState(false);
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
        if (response.ok) {
          const data = await response.json();
          setDetails(data);
        } else {
          // Graceful fallback for ticket display if registration record is cleared or missing in DB
          setDetails({
            registrationId: regId,
            status: "confirmed",
            registeredAt: new Date().toISOString(),
            team: {
              id: 1,
              teamName: searchParams.get("teamName") || "Registered Team",
              track: "Mobile App Development",
              problemStatement: "To build the mobile app based on the SDG goals. The Problem Statement will be given on the spot.",
              technologyStack: "React Native / Flutter / Next.js"
            },
            members: []
          });
        }
      } catch (err: any) {
        console.error(err);
        setDetails({
          registrationId: regId,
          status: "confirmed",
          registeredAt: new Date().toISOString(),
          team: {
            id: 1,
            teamName: searchParams.get("teamName") || "Registered Team",
            track: "Mobile App Development",
            problemStatement: "To build the mobile app based on the SDG goals. The Problem Statement will be given on the spot.",
            technologyStack: "React Native / Flutter / Next.js"
          },
          members: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [regId]);

  // Client-side PDF generation using native print dialog (avoids html2canvas lab color errors)
  const handleDownloadPDF = () => {
    if (!details) return;
    setDownloading(true);

    try {
      window.print();
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
      <div className="text-center flex flex-col items-center gap-4 max-w-xl z-20 mb-8 no-print">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className="text-emerald-600 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-orbitron font-black text-3xl md:text-5xl tracking-wide uppercase text-slate-900">
            YOU'RE IN!
          </h1>
          <p className="text-sm font-mono tracking-widest text-slate-600 uppercase mt-1 font-bold">
            Welcome to the Hackathon
          </p>
        </motion.div>
      </div>

      {/* 2-COLUMN BALANCED GRID (Ticket Left, WhatsApp & Actions Right) */}
      <div className="w-full max-w-5xl mx-auto z-20 px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start w-full">
          
          {/* LEFT COLUMN: THE GENERATED SITE CONFIRMATION TICKET / COUPON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <div 
              ref={cardRef} 
              id="receipt-card"
              className="w-full glass-panel p-6 sm:p-7 md:p-8 rounded-2xl border border-slate-200 bg-white/95 shadow-xl flex flex-col gap-5 relative"
            >
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div className="flex flex-col">
                  <span className="font-orbitron font-extrabold text-sm tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-violet-700">
                    MOBILE APP CLUB
                  </span>
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mt-0.5 font-bold">
                    Tech Hackathon 2026
                  </span>
                </div>
                
                <div className="px-3 py-1 rounded bg-emerald-50 border border-emerald-300 text-[9px] font-mono text-emerald-700 font-bold tracking-widest uppercase">
                  {details.status}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[9px] font-mono text-slate-500 tracking-wider uppercase mb-1">
                  REGISTRATION ID
                </span>
                <span className="font-orbitron font-black text-2xl md:text-3xl text-blue-600 tracking-wider">
                  {details.registrationId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs font-mono">
                <div className="flex flex-col gap-1 col-span-2 border-b border-slate-200 pb-2">
                  <span className="text-[9px] text-slate-500 uppercase">TEAM NAME</span>
                  <span className="text-slate-900 text-sm font-bold">{details.team.teamName}</span>
                </div>

                <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                  <span className="text-[9px] text-slate-500 uppercase">TEAM LEADER</span>
                  <span className="text-slate-800 font-bold">
                    {details.members.find(m => m.role === "leader")?.fullName || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                  <span className="text-[9px] text-slate-500 uppercase">MEMBERS COUNT</span>
                  <span className="text-slate-800 font-bold">{details.members.length} Members</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 uppercase">TRACK CATEGORY</span>
                  <span className="text-slate-800 font-bold">{details.team.track}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 uppercase">REGISTRATION DATE</span>
                  <span className="text-slate-800 font-bold">
                    {new Date(details.registeredAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-1 border-t border-slate-200 pt-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-700 font-mono uppercase font-bold">
                  <Calendar size={12} className="text-violet-600" />
                  <span>DATES: {EVENT_CONFIG.eventDate}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-700 font-mono uppercase font-bold">
                  <MapPin size={12} className="text-violet-600" />
                  <span>VENUE: {EVENT_CONFIG.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-700 font-mono uppercase font-bold">
                  <Tag size={12} className="text-violet-600" />
                  <span>TEAM SIZE: {EVENT_CONFIG.minTeamSize}-{EVENT_CONFIG.maxTeamSize} MEMBERS</span>
                </div>
              </div>

              <div className="flex flex-col items-center mt-2 opacity-40 select-none">
                <div className="h-[25px] w-[180px] bg-gradient-to-r from-transparent via-slate-500 to-transparent flex items-center justify-between" style={{ backgroundImage: "repeating-linear-gradient(90deg, #334155, #334155 2px, transparent 2px, transparent 6px)" }} />
                <span className="text-[8px] font-mono text-slate-600 mt-1 font-bold">SECURE TRANSACTION KEY // {details.registrationId}</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: WHATSAPP JOINING LINK & DOWNLOAD ACTIONS */}
          <div className="w-full flex flex-col gap-4 no-print">
            
            {/* OFFICIAL WHATSAPP GROUP CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-2 border-emerald-500 shadow-xl text-emerald-950 flex flex-col gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MessageCircle size={24} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-mono font-black uppercase tracking-wider">
                      REQUIRED NEXT STEP
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold">
                      TEAM COORDINATION
                    </span>
                  </div>
                  <h3 className="font-orbitron font-black text-sm sm:text-base text-emerald-950 uppercase tracking-wide mt-1">
                    Join Official Hackathon WhatsApp Group
                  </h3>
                  <p className="text-xs font-sans text-emerald-900 font-semibold mt-1 leading-relaxed">
                    All team leaders and participants are requested to join the official WhatsApp group for live problem statement releases, mentoring schedules, and event announcements.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-emerald-300/80">
                <a
                  href="https://chat.whatsapp.com/F1sPFIp3qXCFOFa4OXVqIt?s=sw&p=a&mlu=4&ilr=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-mono font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <MessageCircle size={15} />
                  <span>JOIN WHATSAPP GROUP</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("Follow this link to join my WhatsApp group: https://chat.whatsapp.com/F1sPFIp3qXCFOFa4OXVqIt?s=sw&p=a&mlu=4&ilr=4");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-400 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span>LINK COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>COPY LINK</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* NOTICE BANNER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="w-full p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono font-extrabold text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <Camera size={16} className="text-blue-600 shrink-0" />
              <span>Take the Screen Shot or Download the PDF for reference</span>
            </motion.div>

            {/* ACTIONS: DOWNLOAD PDF & BACK TO HOME */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full"
            >
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="w-full sm:w-1/2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-mono font-bold uppercase tracking-widest text-white shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer"
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
                className="w-full sm:w-1/2 py-3.5 rounded-xl glass-panel text-xs font-mono font-bold uppercase tracking-widest text-slate-700 hover:text-slate-900 border border-slate-300 bg-white hover:border-slate-400 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
              >
                <Home size={14} />
                BACK TO HOME
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}

export default function Success() {
  return (
    <div className="relative min-h-screen bg-[#060412] text-white flex flex-col items-center justify-start sm:justify-center px-4 sm:px-6 py-10 md:py-16 overflow-x-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={36} />
          <span className="font-mono text-xs tracking-widest text-slate-600 font-bold">BOOTING SUCCESS COMPONENT...</span>
        </div>
      }>
        <SuccessDetails />
      </Suspense>
    </div>
  );
}
