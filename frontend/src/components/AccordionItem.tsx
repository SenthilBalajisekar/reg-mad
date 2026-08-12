"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  content: string;
  index: number;
}

export default function AccordionItem({ title, content, index }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-panel rounded-lg border border-white/5 mb-3 overflow-hidden bg-opacity-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-orbitron text-xs md:text-sm font-semibold tracking-wider text-slate-200">
          <span className="text-neon-blue mr-3 font-mono">{(index + 1).toString().padStart(2, "0")}.</span>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-neon-purple"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-700 leading-relaxed font-sans border-t border-white/5 bg-cyber-dark/40">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

