"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { RunningAdTicker, WinstarModal } from "./RunningAd";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

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
    { name: "Members", href: "#members" },
    { name: "Sponsors Details", href: "#advertisement" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-md"
            : "bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm"
        }`}
      >
        {/* Continuous Running Advertisement Ticker */}
        <RunningAdTicker onOpenModal={() => setIsAdModalOpen(true)} />

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "py-2.5" : "py-3.5"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-orbitron text-base sm:text-lg font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-700 to-violet-700 drop-shadow-sm">
              MOBILE APP CLUB
            </span>
            <span className="text-[9px] font-mono tracking-widest text-amber-600 font-extrabold uppercase -mt-0.5">
              POWERED BY ISTE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-extrabold text-slate-700 hover:text-blue-600 transition-colors duration-200 uppercase tracking-widest font-mono"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden md:block">
            <Link
              href="/register"
              className="relative px-6 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.55)] transition-all duration-300"
            >
              REGISTER NOW →
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-800 hover:text-blue-600 transition-colors p-2 rounded-lg bg-white border border-slate-200 shadow-sm"
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
            className="fixed inset-0 top-[108px] z-40 bg-white/98 backdrop-blur-2xl border-b border-slate-200 md:hidden flex flex-col items-center justify-center gap-8 p-6 shadow-xl"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-orbitron font-bold tracking-widest text-slate-900 hover:text-blue-600 transition-colors uppercase"
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

      {/* Interactive Modal for Winstar Tours Packages */}
      <WinstarModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
      />
    </>
  );
}
