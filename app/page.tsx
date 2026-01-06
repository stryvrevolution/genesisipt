'use client';

// --- 1. IMPORTS ---
import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Lock, Activity, ChevronDown, Check, Play, Menu, X } from 'lucide-react';
import { Utensils, BarChart3, Moon, RefreshCw, Droplet, HeartPulse, Dumbbell } from 'lucide-react';

// Composants locaux
import { IPTQuestionnaire } from '@/components/genesis/IPTQuestionnaire';
import { CalendlyButton } from '@/components/CalendlyButton';
import GenesisAssistant from '@/components/GenesisAssistant';
import FaqMetabolicSchema from '@/components/seo/FaqMetabolicSchema';
import MetabolicFAQ from '@/components/ui/MetabolicFAQ';

// --- 2. COMPOSANT PRINCIPAL ---
export default function AnalyseIPTPage() {
  
  // --- STATES & REFS ---
  const [startIPT, setStartIPT] = useState(false);
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // États d'animation
  const [ctaVisible, setCtaVisible] = useState(false);
  const [failureGraphVisible, setFailureGraphVisible] = useState(false);
  const [growthGraphVisible, setGrowthGraphVisible] = useState(false);

  // Refs
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const failureRef = useRef<HTMLDivElement | null>(null);
  const growthRef = useRef<HTMLDivElement | null>(null);

  // --- LOGIQUE ---
  const handleStripePayment = async () => {
    setIsStripeLoading(true);
    try {
      const res = await fetch('/api/stripe', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
      setIsStripeLoading(false);
    }
  };
  const handleStripePaymentGPlus = async () => {
    setIsStripeLoading(true);
    try {
      const res = await fetch('/api/stripe/gplus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erreur paiement G+', error);
      setIsStripeLoading(false);
    }
  };
  
  const handleStripePaymentIPT = async () => {
    try {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erreur paiement analyse IPT', error);
    }
  };
  
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === ctaRef.current) setCtaVisible(true);
            if (entry.target === failureRef.current) setFailureGraphVisible(true);
            if (entry.target === growthRef.current) setGrowthGraphVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (ctaRef.current) observer.observe(ctaRef.current);
    if (failureRef.current) observer.observe(failureRef.current);
    if (growthRef.current) observer.observe(growthRef.current);
    
    return () => observer.disconnect();
  }, []);

  // --- RENDER ---
  return (
    <main className="relative bg-[#303030] text-white overflow-x-hidden font-outfit selection:bg-[#DAFA72] selection:text-black">

      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-16 pt-6 md:pt-8">
          <a href="/" className="block cursor-pointer group relative z-50">
            <div className="leading-none tracking-wide flex items-baseline gap-[6px] text-white transition-transform duration-200 group-hover:scale-[1.02]">
              <span 
                className="text-[22px] md:text-[26px] tracking-wider"
                style={{ fontFamily: 'var(--font-azonix)', textTransform: 'uppercase' }}
              >
                STRYV
              </span>
              <span 
                className="text-[22px] md:text-[25px] opacity-60" 
                style={{ fontFamily: 'var(--font-outfit)', fontWeight: 300, textTransform: 'lowercase' }}
              >
                lab
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center h-[38px] text-white/60 text-[13px] px-6 rounded-xl bg-[#252525] border border-white/5 transition-all duration-200 hover:border-white/20 hover:text-white cursor-pointer"
            >
              Expertise
            </button>
            <CalendlyButton
              text="Consultation"
              className="flex items-center justify-center h-[38px] text-black text-[13px] px-6 rounded-xl bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer font-medium"
            />
          </div>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden relative z-50 p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-[#303030] z-40 flex flex-col items-center justify-center gap-8 md:hidden animate-in fade-in duration-200">
             <button 
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-2xl font-medium text-white/80"
            >
              Expertise
            </button>
            <CalendlyButton
              text="Prendre RDV"
              className="px-8 py-4 rounded-xl bg-[#DAFA72] text-black font-bold text-lg"
            />
          </div>
        )}
      </header>

      {/* HERO SECTION (ÉPURÉE & H1 CORRIGÉ) */}
      <section className="relative min-h-screen flex items-center pt-20 md:pt-0">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-overlay z-0 pointer-events-none"
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[#303030]/50 z-0 pointer-events-none" />

        <div className="relative z-20 w-full px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="max-w-5xl">
            
            {/* BADGE SUPPRIMÉ ICI */}

            {/* H1 CORRIGÉ : Utilisation explicite de font-outfit pour autoriser les minuscules */}
            <h1 className="font-outfit text-white font-medium leading-[0.95] tracking-[-0.02em] text-3xl sm:text-5xl md:text-[clamp(3.5rem,7vw,5rem)] break-words hyphens-auto mb-7">
  La transformation physique
  <br />
  <span className="text-white/30">n’est pas une question d’effort</span>
</h1>

<p className="mt-6 md:mt-8 text-white/60 text-sm md:text-base max-w-xl leading-relaxed border-l border-[#DAFA72]/30 pl-4">
  <span className="inline-flex items-start gap-[2px]">
    STRYV lab
    <sup className="text-[9px] leading-none relative -top-[2px] opacity-70">™</sup>
  </span>
  mesure votre potentiel réel de transformation (ipt),
  adapte la stratégie à votre système biologique,
  puis optimise ce potentiel avant toute tentative de transformation.
</p>



            <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
              <button
                onClick={() => setStartIPT(true)}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-[14px] rounded-xl bg-[#DAFA72]/10 border border-[#DAFA72]/20 text-[#DAFA72] text-[13px] font-medium tracking-wide backdrop-blur-sm transition-all duration-500 hover:bg-[#DAFA72] hover:text-[#1A1A1A] hover:border-[#DAFA72] cursor-pointer"
              >
                <span className="relative z-10">Lancer l'analyse IPT</span>
                <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="/outils"
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-[14px] rounded-xl bg-[#252525] border border-white/5 text-white/60 text-[13px] tracking-wide backdrop-blur-sm transition-all duration-500 hover:bg-[#404040] hover:text-white hover:border-white/10 cursor-pointer"
              >
                <span>Accès outils open source</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 : ARCHITECTURE DE L'ÉCHEC */}
      <section className="bg-[#303030] px-6 sm:px-10 md:px-16 lg:px-24 py-24 md:py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 lg:mb-24">
            <div>
              <div className="text-[#DAFA72] text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#DAFA72] rounded-full animate-pulse"/>
                Analyse forensique
              </div>
              <h2 className="font-outfit text-white text-3xl sm:text-4xl md:text-6xl font-medium leading-[1.05] mb-8 tracking-tight">
                L'Architecture <br/>
                de l'échec.
              </h2>
              <p className="text-white/60 text-base md:text-lg leading-relaxed border-l border-[#DAFA72]/30 pl-6">
                Vous pensez manquer de volonté ? Faux. <br/>
                Vos échecs précédents sont le résultat de **mécanismes de protection biologique**. 
                Quand l'insuline et le cortisol sont déréglés, votre corps refuse physiologiquement de brûler du gras.
              </p>
            </div>

            {/* GRAPHIQUE ÉCHEC (UPGRADED - Thème Alerte) */}
            <div ref={failureRef} className="relative bg-[#252525] rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl group cursor-crosshair overflow-hidden">
              
              {/* Header du Graphique */}
              <div className="relative flex justify-between items-end mb-10 z-10">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Réponse Insuline / Cortisol</span>
                </div>
                <div className="text-right">
                  <div className="text-red-500 font-mono text-xl font-bold leading-none">CRITIQUE</div>
                  <div className="text-[9px] text-white/30 font-mono uppercase">Statut Métabolique</div>
                </div>
              </div>

              {/* ZONE DU GRAPHIQUE */}
              <div className="h-[220px] flex items-end justify-between gap-2 relative z-10 pb-6 border-b border-white/5">
                
                {/* Ligne de Seuil Inflammatoire */}
                <div className="absolute top-[30%] w-full h-[1px] bg-red-500/20 border-t border-dashed border-red-500/40 flex items-center z-0">
                  <span className="text-[9px] font-bold text-red-400 bg-[#252525] px-1 ml-1 uppercase tracking-widest">Seuil Inflammatoire</span>
                </div>

                {/* Les Barres de Données */}
                {[40, 65, 90, 45, 30, 80, 100, 40, 20, 50, 70, 30].map((h, i) => {
                  // Logique : Si la barre dépasse 75%, c'est un pic critique (Rouge)
                  const isCritical = h > 75;

                  return (
                     <div key={i} className="relative w-full h-full flex items-end group/bar">
                       <div 
                         style={{ 
                           height: failureGraphVisible ? `${h}%` : '5%', 
                           transitionDelay: `${i * 50}ms`,
                           transitionDuration: '1000ms'
                         }} 
                         className={`w-full rounded-sm relative min-w-[8px] transition-all ease-out group-hover:scale-x-110
                         ${isCritical 
                           ? 'bg-gradient-to-t from-red-500/20 via-red-500 to-red-500 shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)]' 
                           : 'bg-gradient-to-t from-white/5 to-white/30'
                         }`}
                       >
                          {/* Scanline */}
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-0 group-hover/bar:opacity-100 shadow-[0_0_10px_white]" />
                       </div>
                       
                       {/* Tooltip */}
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-20">
                         <div className="bg-[#1A1A1A] border border-white/20 text-white text-[9px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap">
                           {i * 2 + 8}:00 <span className="text-red-500"> // </span> {h} mg/dL
                         </div>
                         <div className="w-[1px] h-3 bg-white/20"></div>
                       </div>
                     </div>
                   )
                })}
              </div>

              {/* Footer Graphique */}
              <div className="mt-4 flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-white/20">
                <div className="flex items-center gap-2">
                  <span>08:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">14:00 (Crash)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>20:00</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4">
                <div className="px-3 py-1 bg-[#303030] border border-red-500/20 rounded text-[10px] text-red-400 uppercase font-medium">Zone critique détectée</div>
                <div className="px-3 py-1 bg-[#303030] border border-white/10 rounded text-[10px] text-white/30 uppercase">Flexibilité métabolique: 12%</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Le Crash de 14h", sub: "Hypoglycémie Réactionnelle", desc: "Envie de dormir après le repas ? C'est votre insuline qui s'effondre.", path: "M13 10V3L4 14h7v7l9-11h-7z" },
              { title: "Le Ventre Cortisol", sub: "Axe HPA Déréglé", desc: "Vous mangez peu mais stockez au ventre ? Le stress bloque la perte de gras.", path: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
              { title: "Le Réveil de 3h", sub: "Pic Cortisol Inversé", desc: "Réveils nocturnes = Panique glycémique. Pas d'hormone de croissance.", path: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" }
            ].map((item, i) => (
              <div key={i} className="group bg-[#252525] p-6 md:p-8 rounded-[20px] border border-white/5 hover:border-white/20 transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-[#303030] flex items-center justify-center mb-6 group-hover:bg-[#DAFA72] transition-colors duration-500">
                  <svg className="w-6 h-6 text-white/60 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.path} />
                  </svg>
                </div>
                <h3 className="text-white text-lg md:text-xl font-azonix mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  <span className="text-[#DAFA72] text-[10px] font-bold uppercase tracking-wider block mb-2">{item.sub}</span>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= SECTION 2 : HYPERTROPHIE (ENRICHIE) ================= */}
      <section className="bg-[#303030] px-6 sm:px-10 md:px-16 lg:px-24 py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* VISUALISATION GRAPHIQUE (ÉPURÉE) */}
            <div ref={growthRef} className="order-2 lg:order-1 relative bg-[#252525] rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl group cursor-crosshair overflow-hidden">
              
              {/* Header du Graphique (Simplifié) */}
              <div className="relative flex justify-between items-end mb-10 z-10">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">SPM / Synthèse</span>
                </div>
                <div className="text-right">
                  <div className="text-[#DAFA72] font-mono text-xl font-bold leading-none">+12.4%</div>
                  <div className="text-[9px] text-white/30 font-mono uppercase">Gain Masse Maigre</div>
                </div>
              </div>

              {/* ZONE DU GRAPHIQUE */}
              <div className="h-[220px] flex items-end justify-between gap-2 relative z-10 pb-6 border-b border-white/5">
                
                {/* Ligne de Limite Génétique */}
                <div className="absolute top-[45%] w-full h-[1px] bg-red-500/20 border-t border-dashed border-red-500/40 flex items-center z-0">
                  <span className="text-[9px] font-bold text-red-400/60 bg-[#252525] px-1 ml-1 uppercase tracking-widest">Seuil Génétique Théorique</span>
                </div>

                {/* Les Barres de Données */}
                {[25, 35, 30, 45, 40, 55, 50, 65, 80, 75, 90, 100].map((height, i) => {
                  const isBreakthrough = height > 55;
                  
                  return (
                    <div key={i} className="relative w-full h-full flex items-end group/bar">
                      {/* La Barre */}
                      <div 
                        style={{ 
                          height: growthGraphVisible ? `${height}%` : '0%', 
                          transitionDelay: `${i * 80}ms`,
                          transitionDuration: '1000ms'
                        }} 
                        className={`w-full rounded-sm relative min-w-[8px] transition-all ease-out group-hover:scale-x-110
                        ${isBreakthrough 
                          ? 'bg-gradient-to-t from-[#DAFA72]/20 via-[#DAFA72] to-[#DAFA72] shadow-[0_0_15px_-5px_rgba(218,250,114,0.5)]' 
                          : 'bg-gradient-to-t from-white/5 to-white/30'
                        }`}
                      >
                         {/* Scanline au survol */}
                         <div className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-0 group-hover/bar:opacity-100 shadow-[0_0_10px_white]" />
                      </div>

                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-20">
                        <div className="bg-[#1A1A1A] border border-white/20 text-white text-[9px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap">
                          S{i+1} <span className="text-[#DAFA72]"> // </span> {height * 1.2}KG
                        </div>
                        <div className="w-[1px] h-3 bg-white/20"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Graphique */}
              <div className="mt-4 flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                  <span>Activation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#DAFA72]/50 rounded-full"></div>
                  <span className="text-[#DAFA72]/50">Surcharge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#DAFA72] rounded-full animate-pulse"></div>
                  <span className="text-[#DAFA72]">Pic</span>
                </div>
              </div>
            </div>

            {/* CONTENU TEXTE (VERSION ENRICHIE SCIENCE) */}
            <div className="order-1 lg:order-2">
              <div className="text-[#DAFA72] text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#DAFA72] rounded-full"/>
                Ingénierie Cellulaire
              </div>
              
              <h2 className="font-outfit text-white text-3xl sm:text-4xl md:text-6xl font-medium leading-[1.05] mb-8 tracking-tight">
                Architecture <br/>
                anabolique.
              </h2>
              
              <p className="text-white/60 text-base md:text-lg leading-relaxed border-l border-[#DAFA72]/30 pl-6 mb-10">
                L'hypertrophie n'est pas du hasard, c'est une cascade biochimique. <br/>
                Nous ne "poussons" pas simplement de la fonte. Nous manipulons les voies de signalisation **mTORC1** et la synthèse protéique (MPS) pour forcer l'adaptation cellulaire, au-delà de votre génétique initiale.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#252525] flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-[#DAFA72] font-bold text-lg">M</span>
                  </div>
                  <div>
                    <h4 className="text-white font-azonix text-sm mb-1">Mécano-transduction</h4>
                    <p className="text-white/50 text-xs leading-relaxed">Conversion du stimulus mécanique en signal chimique. Nous calibrons la tension pour saturer les récepteurs membranaires sans épuiser le SNC.</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#252525] flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-[#DAFA72] font-bold text-lg">S</span>
                  </div>
                  <div>
                    <h4 className="text-white font-azonix text-sm mb-1">Signalisation mTOR</h4>
                    <p className="text-white/50 text-xs leading-relaxed">Activation précise du régulateur central de croissance via le seuil de Leucine et la manipulation des fenêtres d'insuline post-effort.</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#252525] flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-[#DAFA72] font-bold text-lg">U</span>
                  </div>
                  <div>
                    <h4 className="text-white font-azonix text-sm mb-1">Unités Motrices</h4>
                    <p className="text-white/50 text-xs leading-relaxed">Recrutement sélectif des fibres de Type II (High-Threshold) via une gestion algorithmique du RPE (Rate of Perceived Exertion).</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ================= SECTION OUTILS (POSITIONNÉE AVANT LES PRIX) ================= */}
      <section className="bg-[#303030] px-6 sm:px-10 md:px-16 lg:px-24 py-24 md:py-32 border-t border-white/5">
        <div className="max-w-5xl mb-16">
          <div className="text-[#DAFA72] text-xs font-bold tracking-widest uppercase mb-6">Lab open source</div>
          <h2 className="font-outfit text-white text-3xl sm:text-4xl md:text-6xl font-medium leading-[1.1] mb-8">
            Outils &<br />Calculateurs
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl font-outfit">
            Accédez gratuitement aux algorithmes utilisés par nos coachs.
            Des outils précis pour tracker votre composition corporelle et vos performances.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* CARTE 1 */}
          <a href="/outils/1rm" className="group relative bg-[#252525] rounded-[24px] p-8 border border-white/5 hover:border-white/20 transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#303030] flex items-center justify-center text-white">
                  <Dumbbell className="w-7 h-7 stroke-[1.5]" />
                </div>
              </div>
              <span className="font-mono text-[10px] text-white/10 font-bold group-hover:text-[#DAFA72]">01</span>
            </div>
            <div className="relative flex-1">
              <h3 className="text-xl text-white mb-4 font-azonix">Calculateur 1RM</h3>
              <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-4 font-outfit">
                Estimez votre charge maximale théorique pour calibrer vos cycles.
              </p>
            </div>
            <div className="relative mt-auto pt-6 flex items-center justify-between group/btn">
              <span className="text-[11px] font-medium text-white/30 group-hover:text-white transition-colors uppercase tracking-wide">Calculer</span>
              <ArrowUpRight className="w-5 h-5 text-[#DAFA72] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </a>

          {/* CARTE 2 */}
          <a href="/outils/cycle-sync" className="group relative bg-[#252525] rounded-[24px] p-8 border border-white/5 hover:border-white/20 transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#303030] flex items-center justify-center text-white">
                  <Moon className="w-7 h-7 stroke-[1.5]" />
                </div>
              </div>
              <span className="font-mono text-[10px] text-white/10 font-bold group-hover:text-[#DAFA72]">02</span>
            </div>
            <div className="relative flex-1">
              <h3 className="text-xl text-white mb-4 font-azonix">Cycle Sync</h3>
              <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-4 font-outfit">
              Respectez votre physiologie féminine. Transformez votre cycle féminin en atout : une programmation ajustée aux phases hormonales.
              </p>
            </div>
            <div className="relative mt-auto pt-6 flex items-center justify-between group/btn">
              <span className="text-[11px] font-medium text-white/30 group-hover:text-white transition-colors uppercase tracking-wide">Optimiser</span>
              <ArrowUpRight className="w-5 h-5 text-[#DAFA72] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </a>

          {/* CARTE 3 */}
          <a href="/outils" className="group relative bg-[#252525] rounded-[24px] p-8 border border-dashed border-white/10 hover:border-[#DAFA72] hover:bg-[#303030] transition-all duration-500 flex flex-col items-center justify-center text-center h-full min-h-[250px]">
            <div className="mb-8 flex flex-wrap justify-center gap-3 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
               <div className="p-2 bg-[#303030] rounded-lg"><Utensils size={18} strokeWidth={2} /></div>
               <div className="p-2 bg-[#303030] rounded-lg"><BarChart3 size={18} strokeWidth={2} /></div>
               <div className="p-2 bg-[#303030] rounded-lg"><HeartPulse size={18} strokeWidth={2} /></div>
            </div>
            <h3 className="text-sm text-white mb-2 font-azonix uppercase tracking-widest">Bibliothèque</h3>
            <p className="text-white/40 text-xs font-light">Calculateurs macros, TDEE, Body Fat.</p>
          </a>

        </div>
      </section>

      {/* ================= SECTION OFFRES (PRIX) ================= */}
      <section id="services-section" className="relative px-6 sm:px-10 md:px-16 lg:px-24 py-24 md:py-32 bg-[#303030] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <div className="text-[#DAFA72] text-xs font-bold tracking-widest uppercase mb-6">Écosystème GENESIS</div>
            <h2 className="font-outfit text-white font-medium leading-[0.95] tracking-[-0.02em] text-4xl sm:text-5xl md:text-[5.5rem] mb-8 md:mb-16">
              Nos solutions <br/> d'accompagnement
            </h2>
            <div className="text-white/60 text-lg leading-relaxed max-w-3xl">
              De l'audit métabolique ponctuel à l'optimisation continue de la performance.
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch auto-rows-fr">

            
            {/* 1. RAPPORT IPT (Card #252525) */}
<div className="flex flex-col h-full p-8 rounded-[24px] bg-[#252525] border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
  
  {/* HEADER */}
  <div className="mb-8">
    <h3
      className="text-2xl text-white mb-2"
      style={{ fontFamily: 'var(--font-azonix)' }}
    >
      RAPPORT IPT
    </h3>
    <span className="text-white/40 text-[11px] uppercase tracking-wider font-light">
      Bilan métabolique complet
    </span>
  </div>

  {/* PRIX */}
  <div className="flex items-baseline gap-1 mb-8">
    <span
      className="text-4xl text-white font-light"
      style={{ fontFamily: 'var(--font-outfit)' }}
    >
      35€
    </span>
  </div>

  <div className="w-full h-[1px] bg-white/5 mb-8" />

  {/* CONTENU — PREND LA PLACE */}
  <ul className="flex-1 space-y-4 text-[14px] text-white/60 font-light mb-8">
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
      Analyse IPT (collecte & modélisation)
    </li>
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
      Calcul de l’indice de potentiel de transformation (IPT™)
    </li>
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
      Rapport de potentiel de transformation
    </li>
  </ul>

  {/* FOOTER — COLLÉ EN BAS */}
  <div className="mt-8 h-[160px] flex flex-col justify-between">
    <p className="mb-3 text-[11px] text-white/40 leading-relaxed min-h-[34px]">
      Vous payez pour une analyse et un rapport d’interprétation.
      Aucun programme ni transformation n’est inclus à ce stade.
    </p>

    <button
      onClick={handleStripePaymentIPT}
      className="w-full py-4 rounded-xl border border-white/10 text-white/60 text-[13px] hover:bg-white hover:text-black transition-all duration-300"
    >
      Accéder à l’analyse IPT
    </button>

    <p className="mt-3 text-[11px] text-white/30 leading-relaxed min-h-[32px]">
      Après paiement, vous accédez au questionnaire d’analyse IPT.
      Le rapport est généré à partir de vos données et livré selon les délais indiqués.
    </p>
  </div>
</div>

            

            {/* 2. G+ (Card #404040 - Active) */}
<div className="flex flex-col h-full p-8 rounded-[24px] bg-[#404040] border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden">
  
  <div className="absolute top-0 left-0 w-full h-1 bg-[#DAFA72]"></div>

  {/* HEADER */}
  <div className="mb-8">
    <h3
      className="text-2xl text-white mb-2"
      style={{ fontFamily: 'var(--font-azonix)' }}
    >
      PROTOCOL G+
    </h3>
    <span className="text-white/60 text-[11px] uppercase tracking-wider font-light">
      Programme ultra personnalisé
    </span>
  </div>

  {/* PRIX */}
  <div className="flex items-baseline gap-1 mb-8">
    <span
      className="text-4xl text-white font-light"
      style={{ fontFamily: 'var(--font-outfit)' }}
    >
      175€
    </span>
    <span className="text-white/40 text-xs font-light">
      / 6 semaines
    </span>
  </div>

  <div className="w-full h-[1px] bg-white/10 mb-8" />

  {/* CONTENU — PREND LA PLACE */}
  <ul className="flex-1 space-y-4 text-[14px] text-white/80 font-light mb-8">
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72]" />
      Adaptation stratégique basée sur votre IPT
    </li>
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72]" />
      Priorisation des leviers à potentiel élevé
    </li>
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72]" />
      Ajustements continus selon l’évolution de l’IPT
    </li>
  </ul>

  {/* FOOTER — COLLÉ EN BAS */}
  <div className="mt-8 h-[160px] flex flex-col justify-between">
    <p className="mb-3 text-[11px] text-white/40 leading-relaxed min-h-[34px]">
      Ce paiement active le protocole G+ et inclut une analyse IPT complète.
      le protocole est adapté uniquement après évaluation de votre potentiel
      de transformation.
    </p>

    <button
      onClick={handleStripePaymentGPlus}
      disabled={isStripeLoading}
      className={`w-full py-4 rounded-xl bg-white text-[#1A1A1A] font-bold text-[13px] transition-all duration-300 hover:bg-[#DAFA72] ${
        isStripeLoading ? 'opacity-70' : ''
      }`}
    >
      {isStripeLoading ? 'Redirection…' : 'Activer le protocole G+'}
    </button>

    <p className="mt-3 text-[10px] text-white/30 leading-relaxed min-h-[32px]">
      Après paiement, vous serez redirigé vers le questionnaire
      d’analyse IPT, indispensable pour adapter le protocole
      à votre système.
    </p>
  </div>
</div>


            {/* 3. OMNI (Card #303030 - Elite) */}
<div className="relative flex flex-col h-full p-8 rounded-[24px] bg-[#303030] border border-[#DAFA72]/30 shadow-lg transition-all duration-300 hover:-translate-y-2">
  
  <div className="absolute top-8 right-8">
    <span className="text-[#DAFA72] text-[10px] font-bold tracking-widest uppercase border border-[#DAFA72]/30 px-2 py-1 rounded">
      Elite
    </span>
  </div>

  <div className="mb-8">
    <h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'var(--font-azonix)' }}>
      OMNI
    </h3>
    <span className="text-white/40 text-[11px] uppercase tracking-wider font-light">
      Optimisation continue & ingénierie du potentiel
    </span>
  </div>

  <div className="flex items-baseline gap-1 mb-8">
    <span className="text-4xl text-white font-light" style={{ fontFamily: 'var(--font-outfit)' }}>
      650€
    </span>
    <span className="text-white/40 text-xs font-light">
      / 12 semaines
    </span>
  </div>

  <div className="w-full h-[1px] bg-white/10 mb-8" />

  <ul className="flex-1 space-y-4 text-[14px] text-white/60 font-light mb-8">
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
      Optimisation continue du potentiel de transformation
    </li>
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
      Élévation progressive de l’indice IPT dans le temps
    </li>
    <li className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
      Recalibrage stratégique selon l’évolution du système
    </li>
  </ul>

  <div className="mt-8 h-[160px] flex flex-col justify-between">
    <p className="text-[11px] text-white/40 leading-relaxed">
      OMNI s’adresse aux profils nécessitant une optimisation
      continue et une supervision stratégique avancée.
      l’accès se fait uniquement après entretien.
    </p>

    <CalendlyButton
      text="entretien d’admission"
      className="w-full py-4 rounded-xl bg-[#DAFA72] text-black text-[13px] font-medium hover:bg-white transition-colors duration-200"
    />

    <p className="text-[10px] text-white/30 leading-relaxed">
      Aucun paiement n’est possible sans validation préalable.
    </p>
  </div>
  </div>
  </div> {/* fin grid */}
</div> {/* fin max-w-7xl */}
</section>

      {/* ================= FAQ SECTION (JUSTE APRÈS LES OFFRES) ================= */}
      <MetabolicFAQ />

      {/* ================= SECTION FINALE (CTA) ================= */}
      <section className="bg-[#303030] px-6 sm:px-10 md:px-16 lg:px-24 py-32 border-t border-white/5">
        <div className="max-w-4xl">
          <h2 className="text-[#6D6D6D] font-medium leading-[0.95] tracking-[-0.02em] text-4xl sm:text-5xl md:text-[5.5rem] mb-12 md:mb-16">
            Votre transformation<br />est une science, pas un combat.
          </h2>
          <button 
            onClick={() => setStartIPT(true)} 
            className="w-full sm:w-auto inline-flex items-center justify-center text-black text-[13px] px-8 py-4 rounded-xl bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer font-bold"
          >
            Commencer le diagnostic IPT
          </button>
        </div>
      </section>

      {/* ================= FOOTER (#252525) ================= */}
      <footer className="relative z-10 bg-[#252525] text-white/40 py-12 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="text-[11px] tracking-wide font-light">© {new Date().getFullYear()} STRYV lab - Genesis.</div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-[11px] tracking-wide uppercase">
            <a href="/mentions-legales" className="hover:text-white transition-colors">Mentions</a>
            <a href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="/cgv" className="hover:text-white transition-colors">CGV</a>
          </div>
        </div>
      </footer>

      {/* GLOBAL COMPONENTS (Chatbot, Schema, Modal) */}
      <GenesisAssistant onStartIPT={() => setStartIPT(true)} />
      <FaqMetabolicSchema />

      {startIPT && (
        <div className="fixed inset-0 bg-black/90 z-[70] overflow-auto backdrop-blur-sm animate-in fade-in duration-200">
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