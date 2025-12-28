'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200"
      style={{
        height: '80px',
      }}
    >
      <div 
        className="max-w-7xl mx-auto h-full flex items-center justify-between px-6 md:px-10"
      >
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight text-black"
          style={{ 
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          STRYV LAB
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/genesis-era"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Genesis Era
          </Link>
          
          {/* Laboratoire (Outils) Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setToolsDropdownOpen(true)}
            onMouseLeave={() => setToolsDropdownOpen(false)}
          >
            <button
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors flex items-center gap-1"
            >
              Laboratoire
              <span className="text-xs">▼</span>
            </button>
            {toolsDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 py-2"
                onMouseEnter={() => setToolsDropdownOpen(true)}
                onMouseLeave={() => setToolsDropdownOpen(false)}
              >
                <Link href="/outils/macros" className="block px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  Calculateur Macros
                </Link>
                <Link href="/outils/body-fat" className="block px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  Taux Masse Grasse
                </Link>
                <Link href="/outils/carb-cycling" className="block px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  Carb Cycling
                </Link>
                <Link href="/outils/hr-zones" className="block px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  Zones FC
                </Link>
                <Link href="/outils/hydratation" className="block px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  Hydratation
                </Link>
                <Link href="/outils/1rm" className="block px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  Calculateur 1RM
                </Link>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <Link href="/outils" className="block px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-blue-600 font-medium">
                    → Voir Tous les Outils
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="#science"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            La Science
          </Link>

          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Connexion
          </Link>

          <Link
            href="/genesis-era"
            className="bg-blue-600 text-white py-3 px-6 rounded-2xl font-semibold text-sm transition-all hover:bg-blue-700 hover:-translate-y-0.5"
          >
            Démarrer l'Analyse
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span 
            className={`w-5 h-px bg-black transition-all ${
              mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span 
            className={`w-5 h-px bg-black transition-all ${
              mobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span 
            className={`w-5 h-px bg-black transition-all ${
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav 
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-6 flex flex-col gap-4"
        >
          <Link
            href="/genesis-era"
            className="text-gray-700 py-3 text-sm font-medium hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Genesis Era
          </Link>
          <Link
            href="/outils"
            className="text-gray-700 py-3 text-sm font-medium hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Laboratoire
          </Link>
          <Link
            href="#science"
            className="text-gray-700 py-3 text-sm font-medium hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            La Science
          </Link>
          <Link
            href="/login"
            className="text-gray-700 py-3 text-sm font-medium hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Connexion
          </Link>
          <Link
            href="/genesis-era"
            className="bg-blue-600 text-white py-3 px-6 rounded-2xl font-semibold text-sm text-center transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Démarrer l'Analyse
          </Link>
        </nav>
      )}
    </header>
  );
}
