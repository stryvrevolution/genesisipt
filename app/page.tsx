'use client';

// --- 1. IMPORTS SYSTEM ---
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// --- 2. IMPORTS UI (DESIGN SYSTEM) ---
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SwipeButton from '@/components/ui/SwipeButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Accordion } from '@/components/ui/Accordion';
import Link from 'next/link';
import CalConsultationModal from '@/components/booking/CalConsultationModal';
import { useEffect, useRef } from 'react';

// --- 3. IMPORTS ICONS (LUCIDE) ---
import { 
  Activity, 
  Flame, 
  Users, 
  Brain,
  Dna,
  Check,
  Moon, 
  ArrowRight,
  Phone,
  MessageCircle,
  ScanSearch,
  CheckCircle2
} from 'lucide-react';

// --- 4. IMPORTS MÉTIER ---
import IPTQuestionnaire from '@/components/genesis/IPTQuestionnaire';

export default function AnalyseIPTPage() {
  const router = useRouter();
  
  // --- STATES ---
  const [startIPT, setStartIPT] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState<string | null>(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // --- LOGIQUE PAIEMENT ---
  const handlePayment = async (type: 'ipt' | 'gplus' | 'omni') => {
    setLoadingStripe(type);
    try {
      const endpoints = {
        ipt: '/api/stripe',
        gplus: '/api/stripe/gplus',
        omni: '/api/stripe/omni'
      };

      const res = await fetch(endpoints[type], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error(`Erreur paiement ${type}`, error);
    } finally {
      setLoadingStripe(null);
    }
  };
  // --- COLLE ÇA AU DÉBUT DE TA FONCTION ---
  const [lines, setLines] = useState([
    "> INITIALIZING GENESIS CORE...",
    "> CONNECTING TO BIOMETRIC DB...",
    "...",
    "> LOADING MODULES:",
    "  [OK] Metabolic_Rate (HOMA-IR)",
    "  [OK] Neuro_Profile (Braverman)",
    "  [OK] HPA_Axis_Load",
    "...",
    "> DETECTED ROOT CAUSES:",
    "  ! WARNING: Cortisol Spike (AM)",
    "  ! ALERT: Dopamine deficiency",
    "...",
    "> CALCULATING PROBABILITY...",
    "  Processing... 100%",
    "> RESULT: 87.4% SUCCESS",
    "_",
    "> REBOOTING SYSTEM..."
  ]);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  // Ce qui fait bouger le texte
  useEffect(() => {
    const interval = setInterval(() => {
      setLines(prev => {
        const nextLine = prev[indexRef.current % prev.length];
        indexRef.current++;
        return [...prev.slice(-15), nextLine]; // Garde les 15 dernières lignes
      });
    }, 600); // Vitesse
    return () => clearInterval(interval);
  }, []);

  // Ce qui fait scroller vers le bas
  useEffect(() => {
    if(terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);
// ----------------------------------------

  return (
    <main className="min-h-screen w-full bg-background text-primary selection:bg-accent selection:text-white pb-24">

      {/* Modal Consultation */}
      <CalConsultationModal 
        isOpen={showConsultationModal} 
        onClose={() => setShowConsultationModal(false)} 
      />

      {/* =========================================
          1. HEADER RESPONSIVE avec bouton consultation
          ========================================= */}
      <header className="w-full py-6 md:py-8 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 transition-all duration-300 pointer-events-none">
        
        {/* LOGO ADAPTATIF */}
        <div 
          className="pointer-events-auto cursor-pointer group flex items-center" 
          onClick={() => router.push('/')}
        >
             <Image 
               src="/images/Stryvlab-logo.svg" 
               alt="STRYV lab" 
               width={0}
               height={0}
               sizes="100vw"
               className="
                 w-auto 
                 h-[50px] md:h-[50px] 
                 object-contain 
                 transition-all duration-300 ease-out
                 group-hover:scale-105 group-hover:opacity-90
               "
               priority
             />
        </div>

        {/* NAVIGATION DESKTOP : STYLE "DOCK FLOTTANT" */}
        <nav className="hidden md:flex items-center gap-3 bg-surface p-2 rounded-full shadow-soft-out absolute left-1/2 -translate-x-1/2 pointer-events-auto border border-white/40">
          
          <button 
            onClick={() => router.push('/outils')}
            className="px-6 py-2.5 rounded-full text-sm font-bold tracking-wide text-secondary hover:text-primary hover:bg-surface-light hover:shadow-soft-in transition-all duration-200"
          >
            Outils
          </button>

          <button 
            onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})}
            className="px-6 py-2.5 rounded-full text-sm font-bold tracking-wide text-secondary hover:text-primary hover:bg-surface-light hover:shadow-soft-in transition-all duration-200"
          >
            Protocoles
          </button>
          
        </nav>

        {/* WIDGET DROITE (STATUS + CONSULTATION) */}
        <div className="flex items-center gap-3 pointer-events-auto">
          
          {/* BOUTON CONSULTATION (Desktop) */}
          <button
            onClick={() => setShowConsultationModal(true)}
            className="hidden md:flex items-center gap-2 h-[48px] px-6 bg-accent text-white rounded-btn shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-bold text-sm"
          >
            <Phone size={16} />
            <span>Consultation</span>
          </button>


          {/* BOUTON CONSULTATION (Mobile - Icône seule) */}
          <button
            onClick={() => setShowConsultationModal(true)}
            className="md:hidden w-[42px] h-[42px] bg-accent text-white rounded-btn shadow-lg shadow-accent/30 hover:shadow-accent/50 active:shadow-accent/20 transition-all duration-200 flex items-center justify-center"
          >
            <Phone size={18} />
          </button>
        

          {/* Menu Button */}
          <button className="
            w-[42px] h-[42px] md:w-[48px] md:h-[48px] 
            rounded-btn 
            bg-surface text-secondary 
            shadow-soft-out 
            hover:text-primary hover:-translate-y-0.5
            active:shadow-soft-in active:translate-y-0 active:bg-surface-light
            transition-all duration-200 ease-out
            flex items-center justify-center
          ">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </button>
        </div>
      </header>

      {/* =========================================
          2. HERO SECTION avec CTA consultation
          ========================================= */}
      <section className="relative flex flex-col items-center justify-center pt-12 pb-32 px-6">
        <h1 className="text-center max-w-4xl mx-auto mb-6">
          <span className="block text-4xl md:text-6xl font-medium tracking-tight text-primary leading-[1.1] mb-2">
          Le dernier système<br />que vous utiliserez.
          </span>
        </h1>

        <p className="text-center text-secondary text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-12">
          Le système <strong>GENESIS IPT™</strong> analyse <strong>273 points de données forensiques</strong> pour modéliser le seul protocole mathématiquement viable pour votre biologie.
        </p>

        {/* DOUBLE CTA : Analyse + Consultation */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <div className="w-full">
            <SwipeButton 
              onSuccess={() => setStartIPT(true)} 
              text="INITIALISER L'ANALYSE" 
            />
          </div>
        
        </div>
        
        <p className="mt-4 text-[10px] uppercase tracking-widesthover: text-primary/45">
          Système propriétaire. Pas de coaching standardisé.
        </p>
      </section>

      {/* =========================================
          3. SECTION FORENSIQUE (Design: System Audit Log)
          ========================================= */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <SectionHeader 
          title="Matrice de Détection" 
          subtitle="Notre moteur ne cherche pas à vous motiver. Il audite 15 points de friction biologiques précis pour isoler la cause de l'échec."
          className="mb-12"
        />

        <div className="bg-surface rounded-card shadow-soft-out border border-white/60 overflow-hidden">
          
          {/* Header du Tableau Technique */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-surface-light border-b border-gray-200/50 text-[10px] font-bold text-muted uppercase tracking-widest">
            <div className="col-span-3">Système Biologique</div>
            <div className="col-span-5">Root Causes (Variables bloquantes)</div>
            <div className="col-span-4">Méthode de détection</div>
          </div>

          <div className="divide-y divide-gray-200/50">

            {/* 1. MÉTALBOLISME */}
            <div className="grid md:grid-cols-12 gap-6 px-8 py-8 items-start hover:bg-surface-light/30 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="p-2 bg-orange-100/50 text-orange-600 rounded-lg">
                  <Flame size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">Métabolisme</h4>
                  <span className="text-[10px] text-muted uppercase tracking-wide">Infrastructure Énergétique</span>
                </div>
              </div>
              <div className="col-span-5 space-y-2">
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Résistance à l'insuline :</span> La cellule refuse le nutriment.</p>
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Inflexibilité métabolique :</span> Incapacité à brûler le gras au repos.</p>
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Dysfonction Mitochondriale :</span> Production d'ATP défaillante.</p>
              </div>
              <div className="col-span-4 flex items-center gap-2 text-xs text-muted font-mono bg-surface-light/50 p-2 rounded border border-gray-100">
                <ScanSearch size={14} className="text-accent" />
                Score HOMA-IR (est.) + Glycemic Load Analysis
              </div>
            </div>

            {/* 2. HORMONAL */}
            <div className="grid md:grid-cols-12 gap-6 px-8 py-8 items-start hover:bg-surface-light/30 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="p-2 bg-red-100/50 text-red-600 rounded-lg">
                  <Activity size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">Hormonal (HPA)</h4>
                  <span className="text-[10px] text-muted uppercase tracking-wide">Gestion du Stress</span>
                </div>
              </div>
              <div className="col-span-5 space-y-2">
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Cortisol Chronique :</span> État catabolique permanent (stockage viscéral).</p>
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Fatigue Surrénalienne :</span> Épuisement des catécholamines.</p>
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Déséquilibre Oestrogénique :</span> Rétention d'eau et inflammation.</p>
              </div>
              <div className="col-span-4 flex items-center gap-2 text-xs text-muted font-mono bg-surface-light/50 p-2 rounded border border-gray-100">
                <ScanSearch size={14} className="text-accent" />
                Allostatic Load Index + Cycle Tracking
              </div>
            </div>

            {/* 3. NEUROCHIMIE */}
            <div className="grid md:grid-cols-12 gap-6 px-8 py-8 items-start hover:bg-surface-light/30 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="p-2 bg-purple-100/50 text-purple-600 rounded-lg">
                  <Brain size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">Neurochimie</h4>
                  <span className="text-[10px] text-muted uppercase tracking-wide">Adhérence & Volonté</span>
                </div>
              </div>
              <div className="col-span-5 space-y-2">
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Déficit Dopaminergique :</span> Besoin de récompense immédiate (craving).</p>
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Carence Sérotonine :</span> Instabilité de l'humeur et sommeil haché.</p>
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Profil GABA faible :</span> Anxiété systémique empêchant la récupération.</p>
              </div>
              <div className="col-span-4 flex items-center gap-2 text-xs text-muted font-mono bg-surface-light/50 p-2 rounded border border-gray-100">
                <ScanSearch size={14} className="text-accent" />
                Braverman Assessment Type 2
              </div>
            </div>

            {/* 4. TRAINING & ENV */}
            <div className="grid md:grid-cols-12 gap-6 px-8 py-8 items-start hover:bg-surface-light/30 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="p-2 bg-blue-100/50 text-blue-600 rounded-lg">
                  <Dna size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">Performance</h4>
                  <span className="text-[10px] text-muted uppercase tracking-wide">Stimulus & Récupération</span>
                </div>
              </div>
              <div className="col-span-5 space-y-2">
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Junk Volume :</span> Entraînement excessif sans signal anabolique.</p>
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Dette de Récupération :</span> Le SNC ne suit plus la charge.</p>
                <p className="text-sm text-secondary"><span className="text-primary font-medium">• Friction Environnementale :</span> Complexité logistique trop élevée.</p>
              </div>
              <div className="col-span-4 flex items-center gap-2 text-xs text-muted font-mono bg-surface-light/50 p-2 rounded border border-gray-100">
                <ScanSearch size={14} className="text-accent" />
                MRV Calculation + GSE Score
              </div>
            </div>

          </div>
          
          {/* Footer technique */}
          <div className="bg-surface-light px-8 py-4 border-t border-gray-200/50 flex justify-between items-center">
             <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
               Diagnostic Protocol v2.4
             </span>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-wide">
                  Scanner Actif
                </span>
             </div>
          </div>

        </div>
      </section>

      {/* =========================================
          SECTION 4 : LE MOTEUR ANIMÉ
          ========================================= */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="bg-surface rounded-card p-8 md:p-12 shadow-soft-out border border-white/5 relative overflow-hidden">
          
          {/* Décoration Fond */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* GAUCHE : TEXTE */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-xs font-mono text-accent">ENGINE_STATUS: ONLINE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-medium text-primary mb-6">
                Nous ne devinons pas.<br/>Nous mesurons.
              </h2>
              <p className="text-secondary text-sm leading-relaxed mb-8 max-w-md">
                GENESIS n'est pas un questionnaire. C'est un moteur d'analyse forensique. Il croise votre biologie, votre neurologie et votre environnement.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-background/50 p-4 rounded-lg border border-primary/5">
                    <span className="block text-3xl font-mono text-primary font-bold">273</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted">Data Points</span>
                 </div>
                 <div className="bg-background/50 p-4 rounded-lg border border-primary/5">
                    <span className="block text-3xl font-mono text-primary font-bold">0.57</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted">Coeff. Prédiction (r²)</span>
                 </div>
              </div>
            </div>

            {/* DROITE : ÉCRAN ANIMÉ */}
            <div 
              ref={terminalRef}
              className="bg-[#1a1a1a] p-6 rounded-xl shadow-inner font-mono text-xs text-gray-300 relative overflow-hidden h-72 overflow-y-auto"
            >
               {/* Ligne verte scanner */}
               <div className="absolute top-0 left-0 w-full h-1 bg-accent/50 z-10 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               
               {/* Le Code qui défile */}
               <div className="relative z-0 space-y-1">
                  {lines.map((line, i) => (
                    <div key={i} className={`${line.includes('!') ? 'text-yellow-500' : line.includes('>') ? 'text-accent' : ''}`}>
                      {line}
                    </div>
                  ))}
                  <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse"></span>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          5. TABLEAU COMPARATIF (AUTORITÉ)
          ========================================= */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-32">
        <SectionHeader 
          title="Standards du Marché" 
          subtitle="Coaching Traditionnel vs Ingénierie Forensique."
          align="center"
          className="mb-12"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-muted font-medium w-1/4">Critère</th>
                <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-muted font-medium w-1/3">Coaching Classique</th>
                <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-accent font-bold bg-accent/5 rounded-t-lg w-1/3">
                  STRYV LAB (Genesis)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              
              <tr>
                <td className="py-6 px-6 font-medium text-sm text-primary">Approche</td>
                <td className="py-6 px-6 text-sm text-secondary">Basée sur l'opinion ou l'expérience</td>
                <td className="py-6 px-6 text-sm text-primary font-medium bg-accent/5 border-l-2 border-accent">
                  Data Forensique (273 points)
                </td>
              </tr>

              <tr>
                <td className="py-6 px-6 font-medium text-sm text-primary">Nutrition</td>
                <td className="py-6 px-6 text-sm text-secondary">Macros génériques / Menu fixe</td>
                <td className="py-6 px-6 text-sm text-primary font-medium bg-accent/5 border-l-2 border-accent">
                  Calculée selon Insuline & Neurotype
                </td>
              </tr>

              <tr>
                <td className="py-6 px-6 font-medium text-sm text-primary">Psychologie</td>
                <td className="py-6 px-6 text-sm text-secondary">"Il faut avoir de la volonté"</td>
                <td className="py-6 px-6 text-sm text-primary font-medium bg-accent/5 border-l-2 border-accent">
                  Profilage Neurochimique (Braverman)
                </td>
              </tr>

              <tr>
                <td className="py-6 px-6 font-medium text-sm text-primary">Adaptation</td>
                <td className="py-6 px-6 text-sm text-secondary">Réactive (quand on stagne)</td>
                <td className="py-6 px-6 text-sm text-primary font-medium bg-accent/5 border-l-2 border-accent rounded-b-lg">
                  Prédictive (anticipation de l'échec)
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>

     {/* =========================================
    SECTION LAB OPEN SOURCE (Fixed Dimensions)
    ========================================= */}
<section id="open-lab" className="px-6 md:px-12 py-24 mb-32 bg-background">
  
  <div className="max-w-6xl mx-auto">

    <SectionHeader 
      title="Lab Open Source" 
      subtitle="Accès gratuit aux calculateurs utilisés dans nos protocoles. Ces outils fournissent des métriques isolées."
      className="mb-16"
    />

    {/* AJOUT : 'items-stretch' force les enfants de la grille à avoir la même hauteur */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 items-stretch">
      
      {/* CARTE 1 : BODY FAT */}
      <Link href="/outils/body-fat" className="group h-full">
        <div className="h-full bg-surface rounded-card shadow-soft-out p-8 transition-all duration-300 hover:shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:-translate-y-1 cursor-pointer flex flex-col">
          
          <div className="flex items-center justify-between mb-6">
            <Users size={24} className="text-primary" />
            <span className="text-[9px] font-mono text-muted font-bold uppercase tracking-wider">Open Source</span>
          </div>

          <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">
            Body Fat %
          </h3>

          <p className="text-xs text-secondary leading-relaxed mt-auto">
            Navy Method & Jackson-Pollock
          </p>
        </div>
      </Link>

      {/* CARTE 2 : MACROS */}
      <Link href="/outils/macros" className="group h-full">
        <div className="h-full bg-surface rounded-card shadow-soft-out p-8 transition-all duration-300 hover:shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:-translate-y-1 cursor-pointer flex flex-col">
          
          <div className="flex items-center justify-between mb-6">
            <Activity size={24} className="text-primary" />
            <span className="text-[9px] font-mono text-muted font-bold uppercase tracking-wider">Open Source</span>
          </div>

          <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">
            Kcal & Macros
          </h3>

          <p className="text-xs text-secondary leading-relaxed mt-auto">
            Mifflin-St Jeor + Katch-McArdle
          </p>
        </div>
      </Link>

      {/* CARTE 3 : CYCLE SYNC */}
      <Link href="/outils/cycle-sync" className="group h-full">
        <div className="h-full bg-surface rounded-card shadow-soft-out p-8 transition-all duration-300 hover:shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:-translate-y-1 cursor-pointer flex flex-col">
          
          <div className="flex items-center justify-between mb-6">
            <Moon size={24} className="text-primary" />
            <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-wider">Open Source</span>
          </div>

          <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">
            Cycle Sync
          </h3>

          <p className="text-xs text-secondary leading-relaxed mt-auto">
            Protocole hormonal adaptatif
          </p>
        </div>
      </Link>

      {/* CARTE 4 : TOUS LES OUTILS */}
      <Link href="/outils" className="group h-full">
        <div className="h-full bg-surface rounded-card shadow-soft-out p-8 transition-all duration-300 hover:shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center text-center">
          
          <div className="mb-4 p-3 bg-surface-light rounded-full shadow-soft-in group-hover:scale-110 transition-transform duration-300">
            <ArrowRight size={24} className="text-accent" />
          </div>

          <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">
            Tous les outils
          </h3>

          <p className="text-xs text-secondary leading-relaxed">
            Carb Cycling, HR Zones, 1RM, Hydratation & plus
          </p>
        </div>
      </Link>

    </div>

    <div className="text-center">
      <p className="text-sm text-secondary mb-6 max-w-xl mx-auto">
        Pour un diagnostic forensique complet et un protocole d'intervention : <strong className="text-primary">GENESIS IPT™</strong>
      </p>
      
      <a href="#pricing">
        <Button variant="primary">
          Découvrir GENESIS
        </Button>
      </a>
    </div>

  </div>
</section>

      {/* =========================================
          SECTION CONSULTATION (Avant Pricing)
          ========================================= */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-32">
        <div className="bg-surface rounded-card p-8 md:p-12 shadow-soft-out text-center relative overflow-hidden">
          
          {/* Accent visuel */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-accent rounded-full" />

          <div className="mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">
              Échangez avec un expert STRYV
            </h2>
            <p className="text-sm text-secondary leading-relaxed max-w-lg mx-auto">
              Questions sur GENESIS ? Besoin de conseils ? Nos coachs sont disponibles pour un échange personnalisé gratuit.
            </p>
          </div>

          <button
            onClick={() => setShowConsultationModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-btn shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-200 font-bold text-sm"
          >
            <Phone size={18} />
            <span>Réserver une consultation gratuite</span>
          </button>

          <p className="mt-4 text-xs text-primary/45">
            30 minutes • Visioconférence • Sans engagement
          </p>

        </div>
      </section>

      {/* =========================================
    6. PRICING & PROTOCOLES
    ========================================= */}
<section id="pricing" className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
  <SectionHeader 
    title="Protocoles d'Intervention" 
    subtitle="Cessez de lutter contre votre biologie. Initialisez le système."
    className="mb-12"
  />

  <div className="grid md:grid-cols-3 gap-6">
    
    <Card variant="default" className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-primary mt-1">Rapport IPT™</h3>
      </div>
      <div className="text-3xl font-light text-primary mb-6">
        35€ <span className="text-sm text-muted font-normal">/ one-shot</span>
      </div>
      <ul className="flex-1 space-y-3 mb-8">
        <li className="text-sm text-secondary flex gap-2"><Check size={16} className="text-accent"/>Analyse métabolique complète</li>
        <li className="text-sm text-secondary flex gap-2"><Check size={16} className="text-accent"/>Score de Potentiel & Risques</li>
        <li className="text-sm text-secondary flex gap-2"><Check size={16} className="text-accent"/>Détection Root Causes</li>
      </ul>
      
      <Link href="/checkout/ipt" className="w-full mt-auto">
        <Button variant="secondary" className="w-full">
          Obtenir mon rapport
        </Button>
      </Link>
    </Card>

    <Card variant="default" className="flex flex-col h-full border-2 border-accent/10 relative">
      <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-[12px]">
        SYSTÈME RECOMMANDÉ
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-primary mt-1">Système G+</h3>
      </div>
      <div className="text-3xl font-light text-primary mb-6">
        250€ <span className="text-sm text-muted font-normal">/ 6 sem.</span>
      </div>
      <ul className="flex-1 space-y-3 mb-8">
        <li className="text-sm text-primary font-medium flex gap-2"><Check size={16} className="text-accent"/>Rapport IPT Complet Inclus</li>
        <li className="text-sm text-secondary flex gap-2"><Check size={16} className="text-accent"/>Programmation Neuro-Métabolique</li>
        <li className="text-sm text-secondary flex gap-2"><Check size={16} className="text-accent"/>Ajustements Algorithmiques Hebdo</li>
      </ul>
      
      <Link href="/checkout/gplus" className="w-full mt-auto">
        <Button variant="primary" className="w-full">
          Activer le système
        </Button>
      </Link>
    </Card>

    <Card variant="default" className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-primary mt-1">OMNI Hybrid</h3>
      </div>
      <div className="text-3xl font-light text-primary mb-6">
        800€ <span className="text-sm text-muted font-normal">/ 12 sem.</span>
      </div>
      <ul className="flex-1 space-y-3 mb-8">
        <li className="text-sm text-secondary flex gap-2"><Check size={16} className="text-accent"/>Supervision Biologique Totale</li>
        <li className="text-sm text-secondary flex gap-2"><Check size={16} className="text-accent"/>Ingénierie de l'Hypertrophie</li>
        <li className="text-sm text-secondary flex gap-2"><Check size={16} className="text-accent"/>Canal Privé Chercheur (24/7)</li>
      </ul>
      
      <Link href="/checkout/omni" className="w-full mt-auto">
        <Button variant="secondary" className="w-full">
          Candidater (Admission)
        </Button>
      </Link>
    </Card>

  </div>
</section>


{/* =========================================
          7. FAQ (Compilée & Stratégique)
          ========================================= */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-32">
        <SectionHeader 
          title="Questions Fréquentes" 
          align="center"
          className="mb-12"
        />
        
        <Accordion items={[
           {
            title: "Quelle est la différence entre GENESIS et un programme classique ?",
            content: "Un programme classique vous donne un plan (macros, exercices, répétitions). GENESIS analyse POURQUOI votre système échoue AVANT de vous prescrire quoi que ce soit. Nous mesurons 273 variables métaboliques, hormonales, neurochimiques et psychologiques pour identifier les Root Causes d'échec (résistance insuline, HPA dysfunction, incompatibilité neurotype). Résultat : protocole mathématiquement calibré sur VOTRE biochimie, pas sur une moyenne théorique. Exemple : un déficit de -500kcal peut accélérer la perte de graisse chez un système métaboliquement flexible, mais saboter un profil en HPA dysfonction (cortisol élevé → catabolisme musculaire, fatigue surrénale)."
          },
          {
            title: "Pourquoi l'IPT (Indice de Potentiel de Transformation) est-il si important ?",
            content: "L'IPT prédit votre probabilité de succès AVANT que vous investissiez temps et argent. Score 0-100 calculé sur 5 piliers validés : Métabolique (30%), Infrastructure (25%), Psychologie (20%), Physiologie (15%), Adhérence (10%). Un IPT élevé (>75/100) garantit une progression rapide. Un IPT faible (<50/100) signale des blocages invisibles (ex: résistance insuline non corrigée, charge allostatique excessive, neurochimie incompatible avec restriction). Sans correction préalable, vous perdrez 6-8 semaines à appliquer le mauvais protocole. L'IPT vous dit : 'Voici ce qu'il faut réparer AVANT de commencer'."
          },
          {
            title: "Vous garantissez les résultats ?",
            content: "Non. Nous garantissons une méthodologie forensique, un diagnostic Root Cause validé, et un protocole mathématiquement optimal pour VOTRE système. Les résultats dépendent de VOTRE exécution. Si votre IPT prédit 23% de succès, nous vous le disons AVANT de prendre votre argent. Nous préférons refuser un client que promettre l'impossible. Notre coefficient de prédiction (r²=0.57) signifie que le modèle explique 57% de la variance des résultats (vs 12% pour un simple calcul TDEE). Nous ne vendons pas de rêve, nous appliquons de l'ingénierie sur des systèmes humains."
          },
      
          // ============================================
          // OBJECTIONS ÉCHECS PASSÉS
          // ============================================
          {
            title: "Est-ce que GENESIS fonctionne si j'ai déjà tout essayé sans succès ?",
            content: "C'est précisément notre cible. L'échec répété n'est PAS un problème de volonté, c'est un problème de Root Cause non identifiée. Les protocoles génériques ignorent les blocages métaboliques invisibles (résistance insuline, HPA dysfunction, neurotype incompatible, charge allostatique excessive). GENESIS ne vous donne pas un 17ème régime, il identifie POURQUOI les 16 précédents ont échoué. Exemple : forcer une restriction calorique sur un profil dopaminergique déficient garantit l'abandon à J+21. Nous analysons votre chimie cérébrale (dopamine vs sérotonine) et votre score GSE (General Self-Efficacy) pour calibrer un protocole compatible avec VOTRE capacité d'exécution réelle, pas avec un fantasme de discipline infinie."
          },
      
          // ============================================
          // VALIDATION SCIENTIFIQUE
          // ============================================
          {
            title: "C'est scientifique ou c'est encore du marketing ? Vos chiffres sont-ils vérifiés ?",
            content: "Chaque affirmation GENESIS repose sur des publications validées (PubMed, études cliniques). Les 273 points de données couvrent 5 piliers issus de la recherche en médecine fonctionnelle, endocrinologie et neurosciences comportementales : test Braverman (profil neurochimique), index HOMA-IR (résistance insuline), charge allostatique (axe HPA). Le coefficient r²=0.57 signifie que notre modèle explique 57% de la variance des résultats, mesuré sur nos cohortes internes (50+ clients). Pourquoi 273 variables ? Parce qu'un bilan sanguin standard mesure ~20 marqueurs, un médecin pose ~15 questions. Ignorer les interactions cortisol-sommeil-insuline, c'est programmer l'échec. Sans cette granularité forensique, vous appliquez le mauvais protocole."
          },
      
          // ============================================
          // SPÉCIFICITÉS PUBLICS
          // ============================================
          {
            title: "C'est adapté aux femmes (cycle menstruel, hormones) ?",
            content: "Absolument. Le module Cycle Sync adapte nutrition et entraînement aux 4 phases hormonales (folliculaire, ovulatoire, lutéale, menstruelle). Ignorer la fluctuation œstrogène-progestérone = stagnation programmée. Nos protocoles féminins tiennent compte de la sensibilité insulinique cyclique (pic en phase folliculaire), rétention d'eau lutéale, régulation du cortisol selon les phases. Résultat : progression linéaire malgré les variations hormonales. La majorité des protocoles 'unisexes' sont calibrés sur une physiologie masculine stable → échec garanti chez 60% des femmes après 8 semaines."
          },
          {
            title: "Je suis végétarien/vegan, ça fonctionne ?",
            content: "Oui, avec contraintes. GENESIS adapte les macros selon vos préférences, mais certaines carences (B12, fer héminique, créatine, oméga-3 DHA) devront être corrigées par supplémentation ciblée. Le protocole calculera les combinaisons protéiques optimales (riz + légumineuses, quinoa + noix) et les fenêtres d'absorption pour maximiser la synthèse protéique. Réalité biochimique : un protocole vegan sera 15-20% moins efficient qu'un protocole omnivore à calories égales (biodisponibilité protéique inférieure, densité micronutritionnelle moindre). Faisable, mais progression proportionnelle."
          },
      
          // ============================================
          // LOGISTIQUE & DISCLAIMERS
          // ============================================
          {
            title: "Combien de temps ça prend ? Dois-je aller en salle de sport ? C'est accessible aux débutants ?",
            content: "**Temps requis :** G+ = 3-4 séances (45-60min) + meal prep (2-3h/semaine). OMNI = 4-5 séances (60-75min) + tracking quotidien (10min/jour). GENESIS intègre votre disponibilité réelle dans le calcul d'adhérence. Si vous disposez de <4h/semaine, un protocole full sera contre-productif.\n\n**Salle obligatoire ?** Non, mais recommandé pour G+/OMNI. Adaptable en home training (poids du corps, élastiques, haltères), efficacité moindre (progression métabolique optimale nécessite charge externe contrôlable). Nous calibrons votre MRV (Maximum Recoverable Volume) selon équipement disponible.\n\n**Débutants ?** Oui. Plus vous êtes débutant, plus l'analyse est cruciale pour éviter déficit trop agressif, volume inadapté, attentes irréalistes. Protocole calibré selon VOTRE niveau de départ, pas selon un idéal fantasmé."
          },
          {
            title: "Puis-je faire GENESIS si j'ai des problèmes de santé ? Vous vendez des compléments ?",
            content: "**Santé :** GENESIS n'est PAS un substitut médical. Si diabète, hypertension, troubles thyroïdiens ou pathologie diagnostiquée, consultez votre médecin AVANT. Nous travaillons sur l'optimisation métabolique, pas sur le traitement de maladies. Le rapport IPT peut être partagé avec votre médecin pour validation. GENESIS complète un traitement médical, ne le remplace jamais.\n\n**Compléments :** STRYV LAB ne vend AUCUN complément, shake ou produit. Si le diagnostic révèle des carences probables (vitamine D, magnésium, oméga-3), nous orientons vers marques tierces vérifiées (MyProtein, Nutrimuscle, Bulk) sans commission. Modèle économique basé sur l'expertise, pas sur la vente de poudres. Zéro conflit d'intérêt."
          }
        ]} 
      />
      
      {/* CTA après FAQ */}
      <div className="text-center mt-12 p-8 bg-gradient-to-br from-dark-lighter/30 to-dark-lighter/10 rounded-2xl border border-accent/20">
        <p className="text-neutral-light mb-6 text-lg">
          D'autres questions ? Échangez gratuitement avec un expert STRYV pour valider si GENESIS est adapté à votre situation.
        </p>
        <button
          onClick={() => setShowConsultationModal(true)}
          className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-btn shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-200 font-bold text-sm"
        >
          Réserver une consultation gratuite
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      </section>

      {/* =========================================
          8. FOOTER
          ========================================= */}
      <footer className="mt-32 border-t border-gray-200 pt-12 text-center pb-8">
        <p className="text-[12px] hover:text-primary tracking-wide uppercase mb-4">
          STRYV lab. Le dernier système que vous utiliserez.
        </p>
        <div className="flex justify-center gap-6 text-[11px] text-secondary">
          <a href="/legal" className="hover:text-primary">Mentions Légales</a>
          <a href="/cgv" className="hover:text-primary">CGV</a>
          <span className="hover:text-primary">© 2026 STRYV Lab Genesis</span>
        </div>
      </footer>
      
    </main>
  );
}