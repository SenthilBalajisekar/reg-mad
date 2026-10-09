"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bus, 
  Phone, 
  Sparkles, 
  X, 
  MapPin, 
  Award,
  MessageCircle
} from "lucide-react";

export function RunningAdTicker({ onOpenModal }: { onOpenModal: () => void }) {
  const tickerText = (
    <>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/60 text-amber-300 font-extrabold uppercase tracking-wider text-[11px] sm:text-xs shadow-sm">
        <span>⭐</span> SPONSORED BY: WINSTAR TOURS <span>•</span> 📍 NAMAKKAL
      </span>
      <span className="text-rose-400 font-bold">✦</span>
      <span className="inline-flex items-center gap-2 text-amber-300 font-extrabold uppercase tracking-widest">
        <span>🚌</span> WINSTAR PACKAGES AVAILABLE <span>🚌</span>
      </span>
      <span className="text-rose-400 font-bold">✦</span>
      <span className="inline-flex items-center gap-1.5 font-bold text-white">
        <span>✨</span> TRIP PACKAGES FOR EVERYONE:
      </span>
      <span className="text-yellow-300 font-semibold">🎓 All College Trip</span>
      <span className="text-rose-400">•</span>
      <span className="text-cyan-300 font-semibold">🏫 All School Trip</span>
      <span className="text-rose-400">•</span>
      <span className="text-emerald-300 font-semibold">👨‍👩‍👧‍👦 All Family Trip</span>
      <span className="text-rose-400">•</span>
      <span className="text-orange-300 font-semibold">🛕 Kovil Function Trip</span>
      <span className="text-rose-400">•</span>
      <span className="text-pink-300 font-semibold">💍 Wedding Function Trip</span>
      <span className="text-rose-400 font-bold">✦</span>
      <span className="inline-flex items-center gap-1.5 text-amber-200 font-bold">
        <span>🚌</span> ALL BUSES AVAILABLE:
      </span>
      <span className="text-blue-200 font-medium">❄️ AC / NON-AC BUSES</span>
      <span className="text-rose-400">•</span>
      <span className="text-purple-200 font-medium">🏨 AC / NON-AC ROOMS</span>
      <span className="text-rose-400">•</span>
      <span className="text-amber-300 font-medium">🔥 CAMPFIRE DJ</span>
      <span className="text-rose-400">•</span>
      <span className="text-emerald-200 font-medium">🚙 JEEP SAFARI</span>
      <span className="text-rose-400">•</span>
      <span className="text-cyan-200 font-medium">🛥️ BOATING DJ</span>
      <span className="text-rose-400 font-bold">✦</span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-bold font-mono">
        <MapPin className="w-3 h-3 text-emerald-400 inline" /> LOCATION: NAMAKKAL
      </span>
      <span className="text-rose-400 font-bold">✦</span>
      <span className="inline-flex items-center gap-2 font-mono font-bold text-yellow-300">
        <span>📞</span> CONTACT: 9791644661, 84382 14939
      </span>
      <span className="text-rose-400 font-bold">✦</span>
      <span className="inline-flex items-center gap-1.5 text-emerald-300 font-extrabold tracking-wider">
        <span>🌟</span> TRAVEL • EXPLORE • ENJOY <span>🌟</span>
      </span>
      <span className="text-rose-400 mx-4 font-bold">✦✦✦</span>
    </>
  );

  return (
    <div className="relative w-full bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-b border-red-500/40 text-white overflow-hidden py-3 sm:py-3.5 shadow-md z-30 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-5">
        {/* Left Badge with Logo + Sponsored By + Namakkal */}
        <button
          onClick={onOpenModal}
          className="flex-shrink-0 flex items-center gap-2.5 bg-black/60 hover:bg-black/80 border border-red-500/50 hover:border-amber-400/80 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-yellow-300 shadow-md transition-all duration-200 mr-3 cursor-pointer group"
          title="Click to view Winstar packages details"
        >
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-red-400/90 group-hover:scale-110 transition-transform">
            <Image
              src="/winstar-logo.jpg"
              alt="Winstar Tours"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[8.5px] sm:text-[9.5px] font-mono tracking-widest text-amber-400 font-extrabold uppercase">
              SPONSORED BY
            </span>
            <span className="font-orbitron text-[11px] sm:text-xs tracking-wider text-white font-black group-hover:text-amber-200 transition-colors">
              WINSTAR TOURS
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-red-950/90 border border-red-500/60 text-[9.5px] font-mono font-bold text-emerald-400">
            📍 NAMAKKAL
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </button>

        {/* Running Continuous Marquee Ticker */}
        <div 
          onClick={onOpenModal}
          className="relative flex-1 overflow-hidden cursor-pointer group"
          title="Click to view full tour details"
        >
          <div className="animate-running-ad flex items-center gap-4 text-xs sm:text-[13px] font-mono tracking-wide py-0.5 whitespace-nowrap">
            <div className="flex items-center gap-4">{tickerText}</div>
            <div className="flex items-center gap-4">{tickerText}</div>
          </div>
        </div>

        {/* Right CTA Button */}
        <button
          onClick={onOpenModal}
          className="flex-shrink-0 ml-3 hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10.5px] font-mono font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 shadow-md transition-all hover:scale-105 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>VIEW PACKAGES</span>
        </button>
      </div>
    </div>
  );
}

