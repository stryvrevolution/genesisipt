'use client'

import Link from 'next/link'
import { CalendlyButton } from '@/components/CalendlyButton'
import GenesisAssistant from '@/components/GenesisAssistant'
import { 
  Utensils, 
  BarChart3, 
  RefreshCw, 
  HeartPulse, 
  Droplet, 
  Dumbbell, 
  Moon,
  ArrowUpRight
} from 'lucide-react'

// Ajout de la propriété 'shadow' pour chaque outil afin de créer l'effet de lueur colorée
const toolIds = [
  { 
    id: 'macros', 
    href: 'macros', 
    icon: Utensils,
    type: 'Nutrition',
    title: 'Macros Forensic',
    description: 'Besoins caloriques & macronutriments (BMR + NEAT + EAT + TEF).',
    color: 'from-blue-400 to-blue-600',
    shadow: 'rgba(59, 130, 246, 0.4)'
  },
  { 
    id: 'bodyFat', 
    href: 'body-fat', 
    icon: BarChart3, 
    type: 'Composition',
    title: 'Body Fat %',
    description: 'Estimation masse grasse via Navy Method & Jackson-Pollock.',
    color: 'from-emerald-400 to-emerald-600',
    shadow: 'rgba(16, 185, 129, 0.4)'
  },
  { 
    id: 'cycleSync', 
    href: 'cycle-sync', 
    icon: Moon, 
    type: 'Protocole Hormonal',
    title: 'Cycle Sync',
    description: 'Nutrition et training adaptés aux fluctuations hormonales.',
    color: 'from-purple-400 to-purple-600',
    shadow: 'rgba(168, 85, 247, 0.4)'
  },
  { 
    id: 'carbCycling', 
    href: 'carb-cycling', 
    icon: RefreshCw, 
    type: 'Planification',
    title: 'Glycogène',
    description: 'Stratégie glucidique cyclique pour la performance et la recomposition.',
    color: 'from-orange-400 to-orange-600',
    shadow: 'rgba(249, 115, 22, 0.4)'
  },
  { 
    id: 'hydratation', 
    href: 'hydratation', 
    icon: Droplet, 
    type: 'Santé & Performance',
    title: 'Hydratation',
    description: 'Besoins hydriques selon climat, activité et taux de sudation.',
    color: 'from-cyan-400 to-cyan-600',
    shadow: 'rgba(6, 182, 212, 0.4)'
  },
  { 
    id: 'hrZones', 
    href: 'hr-zones', 
    icon: HeartPulse, 
    type: 'Cardiovasculaire',
    title: 'HR Zones',
    description: 'Zones cardiaques cibles via méthode Karvonen (FC réserve).',
    color: 'from-red-400 to-red-600',
    shadow: 'rgba(239, 68, 68, 0.4)'
  },
  { 
    id: 'oneRM', 
    href: '1rm', 
    icon: Dumbbell, 
    type: 'Charges',
    title: '1RM Calculator',
    description: 'Charge maximale théorique & zones de force (Brzycki, Epley).',
    color: 'from-yellow-400 to-yellow-600',
    shadow: 'rgba(250, 204, 21, 0.4)'
  }, 
] as const

export default function ToolsPage() {
  return (
    <main className="relative bg-[#303030] text-[#303030] overflow-hidden min-h-screen selection:bg-[#DAFA72] selection:text-black font-outfit">
      
      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 sm:px-10 md:px-16 pt-6 sm:pt-7 md:pt-8">
          
          <Link href="/accueil" className="block cursor-pointer">
            <div className="leading-none tracking-wide flex items-baseline gap-[6px] text-white transition-transform duration-200 hover:scale-[1.04]">
              <span className="text-[26px] tracking-wider font-azonix uppercase">STRYV</span>
              <span className="text-[25px] opacity-80 font-light lowercase">lab</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/#services-section"
              className="hidden sm:flex items-center justify-center h-[38px] text-white text-[13px] px-6 rounded-full bg-[#1A1A1A] border border-white/10 transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
            >
              Services
            </Link>

            <CalendlyButton
              text="Consultation"
              className="flex items-center justify-center h-[38px] text-black text-[13px] px-6 rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[60vh] min-h-[500px] bg-[#303030] flex flex-col justify-center">
        <div className="relative z-20 px-6 sm:px-10 md:px-16 lg:px-24 w-full">
          <div className="max-w-5xl">
            <h1 className="text-[#6D6D6D] font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(3.8rem,7vw,9.5rem)]">
              HUB<br /><span className="text-[#DAFA72]">OUTILS</span>
            </h1>

            <p className="mt-8 text-white/70 text-sm max-w-xl border-l-2 border-[#DAFA72] pl-6 leading-relaxed">
              Calculateurs de précision pour l'optimisation métabolique, hormonale et performance.<br />Calculez. Optimisez. Progressez.
            </p>
          </div>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="relative px-6 md:px-12 lg:px-24 pb-40 -mt-20 z-30">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
          {toolIds.map((tool, index) => (
            <Link 
              key={tool.id}
              href={`/outils/${tool.href}`}
              className="group relative bg-[#1A1A1A] rounded-[24px] p-8 border border-white/5 hover:border-[#DAFA72] transition-all duration-300 hover:shadow-[0_4px_30px_-10px_rgba(218,250,114,0.15)] overflow-hidden flex flex-col h-full"
            >
              
              {/* Symbole d'arrière-plan */}
              <div className="absolute -bottom-4 -right-4 text-white/5 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
                <tool.icon className="h-32 w-32 stroke-[0.5]" />
              </div>

              {/* Header Carte */}
              <div className="relative flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    
                    {/* --- MODIFICATION LOGO ICI --- */}
                    {/* ICONE CARRÉE GRADIENT + SHADOW */}
                    <div 
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-105`}
                      style={{ boxShadow: `0 0 20px -5px ${tool.shadow}` }}
                    >
                      <tool.icon className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    
                    {/* PRÉ-TITRE / TYPE */}
                    <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full group-hover:text-[#DAFA72] group-hover:border-[#DAFA72]/30 transition-colors duration-300">
                      {tool.type}
                    </span>
                </div>
                
                {/* ID Number */}
                <span className="font-mono text-[10px] text-white/10 font-bold group-hover:text-[#DAFA72] transition-colors">
                  0{index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="relative flex-1">
                <h3 className="text-xl text-white mb-3 font-azonix uppercase group-hover:translate-x-1 transition-transform duration-300">
                  {tool.title}
                </h3>
                
                <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-4">
                  {tool.description}
                </p>
              </div>

              {/* Footer Carte */}
              <div className="relative mt-auto pt-6 flex items-center justify-between group/btn">
                <span className="text-[11px] font-medium text-white/30 group-hover:text-white transition-colors uppercase tracking-wide">
                  Initialiser
                </span>
                <span className="text-[#DAFA72] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                   <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-[#303030] text-white/40 py-12 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[11px] tracking-wide font-light">
            © {new Date().getFullYear()} STRYV lab - Genesis. Tous droits réservés.
          </div>
        </div>
      </footer>
      
      {/* CHATBOT */}
      <GenesisAssistant />
    </main>
  )
}