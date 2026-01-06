import type { Metadata } from 'next';
import Link from 'next/link';
import MacroCalculator from './MacroCalculator';
import { Utensils, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Calculateur Macros & Calories (KCAL) | STRYV LAB',
  description: 'Le calculateur nutritionnel ultime. BMR Mifflin-St Jeor, TDEE précis et répartition macronutriments (Protéines, Lipides, Glucides) optimisée pour la performance.',
  
  openGraph: {
    title: 'Calculateur Macros Pro | STRYV LAB',
    description: 'Calculez vos calories et macros avec précision scientifique.',
    url: 'https://www.stryvlab.com/outils/macros',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-macros.png', // Assure-toi d'avoir cette image
        width: 1200,
        height: 630,
        alt: 'Calculateur Macros Stryv Lab',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Calculateur Macros Pro | STRYV LAB',
    description: 'Nutrition de précision pour athlètes.',
    images: ['/og-macros.png'],
  },
};

export default function MacrosPage() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen font-outfit text-white">
      
      {/* ================= GAUCHE ================= */}
      <section className="w-full lg:w-5/12 lg:max-w-[500px] bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] lg:min-h-screen lg:sticky lg:top-0 border-r border-white/5 shadow-2xl z-20">
        
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <Utensils className="w-80 h-80 stroke-[0.5]" />
        </div>

        <div className="relative z-10">
          <Link href="/outils" className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors">
            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au Hub
          </Link>
          
          <div className="flex flex-col items-start gap-6 mb-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)] flex items-center justify-center text-white">
                   <Utensils className="w-7 h-7 stroke-[1.5]" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">Nutrition</span>
            </div>
            
            <div className="font-mono text-[10px] text-white/10 font-bold">
              ID: 01
            </div>
          </div>
          
          <h1 className="text-white text-4xl md:text-5xl font-azonix uppercase tracking-tighter mb-8 leading-[0.9]">
  Kcal
  <br />
  <span className="text-white/40">& Macros</span>
</h1>
          
          {/* DESCRIPTION SCIENTIFIQUE */}
          <div className="space-y-6 border-t border-white/5 pt-6">
            <div>
              <h2 className="text-white/90 text-base font-bold mb-3 tracking-tight">Le Gold Standard Nutritionnel</h2>
              <p className="text-white/50 text-[13px] leading-relaxed font-light">
                Calculateur ultime de macronutriments et calories basé sur les formules scientifiques de référence mondiale. Précision chirurgicale pour optimisation métabolique maximale.
              </p>
            </div>

            <div className="text-white/50 text-[13px] leading-relaxed font-light space-y-3">
              <p>Architecture scientifique multi-niveaux :</p>
              
              <div className="space-y-2 pl-4 border-l-2 border-blue-400/30">
                <p><strong className="text-white/70">• Mifflin-St Jeor (1990)</strong> : BMR gold standard. Précision ±10% sur 82% population. Validation Academy of Nutrition & Dietetics.</p>
                <p><strong className="text-white/70">• TDEE Multi-Composantes</strong> : BMR + NEAT + EAT + TEF. Approche Levine et al. (2005) thermogenèse adaptative.</p>
                <p><strong className="text-white/70">• Helms et al. (2014)</strong> : Protéines LBM-based 1.8-2.6g/kg. Préservation masse maigre déficit calorique.</p>
                <p><strong className="text-white/70">• Phillips & Van Loon (2011)</strong> : Optimisation synthèse protéique. Timing/distribution acides aminés.</p>
              </div>

              <p className="pt-2">
                <strong className="text-white/90">Déficit/Surplus algorithmique</strong> : ajustements BF%-dépendants, préservation LBM, santé hormonale, performance training.
              </p>

              <p className="text-[11px] text-white/40 pt-3 border-t border-white/5">
                Références : Mifflin-St Jeor (1990) • Levine (2005) • Helms (2014) • Phillips & Van Loon (2011)
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold">STRYV Lab</p>
          <span className="font-azonix text-xs opacity-30">V4.0 ULTRA</span>
        </div>
      </section>

      {/* ================= DROITE : COMPONENT ================= */}
      <section className="flex-1 relative overflow-y-auto py-8 px-4 md:px-8 lg:py-16 bg-[#303030]">
        <div className="max-w-3xl mx-auto">
          <MacroCalculator />
        </div>
      </section>
      
    </main>
  );
}