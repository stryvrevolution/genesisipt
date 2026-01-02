'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { CalendlyButton } from '@/components/CalendlyButton'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useTranslation } from '@/lib/context/LanguageContext'
import { 
  Dna, 
  BarChart3, 
  RefreshCw, 
  HeartPulse, 
  Droplet, 
  Dumbbell, 
  Moon 
} from 'lucide-react'

// On retire le slash initial pour les href car on va construire l'URL dynamiquement
const toolIds = [
  { id: 'macros', href: 'macros', icon: Dna, type: 'Calculateur' },
  { id: 'bodyFat', href: 'body-fat', icon: BarChart3, type: 'Analyse' },
  { id: 'cycleSync', href: 'cycle-sync', icon: Moon, type: 'Physiologie' },
  { id: 'carbCycling', href: 'carb-cycling', icon: RefreshCw, type: 'Planification' },
  { id: 'hrZones', href: 'hr-zones', icon: HeartPulse, type: 'Physiologie' },
  { id: 'oneRM', href: '1rm', icon: Dumbbell, type: 'Performance' }, 
] as const

export default function ToolsPage() {
  const params = useParams()
  const pathname = usePathname()
  const { t, language } = useTranslation()
  const lang = params.lang as string

  // Hydration fix
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <main className="relative bg-white text-[#303030] overflow-hidden min-h-screen">
      {/* HEADER STRYV LAB */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 sm:px-10 md:px-16 pt-6 sm:pt-7 md:pt-8">
          <Link href={`/${lang}`} className="block cursor-pointer">
            <div className="leading-none tracking-wide flex items-baseline gap-[6px] text-white transition-transform duration-200 hover:scale-[1.04]">
              <span className="text-[26px] tracking-wider font-azonix uppercase">STRYV</span>
              <span className="text-[25px] opacity-80 font-outfit font-light lowercase">lab</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <Link 
              href={`/${lang}`}
              className="hidden sm:flex items-center justify-center h-[38px] text-white text-[13px] px-6 rounded-full bg-[#303030] transition-all hover:bg-black"
            >
              Accueil
            </Link>
            <CalendlyButton text="Consultation" className="flex items-center justify-center h-[38px] text-black text-[13px] px-6 rounded-full bg-[#DAFA72] transition-transform hover:scale-[1.05]" />
          </div>
        </div>
      </header>

      {/* HERO SECTION - DARK */}
      <section className="relative h-[55vh] overflow-hidden bg-[#0E0E0E]">
        <div className="relative z-20 h-full flex items-center px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="max-w-5xl mt-20">
            <div className="text-[#DAFA72] text-[11px] font-bold tracking-widest uppercase mb-6 italic">
              {t.common?.labLabel || "Laboratoire de précision"}
            </div>
            <h1 className="text-white font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(3rem,6vw,7rem)] uppercase font-azonix italic">
              {t.toolsPage?.title || "Outils"}
            </h1>
            <p className="mt-6 text-white/50 text-sm max-w-xl font-light font-outfit">
              {t.toolsPage?.subtitle || "Optimisez votre physiologie grâce à nos algorithmes de calcul biométriques avancés."}
            </p>
          </div>
        </div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#DAFA72] rounded-full blur-[150px] opacity-[0.05]" />
      </section>

      {/* GRID DES OUTILS - WHITE */}
      <section className="bg-white px-8 md:px-16 lg:px-24 py-24 border-t border-black/5">
        
        {/* Mobile Switcher */}
        <div className="sm:hidden flex justify-end mb-8">
           <LanguageSwitcher />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {toolIds.map((tool) => {
             const toolData = t.toolsPage?.tools?.[tool.id] || { title: tool.id, description: "..." }
             
             return (
              <Link 
                key={tool.id}
                // Construction dynamique de l'URL : /fr/outils/1rm
                href={`/${lang}/outils/${tool.href}`} 
                className="group flex flex-col p-8 rounded-[32px] bg-white border border-black/5 hover:border-[#DAFA72] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F8F8] flex items-center justify-center text-[#303030] group-hover:bg-[#DAFA72] group-hover:rotate-[10deg] transition-all duration-500">
                    <tool.icon className="w-6 h-6 stroke-[1.2]" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 bg-black/5 px-3 py-1 rounded-full group-hover:bg-[#DAFA72]/10 group-hover:text-black transition-colors">
                    {tool.type}
                  </span>
                </div>

                <h3 className="text-lg text-[#1A1A1A] mb-3 font-azonix italic uppercase tracking-tight">
                  {toolData.title}
                </h3>
                <p className="text-black/50 text-[12px] leading-relaxed font-light mb-8 font-outfit">
                  {toolData.description}
                </p>

                <div className="mt-auto pt-6 border-t border-black/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                    {t.toolsPage?.access || "Lancer l'audit"}
                  </span>
                  <span className="text-xl translate-x-0 group-hover:translate-x-2 transition-transform duration-500">→</span>
                </div>
              </Link>
             )
          })}
        </div>
      </section>
    </main>
  )
}