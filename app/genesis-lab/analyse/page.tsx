'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ShieldCheck, Activity } from 'lucide-react'
import Link from 'next/link'
import IPTCalculator from '@/components/calculator/IPTCalculator'
import { GlassCard } from '@/app/components/ui/glass-card'

export default function AnalysePage() {
  return (
    <main className="min-h-screen bg-obsidian-900 text-white relative overflow-hidden flex flex-col">
      
      {/* Header Minimaliste "Mode Focus" */}
      <header className="relative z-20 h-16 border-b border-white/5 bg-obsidian-900/80 backdrop-blur-md flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-light uppercase tracking-wider">
          <ChevronLeft className="w-4 h-4" />
          Retour au QG
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-mono tracking-wider text-emerald-500 uppercase">Connexion sécurisée</span>
        </div>
      </header>

      {/* Contenu Central */}
      <section className="relative z-10 flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        {/* Lumière d'ambiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-glass-light backdrop-blur-sm">
              <Activity className="w-3 h-3 text-emerald-500" />
              <span className="text-xs font-mono tracking-wider uppercase text-white/60">IPT Protocol v3.0</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-white">
              Initialisation du Scan
            </h1>
            <p className="text-white/60 text-sm max-w-lg mx-auto">
              Répondez avec honnêteté. L'algorithme a besoin de données précises pour générer votre carte métabolique.
            </p>
          </div>

          {/* Le Calculateur Encapsulé dans Glass Card */}
          <GlassCard
            glassLevel="strong"
            depth={5}
            withGlow={true}
            animation="scale"
            className="border-2 border-emerald-500/30"
          >
            <div className="p-1">
              <div className="mb-4 pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">INPUT TERMINAL</span>
              </div>
              <IPTCalculator />
            </div>
          </GlassCard>

          <div className="flex justify-center items-center gap-2 text-xs text-white/40 font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            <span>Données cryptées & confidentielles</span>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
