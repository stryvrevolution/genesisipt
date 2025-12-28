'use client'

import { useState, useRef, useEffect } from 'react'
import type { Language } from '@/lib/i18n/translations'
import { GlassCard } from '@/app/components/ui/glass-card'

interface LanguageSwitcherProps {
  currentLanguage: Language
  onLanguageChange: (lang: Language) => void
}

const languages: Array<{ code: Language; label: string; flag: string }> = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const currentLang = languages.find((l) => l.code === currentLanguage) || languages[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.10)] backdrop-blur-sm hover:bg-[rgba(255,255,255,0.15)] active:bg-[rgba(255,255,255,0.20)] text-white transition-all min-h-[44px] touch-manipulation"
        aria-label="Change language"
      >
        <span className="text-base sm:text-lg">{currentLang.flag}</span>
        <span className="text-xs sm:text-sm font-light uppercase tracking-wider">
          {currentLang.code}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[rgba(255,255,255,0.15)] backdrop-blur-lg border border-[rgba(255,255,255,0.25)] rounded-2xl shadow-depth-4 z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors min-h-[44px] touch-manipulation ${
                currentLanguage === lang.code
                  ? 'bg-[#19D4FF]/20 border-l-4 border-l-[#19D4FF]'
                  : 'hover:bg-white/5 active:bg-white/10'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className={`text-sm font-light ${
                currentLanguage === lang.code ? 'text-[#19D4FF]' : 'text-white/70'
              }`}>
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
