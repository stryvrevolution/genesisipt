"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex flex-col group">
           <span className="text-2xl font-bold tracking-[0.2em] text-white group-hover:text-neon-cyan transition-colors duration-500">
             STRYV<span className="font-light text-text-muted">lab</span>
           </span>
           <span className="text-[0.5rem] uppercase tracking-[0.4em] text-neon-green/80">
             Forensic System
           </span>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex gap-8">
          {["Analyse", "Science", "Technologies"].map((item) => (
            <Link key={item} href="#" className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
              {item}
            </Link>
          ))}
        </nav>

        {/* BUTTON */}
        <button className="px-6 py-2 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300">
            Espace Membre
        </button>
      </div>
    </header>
  );
}