export function WinstarModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-red-600/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(220,38,38,0.35)] text-white overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Top decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/20 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-red-950 text-slate-300 hover:text-white border border-slate-700 hover:border-red-500 transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Logo */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-red-600 via-amber-500 to-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-black">
                  <Image
                    src="/winstar-logo.jpg"
                    alt="WINSTAR TOURS"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Sponsored By Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-xs font-mono font-black tracking-widest text-amber-300 uppercase shadow-sm">
                <span>⭐</span> SPONSORED BY <span>⭐</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-red-400 uppercase">
                WINSTAR TOURS & TRAVELS
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-xs font-mono font-bold text-emerald-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  LOCATION: NAMAKKAL, TAMIL NADU
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
                  <span>🚌</span> WINSTAR PACKAGES AVAILABLE
                </span>
              </div>

              <p className="text-xs sm:text-sm font-mono tracking-[0.2em] text-emerald-400 font-extrabold uppercase">
                🌟 TRAVEL • EXPLORE • ENJOY 🌟
              </p>
            </div>

            {/* Content Sections */}
            <div className="mt-6 space-y-6">
              {/* Trip Packages For Everyone */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-red-500/30">
                <h3 className="flex items-center gap-2 text-sm sm:text-base font-orbitron font-bold text-amber-300 tracking-wide uppercase mb-3.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  TRIP PACKAGES FOR EVERYONE
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-colors">
                    <span className="text-xl">🎓</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">All COLLEGE TRIP</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors">
                    <span className="text-xl">🏫</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">All SCHOOL TRIP</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-colors">
                    <span className="text-xl">👨‍👩‍👧‍👦</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">All FAMILY TRIP</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-400/50 transition-colors">
                    <span className="text-xl">🛕</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">KOVIL FUNCTION TRIP</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400/50 transition-colors sm:col-span-2">
                    <span className="text-xl">💍</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">WEDDING FUNCTION TRIP</span>
                  </div>
                </div>
              </div>

              {/* Fleet & Amenities */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-red-500/30">
                <h3 className="flex items-center gap-2 text-sm sm:text-base font-orbitron font-bold text-amber-300 tracking-wide uppercase mb-3.5">
                  <Bus className="w-4 h-4 text-amber-400" />
                  PREMIUM FLEET & AMENITIES
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl mb-1">🚌</span>
                    <span className="font-mono text-xs font-bold text-slate-200">ALL BUSES AVAILABLE</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl mb-1">❄️</span>
                    <span className="font-mono text-xs font-bold text-slate-200">AC / NON-AC BUSES</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl mb-1">🏨</span>
                    <span className="font-mono text-xs font-bold text-slate-200">AC / NON-AC ROOMS</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl mb-1">🔥</span>
                    <span className="font-mono text-xs font-bold text-slate-200">CAMPFIRE DJ</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl mb-1">🚙</span>
                    <span className="font-mono text-xs font-bold text-slate-200">JEEP SAFARI</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl mb-1">🛥️</span>
                    <span className="font-mono text-xs font-bold text-slate-200">BOATING DJ</span>
                  </div>
                </div>
              </div>

              {/* Direct Contact Buttons */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border border-red-500/50 flex flex-col items-center text-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
                    📞 INSTANT BOOKING & ENQUIRY CONTACT
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    📍 Based in Namakkal • Serving all destinations
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                  <a
                    href="tel:9791644661"
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call 9791644661</span>
                  </a>

                  <a
                    href="tel:8438214939"
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call 84382 14939</span>
                  </a>

                  <a
                    href="https://wa.me/919791644661?text=Hi%20Winstar%20Tours%20(Namakkal),%20I%20am%20interested%20in%20your%20trip%20packages"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp (Namakkal)</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function WinstarAdSection({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <section id="advertisement" className="relative py-16 px-4 sm:px-6 z-10 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-red-950/70 to-slate-950 border-2 border-red-600/40 p-6 sm:p-10 shadow-[0_10px_40px_rgba(220,38,38,0.25)]">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Logo Showcase */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-1.5 bg-gradient-to-tr from-red-600 via-amber-400 to-red-600 shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:scale-105 transition-transform duration-300">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-black">
                <Image
                  src="/winstar-logo.jpg"
                  alt="WINSTAR TOURS"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-xs font-mono font-bold text-emerald-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              LOCATION: NAMAKKAL
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/60 border border-red-500/50 text-[11px] font-mono font-bold tracking-widest text-amber-300 uppercase">
              <span>🌟</span> TRAVEL • EXPLORE • ENJOY <span>🌟</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-300 shadow-sm">
              <span>⭐</span> SPONSORED BY WINSTAR TOURS (NAMAKKAL)
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-amber-200 uppercase">
              WINSTAR PACKAGES AVAILABLE
            </h2>

            <p className="text-sm font-mono text-slate-300 max-w-2xl leading-relaxed">
              Planning your next epic getaway or event? Based in <strong className="text-amber-300">Namakkal</strong>, Winstar Tours provides premium trips across college industrial visits, school tours, grand family vacations, and temple/wedding functions with luxury AC/Non-AC buses, campfire DJ, and jeep safaris!
            </p>

            {/* Grid of Key Features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <span className="text-lg">🎓 🏫</span>
                <p className="font-mono text-xs font-bold text-white mt-1">College & School Trips</p>
                <p className="text-[10px] text-slate-400">All destinations covered</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <span className="text-lg">👨‍👩‍👧‍👦 🛕</span>
                <p className="font-mono text-xs font-bold text-white mt-1">Family & Kovil Trips</p>
                <p className="text-[10px] text-slate-400">Customized itineraries</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <span className="text-lg">💍 🏨</span>
                <p className="font-mono text-xs font-bold text-white mt-1">Wedding & Rooms</p>
                <p className="text-[10px] text-slate-400">AC & Non-AC suites</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <span className="text-lg">🚌 ❄️</span>
                <p className="font-mono text-xs font-bold text-white mt-1">All Buses Available</p>
                <p className="text-[10px] text-slate-400">AC & Non-AC luxury fleet</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <span className="text-lg">🔥 🎶</span>
                <p className="font-mono text-xs font-bold text-white mt-1">Campfire DJ</p>
                <p className="text-[10px] text-slate-400">High-energy musical nights</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <span className="text-lg">🚙 🛥️</span>
                <p className="font-mono text-xs font-bold text-white mt-1">Jeep Safari & Boating</p>
                <p className="text-[10px] text-slate-400">Adrenaline adventures</p>
              </div>
            </div>

            {/* Direct Booking CTA */}
            <div className="flex flex-wrap items-center gap-3 mt-4 w-full sm:w-auto">
              <a
                href="tel:9791644661"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs tracking-wider uppercase shadow-lg shadow-red-600/30 transition-transform hover:scale-105"
              >
                <Phone className="w-4 h-4" />
                <span>Call: 9791644661</span>
              </a>

              <a
                href="tel:8438214939"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-600/30 transition-transform hover:scale-105"
              >
                <Phone className="w-4 h-4" />
                <span>Call: 84382 14939</span>
              </a>

              <a
                href="https://wa.me/919791644661?text=Hi%20Winstar%20Tours%20(Namakkal),%20I%20am%20interested%20in%20your%20trip%20packages"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-mono font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (Namakkal)</span>
              </a>

              {onOpenModal && (
                <button
                  onClick={onOpenModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>View All Details</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
