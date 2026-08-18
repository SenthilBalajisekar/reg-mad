export const EVENT_CONFIG = {
  eventName: "APP RADIX - 26",
  tagline: "BUILD THE UNEXPECTED",
  poweredBy: "POWERED BY ISTE",
  collegeName: "",
  eventDate: "September 9, 2026",
  registrationDeadline: "September 9, 2026 23:59:59",
  venue: "Ramanujan Hall : CH 5",
  prizePool: "₹50,000",
  minTeamSize: 3,
  maxTeamSize: 4,
  facultyCoordinator: {
    id: "faculty_coordinator",
    role: "FACULTY COORDINATOR",
    name: "Mrs. SUBHA S",
    dept: "AP/IT",
    icon: "GraduationCap",
    color: "from-blue-600 via-indigo-600 to-purple-600",
    glow: "rgba(99, 102, 241, 0.4)",
    tag: "Faculty Advisor"
  },
  clubMembers: [
    { id: "president", role: "PRESIDENT", name: "THIRUKUMARAN P S", dept: "IT DEPT", icon: "Crown", color: "from-amber-400 via-yellow-500 to-amber-600", glow: "rgba(245, 158, 11, 0.4)", tag: "Executive Leader" },
    { id: "vice_president", role: "VICE-PRESIDENT", name: "DHANYA R", dept: "CSE DEPT", icon: "Award", color: "from-purple-400 via-indigo-500 to-purple-600", glow: "rgba(168, 85, 247, 0.4)", tag: "Operations Lead" },
    { id: "secretary", role: "SECRETARY", name: "RAHUL J C", dept: "ECE DEPT", icon: "FileText", color: "from-cyan-400 via-blue-500 to-cyan-600", glow: "rgba(6, 182, 212, 0.4)", tag: "Documentation & Comms" },
    { id: "pr_coordinator", role: "PR COORDINATOR", name: "THIVAGARAN M", dept: "MECH DEPT", icon: "Megaphone", color: "from-pink-400 via-rose-500 to-pink-600", glow: "rgba(244, 63, 94, 0.4)", tag: "Outreach & Media" },
    { id: "treasurer", role: "TREASURER", name: "SENTHIL BALAJI S", dept: "AI&ML DEPT", icon: "Coins", color: "from-emerald-400 via-teal-500 to-emerald-600", glow: "rgba(16, 185, 129, 0.4)", tag: "Finance & Accounts" }
  ],
  tracks: [
    { id: "cross_platform_mobile", name: "Cross-Platform Mobile Apps", icon: "Smartphone", desc: "Build high-performance Flutter, React Native, or Native mobile applications to solve real-time daily utility & urban problems." },
    { id: "ai_mobile", name: "AI-Powered Mobile Solutions", icon: "Cpu", desc: "Integrate smart ML models, on-device AI, and intelligent chatbots into mobile apps for real-time decision making." },
    { id: "utility_mobile", name: "Real-Time Utility & Smart City Apps", icon: "Globe", desc: "Develop location-aware, live tracking, and real-time emergency service mobile applications for community impact." },
    { id: "security_mobile", name: "Mobile Security & Data Privacy", icon: "ShieldAlert", desc: "Design encrypted mobile wallets, secure authentication tools, and data privacy solutions for mobile users." },
    { id: "sdg_mobile", name: "Social Impact & SDG Mobile Apps", icon: "HeartHandshake", desc: "Create accessible, offline-first mobile applications targeted at achieving UN Sustainable Development Goals." }
  ],
  timeline: [
    { phase: "01", title: "REGISTRATION", date: "Aug 08 - Sep 09", desc: "Form your team of 3-4 members and register online through this platform." },
    { phase: "02", title: "TEAM FORMATION", date: "Sep 01 - Sep 06", desc: "Finalize roles, brainstorm ideas, and set up your development workspace templates." },
    { phase: "03", title: "IDEA SUBMISSION", date: "Sep 08", desc: "Submit a brief 1-page proposal and wireframe design of your planned hack project." },
    { phase: "04", title: "HACKATHON MAIN EVENT", date: "Sep 09", desc: "5-hour sprint. Build, break, refactor, and finalize your prototype at the college venue." },
    { phase: "05", title: "FINAL PRESENTATION", date: "Sep 09 (3:00 PM)", desc: "Pitch your product live in front of tech industry mentors and college jury panels." },
    { phase: "06", title: "WINNERS ANNOUNCED", date: "Sep 09 (6:00 PM)", desc: "Jury assessment completes. Trophies, cash prizes, and merchandise are awarded." }
  ],
  faqs: [
    { q: "Who can participate?", a: "Any student currently enrolled in an undergraduate or postgraduate program at our university is welcome to join!" },
    { q: "What is the team size?", a: "Teams must have between 2 to 3 members. Solo participations are not permitted." },
    { q: "Is registration free?", a: "Yes, registration is 100% free for all students. Food, snacks, and wifi will be provided by the club." },
    { q: "Do I need previous hackathon experience?", a: "Not at all! Many participants build their very first developer project here. We will have mentors to guide you." },
    { q: "What should we build?", a: "Choose one of our five tracks (Mobile, AI, Web, Security, Social) and build a functional tech prototype related to your track." },
    { q: "What technologies can we use?", a: "You can use any frameworks, languages, or services (e.g. Next.js, Flutter, React Native, Node.js, Python, Firebase, MySQL, Supabase, etc.)." },
    { q: "Can we use AI tools?", a: "Yes! Utilizing AI tools like GitHub Copilot, ChatGPT, or Cursor to accelerate your coding is allowed and encouraged." },
    { q: "How will projects be judged?", a: "Judging will be based on Innovation (30%), Execution & Technical Difficulty (30%), UX/UI Design (20%), and Pitch/Presentation (20%)." },
    { q: "What should we submit?", a: "You will submit a working GitHub repository link and a short demo video of your application at the end of the hackathon." },
    { q: "When does registration close?", a: "Registration closes strictly on September 9, 2026 at 11:59 PM IST." }
  ],
  rules: [
    { title: "Team Integrity", detail: "All team members must be registered. Sharing accounts or combining projects from non-registered students is prohibited." },
    { title: "Original Work", detail: "Your project must be written from scratch during the hackathon. Using pre-existing personal projects is not permitted." },
    { title: "No Plagiarism", detail: "Copying another team's project repository or using open source templates without modification will lead to disqualification." },
    { title: "Submission Deadline", detail: "Code commits must stop exactly at the hackathon timer buzzer. Any commits pushed after the deadline will not be evaluated." },
    { title: "Code of Conduct", detail: "Treat all other participants, mentors, organizers, and volunteers with respect. Harassment of any form will result in immediate disqualification." }
  ],
  stats: [
    { value: 5, label: "HACKATHON HOURS", suffix: "H" },
    { value: 0, label: "TEAMS REGISTERED", suffix: "" }
  ] as Array<{ value: number; label: string; suffix?: string; prefix?: string }>,
  contact: {
    email: "senthilbalaji824@gamil.com",
    phone: "+91 93443 56417 / +91 95971 71573",
    instagram: "https://www.instagram.com/iste.mkce?igsh=aDRoa2pldjIydDB4",
    github: "https://github.com/mobileappclub",
    linkedin: "https://linkedin.com/company/mobileappclub"
  }
};
