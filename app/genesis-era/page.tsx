'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/app/components/ui/glass-card'
import { HeroGenesis } from '@/app/components/sections/hero-genesis'
import IPTSimulator from '../../components/IPTSimulator'
import { NeurotypesVisualizer } from '../components/sections/NeurotypesVisualizer'
import { ForensicCaseStudies } from '../components/sections/ForensicCaseStudies'
import { ScientificTruthBanner } from '../components/sections/ScientificTruthBanner'

export default function GenesisEraPage() {
  return (
    <main className="min-h-screen bg-obsidian-900">
      {/* Hero Section Genesis */}
      <HeroGenesis />
      
      {/* IPT Simulator Section avec glass card */}
      <section className="relative py-32 bg-gradient-medical">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
              Calculateur IPT
            </h2>
            <p className="text-lg font-extralight text-white/60 max-w-2xl mx-auto">
              Découvrez votre Indice de Potentiel de Transformation
            </p>
          </motion.div>

          <GlassCard
            glassLevel="strong"
            depth={4}
            withGlow={true}
            animation="scale"
            className="max-w-5xl mx-auto"
          >
            <IPTSimulator />
          </GlassCard>
        </div>
      </section>
      
      {/* Neurotypes Visualizer */}
      <section className="relative py-32 bg-obsidian-900">
        <NeurotypesVisualizer />
      </section>

      {/* Forensic Case Studies */}
      <section className="relative py-32 bg-gradient-medical">
        <ForensicCaseStudies />
      </section>

      {/* Scientific Truth Banner */}
      <section className="relative py-32 bg-obsidian-900">
        <ScientificTruthBanner />
      </section>
    </main>
  )
}






