"use client";

import { useState } from "react";
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
  Loader2
} from "lucide-react";

import { EVENT_CONFIG } from "@/config/event";
import CustomCursor from "@/components/CustomCursor";

// Validation Schema using Zod
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/; // Standard Indian phone pattern

const MemberSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().regex(emailRegex, "Provide a valid email address."),
  phone: z.string().regex(phoneRegex, "Provide a valid 10-digit phone number."),
  studentId: z.string().min(3, "Student ID must be at least 3 characters.")
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
      track: "Website Development",
      technologyStack: "Website Development",
      problemStatement: "To build the website based on the SDG goals. The Problem Statement will be given on the spot.",
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
  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (step === 1) {
      fieldsToValidate = [
        "leader.fullName",
        "leader.email",
        "leader.phone",
        "leader.studentId"
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
    setIsSubmitting(true);
    setApiError(null);

    // Format payload for backend structure
    const payload = {
      teamName: data.teamName,
      track: data.track || "Website Development",
      problemStatement: data.problemStatement || "To build the website based on the SDG goals. The Problem Statement will be given on the spot.",
      technologyStack: data.technologyStack || "Website Development",
      leader: {
        fullName: data.leader.fullName,
        email: data.leader.email,
        phone: data.leader.phone,
        collegeName: data.collegeName || "Sathyabama Institute of Science and Technology",
        department: data.department || "Computer Science & Engineering",
        year: data.year || 1,
        studentId: data.leader.studentId
      },
      members: data.members.map(m => ({
        fullName: m.fullName,
        email: m.email,
        phone: m.phone,
        collegeName: data.collegeName || "Sathyabama Institute of Science and Technology",
        department: data.department || "Computer Science & Engineering",
        year: data.year || 1,
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
    <div className="relative min-h-screen bg-[#060412] text-white flex flex-col justify-between overflow-x-hidden selection:bg-violet-600 selection:text-white">
      <CustomCursor />
      
      {/* Visual background overlays */}
      <div className="absolute inset-0 bg-grid-pattern animate-grid-move opacity-30 pointer-events-none z-0" />

      {/* HEADER NAVBAR */}
      <header className="relative z-20 py-6 px-6 border-b border-violet-500/30 bg-[#060412]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-300 hover:text-cyan-300 font-bold transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            BACK TO HOME
          </button>
          
          <div className="text-right hidden sm:block">
            <span className="font-orbitron font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-purple-300 tracking-widest">
              MOBILE APP CLUB
            </span>
          </div>
        </div>
      </header>

      {/* WIZARD CONTAINER */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-3xl glass-panel p-6 md:p-10 rounded-2xl border border-violet-500/30 bg-[#0e0926]/90 shadow-2xl flex flex-col gap-8">
          
          {/* STEP PROGRESS BAR */}
          <div className="w-full flex items-center justify-between relative px-6">
            <div className="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-slate-800 z-0" />
            <div 
              className="absolute top-[18px] left-[10%] h-[2px] bg-gradient-to-r from-cyan-400 via-violet-500 to-purple-500 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 80}%` }}
            />

            {stepDetails.map((sDet, idx) => {
              const StepIcon = sDet.icon;
              const isActive = step === idx + 1;
              const isCompleted = step > idx + 1;

              return (
                <div key={sDet.title} className="flex flex-col items-center z-10 relative">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isActive 
                        ? "bg-[#0b0825] border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] text-cyan-300 font-bold"
                        : isCompleted
                        ? "bg-gradient-to-r from-cyan-500 to-violet-600 border-transparent text-white"
                        : "bg-slate-900 border-slate-700 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                  </div>
                  <span className={`text-[10px] font-mono tracking-wider mt-2 hidden sm:block ${
                    isActive ? "text-cyan-300 font-extrabold" : "text-slate-400"
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
                  className="bg-red-950/40 border border-red-500/50 p-4 rounded-lg flex items-center gap-3 text-red-200 text-xs md:text-sm"
                >
                  <AlertCircle className="text-red-400 shrink-0" size={16} />
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
                    <div className="border-b border-white/10 pb-2">
                      <h2 className="font-orbitron font-bold text-lg text-white uppercase tracking-widest">
                        Step 01 - Participants
                      </h2>
                      <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                        Please provide contact details for the team leader. Communication will be sent here.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-cyan-300 uppercase font-bold">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          {...register("leader.fullName")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/80 text-white text-sm focus:outline-none transition-all duration-200 ${
                            errors.leader?.fullName ? "border-red-500/60 focus:border-red-500" : "border-slate-700 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                          }`}
                        />
                        {errors.leader?.fullName && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.fullName.message}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-cyan-300 uppercase font-bold">Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. johndoe@college.edu"
                          {...register("leader.email")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/80 text-white text-sm focus:outline-none transition-all duration-200 ${
                            errors.leader?.email ? "border-red-500/60 focus:border-red-500" : "border-slate-700 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                          }`}
                        />
                        {errors.leader?.email && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.email.message}
                          </span>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-cyan-300 uppercase font-bold">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 9876543210 (10 digit)"
                          {...register("leader.phone")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/80 text-white text-sm focus:outline-none transition-all duration-200 ${
                            errors.leader?.phone ? "border-red-500/60 focus:border-red-500" : "border-slate-700 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                          }`}
                        />
                        {errors.leader?.phone && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.phone.message}
                          </span>
                        )}
                      </div>

                      {/* Student ID */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-cyan-300 uppercase font-bold">Student Registration ID</label>
                        <input
                          type="text"
                          placeholder="e.g. STU-2026-045"
                          {...register("leader.studentId")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/80 text-white text-sm focus:outline-none transition-all duration-200 ${
                            errors.leader?.studentId ? "border-red-500/60 focus:border-red-500" : "border-slate-700 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                          }`}
                        />
                        {errors.leader?.studentId && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.leader.studentId.message}
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
                    <div className="border-b border-white/10 pb-2 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h2 className="font-orbitron font-bold text-lg text-white uppercase tracking-widest">
                          Step 02 - Team Details
                        </h2>
                        <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                          Set your unique team name. Team size must be 2 - 3 members.
                        </p>
                      </div>
                      
                      <div className="px-3 py-1 bg-cyan-950/60 border border-cyan-400/50 rounded text-xs font-mono text-cyan-300 font-bold">
                        SIZE: {membersCount} / 3 MEMBERS
                      </div>
                    </div>

                    {/* Team Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-cyan-300 uppercase font-bold">Team Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Cyber Warriors"
                        {...register("teamName")}
                        className={`w-full px-4 py-3 rounded-lg border bg-slate-950/80 text-white text-sm focus:outline-none transition-all duration-200 ${
                          errors.teamName ? "border-red-500/60 focus:border-red-500" : "border-slate-700 focus:border-cyan-400"
                        }`}
                      />
                      {errors.teamName && (
                        <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.teamName.message}
                        </span>
                      )}
                    </div>

                    {/* Members List */}
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono tracking-widest text-slate-200 uppercase font-bold">
                          Additional Team Members
                        </span>
                        
                        {membersCount < 3 && (
                          <button
                            type="button"
                            onClick={() => append({ fullName: "", email: "", phone: "", studentId: "" })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-violet-600/30 border border-violet-400/50 text-[10px] font-mono text-white hover:bg-violet-600/50 transition-colors duration-200"
                          >
                            <Plus size={12} />
                            ADD MEMBER
                          </button>
                        )}
                      </div>

                      {/* Display warning if too few members */}
                      {membersCount < 2 && (
                        <div className="text-[11px] font-mono text-amber-300 bg-amber-950/40 border border-amber-500/40 p-2.5 rounded">
                          ⚠️ Hackathon rules require a minimum of 2 members. Please add 1 team member below.
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        {fields.map((field, index) => (
                          <div 
                            key={field.id}
                            className="p-4 rounded-xl border border-violet-500/30 bg-slate-950/70 flex flex-col gap-4 relative"
                          >
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                              <span className="text-[10px] font-mono text-cyan-300 font-bold">
                                MEMBER 0{index + 2} DETAILS
                              </span>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/20 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-mono text-slate-300">FULL NAME</label>
                                <input
                                  type="text"
                                  placeholder="Full Name"
                                  {...register(`members.${index}.fullName` as const)}
                                  className="px-3 py-2 rounded border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-cyan-400"
                                />
                                {errors.members?.[index]?.fullName && (
                                  <span className="text-[9px] text-red-400 font-mono">
                                    {errors.members[index].fullName.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-mono text-slate-300">EMAIL</label>
                                <input
                                  type="email"
                                  placeholder="Email"
                                  {...register(`members.${index}.email` as const)}
                                  className="px-3 py-2 rounded border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-cyan-400"
                                />
                                {errors.members?.[index]?.email && (
                                  <span className="text-[9px] text-red-400 font-mono">
                                    {errors.members[index].email.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-mono text-slate-300">PHONE</label>
                                <input
                                  type="text"
                                  placeholder="Phone"
                                  {...register(`members.${index}.phone` as const)}
                                  className="px-3 py-2 rounded border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-cyan-400"
                                />
                                {errors.members?.[index]?.phone && (
                                  <span className="text-[9px] text-red-400 font-mono">
                                    {errors.members[index].phone.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-mono text-slate-300">STUDENT REG ID</label>
                                <input
                                  type="text"
                                  placeholder="Student ID"
                                  {...register(`members.${index}.studentId` as const)}
                                  className="px-3 py-2 rounded border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-cyan-400"
                                />
                                {errors.members?.[index]?.studentId && (
                                  <span className="text-[9px] text-red-400 font-mono">
                                    {errors.members[index].studentId.message}
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
                    <div className="border-b border-white/10 pb-2">
                      <h2 className="font-orbitron font-bold text-lg text-white uppercase tracking-widest">
                        Step 03 - Summary & Confirmation
                      </h2>
                      <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                        Please review your submission details before confirming registration.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-slate-950/80 p-5 rounded-xl border border-violet-500/30">
                      
                      <div className="flex flex-col gap-1 border-b border-white/10 pb-2 md:col-span-2">
                        <span className="text-[9px] text-cyan-400 uppercase font-bold">TEAM IDENTIFIER</span>
                        <span className="text-white text-base font-bold font-orbitron">{watchAllFields.teamName || "N/A"}</span>
                      </div>

                      <div className="flex flex-col gap-1 border-b border-white/10 pb-2">
                        <span className="text-[9px] text-cyan-400 uppercase font-bold">TEAM LEADER (MEMBER 01)</span>
                        <span className="text-white font-bold">{watchAllFields.leader?.fullName || "N/A"}</span>
                        <span className="text-[10px] text-slate-300">{watchAllFields.leader?.email} | {watchAllFields.leader?.studentId}</span>
                      </div>

                      <div className="flex flex-col gap-1 border-b border-white/10 pb-2">
                        <span className="text-[9px] text-cyan-400 uppercase font-bold">TEAM MEMBERS ({membersCount})</span>
                        <div className="flex flex-col gap-0.5 text-slate-200">
                          {watchAllFields.members?.length > 0 ? (
                            watchAllFields.members.map((m, idx) => (
                              <div key={idx} className="text-[11px]">
                                • {m.fullName || "Member"} ({m.studentId})
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400">None Added</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 pb-1">
                        <span className="text-[9px] text-cyan-400 uppercase font-bold">CHALLENGE TRACK</span>
                        <span className="text-white font-bold">{watchAllFields.track || "Website Development"}</span>
                      </div>

                      <div className="flex flex-col gap-1 pb-1">
                        <span className="text-[9px] text-cyan-400 uppercase font-bold">EVENT GOAL</span>
                        <span className="text-white truncate max-w-xs font-bold">Website Development based on SDG goals</span>
                      </div>
                    </div>

                    {/* Agree checkbox */}
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="flex items-start gap-3 cursor-pointer text-xs leading-normal font-sans text-slate-200">
                        <input
                          type="checkbox"
                          {...register("agreeToRules")}
                          className="accent-cyan-400 w-4.5 h-4.5 mt-0.5 cursor-pointer rounded border-slate-700"
                        />
                        <span>
                          I agree to the Hackathon rules, code of conduct, and submission requirements. 
                          I verify that the project will be built entirely from scratch during the hack event.
                        </span>
                      </label>
                      {errors.agreeToRules && (
                        <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.agreeToRules.message}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BUTTON CONTROLS */}
            <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-xs font-mono uppercase tracking-widest text-white flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                >
                  <ArrowLeft size={12} />
                  BACK
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 rounded-lg bg-slate-900 border border-cyan-400/50 text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold hover:bg-cyan-950/60 hover:shadow-[0_0_12px_rgba(56,189,248,0.3)] flex items-center gap-2 transition-all duration-300"
                >
                  NEXT STEP
                  <ArrowRight size={12} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-xs font-mono uppercase tracking-widest text-white font-bold hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center gap-2 transition-all duration-300 disabled:opacity-80"
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
