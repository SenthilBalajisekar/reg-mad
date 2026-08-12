export const EVENT_CONFIG = {
  eventName: "MOBILE APP CLUB HACKATHON 2026",
  tagline: "BUILD THE UNEXPECTED",
  collegeName: "Tech Innovation University",
  eventDate: "March 13 - 14, 2026",
  registrationDeadline: "March 05, 2026",
  venue: "Main Auditorium & Labs",
  prizePool: "₹50,000",
  minTeamSize: 2,
  maxTeamSize: 4,
  prizes: [
    { rank: "2nd", title: "Second Place", amount: "₹15,000", desc: "Runner Up Cash Prize + Certificates", color: "from-slate-400 to-slate-500", glow: "rgba(148, 163, 184, 0.4)" },
    { rank: "1st", title: "First Place", amount: "₹25,000", desc: "Grand Winner Trophy + Cash + Goodies", color: "from-yellow-400 via-amber-500 to-yellow-600", glow: "rgba(234, 179, 8, 0.5)", premium: true },
    { rank: "3rd", title: "Third Place", amount: "₹10,000", desc: "Second Runner Up Cash Prize + Certificates", color: "from-amber-700 to-amber-800", glow: "rgba(180, 83, 9, 0.4)" }
  ],
  tracks: [
    { id: "mobile", name: "Mobile Applications", icon: "Smartphone", desc: "Build cutting-edge iOS/Android mobile applications that solve daily user struggles with high performance." },
    { id: "ai_ml", name: "AI & Machine Learning", icon: "Cpu", desc: "Incorporate intelligent LLMs, predictive model networks, or automated agents into workflow applications." },
    { id: "web_tech", name: "Web Technology", icon: "Globe", desc: "Build high-performance, immersive next-generation web applications, devtools, or platform portals." },
    { id: "cybersec", name: "Cybersecurity", icon: "ShieldAlert", desc: "Develop novel cryptography pipelines, server protection layers, or cyber threat prevention dashboards." },
    { id: "social", name: "Social Impact", icon: "HeartHandshake", desc: "Apply software engineering to solve community issues, carbon footprint management, or micro-education." }
  ],
  timeline: [
    { phase: "01", title: "REGISTRATION", date: "Feb 08 - Mar 05", desc: "Form your team of 2-4 members and register online through this platform." },
    { phase: "02", title: "TEAM FORMATION", date: "Mar 06 - Mar 08", desc: "Finalize roles, brainstorm ideas, and set up your development workspace templates." },
    { phase: "03", title: "IDEA SUBMISSION", date: "Mar 09", desc: "Submit a brief 1-page proposal and wireframe design of your planned hack project." },
    { phase: "04", title: "HACKATHON MAIN EVENT", date: "Mar 13 - 14", desc: "24-hour sprint. Build, break, refactor, and finalize your prototype at the college venue." },
    { phase: "05", title: "FINAL PRESENTATION", date: "Mar 14 (3:00 PM)", desc: "Pitch your product live in front of tech industry mentors and college jury panels." },
    { phase: "06", title: "WINNERS ANNOUNCED", date: "Mar 14 (6:00 PM)", desc: "Jury assessment completes. Trophies, cash prizes, and merchandise are awarded." }
  ],
  faqs: [
    { q: "Who can participate?", a: "Any student currently enrolled in an undergraduate or postgraduate program at our university is welcome to join!" },
    { q: "What is the team size?", a: "Teams must have between 2 to 4 members. Solo participations are not permitted." },
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
    { value: 24, label: "HACKATHON HOURS", suffix: "H" },
    { value: 100, label: "PARTICIPANTS", suffix: "+" },
    { value: 25, label: "TEAMS REGISTERED", suffix: "+" },
    { value: 50000, label: "PRIZE POOL", prefix: "₹" }
  ],
  contact: {
    email: "mac@college.edu",
    phone: "+91 98765 43210",
    instagram: "https://instagram.com/mobileappclub",
    github: "https://github.com/mobileappclub",
    linkedin: "https://linkedin.com/company/mobileappclub"
  }
};
