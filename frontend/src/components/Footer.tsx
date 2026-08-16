"use client";

import { useState } from "react";
import Link from "next/link";
import { EVENT_CONFIG } from "../config/event";
import { Github, Instagram, Linkedin, Mail, Phone, MapPin, Lock } from "lucide-react";
import AdminModal from "./AdminModal";

export default function Footer() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <footer className="relative bg-slate-50 border-t border-slate-200 py-12 overflow-hidden text-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* About Club */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex flex-col">
            <span className="font-orbitron text-lg font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-violet-700">
              MOBILE APP CLUB
            </span>
            <span className="text-[9px] font-mono tracking-widest text-amber-600 font-extrabold uppercase">
              POWERED BY ISTE
            </span>
          </Link>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm font-sans">
            Empowering students to design, develop, and deploy cutting-edge mobile and web platforms. 
            Bridging college learning with software industry excellence.
          </p>
          <span className="text-[10px] font-mono text-slate-500 mt-2">
            © {new Date().getFullYear()} Mobile App Club. All rights reserved.
          </span>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-orbitron text-sm font-bold tracking-wider text-slate-900">
            CONTACT INFO
          </h4>
          <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-sans">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-violet-600" />
              <span>{EVENT_CONFIG.contact.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-violet-600" />
              <span>{EVENT_CONFIG.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-violet-600" />
              <span>{EVENT_CONFIG.venue}</span>
            </div>

            {/* ADMIN PORTAL BUTTON */}
            <div className="pt-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-violet-700 text-white text-xs font-mono font-bold tracking-wider transition-all duration-200 shadow-md group cursor-pointer"
              >
                <Lock size={13} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>ADMIN PORTAL</span>
              </button>
            </div>
          </div>
        </div>

        {/* Social & Resources */}
        <div className="flex flex-col gap-4">
          <h4 className="font-orbitron text-sm font-bold tracking-wider text-slate-900">
            CONNECT WITH US
          </h4>
          <div className="flex items-center gap-4">
            <a
              href={EVENT_CONFIG.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-violet-50 hover:border-violet-400 transition-all duration-300 shadow-sm"
            >
              <Github size={16} className="text-slate-700" />
            </a>
            <a
              href={EVENT_CONFIG.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-pink-50 hover:border-pink-400 transition-all duration-300 shadow-sm"
            >
              <Instagram size={16} className="text-slate-700" />
            </a>
            <a
              href={EVENT_CONFIG.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 shadow-sm"
            >
              <Linkedin size={16} className="text-slate-700" />
            </a>
          </div>
          <div className="mt-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-medium">
              VENUE: {EVENT_CONFIG.venue}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-medium">
              DATES: {EVENT_CONFIG.eventDate}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Portal Modal */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </footer>
  );
}

