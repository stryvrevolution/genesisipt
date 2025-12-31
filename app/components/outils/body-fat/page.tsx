'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BodyFatCalculator } from '@/app/lib/calculators/BodyFatCalculator'
import { BackButton } from '@/app/components/ui/BackButton'
import { LanguageSwitcher } from '@/app/components/ui/LanguageSwitcher'
import { ToolCTA } from '@/app/components/ui/ToolCTA'
import type { Language } from '@/app/lib/i18n/translations'

export default function BodyFatPage() {
  const [language, setLanguage] = useState<Language>('fr')
  
  return (
    <main className="relative min-h-screen bg-[#11202E] py-12 md:py-16 lg:py-24">
      <BackButton />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <BodyFatCalculator language={language} />
        <ToolCTA language={language} />
      </div>
    </main>
  )
}





