import Link from 'next/link';
import { ArrowLeft, Activity, Lock, Server } from 'lucide-react';

export const metadata = {
  title: 'Analyse IPT — Initialisation',
  description: 'Le module d’analyse IPT est en cours de déploiement.',
};

export default function AnalyseComingSoon() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen font-outfit text-white">
        
      {/* ================= GAUCHE (Contexte & Branding) ================= */}
      <section className="w-full lg:w-5/12 lg:max-w-[500px] bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] lg:min-h-screen lg:sticky lg:top-0 border-r border-white/5 shadow-2xl z-20">
        
        {/* Décoration d'arrière-plan */}
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <Activity className="w-80 h-80 stroke-[0.5]" />
        </div>

        <div className="relative z-10">
          {/* Bouton Retour */}
          <Link href="/" className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors">
            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au Hub
          </Link>

          {/* En-tête du module */}
          <div className="flex flex-col items-start gap-6 mb-10">
            <div className="flex items-center gap-4">
                {/* Icône IPT (Vert fluo pour différencier du Carb Cycling Orange) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DAFA72] to-[#aebd5b] shadow-[0_0_20px_-5px_rgba(218,250,114,0.4)] flex items-center justify-center text-[#1A1A1A]">
                   <Activity className="w-7 h-7 stroke-[1.5]" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                  Forensic Analysis
                </span>
            </div>
          </div>

          {/* Titre Azonix */}
          {/* Titre Azonix Corrigé */}
          <h1 className="text-white text-4xl md:text-5xl font-azonix uppercase tracking-tighter mb-8 leading-[0.9]">
            Analyse
            <br />
            {/* Conteneur pour IPT + TM */}
            <span className="text-white/40 relative inline-flex items-start">
              IPT
              
              {/* Le TM : Police standard (sans), tout petit, aligné en haut */}
              <span className="text-[10px] md:text-xs text-white/20 font-sans font-medium tracking-normal ml-1 -mt-1 select-none">
                TM
              </span>
            </span>
          </h1>
          <div className="space-y-6 border-t border-white/5 pt-6">
            <div>
              <h2 className="text-white/90 text-base font-bold mb-3 tracking-tight">Potentiel de Transformation</h2>
              <p className="text-white/50 text-[13px] leading-relaxed font-light">
                L'algorithme IPT™ est en cours de calibration finale. Ce module permettra de déterminer votre profil métabolique exact avant toute intervention.
              </p>
            </div>
            
            <div className="text-white/50 text-[13px] leading-relaxed font-light space-y-3">
               <p className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72]"></span>
                 Calcul de la flexibilité métabolique
               </p>
               <p className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72]"></span>
                 Analyse des freins hormonaux
               </p>
               <p className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72]"></span>
                 Score de résilience au stress
               </p>
            </div>
          </div>
        </div>

        {/* Footer Gauche */}
        <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Stryv Lab</p>
          <span className="font-azonix text-xs opacity-30">V1.0</span>
        </div>
      </section>


      {/* ================= DROITE (Zone de "Maintenance") ================= */}
      <section className="flex-1 relative overflow-y-auto py-8 px-4 md:px-8 lg:py-16 bg-[#303030] flex flex-col justify-center">
          <div className="max-w-2xl mx-auto w-full space-y-12">
              
              <div className="border-b border-white/10 pb-6">
                  <h3 className="text-lg font-bold text-white mb-1">État du système</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <p className="text-sm text-orange-400 font-mono font-medium">Déploiement en cours...</p>
                  </div>
              </div>

              {/* CARD: PROGRESSION */}
              <div className="bg-[#252525] border border-white/5 rounded-2xl p-8 space-y-8 relative overflow-hidden">
                  
                  {/* Effet Scanline */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>

                  <div className="relative z-10 text-center space-y-6">
                      <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                          <Server className="w-8 h-8 text-white/40" />
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">Modules en chargement</h4>
                        <p className="text-sm text-white/40 max-w-md mx-auto">
                           L'intégration des données biométriques et le moteur de scoring sont en phase de tests finaux.
                        </p>
                      </div>

                      {/* Barre de progression */}
                      <div className="space-y-2 max-w-sm mx-auto w-full pt-4">
                        <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase">
                            <span>Installation</span>
                            <span>98%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-[#DAFA72] w-[98%] shadow-[0_0_15px_#DAFA72]"></div>
                        </div>
                        
                        {/* Console Log */}
                        <div className="text-[10px] font-mono text-white/20 text-left pt-2 space-y-1 bg-black/20 p-3 rounded-lg border border-white/5 mt-4">
                            <p>&gt; Initializing neural patterns...</p>
                            <p>&gt; Verifying secure payments (Stripe)... <span className="text-[#DAFA72]">OK</span></p>
                            <p>&gt; Loading UI components...</p>
                            <p className="animate-pulse">&gt; Finalizing endpoint connection_</p>
                        </div>
                      </div>
                  </div>
              </div>

              {/* ACTION: RETOUR */}
              <div className="grid grid-cols-1 gap-4">
                 <Link href="/">
                    <button className="w-full py-5 bg-white hover:bg-gray-200 text-[#1A1A1A] rounded-xl font-bold text-sm transition-all active:scale-[0.99] shadow-lg flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Retourner à l'accueil
                    </button>
                 </Link>
                 
                 <div className="p-4 bg-[#252525] border border-white/5 rounded-xl flex items-start gap-3 opacity-60">
                    <Lock className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                    <p className="text-xs text-white/40 leading-relaxed font-medium">
                        Vous serez notifié automatiquement dès l'ouverture publique du protocole IPT.
                    </p>
                 </div>
              </div>

          </div>
      </section>
    </main>
  );
}