'use client';

import { useState, useEffect, useRef } from 'react';
import { IPTQuestionnaire } from '@/components/genesis/IPTQuestionnaire';
import { CalendlyButton } from '@/components/CalendlyButton';
import GenesisAssistant from '@/components/GenesisAssistant';
import { ArrowUpRight } from 'lucide-react';
import { Utensils, BarChart3, Moon, RefreshCw, Droplet, HeartPulse, Dumbbell } from 'lucide-react';

export default function AnalyseIPTPage() {
  // Seul état nécessaire conservé : l'ouverture du modal IPT
  const [startIPT, setStartIPT] = useState(false);
  
  // États pour le paiement Stripe et l'animation CTA
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  // Gestion du paiement Stripe
  const handleStripePayment = async () => {
    setIsStripeLoading(true);
    try {
      const res = await fetch('/api/stripe', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Pas d\'URL de paiement reçue');
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'initialisation du paiement.");
      setIsStripeLoading(false);
    }
  };

  // Animation au scroll pour le CTA final
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ctaRef.current) observer.observe(ctaRef.current);
    
    return () => {
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  return (
    <main className="relative bg-[#303030] text-white overflow-hidden">

      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 sm:px-10 md:px-16 pt-6 sm:pt-7 md:pt-8">
          <a href="/" className="block cursor-pointer">
            <div className="leading-none tracking-wide flex items-baseline gap-[6px] text-white transition-transform duration-200 hover:scale-[1.04]">
              <span 
                className="text-[26px] tracking-wider"
                style={{ fontFamily: 'var(--font-azonix)', textTransform: 'uppercase' }}
              >
                STRYV
              </span>
              <span 
                className="text-[25px] opacity-80"
                style={{ fontFamily: 'var(--font-outfit)', fontWeight: 300, textTransform: 'lowercase' }}
              >
                lab
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => {
                const element = document.getElementById('services-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center justify-center h-[38px] text-white text-[13px] px-6 rounded-full bg-[#303030] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
            >
              Expertise
            </button>

            {/* Bouton Calendly */}
            <CalendlyButton
              text="Consultation Diagnostic"
              className="flex items-center justify-center h-[38px] text-black text-[13px] px-6 rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* HERO SECTION - SEO Layer 1: High Volume & Branding */}
      <section className="relative min-h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-80 z-0 pointer-events-none"
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[#303030]/50 z-0 pointer-events-none" />

        <div className="relative z-20 min-h-screen flex items-center px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="max-w-5xl">
            <h1 className="text-white font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(3.8rem,7vw,9.5rem)]">
              Transformation
              <br />
              basée sur la donnée
            </h1>

            <p className="mt-6 text-white/70 text-sm max-w-xl">
              Au-delà du coaching : le premier système d'analyse forensique 
              qui diagnostique vos freins métaboliques et hormonaux 
              avant toute conception de programme personnalisé.
            </p>

            {/* Container Premium Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              
              {/* BOUTON 1 : ACTION DIRECTE */}
              <button
                onClick={() => setStartIPT(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-[12px] rounded-full bg-[#DAFA72]/5 border border-[#DAFA72]/20 text-[#DAFA72] text-[13px] font-medium tracking-wide backdrop-blur-sm transition-all duration-500 hover:bg-[#DAFA72] hover:text-[#1A1A1A] hover:border-[#DAFA72] hover:shadow-[0_0_35px_-10px_rgba(218,250,114,0.3)] cursor-pointer overflow-hidden"
              >
                <span className="relative z-10">Lancer l'Analyse IPT</span>
                <svg 
                  className="w-3 h-3 relative z-10 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              {/* BOUTON 2 : RESSOURCES SEO */}
              <a
                href="/outils"
                className="group inline-flex items-center gap-3 px-8 py-[12px] rounded-full bg-white/5 border border-white/10 text-white/70 text-[13px] tracking-wide backdrop-blur-sm transition-all duration-500 hover:bg-white hover:text-[#1A1A1A] hover:border-white hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                <span>Accès Calculateurs & Outils</span>
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION PRINCIPE - SEO Layer 2: Douleurs & Science */}
      <section className="bg-[#303030] px-8 md:px-16 lg:px-24 py-32">
        <div className="max-w-5xl">
          <div className="text-[#DAFA72] text-xs font-bold tracking-widest uppercase mb-8">Ingénierie Métabolique</div>
          <h2 className="text-white text-4xl md:text-6xl font-medium leading-[1.1] mb-12">
            Comprendre
            <br />
            l'Échec Systémique
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
            L'effet yoyo, la fatigue chronique et les plateaux de perte de poids ne sont pas des fatalités.
            <br /><br />
            Ce sont des signaux biologiques (résistance insuline, cortisol) que GENESIS décode pour construire
            votre architecture de réussite durable.
          </p>
        </div>
      </section>

      {/* SECTION ETAPES */}
      <section className="bg-[#303030] px-8 md:px-16 lg:px-24 py-32 border-t border-white/5">
        <div className="max-w-6xl grid md:grid-cols-3 gap-16">
          <div>
            <div className="text-[#DAFA72] text-xl font-azonix mb-4">01</div>
            <p className="text-white/70">
              <strong className="text-white block mb-2">Audit Forensique</strong>
              Collecte de 273 points de données : métabolisme, stress, sommeil et environnement.
            </p>
          </div>
          <div>
            <div className="text-[#DAFA72] text-xl font-azonix mb-4">02</div>
            <p className="text-white/70">
              <strong className="text-white block mb-2">Détection des Freins</strong>
              Analyse algorithmique de la charge allostatique et des blocages hormonaux.
            </p>
          </div>
          <div>
            <div className="text-[#DAFA72] text-xl font-azonix mb-4">03</div>
            <p className="text-white/70">
              <strong className="text-white block mb-2">Stratégie G+</strong>
              Génération d'un protocole personnalisé adapté à votre capacité de récupération.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION IPT */}
      <section className="bg-[#303030] px-8 md:px-16 lg:px-24 py-32 border-t border-white/5">
        <div className="max-w-5xl">
          <div className="text-[#DAFA72] text-xs font-bold tracking-widest uppercase mb-8">La Mesure Standard</div>
          <h2 className="text-white text-4xl md:text-6xl font-medium leading-[1.1] mb-12">
            Indice de Potentiel
            <br />
            de Transformation
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
            L'IPT est le premier score prédictif de l'industrie. Il mesure objectivement
            si votre corps est prêt à supporter un programme de transformation physique
            ou si une phase de réparation métabolique est requise.
          </p>
        </div>
      </section>

      {/* SECTION POUR QUI - SEO Layer 3: Cibles & Branding */}
      <section className="bg-[#303030] px-8 md:px-16 lg:px-24 py-32 border-t border-white/5">
        <div className="max-w-6xl grid md:grid-cols-2 gap-20">
          <div>
            <div className="text-[#DAFA72] text-xs font-bold tracking-widest uppercase mb-6">Profils Cibles</div>
            <p className="text-white/70 leading-relaxed">
              Personnes actives bloquées par un métabolisme lent ou un stress élevé.
              <br /><br />
              Athlètes cherchant à briser un plateau de performance par la data.
            </p>
          </div>
          <div>
            <div className="text-[#DAFA72] text-xs font-bold tracking-widest uppercase mb-6">Anti-Marketing</div>
            <p className="text-white/70 leading-relaxed">
              Nous ne vendons pas de rêve.
              <br />
              Nous vendons de la clarté métabolique.
              <br />
              Nous vendons une structure anti-fragile.
            </p>
          </div>
        </div>
        
        <div
  ref={ctaRef}
  className={`
    max-w-8xl mx-auto
    bg-[#DAFA72]
    rounded-2xl
    p-6 md:px-8 md:py-6
    flex
    flex-col md:flex-row
    items-start md:items-center
    justify-between
    gap-6 md:gap-0
    transition-all
    duration-700
    ease-out
    mt-12 md:mt-24
    ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
  `}
>
  <div className="flex items-start gap-4 w-full md:w-auto">
    <div className="w-3 h-3 rounded-full bg-[#303030] mt-1.5 shrink-0" />
    <p className="text-[#303030] text-sm max-w-md font-medium leading-relaxed">
      Votre transformation échoue car vous naviguez à l'aveugle.
      <br className="hidden md:block" />
      <span className="md:block mt-1 md:mt-0">Obtenez votre diagnostic IPT et objectivez vos résultats.</span>
    </p>
  </div>

  <button
    onClick={() => setStartIPT(true)}
    className="bg-[#303030] text-white text-sm px-6 py-3 rounded-full transition-transform duration-200 hover:scale-[1.05] active:scale-[0.97] cursor-pointer w-full md:w-auto text-center"
  >
    Calculer mon IPT
  </button>
</div>
      </section>

      {/* SECTION OUTILS - SEO Longue Traîne */}
<section className="bg-white px-8 md:px-16 lg:px-24 py-32 border-t border-black/5">
  
  <div className="max-w-5xl mb-16">
    <div className="text-[#303030] text-[10px] font-bold uppercase tracking-[0.2em] mb-8 opacity-40">Lab Open Source</div>
    <h2 className="text-[#303030] text-4xl md:text-6xl font-medium leading-[1.1] mb-12">
      Outils &<br />Calculateurs
    </h2>
    <p className="text-[#303030]/60 text-lg leading-relaxed max-w-3xl font-outfit">
      Accédez gratuitement aux algorithmes utilisés par nos coachs.
      Des outils précis pour tracker votre composition corporelle et vos performances.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-6">
    
    {/* CARTE 1 : SEO Force & Musculation */}
    <a href="/outils/1rm" className="group relative bg-[#1A1A1A] rounded-[24px] p-8 border border-white/5 hover:border-[#DAFA72] transition-all duration-500 overflow-hidden flex flex-col h-full">
      <div className="relative flex justify-between items-start mb-10">
        <div className="flex items-center gap-4">
          {/* ICONE */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_20px_-5px_rgba(250,204,21,0.4)] flex items-center justify-center text-white">
            <Dumbbell className="w-7 h-7 stroke-[1.5]" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full group-hover:text-[#DAFA72] group-hover:border-[#DAFA72]/30 transition-colors duration-300">
            Hypertrophie
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/10 font-bold group-hover:text-[#DAFA72]">01</span>
      </div>

      <div className="relative flex-1">
        <h3 className="text-xl text-white mb-4 font-azonix uppercase group-hover:translate-x-1 transition-transform">
          Calculateur 1RM
        </h3>
        <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-4 font-outfit">
          Estimez votre charge maximale théorique pour calibrer vos cycles de force et d'hypertrophie.
        </p>
      </div>

      <div className="relative mt-auto pt-6 flex items-center justify-between group/btn">
        <span className="text-[11px] font-medium text-white/30 group-hover:text-white transition-colors uppercase tracking-wide">Calculer</span>
        <ArrowUpRight className="w-5 h-5 text-[#DAFA72] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </div>
    </a>

    {/* CARTE 2 : SEO Hormones & Femme */}
    <a href="/outils/cycle-sync" className="group relative bg-[#1A1A1A] rounded-[24px] p-8 border border-white/5 hover:border-[#DAFA72] transition-all duration-500 overflow-hidden flex flex-col h-full">
      <div className="relative flex justify-between items-start mb-10">
        <div className="flex items-center gap-4">
          {/* ICONE */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] flex items-center justify-center text-white">
            <Moon className="w-7 h-7 stroke-[1.5]" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full group-hover:text-[#DAFA72] group-hover:border-[#DAFA72]/30 transition-colors duration-300">
          Cycle Menstruel
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/10 font-bold group-hover:text-[#DAFA72]">02</span>
      </div>

      <div className="relative flex-1">
        <h3 className="text-xl text-white mb-4 font-azonix uppercase group-hover:translate-x-1 transition-transform">
          Cycle Syncing
        </h3>
        <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-4 font-outfit">
          Adaptez votre nutrition et votre entraînement à vos phases hormonales (folliculaire, lutéale).
        </p>
      </div>

      <div className="relative mt-auto pt-6 flex items-center justify-between group/btn">
        <span className="text-[11px] font-medium text-white/30 group-hover:text-white transition-colors uppercase tracking-wide">Optimiser</span>
        <ArrowUpRight className="w-5 h-5 text-[#DAFA72] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </div>
    </a>

    {/* CARTE 3 : SEO Data & Macros */}
    <a href="/outils" className="group relative bg-[#1A1A1A] rounded-[24px] p-8 border border-dashed border-white/10 hover:border-[#DAFA72] hover:bg-[#1f1f1f] transition-all duration-500 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
      
      {/* MOSAÏQUE DES ICÔNES */}
      <div className="mb-8 flex flex-wrap justify-center gap-3 max-w-[180px] opacity-80 group-hover:opacity-100 transition-opacity duration-500">
        
        {/* Macros */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)] flex items-center justify-center text-white transform group-hover:-translate-y-1 transition-transform duration-300 delay-0">
           <Utensils size={18} strokeWidth={2} />
        </div>

        {/* Body Fat */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)] flex items-center justify-center text-white transform group-hover:-translate-y-1 transition-transform duration-300 delay-75">
           <BarChart3 size={18} strokeWidth={2} />
        </div>

        {/* Glycogène */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_0_15px_-5px_rgba(249,115,22,0.5)] flex items-center justify-center text-white transform group-hover:-translate-y-1 transition-transform duration-300 delay-150">
           <RefreshCw size={18} strokeWidth={2} />
        </div>

        {/* Hydratation */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_0_15px_-5px_rgba(34,211,238,0.5)] flex items-center justify-center text-white transform group-hover:-translate-y-1 transition-transform duration-300 delay-200">
           <Droplet size={18} strokeWidth={2} />
        </div>

        {/* HR Zones */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 shadow-[0_0_15px_-5px_rgba(225,29,72,0.5)] flex items-center justify-center text-white transform group-hover:-translate-y-1 transition-transform duration-300 delay-300">
           <HeartPulse size={18} strokeWidth={2} />
        </div>
      </div>

      <h3 className="text-sm text-white mb-2 font-azonix uppercase tracking-widest group-hover:text-[#DAFA72] transition-colors">
        Bibliothèque
      </h3>
      <p className="text-white/40 text-xs font-light font-outfit max-w-[200px]">
        Calculateurs macronutriments, TDEE, Body Fat, Zones cardiaques.
      </p>
    </a>

  </div>
</section>

      {/* SECTION PROTOCOLES */}
      <section id="services-section" className="relative px-6 sm:px-10 md:px-16 lg:px-24 py-32 bg-[#303030] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-20">
            <div className="text-[#DAFA72] text-xs font-bold tracking-widest uppercase mb-6">Écosystème GENESIS</div>
            <h2 className="text-[#6D6D6D] font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(2.8rem,6vw,5.5rem)] mb-16">
              Nos Solutions
              <br />
              D'Accompagnement
            </h2>
            <div className="text-white/60 text-lg leading-relaxed max-w-3xl">
              De l'audit métabolique ponctuel à l'optimisation continue de la performance.
              Une architecture de coaching adaptée à votre niveau d'exigence.
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* 1. RAPPORT IPT */}
            <div className="flex flex-col p-8 rounded-[24px] bg-[#6D6D6D] border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-8">
                <h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'var(--font-azonix)' }}>
                  RAPPORT IPT
                </h3>
                <span className="text-white/40 text-[11px] uppercase tracking-wider font-light">Bilan Métabolique Complet</span>
              </div>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl text-white font-light" style={{ fontFamily: 'var(--font-outfit)' }}>35€</span>
              </div>

              <div className="w-full h-[1px] bg-white/10 mb-8" />

              <ul className="flex-1 space-y-4 text-[14px] text-white/70 font-light mb-10" style={{ fontFamily: 'var(--font-outfit)' }}>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Diagnostic forensique 273 points
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Analyse des freins (P1-P8)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Score de Potentiel (0-100)
                </li>
              </ul>
              <button
                onClick={() => setStartIPT(true)}
                className="w-full py-3 rounded-full border border-white/20 text-white text-[13px] hover:bg-white hover:text-black transition-all duration-300"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Commander l'Audit
              </button>
            </div>

            {/* 2. G+ - LE STANDARD */}
            <div className="flex flex-col p-8 rounded-[24px] bg-[#DAFA72] border border-white/5 hover:border-[#303030]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(218,250,114,0.1)]">
              <div className="mb-8">
                <h3 className="text-2xl text-[#303030] mb-2" style={{ fontFamily: 'var(--font-azonix)' }}>
                  PROTOCOL G+
                </h3>
                <span className="text-[#303030]/40 text-[11px] uppercase tracking-wider font-light">Programme Personnalisé</span>
              </div>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl text-[#303030] font-light" style={{ fontFamily: 'var(--font-outfit)' }}>175€</span>
                <span className="text-[#303030]/40 text-xs font-light">/ 6 semaines</span>
              </div>

              <div className="w-full h-[1px] bg-white/10 mb-8" />

              <ul className="flex-1 space-y-4 text-[14px] text-[#303030]/70 font-light mb-10" style={{ fontFamily: 'var(--font-outfit)' }}>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#303030] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Programmation sur-mesure
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#303030] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Ajustements selon la Data
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#303030] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Autonomie guidée par IA
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#303030] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Accès Application Privée
                </li>
              </ul>

              <button
                onClick={handleStripePayment}
                disabled={isStripeLoading}
                className={`w-full py-3 rounded-full border border-[#303030]/20 text-[13px] transition-all duration-300 flex justify-center items-center gap-2
                  ${isStripeLoading 
                    ? 'bg-white/10 text-white/50 cursor-wait' 
                    : 'text-[#303030] hover:bg-[#6D6D6D] hover:text-white hover:border-[#6D6D6D]'
                  }`}
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {isStripeLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-[#303030]/30 border-t-white rounded-full animate-spin"/>
                    Redirection...
                  </>
                ) : (
                  "Activer mon Protocole"
                )}
              </button>
            </div>

            {/* 3. OMNI - L'OFFRE SIGNATURE */}
            <div className="relative flex flex-col p-8 rounded-[24px] bg-[#303030] border border-[#DAFA72] shadow-[0_0_30px_-10px_rgba(218,250,114,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_50px_-10px_rgba(218,250,114,0.3)]">
              <div className="absolute top-8 right-8">
                <span className="text-[#DAFA72] text-[10px] font-bold tracking-widest uppercase">Elite</span>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'var(--font-azonix)' }}>
                  OMNI
                </h3>
                <span className="text-[#DAFA72] text-[11px] uppercase tracking-wider font-light">Coaching & Bio-Hacking</span>
              </div>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl text-white font-light" style={{ fontFamily: 'var(--font-outfit)' }}>650€</span>
                <span className="text-white/40 text-xs font-light">/ 12 semaines</span>
              </div>

              <div className="w-full h-[1px] bg-[#DAFA72]/20 mb-8" />

              <ul className="flex-1 space-y-4 text-[14px] text-white/90 font-light mb-10" style={{ fontFamily: 'var(--font-outfit)' }}>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72] shadow-[0_0_10px_#DAFA72]" />
                  Suivi 7j/7 & Analyse Biomarqueurs
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72] shadow-[0_0_10px_#DAFA72]" />
                  Ingénierie du Sommeil
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72] shadow-[0_0_10px_#DAFA72]" />
                  Gestion Charge Allostatique
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72] shadow-[0_0_10px_#DAFA72]" />
                  Optimisation Hormonale
                </li>
              </ul>

              <CalendlyButton
                text="Entretien d'Admission"
                className="w-full py-3 rounded-full bg-[#DAFA72] text-black text-[13px] font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION FINALE */}
      <section className="bg-[#303030] px-8 md:px-16 lg:px-24 py-40 border-t border-white/5">
        <div className="max-w-4xl">
          <h2 className="text-[#6D6D6D] font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(2.8rem,6vw,5.5rem)] mb-16">
            Votre transformation
            <br />
            est une science.
          </h2>

          <button
            onClick={() => setStartIPT(true)}
            className="inline-flex items-center text-black text-[13px] px-6 py-[10px] rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
          >
            Commencer le Diagnostic IPT
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-[#303030] text-white/40 py-12 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[11px] tracking-wide font-light">
            © {new Date().getFullYear()} STRYV lab - Genesis. Ingénierie de la Performance.
          </div>
          
          <div className="flex items-center gap-6 text-[11px] tracking-wide">
            <a href="/mentions-legales" className="hover:text-white transition-colors cursor-pointer">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-white transition-colors cursor-pointer">Confidentialité</a>
            <a href="/cgv" className="hover:text-white transition-colors cursor-pointer">CGV</a>
          </div>
        </div>
      </footer>

      {/* CHATBOT UNIFIÉ */}
      <GenesisAssistant onStartIPT={() => setStartIPT(true)} />

      {/* MODAL IPT */}
      {startIPT && (
        <div className="fixed inset-0 bg-black/90 z-[70] overflow-auto">
          <div className="min-h-screen py-8 px-4">
            <button
              onClick={() => setStartIPT(false)}
              className="fixed top-6 right-6 text-white/60 hover:text-white text-2xl z-[80] cursor-pointer"
            >
              ✕
            </button>
            
            <IPTQuestionnaire onComplete={() => setStartIPT(false)} />
          </div>
        </div>
      )}
    </main>
  );
}