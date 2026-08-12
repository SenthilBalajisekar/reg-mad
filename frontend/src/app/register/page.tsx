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
  collegeName: z.string().min(3, "College Name must be at least 3 characters."),
  department: z.string().min(2, "Department must be at least 2 characters."),
  year: z.coerce.number().min(1, "Select year.").max(5),
  collegeLocation: z.string().min(3, "College Location is required."),
  track: z.string().min(1, "Select a category track."),
  technologyStack: z.string().min(3, "Technology stack is required."),
  problemStatement: z.string().min(15, "Explain the problem in at least 15 characters."),
  previousExperience: z.string().min(1, "Select experience level."),
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
      collegeName: "",
      department: "",
      year: 1,
      collegeLocation: "",
      track: "",
      technologyStack: "",
      problemStatement: "",
      previousExperience: "no",
      agreeToRules: false,
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
    } else if (step === 3) {
      fieldsToValidate = ["collegeName", "department", "year", "collegeLocation"];
    } else if (step === 4) {
      fieldsToValidate = ["track", "technologyStack", "problemStatement", "previousExperience"];
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
      track: data.track,
      problemStatement: data.problemStatement,
      technologyStack: data.technologyStack,
      leader: {
        fullName: data.leader.fullName,
        email: data.leader.email,
        phone: data.leader.phone,
        collegeName: data.collegeName,
        department: data.department,
        year: data.year,
        studentId: data.leader.studentId
      },
      members: data.members.map(m => ({
        fullName: m.fullName,
        email: m.email,
        phone: m.phone,
        collegeName: data.collegeName,
        department: data.department,
        year: data.year,
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
      setApiError(err.message || "Server connection failed. Make sure server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepDetails = [
    { title: "Participant", icon: User },
    { title: "Team Details", icon: Users },
    { title: "College Info", icon: School },
    { title: "Hack Details", icon: Laptop },
    { title: "Confirm Spot", icon: FileCheck }
  ];

  return (
    <div className="relative min-h-screen bg-cyber-black text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-neon-blue/30 selection:text-white">
      <CustomCursor />
      
      {/* Visual background overlays */}
      <div className="absolute inset-0 bg-grid-pattern animate-grid-move opacity-20 pointer-events-none z-0" />
      <div className="absolute inset-0 scanline-overlay opacity-15 pointer-events-none z-10" />

      {/* HEADER NAVBAR */}
      <header className="relative z-20 py-6 px-6 border-b border-white/5 bg-cyber-black/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 hover:text-neon-blue transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            BACK TO HOME
          </button>
          
          <div className="text-right hidden sm:block">
            <span className="font-orbitron font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple tracking-widest">
              MOBILE APP CLUB
            </span>
          </div>
        </div>
      </header>

      {/* WIZARD CONTAINER */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-3xl glass-panel p-6 md:p-10 rounded-2xl border border-white/5 bg-opacity-70 flex flex-col gap-8">
          
          {/* STEP PROGRESS BAR */}
          <div className="w-full flex items-center justify-between relative px-2">
            <div className="absolute top-[18px] left-[5%] right-[5%] h-[2px] bg-slate-800 z-0" />
            <div 
              className="absolute top-[18px] left-[5%] h-[2px] bg-gradient-to-r from-neon-blue to-neon-purple z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 4) * 90}%` }}
            />

            {stepDetails.map((sDet, idx) => {
              const StepIcon = sDet.icon;
              const isActive = step === idx + 1;
              const isCompleted = step > idx + 1;

              return (
                <div key={sDet.title} className="flex flex-col items-center z-10 relative">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isActive 
                        ? "bg-[#0b0825] border-neon-blue shadow-[0_0_12px_rgba(0,240,255,0.4)] text-neon-blue"
                        : isCompleted
                        ? "bg-gradient-to-r from-neon-blue to-neon-purple border-transparent text-white"
                        : "bg-cyber-black border-slate-800 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
                  </div>
                  <span className={`text-[9px] font-mono tracking-wider mt-2 hidden sm:block ${
                    isActive ? "text-neon-blue font-bold" : "text-slate-500"
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
                    <div className="border-b border-white/5 pb-2">
                      <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase tracking-widest">
                        Step 01 - Participant (Leader) Details
                      </h2>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Please provide contact information for the team leader. Communication will be sent here.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          {...register("leader.fullName")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.leader?.fullName ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,240,255,0.15)]"
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
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. johndoe@college.edu"
                          {...register("leader.email")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.leader?.email ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,240,255,0.15)]"
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
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 9876543210 (10 digit)"
                          {...register("leader.phone")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.leader?.phone ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,240,255,0.15)]"
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
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Student Registration ID</label>
                        <input
                          type="text"
                          placeholder="e.g. STU-2026-045"
                          {...register("leader.studentId")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.leader?.studentId ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,240,255,0.15)]"
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
                    <div className="border-b border-white/5 pb-2 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase tracking-widest">
                          Step 02 - Team Details
                        </h2>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                          Set your unique team identifier. Team size must be 2 - 4 members.
                        </p>
                      </div>
                      
                      <div className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded text-xs font-mono text-neon-blue font-bold">
                        SIZE: {membersCount} / 4 MEMBERS
                      </div>
                    </div>

                    {/* Team Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Team Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Cyber Warriors"
                        {...register("teamName")}
                        className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                          errors.teamName ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue"
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
                        <span className="text-xs font-mono tracking-widest text-slate-300 uppercase">
                          Additional Team Members
                        </span>
                        
                        {membersCount < 4 && (
                          <button
                            type="button"
                            onClick={() => append({ fullName: "", email: "", phone: "", studentId: "" })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neon-purple/20 border border-neon-purple/40 text-[10px] font-mono text-slate-200 hover:bg-neon-purple/35 transition-colors duration-200"
                          >
                            <Plus size={12} />
                            ADD MEMBER
                          </button>
                        )}
                      </div>

                      {/* Display warning if too few members */}
                      {membersCount < 2 && (
                        <div className="text-[11px] font-mono text-amber-400 bg-amber-950/20 border border-amber-500/30 p-2.5 rounded">
                          ⚠️ Hackathon rules require a minimum of 2 members. Please add at least 1 team member below.
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        {fields.map((field, index) => (
                          <div 
                            key={field.id}
                            className="p-4 rounded-xl border border-white/5 bg-[#09071c]/50 flex flex-col gap-4 relative"
                          >
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-[10px] font-mono text-neon-blue font-bold">
                                MEMBER 0{index + 2} DETAILS
                              </span>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-400 hover:text-red-500 p-1 rounded hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-mono text-slate-400">FULL NAME</label>
                                <input
                                  type="text"
                                  placeholder="Full Name"
                                  {...register(`members.${index}.fullName` as const)}
                                  className="px-3 py-2 rounded border border-slate-800 bg-slate-950/40 text-slate-200 text-xs focus:outline-none focus:border-neon-blue"
                                />
                                {errors.members?.[index]?.fullName && (
                                  <span className="text-[9px] text-red-400 font-mono">
                                    {errors.members[index].fullName.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-mono text-slate-400">EMAIL</label>
                                <input
                                  type="email"
                                  placeholder="Email"
                                  {...register(`members.${index}.email` as const)}
                                  className="px-3 py-2 rounded border border-slate-800 bg-slate-950/40 text-slate-200 text-xs focus:outline-none focus:border-neon-blue"
                                />
                                {errors.members?.[index]?.email && (
                                  <span className="text-[9px] text-red-400 font-mono">
                                    {errors.members[index].email.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-mono text-slate-400">PHONE</label>
                                <input
                                  type="text"
                                  placeholder="Phone"
                                  {...register(`members.${index}.phone` as const)}
                                  className="px-3 py-2 rounded border border-slate-800 bg-slate-950/40 text-slate-200 text-xs focus:outline-none focus:border-neon-blue"
                                />
                                {errors.members?.[index]?.phone && (
                                  <span className="text-[9px] text-red-400 font-mono">
                                    {errors.members[index].phone.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-mono text-slate-400">STUDENT REG ID</label>
                                <input
                                  type="text"
                                  placeholder="Student ID"
                                  {...register(`members.${index}.studentId` as const)}
                                  className="px-3 py-2 rounded border border-slate-800 bg-slate-950/40 text-slate-200 text-xs focus:outline-none focus:border-neon-blue"
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
                    <div className="border-b border-white/5 pb-2">
                      <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase tracking-widest">
                        Step 03 - College/Academic Details
                      </h2>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Provide college and campus department details. 
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* College Name */}
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">College Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Sathyabama Institute of Science and Technology"
                          {...register("collegeName")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.collegeName ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue"
                          }`}
                        />
                        {errors.collegeName && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.collegeName.message}
                          </span>
                        )}
                      </div>

                      {/* Department */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Department</label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science & Engineering"
                          {...register("department")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.department ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue"
                          }`}
                        />
                        {errors.department && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.department.message}
                          </span>
                        )}
                      </div>

                      {/* Year */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Year of Study</label>
                        <select
                          {...register("year")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.year ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue"
                          }`}
                        >
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="5">5th Year (Dual/Integrated)</option>
                        </select>
                        {errors.year && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.year.message}
                          </span>
                        )}
                      </div>

                      {/* College Location */}
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">College Location (City, State)</label>
                        <input
                          type="text"
                          placeholder="e.g. Chennai, Tamil Nadu"
                          {...register("collegeLocation")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.collegeLocation ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue"
                          }`}
                        />
                        {errors.collegeLocation && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.collegeLocation.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="border-b border-white/5 pb-2">
                      <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase tracking-widest">
                        Step 04 - Hackathon Project details
                      </h2>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Select a track category and briefly summarize your target implementation details.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                      {/* Preferred Track */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Preferred Category Track</label>
                        <select
                          {...register("track")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.track ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue"
                          }`}
                        >
                          <option value="">-- Choose Track --</option>
                          {EVENT_CONFIG.tracks.map((t) => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                        {errors.track && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.track.message}
                          </span>
                        )}
                      </div>

                      {/* Technology Stack */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Proposed Technology Stack</label>
                        <input
                          type="text"
                          placeholder="e.g. Next.js, Express, MySQL, TailwindCSS, PyTorch"
                          {...register("technologyStack")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 ${
                            errors.technologyStack ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue"
                          }`}
                        />
                        {errors.technologyStack && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.technologyStack.message}
                          </span>
                        )}
                      </div>

                      {/* Problem Statement description */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Brief Problem Statement / Idea</label>
                        <textarea
                          rows={3}
                          placeholder="Tell us what problem you want to address and how you plan to solve it."
                          {...register("problemStatement")}
                          className={`w-full px-4 py-3 rounded-lg border bg-slate-950/50 text-slate-200 text-sm focus:outline-none transition-all duration-200 font-sans resize-none ${
                            errors.problemStatement ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-neon-blue"
                          }`}
                        />
                        {errors.problemStatement && (
                          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.problemStatement.message}
                          </span>
                        )}
                      </div>

                      {/* Experience */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Previous Hackathon Experience?</label>
                        <div className="flex gap-6 items-center">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                            <input
                              type="radio"
                              value="yes"
                              {...register("previousExperience")}
                              className="accent-neon-blue w-4 h-4 cursor-pointer"
                            />
                            YES, PARTICIPATED BEFORE
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                            <input
                              type="radio"
                              value="no"
                              {...register("previousExperience")}
                              className="accent-neon-blue w-4 h-4 cursor-pointer"
                            />
                            NO, FIRST HACKATHON
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="border-b border-white/5 pb-2">
                      <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase tracking-widest">
                        Step 05 - Summary & Confirmation
                      </h2>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Please review your submission details before confirming registration.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-cyber-dark/60 p-5 rounded-xl border border-white/5">
                      
                      <div className="flex flex-col gap-1 border-b border-white/5 pb-2 md:col-span-2">
                        <span className="text-[9px] text-slate-500 uppercase">TEAM IDENTIFIER</span>
                        <span className="text-neon-blue text-sm font-bold font-orbitron">{watchAllFields.teamName || "N/A"}</span>
                      </div>

                      <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                        <span className="text-[9px] text-slate-500 uppercase">TEAM LEADER (MEMBER 01)</span>
                        <span className="text-slate-200">{watchAllFields.leader?.fullName || "N/A"}</span>
                        <span className="text-[10px] text-slate-400">{watchAllFields.leader?.email} | {watchAllFields.leader?.studentId}</span>
                      </div>

                      <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                        <span className="text-[9px] text-slate-500 uppercase">TEAM MEMBERS</span>
                        <div className="flex flex-col gap-0.5 text-slate-300">
                          {watchAllFields.members?.length > 0 ? (
                            watchAllFields.members.map((m, idx) => (
                              <div key={idx} className="text-[11px]">
                                • {m.fullName || "Member"} ({m.studentId})
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500">None Added</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 border-b border-white/5 pb-2 md:col-span-2">
                        <span className="text-[9px] text-slate-500 uppercase">COLLEGE / ACADEMIC AFFILIATION</span>
                        <span className="text-slate-300">{watchAllFields.collegeName}</span>
                        <span className="text-[10px] text-slate-400">
                          {watchAllFields.department} — Year {watchAllFields.year} ({watchAllFields.collegeLocation})
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 pb-1">
                        <span className="text-[9px] text-slate-500 uppercase">CHALLENGE TRACK</span>
                        <span className="text-slate-300">{watchAllFields.track || "N/A"}</span>
                      </div>

                      <div className="flex flex-col gap-1 pb-1">
                        <span className="text-[9px] text-slate-500 uppercase">TECHNOLOGY STACK</span>
                        <span className="text-slate-300 truncate max-w-xs">{watchAllFields.technologyStack || "N/A"}</span>
                      </div>
                    </div>

                    {/* Agree checkbox */}
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="flex items-start gap-3 cursor-pointer text-xs leading-normal font-sans text-slate-300">
                        <input
                          type="checkbox"
                          {...register("agreeToRules")}
                          className="accent-neon-blue w-4.5 h-4.5 mt-0.5 cursor-pointer rounded border-slate-800"
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
            <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 text-xs font-mono uppercase tracking-widest text-slate-300 hover:text-white flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                >
                  <ArrowLeft size={12} />
                  BACK
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 rounded-lg bg-slate-900 border border-neon-blue/30 text-xs font-mono uppercase tracking-widest text-neon-blue font-bold hover:bg-neon-blue/15 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] flex items-center gap-2 transition-all duration-300"
                >
                  NEXT STEP
                  <ArrowRight size={12} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-xs font-mono uppercase tracking-widest text-white font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2 transition-all duration-300 disabled:opacity-80"
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
      <footer className="relative z-20 py-6 border-t border-white/5 bg-[#02000f]/80 text-center">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          SYSTEM ACTIVE // SECURED WITH SSL & rate limiter
        </span>
      </footer>
    </div>
  );
}
