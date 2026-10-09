"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  User, 
  Users, 
  School, 
  Laptop, 
  FileCheck,
  Plus,
  Trash2,
  Loader2,
  Camera,
  MessageCircle
} from "lucide-react";

import { EVENT_CONFIG } from "@/config/event";
import CustomCursor from "@/components/CustomCursor";

// Validation Schema using Zod
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/; // Standard Indian phone pattern

const DEPARTMENTS_LIST = [
  "Information Technology (IT)",
  "Computer Science & Engineering (CSE)",
  "Artificial Intelligence & Data Science (AI&DS)",
  "Artificial Intelligence & Machine Learning (AI&ML)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Mechanical Engineering (MECH)",
  "Civil Engineering (CIVIL)",
  "Mechatronics Engineering",
  "Chemical Engineering",
  "Other"
];

const MemberSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().regex(emailRegex, "Provide a valid email address."),
  phone: z.string().regex(phoneRegex, "Provide a valid 10-digit phone number."),
  studentId: z.string().min(3, "Student ID must be at least 3 characters."),
  department: z.string().min(2, "Please enter department / branch."),
  year: z.coerce.number().min(1, "Select year of study.").max(4, "Select year of study.")
});

const FormSchema = z.object({
  teamName: z.string().min(3, "Team name must be at least 3 characters."),
  collegeName: z.string().min(1),
  department: z.string().min(1),
  year: z.coerce.number().min(1),
  collegeLocation: z.string().min(1),
  track: z.string().min(1),
  technologyStack: z.string().min(1),
  problemStatement: z.string().min(1),
  previousExperience: z.string().min(1),
  agreeToRules: z.boolean().refine((val) => val === true, {
    message: "You must agree to the rules and guidelines."
  }),
  leader: MemberSchema,
  members: z.array(MemberSchema)
});

