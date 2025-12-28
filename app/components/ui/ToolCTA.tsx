'use client'

import Link from 'next/link'
import { Rocket, ArrowRight } from 'lucide-react'
import { GlassCard } from './glass-card'
import type { Language } from '@/lib/i18n/translations'
import { getTranslation } from '@/lib/i18n/translations'

interface ToolCTAProps {
  language?: Language
}

export function ToolCTA({ language = 'fr' }: ToolCTAProps) {
  const t = getTranslation(language)

  return (
    <div className="mt-8 md:mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard glassLevel="medium" depth={3} withGlow={true} animation="scale" className="bg-gradient-to-br from-[rgba(25,212,255,0.15)] via-[rgba(15,168,204,0.12)] to-[rgba(11,143,168,0.10)] border-[rgba(25,212,255,0.30)]">
          <div className="text-center space-y-5 py-6 md:py-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-[rgba(25,212,255,0.20)] border border-[rgba(25,212,255,0.40)]">
                <Rocket className="w-6 h-6 md:w-7 md:h-7 text-[#19D4FF]" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg md:text-xl font-heading font-semibold text-white">
              {t.toolCTA.title}
            </h3>

            {/* Description */}
            <p className="text-sm md:text-base font-sans font-normal text-white/80 leading-relaxed max-w-xl mx-auto px-4">
              {t.toolCTA.description}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/genesis-era"
                className="group inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-[#19D4FF] via-[#0FA8CC] to-[#0B8FA8] hover:from-[#0FA8CC] hover:via-[#0B8FA8] hover:to-[#19D4FF] text-white px-6 md:px-8 py-3 md:py-4 rounded-button font-sans font-semibold text-sm md:text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(25,212,255,0.5)] active:scale-[0.98]"
              >
                {t.toolCTA.button}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

