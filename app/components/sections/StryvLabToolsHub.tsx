'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/app/components/ui/glass-card';
import { Dna, BarChart3, RefreshCw, HeartPulse, Droplet, Dumbbell } from 'lucide-react';

const tools = [
  {
    id: 'macros',
    title: 'Calculateur de Macronutriments',
    description: 'Formule Mifflin-St Jeor pour déterminer vos besoins caloriques et macro structurels',
    href: '/outils/macros',
    icon: Dna,
  },
  {
    id: 'body-fat',
    title: 'Taux de Masse Grasse',
    description: 'Méthode US Navy pour l\'estimation de composition corporelle',
    href: '/outils/body-fat',
    icon: BarChart3,
  },
  {
    id: 'carb-cycling',
    title: 'Cyclage Glucidique',
    description: 'Protocoles de restauration métabolique via redistribution glucidique',
    href: '/outils/carb-cycling',
    icon: RefreshCw,
  },
  {
    id: 'hr-zones',
    title: 'Zones Cardiaques',
    description: 'Méthode Karvonen pour l\'optimisation de l\'intensité d\'entraînement',
    href: '/outils/hr-zones',
    icon: HeartPulse,
  },
  {
    id: 'hydratation',
    title: 'Hydratation Optimale',
    description: 'Calcul de besoins hydriques selon activité et environnement',
    href: '/outils/hydratation',
    icon: Droplet,
  },
  {
    id: '1rm',
    title: 'Estimation 1RM',
    description: 'Formule Brzycki pour la prédiction de force maximale',
    href: '/outils/1rm',
    icon: Dumbbell,
  },
];

export function StryvLabToolsHub() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative py-12 md:py-16 lg:py-24 bg-[#EDF3F7] px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-sans font-normal uppercase tracking-widest text-[#2D5168] mb-4">• INSTRUMENTS DE MESURE</p>
          <h2 className="text-5xl md:text-6xl font-heading font-extralight text-[#0F2334] mb-6 leading-tight">
            Suite d'outils scientifiques
          </h2>
          <p className="text-lg font-sans font-normal text-[#2D5168] max-w-2xl mx-auto">
            Développés par Stryv Lab pour l'évaluation quantitative de votre biologie
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={tool.href}>
                <GlassCard
                  glassLevel="light"
                  depth={3}
                  withGlow={false}
                  className="h-full transition-all hover:-translate-y-1 hover:shadow-light cursor-pointer"
                >
                  <div className="mb-4">
                    <tool.icon className="w-10 h-10 text-[#19D4FF]" />
                  </div>
                  <h3 className="text-xl font-heading font-medium text-[#0F2334] mb-3">{tool.title}</h3>
                  <p className="text-sm font-sans font-normal text-[#2D5168] leading-relaxed">{tool.description}</p>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}