type FormData = z.infer<typeof FormSchema>;

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalRegisteredTeams, setTotalRegisteredTeams] = useState<number>(0);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(true);

  useEffect(() => {
    const checkRegistrationLimit = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE_URL}/api/registrations/dashboard/stats`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          setTotalRegisteredTeams(data.totalTeams ?? data.totalRegistrations ?? 0);
          if (data.isRegistrationOpen !== undefined) {
            setIsRegistrationOpen(data.isRegistrationOpen);
          }
        }
      } catch {
        // Backend offline, fallback to 0
      }
    };
    checkRegistrationLimit();
    const interval = setInterval(checkRegistrationLimit, 5000);
    window.addEventListener("registrationStatusChanged", checkRegistrationLimit);
    return () => {
      clearInterval(interval);
      window.removeEventListener("registrationStatusChanged", checkRegistrationLimit);
    };
  }, []);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onTouched",
    defaultValues: {
      teamName: "",
      collegeName: "Sathyabama Institute of Science and Technology",
      department: "Computer Science & Engineering",
      year: 1,
      collegeLocation: "Chennai",
      track: "Mobile App Development",
      technologyStack: "Mobile App Development",
      problemStatement: "To build the mobile app based on the SDG goals. The Problem Statement will be given on the spot.",
      previousExperience: "no",
      agreeToRules: true,
      leader: { fullName: "", email: "", phone: "", studentId: "" },
      members: [] // Leader + members will be total size
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members"
  });

  const watchAllFields = watch();
  const membersCount = fields.length + 1; // leader + members

  // Handle Step progression validation checks
  const maxTeams = EVENT_CONFIG.maxTotalTeams || 25;
  const isLimitReached = totalRegisteredTeams >= maxTeams;
  const isClosed = !isRegistrationOpen || isLimitReached;

  const nextStep = async () => {
    if (isClosed) {
      setApiError(
        isLimitReached
          ? `Registration has closed: Maximum limit of ${maxTeams} teams has been reached.`
          : "Registration has closed: Portal access is currently closed by administrators."
      );
      return;
    }
    let fieldsToValidate: any[] = [];
    
    if (step === 1) {
      fieldsToValidate = [
        "leader.fullName",
        "leader.email",
        "leader.phone",
        "leader.studentId",
        "leader.department",
        "leader.year"
      ];
    } else if (step === 2) {
      fieldsToValidate = ["teamName", "members"];
      // Quick bounds check
      if (membersCount < EVENT_CONFIG.minTeamSize) {
        setApiError(`A team must have at least ${EVENT_CONFIG.minTeamSize} members.`);
        return;
      }
      if (membersCount > EVENT_CONFIG.maxTeamSize) {
        setApiError(`A team can have at most ${EVENT_CONFIG.maxTeamSize} members.`);
        return;
      }
      setApiError(null);
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
      setApiError(null);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setApiError(null);
  };

  const onSubmit = async (data: FormData) => {
    if (isClosed) {
      setApiError(
        isLimitReached
          ? `Registration has closed: Maximum limit of ${maxTeams} teams has been reached.`
          : "Registration has closed: Portal access is currently closed by administrators."
      );
      return;
    }
    setIsSubmitting(true);
    setApiError(null);

    // Format payload for backend structure
    const payload = {
      teamName: data.teamName,
      track: data.track || "Mobile App Development",
      problemStatement: data.problemStatement || "To build the mobile app based on the SDG goals. The Problem Statement will be given on the spot.",
      technologyStack: data.technologyStack || "Mobile App Development",
      leader: {
        fullName: data.leader.fullName,
        email: data.leader.email,
        phone: data.leader.phone,
        department: data.leader.department,
        year: Number(data.leader.year),
        studentId: data.leader.studentId
      },
      members: data.members.map(m => ({
        fullName: m.fullName,
        email: m.email,
        phone: m.phone,
        department: m.department,
        year: Number(m.year),
        studentId: m.studentId
      }))
    };

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Registration failed. Try again.");
      }

      // Smooth transition to Success Page
      router.push(`/success?regId=${resData.registrationId}&teamName=${encodeURIComponent(data.teamName)}`);
    } catch (err: any) {
      console.error(err);
      if (err.name === "TypeError" && err.message === "Failed to fetch") {
        setApiError("Backend API Server Unreachable: http://localhost:5000 cannot be reached from live HTTPS site. Please host backend server publicly or configure NEXT_PUBLIC_API_URL in Netlify.");
      } else {
        setApiError(err.message || "Server connection failed. Make sure server is running.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepDetails = [
    { title: "Participants", icon: User },
    { title: "Team Details", icon: Users },
    { title: "Confirm Spot", icon: FileCheck }
  ];

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex flex-col justify-between overflow-x-hidden selection:bg-violet-600 selection:text-white">
      <CustomCursor />
      
      {/* Visual background overlays */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />

      {/* HEADER NAVBAR */}
      <header className="relative z-20 py-6 px-6 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-700 hover:text-blue-600 font-bold transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            BACK TO HOME
          </button>
          
          <div className="text-right hidden sm:block">
            <span className="font-orbitron font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-700 to-violet-700 tracking-widest">
              MOBILE APP CLUB
            </span>
          </div>
        </div>
      </header>

      {/* WIZARD CONTAINER */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-3xl glass-panel p-6 md:p-10 rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col gap-8">
          
          {/* EVENT BANNER BADGES */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="text-violet-600 font-extrabold">📍 VENUE:</span> {EVENT_CONFIG.venue}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-pink-600 font-extrabold">📅 DATE:</span> {EVENT_CONFIG.eventDate}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-blue-600 font-extrabold">⏰ TIME:</span> {EVENT_CONFIG.eventTiming}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-extrabold">👥 SLOTS:</span> {totalRegisteredTeams} / {maxTeams} Teams
            </span>
          </div>

          {isClosed && (
            <div className="bg-red-50 border border-red-300 p-4 rounded-xl flex items-center gap-3 text-red-700 text-xs md:text-sm font-bold shadow-sm">
              <AlertCircle className="text-red-600 shrink-0" size={18} />
              <span>
                {isLimitReached
                  ? `REGISTRATION CLOSES: The maximum limit of ${maxTeams} teams has been reached.`
                  : "REGISTRATION CLOSES: Portal access is currently closed by administrators."}
              </span>
            </div>
          )}

          {/* STEP PROGRESS BAR */}
          <div className="w-full flex items-center justify-between relative px-6">
            <div className="absolute top-[18px] left-[10%] right-[10%] h-[3px] bg-slate-200 z-0" />
            <div 
              className="absolute top-[18px] left-[10%] h-[3px] bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 80}%` }}
            />

            {stepDetails.map((sDet, idx) => {
              const StepIcon = sDet.icon;
              const isActive = step === idx + 1;
              const isCompleted = step > idx + 1;

              return (
                <div key={sDet.title} className="flex flex-col items-center z-10 relative">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive 
                        ? "bg-blue-600 border-blue-600 shadow-md text-white font-extrabold"
                        : isCompleted
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 border-transparent text-white shadow-sm"
                        : "bg-slate-100 border-slate-300 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                  </div>
                  <span className={`text-[11px] font-mono tracking-wider mt-2.5 hidden sm:block ${
                    isActive ? "text-blue-900 font-extrabold" : "text-slate-600 font-bold"
                  }`}>
                    {sDet.title.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* FORM ROOT */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            
            {/* API/LOCAL GENERAL ERRORS */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700 text-xs md:text-sm font-semibold shadow-sm"
                >
                  <AlertCircle className="text-red-600 shrink-0" size={16} />
                  <span>{apiError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SLIDING ANIMATED WRAPPER FOR STEPS */}
            <div className="min-h-[350px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="border-b border-slate-200 pb-3">
                      <h2 className="font-orbitron font-extrabold text-lg text-slate-900 uppercase tracking-widest">
                        Step 01 - Participants
                      </h2>
                      <p className="text-xs text-slate-700 font-semibold font-sans mt-1">
                        Please provide contact details for the team leader. Communication will be sent here.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono tracking-wider text-slate-900 uppercase font-extrabold">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          {...register("leader.fullName")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 border-slate-300 focus:bg-white text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                            errors.leader?.fullName ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                        {errors.leader?.fullName && (
                          <span className="text-[10px] text-red-600 font-mono font-bold flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.fullName.message}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono tracking-wider text-slate-900 uppercase font-extrabold">Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. johndoe@college.edu"
                          {...register("leader.email")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 border-slate-300 focus:bg-white text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                            errors.leader?.email ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                        {errors.leader?.email && (
                          <span className="text-[10px] text-red-600 font-mono font-bold flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.email.message}
                          </span>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono tracking-wider text-slate-900 uppercase font-extrabold">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 9876543210 (10 digit)"
                          {...register("leader.phone")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 border-slate-300 focus:bg-white text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                            errors.leader?.phone ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                        {errors.leader?.phone && (
                          <span className="text-[10px] text-red-600 font-mono font-bold flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.phone.message}
                          </span>
                        )}
                      </div>

                      {/* Student ID */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono tracking-wider text-slate-900 uppercase font-extrabold">Student Registration ID</label>
                        <input
                          type="text"
                          placeholder="e.g. STU-2026-045"
                          {...register("leader.studentId")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 border-slate-300 focus:bg-white text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                            errors.leader?.studentId ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                        {errors.leader?.studentId && (
                          <span className="text-[10px] text-red-600 font-mono font-bold flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.studentId.message}
                          </span>
                        )}
                      </div>

                      {/* Department */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono tracking-wider text-slate-900 uppercase font-extrabold">Department / Branch</label>
                        <input
                          type="text"
                          placeholder="e.g. Information Technology"
                          {...register("leader.department")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 border-slate-300 focus:bg-white text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                            errors.leader?.department ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                        {errors.leader?.department && (
                          <span className="text-[10px] text-red-600 font-mono font-bold flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.department.message}
                          </span>
                        )}
                      </div>

                      {/* Year of Study */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono tracking-wider text-slate-900 uppercase font-extrabold">Year of Study</label>
                        <select
                          {...register("leader.year")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 border-slate-300 focus:bg-white text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                            errors.leader?.year ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        >
                          <option value="">Select Year</option>
                          <option value={1}>Year 1 (1st Year)</option>
                          <option value={2}>Year 2 (2nd Year)</option>
                          <option value={3}>Year 3 (3rd Year)</option>
                          <option value={4}>Year 4 (4th Year)</option>
                        </select>
                        {errors.leader?.year && (
                          <span className="text-[10px] text-red-600 font-mono font-bold flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.year.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="border-b border-slate-200 pb-3 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h2 className="font-orbitron font-extrabold text-lg text-slate-900 uppercase tracking-widest">
                          Step 02 - Team Details
                        </h2>
                        <p className="text-xs text-slate-700 font-semibold font-sans mt-1">
                          Set your unique team name. Team size must be 3 - 4 members.
                        </p>
                      </div>
                      
                      <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-300 rounded-lg text-xs font-mono text-blue-900 font-extrabold shadow-sm">
                        SIZE: {membersCount} / 4 MEMBERS
                      </div>
                    </div>

                    {/* Team Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono tracking-wider text-slate-900 uppercase font-extrabold">Team Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Cyber Warriors"
                        {...register("teamName")}
                        className={`w-full px-4 py-3 rounded-lg border bg-slate-50 text-slate-900 border-slate-300 focus:bg-white text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                          errors.teamName ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                      {errors.teamName && (
                        <span className="text-[10px] text-red-600 font-mono font-bold flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.teamName.message}
                        </span>
                      )}
                    </div>

                    {/* Members List */}
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-mono tracking-widest text-slate-900 uppercase font-extrabold">
                          Additional Team Members
                        </span>
                        
                        {membersCount < 4 && (
                          <div className="flex items-center gap-2">
                            <span 
                              onClick={() => append({ fullName: "", email: "", phone: "", studentId: "", department: "", year: 1 })}
                              className="text-xs font-mono text-slate-600 font-semibold cursor-pointer hover:text-violet-700 transition-colors"
                            >
                              Click here to add members &rarr;
                            </span>
                            <button
                              type="button"
                              onClick={() => append({ fullName: "", email: "", phone: "", studentId: "", department: "", year: 1 })}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-[11px] font-mono text-white font-extrabold shadow-sm transition-colors duration-200"
                            >
                              <Plus size={13} />
                              ADD MEMBER
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Display warning if too few members */}
                      {membersCount < 3 && (
                        <div className="text-xs font-mono text-amber-900 font-extrabold bg-amber-50 border border-amber-300 p-3 rounded-lg flex items-center gap-2 shadow-sm">
                          <span>⚠️ Hackathon rules require a minimum of 3 members. Please add team members below.</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        {fields.map((field, index) => (
                          <div 
                            key={field.id}
                            className="p-4.5 rounded-xl border border-slate-300 bg-slate-50 flex flex-col gap-4 relative shadow-sm"
                          >
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                              <span className="text-[11px] font-mono text-blue-900 font-extrabold">
                                MEMBER 0{index + 2} DETAILS
                              </span>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-mono text-slate-900 font-extrabold">FULL NAME</label>
                                <input
                                  type="text"
                                  placeholder="Full Name"
                                  {...register(`members.${index}.fullName` as const)}
                                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600"
                                />
                                {errors.members?.[index]?.fullName && (
                                  <span className="text-[9px] text-red-600 font-mono font-bold">
                                    {errors.members[index].fullName.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-mono text-slate-900 font-extrabold">EMAIL</label>
                                <input
                                  type="email"
                                  placeholder="Email Address"
                                  {...register(`members.${index}.email` as const)}
                                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600"
                                />
                                {errors.members?.[index]?.email && (
                                  <span className="text-[9px] text-red-600 font-mono font-bold">
                                    {errors.members[index].email.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-mono text-slate-900 font-extrabold">PHONE</label>
                                <input
                                  type="text"
                                  placeholder="Phone Number"
                                  {...register(`members.${index}.phone` as const)}
                                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600"
                                />
                                {errors.members?.[index]?.phone && (
                                  <span className="text-[9px] text-red-600 font-mono font-bold">
                                    {errors.members[index].phone.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-mono text-slate-900 font-extrabold">STUDENT REG ID</label>
                                <input
                                  type="text"
                                  placeholder="Student ID"
                                  {...register(`members.${index}.studentId` as const)}
                                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600"
                                />
                                {errors.members?.[index]?.studentId && (
                                  <span className="text-[9px] text-red-600 font-mono font-bold">
                                    {errors.members[index].studentId.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-mono text-slate-900 font-extrabold">DEPARTMENT</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Information Technology"
                                  {...register(`members.${index}.department` as const)}
                                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
                                />
                                {errors.members?.[index]?.department && (
                                  <span className="text-[9px] text-red-600 font-mono font-bold">
                                    {errors.members[index].department.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-mono text-slate-900 font-extrabold">YEAR OF STUDY</label>
                                <select
                                  {...register(`members.${index}.year` as const)}
                                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600"
                                >
                                  <option value="">Select Year</option>
                                  <option value={1}>Year 1 (1st Year)</option>
                                  <option value={2}>Year 2 (2nd Year)</option>
                                  <option value={3}>Year 3 (3rd Year)</option>
                                  <option value={4}>Year 4 (4th Year)</option>
                                </select>
                                {errors.members?.[index]?.year && (
                                  <span className="text-[9px] text-red-600 font-mono font-bold">
                                    {errors.members[index].year.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="border-b border-slate-200 pb-3">
                      <h2 className="font-orbitron font-extrabold text-lg text-slate-900 uppercase tracking-widest">
                        Step 03 - Summary & Confirmation
                      </h2>
                      <p className="text-xs text-slate-700 font-semibold font-sans mt-1">
                        Please review your submission details before confirming registration.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-900 shadow-sm">
                      
                      <div className="flex flex-col gap-1 border-b border-slate-200 pb-2 md:col-span-2">
                        <span className="text-[10px] text-blue-900 uppercase font-extrabold">TEAM IDENTIFIER</span>
                        <span className="text-slate-900 text-base font-extrabold font-orbitron">{watchAllFields.teamName || "N/A"}</span>
                      </div>

                      <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                        <span className="text-[10px] text-blue-900 uppercase font-extrabold">TEAM LEADER (MEMBER 01)</span>
                        <span className="text-slate-900 font-extrabold">{watchAllFields.leader?.fullName || "N/A"}</span>
                        <span className="text-[11px] text-slate-700 font-semibold">{watchAllFields.leader?.email} | {watchAllFields.leader?.studentId}</span>
                        {watchAllFields.leader?.department && (
                          <span className="text-[10px] text-violet-700 font-extrabold">{watchAllFields.leader.department} {watchAllFields.leader.year ? `(Year ${watchAllFields.leader.year})` : ''}</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                        <span className="text-[10px] text-blue-900 uppercase font-extrabold">TEAM MEMBERS ({membersCount})</span>
                        <div className="flex flex-col gap-0.5 text-slate-800 font-bold">
                          {watchAllFields.members?.length > 0 ? (
                            watchAllFields.members.map((m, idx) => (
                              <div key={idx} className="text-[11px]">
                                • {m.fullName || "Member"} ({m.studentId}) - <span className="text-violet-700 font-semibold">{m.department || ''} {m.year ? `(Yr ${m.year})` : ''}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-500">None Added</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 pb-1">
                        <span className="text-[10px] text-blue-900 uppercase font-extrabold">CHALLENGE TRACK</span>
                        <span className="text-slate-900 font-extrabold">{watchAllFields.track || "Mobile App Development"}</span>
                      </div>

                      <div className="flex flex-col gap-1 pb-1">
                        <span className="text-[10px] text-blue-900 uppercase font-extrabold">EVENT VENUE & DATE</span>
                        <span className="text-slate-900 font-extrabold">{EVENT_CONFIG.venue} | {EVENT_CONFIG.eventDate}</span>
                      </div>
                    </div>

                    {/* Reference Notice */}
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono font-extrabold text-center flex items-center justify-center gap-2 shadow-sm">
                      <Camera size={15} className="text-blue-600 shrink-0" />
                      <span>Take the Screen Shot or Download the PDF for reference</span>
                    </div>

                    {/* WhatsApp Group Notification */}
                    <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                          <MessageCircle size={18} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-orbitron font-extrabold text-xs text-emerald-900 uppercase tracking-wide">
                            Join Official WhatsApp Group
                          </span>
                          <span className="text-[11px] font-sans text-emerald-800 font-semibold mt-0.5">
                            After confirming your spot, the entire team is requested to join the official WhatsApp group for live hackathon announcements.
                          </span>
                        </div>
                      </div>
                      <a
                        href="https://chat.whatsapp.com/F1sPFIp3qXCFOFa4OXVqIt?s=sw&p=a&mlu=4&ilr=4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105"
                      >
                        <MessageCircle size={14} />
                        <span>JOIN GROUP</span>
                      </a>
                    </div>

                    {/* Agree checkbox */}
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="flex items-start gap-3 cursor-pointer text-xs leading-normal font-sans text-slate-900 font-semibold">
                        <input
                          type="checkbox"
                          {...register("agreeToRules")}
                          className="accent-blue-600 w-4.5 h-4.5 mt-0.5 cursor-pointer rounded border-slate-300"
                        />
                        <span>
                          I agree to the Hackathon rules, code of conduct, and submission requirements. 
                          I verify that the project will be built entirely from scratch during the hack event.
                        </span>
                      </label>
                      {errors.agreeToRules && (
                        <span className="text-[10px] text-red-600 font-mono font-bold flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.agreeToRules.message}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BUTTON CONTROLS */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-5 mt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg border-2 border-slate-300 hover:bg-slate-100 text-xs font-mono uppercase tracking-widest text-slate-800 font-extrabold flex items-center gap-2 transition-all duration-200 disabled:opacity-50 shadow-sm"
                >
                  <ArrowLeft size={13} />
                  BACK
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isClosed}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-mono uppercase tracking-widest text-white font-extrabold flex items-center gap-2 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  NEXT STEP
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || isClosed}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-xs font-mono uppercase tracking-widest text-white font-extrabold hover:from-blue-700 hover:to-violet-700 flex items-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      TRANSACTING...
                    </>
                  ) : (
                    <>
                      CONFIRM REGISTRATION
                      <Check size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 py-6 border-t border-white/10 bg-[#060412]/90 text-center">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          SYSTEM ACTIVE // SECURED WITH SSL & rate limiter
        </span>
      </footer>
    </div>
  );
}
