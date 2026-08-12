"use client";

import Link from "next/link";
import { EVENT_CONFIG } from "../config/event";
import { Github, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#02000f] border-t border-white/5 py-12 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute w-[200px] h-[200px] bg-neon-blue/5 rounded-full blur-[80px] bottom-0 left-10 pointer-events-none" />
      <div className="absolute w-[200px] h-[200px] bg-neon-purple/5 rounded-full blur-[80px] top-0 right-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* About Club */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="font-orbitron text-lg font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            MOBILE APP CLUB
          </Link>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-sans">
            Empowering students to design, develop, and deploy cutting-edge mobile and web platforms. 
            Bridging college learning with software industry excellence.
          </p>
          <span className="text-[10px] font-mono text-slate-400 mt-2">
            © {new Date().getFullYear()} Mobile App Club. All rights reserved.
          </span>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-orbitron text-sm font-bold tracking-wider text-slate-100">
            CONTACT INFO
          </h4>
          <div className="flex flex-col gap-2.5 text-xs text-slate-300 font-sans">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-violet-400" />
              <span>{EVENT_CONFIG.contact.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-violet-400" />
              <span>{EVENT_CONFIG.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-violet-400" />
              <span>{EVENT_CONFIG.venue}</span>
            </div>
          </div>
        </div>

        {/* Social & Resources */}
        <div className="flex flex-col gap-4">
          <h4 className="font-orbitron text-sm font-bold tracking-wider text-slate-100">
            CONNECT WITH US
          </h4>
          <div className="flex items-center gap-4">
            <a
              href={EVENT_CONFIG.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-violet-500/20 hover:border-violet-400 transition-all duration-300"
            >
              <Github size={16} className="text-slate-300" />
            </a>
            <a
              href={EVENT_CONFIG.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-400 transition-all duration-300"
            >
              <Instagram size={16} className="text-slate-300" />
            </a>
            <a
              href={EVENT_CONFIG.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-300"
            >
              <Linkedin size={16} className="text-slate-300" />
            </a>
          </div>
          <div className="mt-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              VENUE: {EVENT_CONFIG.venue}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              DATES: {EVENT_CONFIG.eventDate}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

