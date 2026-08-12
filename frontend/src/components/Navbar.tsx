"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Tracks", href: "#tracks" },
    { name: "Timeline", href: "#timeline" },
    { name: "Prizes", href: "#prizes" },
    { name: "Rules", href: "#rules" },
    { name: "FAQ", href: "#faq" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-cyber-black/70 backdrop-blur-md border-b border-white/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-orbitron text-lg font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow-blue">
              MOBILE APP CLUB
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 -mt-1">
              BUILD THE UNEXPECTED
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-neon-blue transition-colors duration-200 uppercase tracking-widest font-mono text-[11px]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden md:block">
            <Link
              href="/register"
              className="relative px-6 py-2.5 rounded-md font-mono text-xs uppercase tracking-widest text-white border border-neon-blue bg-neon-blue/10 overflow-hidden group transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              <span className="relative z-10">REGISTER NOW →</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-200 hover:text-neon-blue transition-colors p-1"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[60px] z-30 bg-[#040212]/95 backdrop-blur-lg border-b border-white/5 md:hidden flex flex-col items-center justify-center gap-8 p-6"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-orbitron font-semibold tracking-widest text-slate-200 hover:text-neon-blue transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-xs text-center py-3 rounded-md font-mono text-sm uppercase tracking-widest text-white bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              REGISTER NOW
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
