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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#060412]/90 backdrop-blur-xl border-b border-violet-500/30 py-3 shadow-xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-orbitron text-base sm:text-lg font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-purple-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              MOBILE APP CLUB
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyan-300 -mt-1 font-bold">
              BUILD THE UNEXPECTED
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-extrabold text-white hover:text-cyan-300 transition-colors duration-200 uppercase tracking-widest font-mono drop-shadow-sm"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden md:block">
            <Link
              href="/register"
              className="relative px-6 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.65)] transition-all duration-300"
            >
              REGISTER NOW →
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-cyan-300 transition-colors p-2 rounded-lg bg-slate-900/80 border border-violet-500/30 shadow-sm"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
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
            className="fixed inset-0 top-[64px] z-40 bg-[#060412]/98 backdrop-blur-2xl border-b border-violet-500/30 md:hidden flex flex-col items-center justify-center gap-8 p-6"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-orbitron font-bold tracking-widest text-white hover:text-cyan-300 transition-colors uppercase"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-xs text-center py-3.5 rounded-lg font-mono text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
            >
              REGISTER NOW →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
