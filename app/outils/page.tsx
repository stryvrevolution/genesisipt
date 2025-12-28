'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { GlassCard } from '@/app/components/ui/glass-card'
import { LanguageSwitcher } from '@/app/components/ui/LanguageSwitcher'
import { ArrowRight, Dna, BarChart3, RefreshCw, HeartPulse, Droplet, Dumbbell } from 'lucide-react'
import type { Language } from '@/lib/i18n/translations'
import { getTranslation } from '@/lib/i18n/translations'

const toolIds = [
  { id: 'macros', href: '/outils/macros', icon: Dna },
  { id: 'bodyFat', href: '/outils/body-fat', icon: BarChart3 },
  { id: 'carbCycling', href: '/outils/carb-cycling', icon: RefreshCw },
  { id: 'hrZones', href: '/outils/hr-zones', icon: HeartPulse },
  { id: 'hydratation', href: '/outils/hydratation', icon: Droplet },
  { id: 'oneRM', href: '/outils/1rm', icon: Dumbbell },
] as const

// Configuration des animations harmonisées
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const fadeInUpDelay = (delay: number) => ({
  ...fadeInUp,
  transition: { ...fadeInUp.transition, delay }
})

export default function ToolsPage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language
      return saved && ['fr', 'en', 'es'].includes(saved) ? saved : 'fr'
    }
    return 'fr'
  })
  const t = getTranslation(language)
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      window.dispatchEvent(new Event('languageChange'))
    }
  }

  return (
    <section className="relative py-12 md:py-16 lg:py-24 bg-[#11202E] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          {...fadeInUpDelay(0.1)}
          className="text-center mb-16"
        >
          <div className="flex justify-end mb-8">
            <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
          </div>
          <p className="text-xs font-sans font-normal uppercase tracking-widest text-white/60 mb-4">
            • {t.toolsPage.labLabel}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extralight text-white mb-6 leading-tight">
            {t.toolsPage.title}
          </h1>
          <p className="text-xl font-sans font-normal text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t.toolsPage.subtitle}
          </p>
        </motion.div>

        {/* Tools Grid avec Glass Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {toolIds.map((tool, i) => {
            const toolData = t.toolsPage.tools[tool.id as keyof typeof t.toolsPage.tools]
            return (
              <motion.div
                key={tool.id}
                {...fadeInUpDelay(0.2 + i * 0.1)}
              >
                <Link href={tool.href}>
                  <GlassCard
                    glassLevel="medium"
                    depth={3}
                    withGlow={true}
                    animation="scale"
                    delay={i * 0.1}
                    className="h-full group hover:border-[#19D4FF]/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="space-y-4">
                      <div className="mb-2">
                        <tool.icon className="w-12 h-12 text-[#19D4FF]" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-heading font-light text-white group-hover:text-[#19D4FF] transition-colors">
                        {toolData.title}
                      </h2>
                      <p className="text-sm font-sans font-normal text-white/70 leading-relaxed">
                        {toolData.description}
                      </p>
                      <div className="flex items-center gap-2 text-[#19D4FF] text-sm font-medium pt-4 border-t border-white/10">
                        <span>{t.toolsPage.access}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}




