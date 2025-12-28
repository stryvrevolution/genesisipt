'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/app/components/ui/glass-card';
import { ArrowRight, Clock, Dna, Building2, Brain, Dumbbell, CheckCircle2 } from 'lucide-react';
import { navigationItems } from '@/app/lib/navigation-constants';

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

export default function IPTChoicePage() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  // Detect if we're on FAQ section by checking hash and scroll position
  useEffect(() => {
    const checkActiveSection = () => {
      if (typeof window === 'undefined' || pathname !== '/') return
      
      // Check hash first
      if (window.location.hash === '#faq') {
        setActiveSection('faq')
        return
      }
      
      // Check if FAQ section is in viewport
      const faqSection = document.getElementById('faq')
      if (faqSection) {
        const rect = faqSection.getBoundingClientRect()
        const isInViewport = rect.top <= 100 && rect.bottom >= 100
        if (isInViewport) {
          setActiveSection('faq')
        } else {
          setActiveSection(null)
        }
      } else {
        setActiveSection(null)
      }
    }
    
    // Check on mount and hash change
    if (typeof window !== 'undefined') {
      checkActiveSection()
      window.addEventListener('hashchange', checkActiveSection)
      window.addEventListener('scroll', checkActiveSection, { passive: true })
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('hashchange', checkActiveSection)
        window.removeEventListener('scroll', checkActiveSection)
      }
    }
  }, [pathname])

  const stats = [
    { value: '87%', label: 'Taux de succès IPT >75 (PRÊT)' },
    { value: '18%', label: 'Taux de succès IPT <45 (CRITIQUE) sans intervention' },
    { value: '300+', label: 'Études scientifiques peer-reviewed validant les seuils' },
    { value: '350+', label: 'Data points analysés (273 questions + calculs)' },
  ];


  return (
    <div className="min-h-screen bg-[#11202E]">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden -mt-16">
        {/* Background Image Layer - Extended to cover header */}
        <div className="absolute inset-0" style={{ top: '-64px', height: 'calc(100% + 64px)' }}>
          <div 
            className="absolute inset-0 bg-no-repeat"
            style={{ 
              backgroundImage: 'url(/IMAGE/GE24.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
              
              {/* Main Content Grid */}
              <div className="flex justify-center lg:justify-start">
                
                {/* Left Column - Hero Content */}
                <div className="space-y-8 lg:space-y-10 relative">
                  {/* Main Heading */}
                  <motion.h1 
                    className="font-heading text-white leading-[1.1] tracking-tight max-w-[500px] text-[40px] md:text-[45px] lg:text-[50px]"
                    style={{
                      color: '#FFFFFF',
                      fontWeight: 375
                    }}
                    {...fadeInUpDelay(0.1)}
                  >
                    Avant de transformer votre corps, découvrez ce qui l'en empêche.
                  </motion.h1>

                  {/* CTA Button */}
                  <motion.div {...fadeInUpDelay(0.3)}>
                    <Link
                      href="/mini-scan"
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#19D4FF] via-[#0FA8CC] to-[#0B8FA8] hover:from-[#0FA8CC] hover:via-[#0B8FA8] hover:to-[#19D4FF] text-white px-8 py-4 rounded-button text-base font-normal transition-all duration-300 hover:shadow-light hover:scale-[1.02]"
                    >
                      <span>Commencer le Mini-Scan <span className="font-medium">(Gratuit)</span></span>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                        <ArrowRight className="w-4 h-4 text-[#19D4FF]" />
                      </div>
                    </Link>
                  </motion.div>
                </div>

              </div>
            </div>
          </div>

          {/* Supporting Text - Between CTA and Navigation */}
          <div className="flex justify-center mb-8">
            <motion.p 
              className="text-base md:text-lg font-sans font-normal leading-relaxed text-center max-w-[700px] px-6"
              style={{ color: '#FFFFFF', width: '500px' }}
              {...fadeInUpDelay(0.4)}
            >
              350+ data points métaboliques, psychologiques et environnementaux analysées pour prédire votre capacité RÉELLE de transformation.
            </motion.p>
          </div>

          {/* Bottom Navigation */}
          <div className="pb-8 lg:pb-12">
            <motion.div 
              className="flex justify-center"
              {...fadeInUpDelay(0.5)}
            >
              <GlassCard
                glassLevel="light"
                depth={2}
                withGlow={false}
                className="w-[350px] h-[60px] p-0 m-[5px] opacity-80 rounded-full text-center bg-[rgba(255,255,255,0.15)] text-[rgba(242,242,242,1)] flex items-center justify-center"
              >
                <nav className="flex items-center justify-center gap-1.5 md:gap-2 h-full w-full px-2">
                  {navigationItems.map((item) => {
                    // Determine which item is active - same logic as header
                    let isActive = false
                    
                    if (item.href === '/') {
                      // "Accueil" is active only on exact home page and not on FAQ section
                      isActive = pathname === '/' && activeSection !== 'faq'
                    } else if (item.href === '/ipt-choice') {
                      // "Analyse IPT" is active only on exact path
                      isActive = pathname === '/ipt-choice'
                    } else if (item.href === '/outils') {
                      // "Outils" is active when on any tools page (including sub-pages)
                      isActive = pathname.startsWith('/outils')
                    } else if (item.href === '/#faq') {
                      // "FAQ" is active only when on home page AND FAQ section is active
                      isActive = pathname === '/' && activeSection === 'faq'
                    }
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-xs md:text-sm font-normal transition-all duration-200 whitespace-nowrap border-0 border-transparent flex items-center justify-center h-[50px] rounded-full flex-shrink-0 ${
                          isActive 
                            ? 'text-white bg-[rgba(237,237,237,0.5)] px-3 py-0 rounded-full hover:bg-[rgba(237,237,237,0.6)]' 
                            : 'text-white hover:text-white hover:scale-105 px-3 py-0'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OPTIONS */}
      <section className="relative py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            {...fadeInUpDelay(0.2)}
            className="text-center mb-12"
          >
            <p className="text-xs font-sans font-normal uppercase tracking-widest text-white/60 mb-4">
              • CHOISISSEZ VOTRE NIVEAU D'ANALYSE
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-extralight text-white leading-tight">
              Choisissez votre niveau d'analyse
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* MINI-SCAN */}
            <motion.div
              {...fadeInUpDelay(0.3)}
            >
              <GlassCard
                glassLevel="medium"
                depth={3}
                withGlow={false}
                className="h-full hover:border-[#19D4FF]/50 transition-all"
              >
                <div className="inline-block bg-[#19D4FF]/20 text-[#19D4FF] px-4 py-1 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider">
                  APERÇU RAPIDE
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-light text-white mb-4">Mini-Scan IPT</h3>
                <p className="text-white/70 mb-8 font-sans font-normal leading-relaxed">
                  18 questions scientifiques pour un premier diagnostic de vos capacités métaboliques et psychologiques.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Score IPT 0-100 (5 piliers analysés)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Catégorie de potentiel (Critique → Prêt)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Patterns pathologiques détectés</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Probabilité de réussite avec IC 95%</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Recommandation d'offre personnalisée</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-card p-4 mb-6">
                  <div className="flex items-center gap-2 text-xs text-white/60 mb-1 uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    <span>Durée</span>
                  </div>
                  <div className="text-white font-medium">3-4 minutes</div>
                </div>

                <div className="bg-[#19D4FF]/10 border border-[#19D4FF]/20 rounded-card p-4 mb-8">
                  <div className="text-xs text-[#19D4FF] mb-2 uppercase tracking-wider font-semibold">Idéal pour</div>
                  <div className="text-white/90 text-sm font-sans font-normal leading-relaxed">
                    Vous voulez une première évaluation rapide de votre potentiel métabolique avant d'investir.
                  </div>
                </div>

                <Link
                  href="/mini-scan"
                  className="group inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#19D4FF] via-[#0FA8CC] to-[#0B8FA8] hover:from-[#0FA8CC] hover:via-[#0B8FA8] hover:to-[#19D4FF] text-white px-8 py-4 rounded-button text-base font-normal transition-all duration-300 hover:shadow-light hover:scale-[1.02]"
                >
                  <span>Commencer le Mini-Scan <span className="text-xs">(Gratuit)</span></span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </GlassCard>
            </motion.div>

            {/* FULL IPT */}
            <motion.div
              {...fadeInUpDelay(0.4)}
            >
              <GlassCard
                glassLevel="medium"
                depth={4}
                withGlow={true}
                className="h-full border-2 border-[#19D4FF]/50 relative"
              >
                <div className="absolute -top-2.5 right-4 sm:right-5 md:right-6 lg:right-5 bg-gradient-to-r from-[#19D4FF] to-[#0FA8CC] px-3 sm:px-3.5 md:px-4 py-1.5 rounded-full z-20 shadow-lg shadow-[#19D4FF]/30">
                  <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">RECOMMANDÉ</span>
                </div>
                <div className="inline-block bg-orange-500/20 text-orange-400 px-4 py-1 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider">
                  ANALYSE FORENSIQUE
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-light text-white mb-4">Full IPT — 350+ Data Points</h3>
                <p className="text-white/70 mb-8 font-sans font-normal leading-relaxed">
                  Le diagnostic le plus complet au monde pour prédire votre capacité de transformation. 
                  160 questions + 75 Deep Scan + analyse biomarqueurs.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Tout du Mini-Scan +</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Score IPT Full avec validation clinique</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Top 3 freins métaboliques/psychologiques</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Neurotype Braverman (dopamine, GABA, sérotonine)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Chronotype MEQ + fenêtre d'entraînement optimale</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Gut Health Score (microbiome + inflammation)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Rapport PDF 25+ pages avec références</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#19D4FF] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Protocole nutrition/entraînement personnalisé</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-card p-4 mb-6">
                  <div className="flex items-center gap-2 text-xs text-white/60 mb-1 uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    <span>Durée</span>
                  </div>
                  <div className="text-white font-medium">25-30 minutes</div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-card p-4 mb-8">
                  <div className="text-xs text-orange-400 mb-2 uppercase tracking-wider font-semibold">Idéal pour</div>
                  <div className="text-white/90 text-sm font-sans font-normal leading-relaxed">
                    Vous avez déjà échoué 2-3 fois et vous voulez comprendre POURQUOI avant de recommencer.
                  </div>
                </div>

                <Link
                  href="/booking"
                  className="group inline-flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-button text-base font-normal transition-all duration-300 border border-white/20 hover:border-white/30"
                >
                  <span>Accéder au Full IPT <span className="text-xs">(Réserver Elite)</span></span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-center text-xs text-white/50 mt-4 font-sans font-normal">Inclus dans Protocol G+ (260€) ou Elite (430€)</p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* POURQUOI LE DIAGNOSTIC */}
      <section className="relative py-12 md:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            {...fadeInUpDelay(0.2)}
            className="text-center mb-12"
          >
            <p className="text-xs font-sans font-normal uppercase tracking-widest text-white/60 mb-4">
              • POURQUOI LE DIAGNOSTIC AVANT L'ACTION
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-extralight text-white leading-tight">
              Votre corps n'est pas une moyenne statistique
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-6 lg:gap-6 xl:gap-4">
            {[
              {
                icon: Dna,
                title: 'Métabolique',
                weight: '30%',
                description: 'Votre HOMA-IR, ratio taille/hanches et sensibilité à l\'insuline déterminent si vous POUVEZ brûler du gras efficacement. Si votre flexibilité métabolique est compromise, aucun régime ne fonctionnera durablement.'
              },
              {
                icon: Building2,
                title: 'Infrastructure',
                weight: '25%',
                description: 'Votre sommeil, horaires de travail, régularité des repas et environnement déterminent votre capacité à maintenir un protocole. Une infrastructure instable = échec garanti malgré la meilleure volonté.'
              },
              {
                icon: Brain,
                title: 'Psychologie',
                weight: '20%',
                description: 'Votre auto-efficacité, type de motivation et historique d\'échecs déterminent votre adhérence. Un profil psychologique faible + motivation extrinsèque = abandon dans les 4 semaines.'
              },
              {
                icon: Dumbbell,
                title: 'Physique',
                weight: '15%',
                description: 'Votre niveau d\'activité actuel, historique d\'entraînement et capacité de récupération déterminent l\'intensité que votre corps peut supporter sans surentraînement.'
              },
              {
                icon: CheckCircle2,
                title: 'Adhérence',
                weight: '10%',
                description: 'Votre capacité à suivre un protocole sur le long terme, basée sur votre historique et votre environnement. Sans adhérence structurelle, même le meilleur plan échoue.'
              }
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
              <motion.div
                key={idx}
                {...fadeInUpDelay(0.3 + idx * 0.1)}
                className="flex"
              >
                <GlassCard
                  glassLevel="light"
                  depth={2}
                  withGlow={false}
                  className="h-full w-full flex flex-col"
                >
                  <div className="mb-4">
                    <IconComponent className="w-8 h-8 text-[#19D4FF]" />
                  </div>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <h3 className="text-xl md:text-2xl font-heading font-light text-white">{item.title}</h3>
                    <span className="text-xs text-[#19D4FF] font-sans font-normal whitespace-nowrap">{item.weight}</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed font-sans font-normal flex-grow">
                    {item.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-12 md:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            {...fadeInUpDelay(0.2)}
            className="text-center mb-12"
          >
            <p className="text-xs font-sans font-normal uppercase tracking-widest text-white/60 mb-4">
              • CE QUE DISENT LES DONNÉES
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-extralight text-white leading-tight">
              Ce que disent les données
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                {...fadeInUpDelay(0.3 + idx * 0.1)}
                className="h-full"
              >
                <GlassCard
                  glassLevel="medium"
                  depth={3}
                  withGlow={true}
                  className="text-center h-full flex flex-col justify-center"
                >
                  <div className="text-5xl md:text-6xl font-extralight text-[#19D4FF] mb-3">{stat.value}</div>
                  <div className="text-xs font-sans font-normal text-white/60 uppercase tracking-wider leading-relaxed">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="relative py-12 md:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            {...fadeInUpDelay(0.2)}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-extralight text-white leading-tight mb-8">
              Prêt à découvrir ce qui vous retient ?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/mini-scan"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#19D4FF] via-[#0FA8CC] to-[#0B8FA8] hover:from-[#0FA8CC] hover:via-[#0B8FA8] hover:to-[#19D4FF] text-white px-8 py-4 rounded-button text-base font-normal transition-all duration-300 hover:shadow-light hover:scale-[1.02]"
              >
                <span>Commencer le Mini-Scan <span className="text-xs">(Gratuit)</span></span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/booking"
                className="group inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-button text-base font-normal transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                <span>Réserver Full IPT Elite</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

