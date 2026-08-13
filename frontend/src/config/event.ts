export const EVENT_CONFIG = {
  eventName: "MOBILE APP CLUB HACKATHON 2026",
  tagline: "BUILD THE UNEXPECTED",
  collegeName: "",
  eventDate: "March 13 - 14, 2026",
  registrationDeadline: "December 31, 2026",
  maxTotalTeams: 20,
  venue: "Main Auditorium & Labs",
  prizePool: "₹50,000",
  minTeamSize: 2,
  maxTeamSize: 3,
  clubMembers: [
    { id: "president", role: "PRESIDENT", name: "THIRUKUMARAN P S", dept: "IT DEPT", icon: "Crown", color: "from-amber-400 via-yellow-500 to-amber-600", glow: "rgba(245, 158, 11, 0.4)", tag: "Executive Leader" },
    { id: "vice_president", role: "VICE-PRESIDENT", name: "DHANYA R", dept: "CSE DEPT", icon: "Award", color: "from-purple-400 via-indigo-500 to-purple-600", glow: "rgba(168, 85, 247, 0.4)", tag: "Operations Lead" },
    { id: "secretary", role: "SECRETARY", name: "RAHUL J C", dept: "ECE DEPT", icon: "FileText", color: "from-cyan-400 via-blue-500 to-cyan-600", glow: "rgba(6, 182, 212, 0.4)", tag: "Documentation & Comms" },
    { id: "pr_coordinator", role: "PR COORDINATOR", name: "THIVAGARAN M", dept: "MECH DEPT", icon: "Megaphone", color: "from-pink-400 via-rose-500 to-pink-600", glow: "rgba(244, 63, 94, 0.4)", tag: "Outreach & Media" },
    { id: "treasurer", role: "TREASURER", name: "SENTHIL BALAJI S", dept: "AI&ML DEPT", icon: "Coins", color: "from-emerald-400 via-teal-500 to-emerald-600", glow: "rgba(16, 185, 129, 0.4)", tag: "Finance & Accounts" }
  ],
  tracks: [
    { id: "fullstack_web", name: "Full-Stack Web Development", icon: "Globe", desc: "Build responsive, high-performance web applications and modern portals to solve real-time problems." },
    { id: "ai_web", name: "AI-Powered Web Apps", icon: "Cpu", desc: "Integrate intelligent AI models, chatbots, and predictive tools into websites to address real-world challenges." },
    { id: "portal_web", name: "Enterprise & Portal Web Systems", icon: "Smartphone", desc: "Design scalable web portals, management dashboards, and digital platforms to streamline real-time services." },
    { id: "security_web", name: "Web Security & Data Portals", icon: "ShieldAlert", desc: "Develop secure web applications, encrypted data portals, and web security tools for safe online interactions." },
    { id: "social_web", name: "Social Impact Web Solutions", icon: "HeartHandshake", desc: "Create accessible web platforms and community web portals designed to solve real-time societal problems." }
  ],
  timeline: [
    { phase: "01", title: "REGISTRATION", date: "Feb 08 - Mar 05", desc: "Form your team of 2-3 members and register online through this platform." },
    { phase: "02", title: "TEAM FORMATION", date: "Mar 06 - Mar 08", desc: "Finalize roles, brainstorm ideas, and set up your development workspace templates." },
    { phase: "03", title: "IDEA SUBMISSION", date: "Mar 09", desc: "Submit a brief 1-page proposal and wireframe design of your planned hack project." },
    { phase: "04", title: "HACKATHON MAIN EVENT", date: "Mar 13 - 14", desc: "5-hour sprint. Build, break, refactor, and finalize your prototype at the college venue." },
    { phase: "05", title: "FINAL PRESENTATION", date: "Mar 14 (3:00 PM)", desc: "Pitch your product live in front of tech industry mentors and college jury panels." },
    { phase: "06", title: "WINNERS ANNOUNCED", date: "Mar 14 (6:00 PM)", desc: "Jury assessment completes. Trophies, cash prizes, and merchandise are awarded." }
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
    { q: "When does registration close?", a: "Registration closes strictly on March 05, 2026 at 11:59 PM IST." }
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
    { value: 20, label: "TOTAL TEAMS", suffix: "" },
    { value: 0, label: "TEAMS REGISTERED", suffix: "" }
  ] as Array<{ value: number; label: string; suffix?: string; prefix?: string }>,
  contact: {
    email: "mac@college.edu",
    phone: "+91 98765 43210",
    instagram: "https://instagram.com/mobileappclub",
    github: "https://github.com/mobileappclub",
    linkedin: "https://linkedin.com/company/mobileappclub"
  }
};
