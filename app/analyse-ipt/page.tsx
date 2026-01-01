'use client';

import { useState, useEffect, useRef } from 'react';
// 👇 C'est propre maintenant : @/components/...
import { IPTQuestionnaire } from '@/components/genesis/IPTQuestionnaire';
import { CalendlyButton } from '@/components/CalendlyButton';

export default function AnalyseIPTPage() {
  const [startIPT, setStartIPT] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // NOUVEAU : État pour le chargement Stripe
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('genesis-chat-history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [scenario, setScenario] = useState<string | null>(null);

  // NOUVEAU : Fonction de paiement Stripe
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

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: chatInput },
    ]);

    const currentMessage = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/genesis-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          history: messages,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Aucune réponse.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Erreur de communication.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('genesis-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

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

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            "Bonjour. Je suis GENESIS.\n\nJe peux t'aider à comprendre le système, répondre à tes questions ou t'accompagner pendant l'analyse IPT.\n\nÉcris-moi simplement ce dont tu as besoin.",
        },
      ]);
    }
  }, [chatOpen]);

  return (
    <main className="relative bg-bg text-text overflow-hidden">

      {/* HEADER - z-50 pour être sûr d'être au-dessus de tout */}
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
            <button className="hidden sm:inline-flex text-white text-[13px] px-5 py-[8px] rounded-full bg-[#303030] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer">
              À propos
            </button>

            {/* Bouton Calendly Header */}
            <CalendlyButton
              text="Consultation"
              className="text-black text-[13px] px-5 py-[8px] rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
            />
          </div>
        </div>
      </header>

      <section className="relative min-h-screen overflow-hidden">
        {/* Background Vidéo - z-0 et pointer-events-none OBLIGATOIRE */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-85 z-0 pointer-events-none"
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        
        {/* Overlay sombre - z-0 et pointer-events-none OBLIGATOIRE */}
        <div className="absolute inset-0 bg-[#303030]/75 z-0 pointer-events-none" />

        {/* Contenu Hero - z-20 pour passer au-dessus de la vidéo (z-0) */}
        <div className="relative z-20 min-h-screen flex items-center px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="max-w-5xl">
            <h1 className="text-white font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(3.8rem,7vw,9.5rem)]">
              Built
              <br />
              Different
            </h1>

            <p className="mt-6 text-white/70 text-sm max-w-xl">
              Système d'évaluation structuré destiné à analyser
              les paramètres influençant le potentiel de transformation
              individuelle.
            </p>

            <button
              onClick={() => setStartIPT(true)}
              className="mt-10 inline-flex items-center text-black text-[13px] px-6 py-[10px] rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
            >
              Démarrer l'évaluation
            </button>
          </div>
        </div>
      </section>

      {/* Bouton Chat Flottant - z-50 */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#DAFA72] rounded-[14px] flex items-center justify-center hover:scale-[1.06] transition-transform cursor-pointer"
        aria-label="Chat"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#303030">
          <path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H9L5 20V17H5.5C4.67 17 4 16.33 4 15.5V5.5Z" />
        </svg>
      </button>

      {/* Modal Chat */}
      {chatOpen && (
        <>
          <div
            onClick={() => {
              setChatOpen(false);
              setScenario(null);
              setChatInput('');
            }}
            className="fixed inset-0 bg-black/40 z-[55]"
          />

          <aside className="fixed top-0 right-0 w-full sm:w-[420px] h-full bg-[#0E0E0E] z-[60] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-lg">GENESIS Assistant</h3>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (confirm('Effacer toute la conversation ?')) {
                      setMessages([]);
                      localStorage.removeItem('genesis-chat-history');
                    }
                  }}
                  className="text-white/40 hover:text-white/80 text-xs cursor-pointer"
                  title="Nouvelle conversation"
                >
                  🔄
                </button>
                
                <button
                  onClick={() => {
                    setChatOpen(false);
                    setScenario(null);
                    setChatInput('');
                  }}
                  className="text-white/60 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 border border-white/10 rounded-lg p-4 overflow-auto text-sm space-y-3">
              {messages.length === 0 && !chatLoading && (
                <span className="text-white/40">
                  GENESIS est prêt. Écris ton message.
                </span>
              )}

              {messages.map((msg, index) => {
                const content = msg.content;
                const hasCalendly = content.includes('[BOUTON_CALENDLY]');
                const hasIPT = content.includes('[BOUTON_IPT]');
                
                let cleanContent = content
                  .replace('[BOUTON_CALENDLY]', '')
                  .replace('[BOUTON_IPT]', '')
                  .trim();

                return (
                  <div
                    key={index}
                    className={msg.role === 'user' ? 'text-right' : 'text-left'}
                  >
                    <div
                      className={`inline-block max-w-[85%] px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-[#DAFA72] text-[#303030]'
                          : 'bg-white/5 text-white/80'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{cleanContent}</div>
                      
                      {hasCalendly && msg.role === 'assistant' && (
                        <CalendlyButton
                          text="Réserver une consultation"
                          className="mt-3 w-full text-center text-black text-[13px] px-5 py-[10px] rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
                        />
                      )}

                      {hasIPT && msg.role === 'assistant' && (
                        <button
                          onClick={() => setStartIPT(true)}
                          className="mt-3 w-full text-center text-black text-[13px] px-5 py-[10px] rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
                        >
                          Démarrer l'IPT
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="text-left">
                  <div className="inline-block bg-white/5 text-white/60 px-4 py-2 rounded-lg">
                    <span className="typing-dots">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Écris ici…"
                className="flex-1 bg-[#1A1A1A] text-white/90 px-4 py-3 rounded-lg outline-none"
              />

              <button
                onClick={sendChat}
                disabled={chatLoading}
                className="bg-[#DAFA72] text-[#303030] px-4 py-3 rounded-lg hover:scale-[1.03] transition-transform disabled:opacity-50 cursor-pointer"
              >
                →
              </button>
            </div>
          </aside>
        </>
      )}

      <section className="section-soft px-8 md:px-16 lg:px-24 py-32">
        <div className="max-w-5xl">
          <div className="label mb-8">Principe</div>
          <h2 className="h2 mb-12">
            Comprendre avant
            <br />
            d'intervenir
          </h2>
          <p className="text-body max-w-3xl">
            GENESIS ne propose ni programme standard,
            ni promesse esthétique immédiate.
            <br /><br />
            Le système vise à établir une lecture
            claire des contraintes individuelles
            avant toute décision d'intervention.
          </p>
        </div>
      </section>

      <section className="px-8 md:px-16 lg:px-24 py-32">
        <div className="max-w-6xl grid md:grid-cols-3 gap-16">
          <div>
            <div className="label mb-4">01</div>
            <p className="text-body">
              Collecte de données déclaratives
              structurées.
            </p>
          </div>
          <div>
            <div className="label mb-4">02</div>
            <p className="text-body">
              Analyse croisée des facteurs
              métaboliques, comportementaux
              et contextuels.
            </p>
          </div>
          <div>
            <div className="label mb-4">03</div>
            <p className="text-body">
              Identification des leviers
              réellement exploitables.
            </p>
          </div>
        </div>
      </section>

      <section className="section-soft px-8 md:px-16 lg:px-24 py-32">
        <div className="max-w-5xl">
          <div className="label mb-8">IPT</div>
          <h2 className="h2 mb-12">
            Index de Potentiel
            <br />
            de Transformation
          </h2>
          <p className="text-body max-w-3xl">
            L'IPT est un indicateur synthétique
            permettant d'estimer la capacité
            réelle d'un individu à progresser
            dans un cadre structuré.
          </p>
        </div>
      </section>

      <section className="px-8 md:px-16 lg:px-24 py-32">
        <div className="max-w-6xl grid md:grid-cols-2 gap-20">
          <div>
            <div className="label mb-6">Pour qui</div>
            <p className="text-body">
              Personnes ayant déjà tenté plusieurs
              approches sans résultat durable.
              <br /><br />
              Profils souhaitant comprendre
              avant d'agir.
            </p>
          </div>
          <div>
            <div className="label mb-6">Ce que GENESIS n'est pas</div>
            <p className="text-body">
              Un programme miracle.
              <br />
              Une méthode rapide.
              <br />
              Une promesse esthétique.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#303030]px-12 md:px-30 lg:px-24 py-24">
        <div
          ref={ctaRef}
          className={`
            max-w-8xl mx-auto
            bg-[#DAFA72]
            rounded-2xl
            px-8
            py-6
            flex
            items-center
            justify-between
            transition-all
            duration-700
            ease-out
            ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 rounded-full bg-[#303030] mt-1" />
            <p className="text-[#303030] text-sm max-w-md">
              Prêt à analyser votre potentiel de transformation ?
              <br />
              Initiez une évaluation structurée dès maintenant.
            </p>
          </div>

          <button
            onClick={() => setStartIPT(true)}
            className="bg-[#303030] text-white text-sm px-6 py-3 rounded-full transition-transform duration-200 hover:scale-[1.05] active:scale-[0.97] cursor-pointer"
          >
            Démarrer l'analyse
          </button>
        </div>
      </section>

      {/* SECTION PROTOCOLES - COHÉRENCE BRANDING (PURE STRYV) */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-24 py-32 border-t">
        <div className="max-w-7xl mx-auto">
          
          {/* TITRE DE SECTION */}
          <div className="mb-20">
          <div className="label mb-6">Solutions</div>
            <h2 className="text-[#6D6D6D] font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(2.8rem,6vw,5.5rem)] mb-16">
              Nos
              <br />
              Services
            </h2>
            <div className="text-[#303030] label mb-6 text-body"></div>
              Une architecture de services conçue pour s'adapter à votre niveau d'exigence. 
              <br />
              Du diagnostic ponctuel à l'accompagnement d'élite.
            
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* 1. RAPPORT IPT */}
            <div className="flex flex-col p-8 rounded-[24px] bg-[#303030] border border-white/5 hover:border-white/20 transition-colors duration-300">
              <div className="mb-8">
                <h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'var(--font-azonix)' }}>
                  RAPPORT IPT
                </h3>
                <span className="text-white/40 text-[11px] uppercase tracking-wider font-light">Analyse One-Shot</span>
              </div>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl text-white font-light" style={{ fontFamily: 'var(--font-outfit)' }}>35€</span>
              </div>

              <div className="w-full h-[1px] bg-white/10 mb-8" />

              <ul className="flex-1 space-y-4 text-[14px] text-white/70 font-light mb-10" style={{ fontFamily: 'var(--font-outfit)' }}>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Analyse métabolique complète
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Identification des freins
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Score de potentiel (0-100)
                </li>
              </ul>
              <button
                onClick={() => setStartIPT(true)}
                className="w-full py-3 rounded-full border border-white/20 text-white text-[13px] hover:bg-white hover:text-black transition-all duration-300"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Lancer l'analyse
              </button>
            </div>

            {/* 2. G+ - LE STANDARD (STRIPE INTEGRATED) */}
            <div className="flex flex-col p-8 rounded-[24px] bg-[#303030] border border-white/5 hover:border-[#DAFA72]/50 transition-colors duration-300">
              <div className="mb-8">
                <h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'var(--font-azonix)' }}>
                  PROTOCOL G+
                </h3>
                <span className="text-white/40 text-[11px] uppercase tracking-wider font-light">Protocole Hybride</span>
              </div>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl text-white font-light" style={{ fontFamily: 'var(--font-outfit)' }}>175€</span>
                <span className="text-white/40 text-xs font-light">/ 6 semaines</span>
              </div>

              <div className="w-full h-[1px] bg-white/10 mb-8" />

              <ul className="flex-1 space-y-4 text-[14px] text-white/70 font-light mb-10" style={{ fontFamily: 'var(--font-outfit)' }}>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Programmation sur-mesure
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Ajustements bimensuels
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Autonomie guidée
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  Accès application privée
                </li>
              </ul>

              {/* BOUTON STRIPE G+ */}
              <button
                onClick={handleStripePayment}
                disabled={isStripeLoading}
                className={`w-full py-3 rounded-full border border-white/20 text-[13px] transition-all duration-300 flex justify-center items-center gap-2
                  ${isStripeLoading 
                    ? 'bg-white/10 text-white/50 cursor-wait' 
                    : 'text-white hover:bg-[#DAFA72] hover:text-black hover:border-[#DAFA72]'
                  }`}
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {isStripeLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    Redirection...
                  </>
                ) : (
                  "Démarrer"
                )}
              </button>
            </div>

            {/* 3. OMNI - L'OFFRE SIGNATURE */}
            <div className="relative flex flex-col p-8 rounded-[24px] bg-[#303030] border border-[#DAFA72] shadow-[0_0_30px_-10px_rgba(218,250,114,0.1)]">
              {/* Badge aligné à droite */}
              <div className="absolute top-8 right-8">
                <span className="text-[#DAFA72] text-[10px] font-bold tracking-widest uppercase">Elite</span>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'var(--font-azonix)' }}>
                  OMNI
                </h3>
                <span className="text-[#DAFA72] text-[11px] uppercase tracking-wider font-light">Immersion Totale</span>
              </div>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl text-white font-light" style={{ fontFamily: 'var(--font-outfit)' }}>650€</span>
                <span className="text-white/40 text-xs font-light">/ 12 semaines</span>
              </div>

              <div className="w-full h-[1px] bg-[#DAFA72]/20 mb-8" />

              <ul className="flex-1 space-y-4 text-[14px] text-white/90 font-light mb-10" style={{ fontFamily: 'var(--font-outfit)' }}>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72] shadow-[0_0_10px_#DAFA72]" />
                  Suivi WhatsApp 7j/7
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72] shadow-[0_0_10px_#DAFA72]" />
                  Analyses biologiques
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72] shadow-[0_0_10px_#DAFA72]" />
                  Ingénierie du sommeil
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72] shadow-[0_0_10px_#DAFA72]" />
                  Optimisation environnement
                </li>
              </ul>

              <CalendlyButton
                text="Entretien d'admission"
                className="w-full py-3 rounded-full bg-[#DAFA72] text-black text-[13px] font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              />
            </div>

          </div>
        </div>
      </section>


      {/* SECTION FINALE - Correction du Background pour fusionner avec le haut */}
      <section className="bg-[#303030] px-8 md:px-16 lg:px-24 py-40">
        <div className="max-w-4xl">
          <h2 className="text-[#6D6D6D] font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(2.8rem,6vw,5.5rem)] mb-16">
            Commencer
            <br />
            par l'analyse
          </h2>

          <button
            onClick={() => setStartIPT(true)}
            className="inline-flex items-center text-black text-[13px] px-6 py-[10px] rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
          >
            Initialiser l'IPT
          </button>
        </div>
      </section>

      {/* FOOTER MINIMALISTE */}
      <footer className="relative z-10 bg-[#303030] text-white/40 py-12 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[11px] tracking-wide font-light">
            © {new Date().getFullYear()} STRYV lab - Genesis. Tous droits réservés.
          </div>
          
          <div className="flex items-center gap-6 text-[11px] tracking-wide">
            <a href="/mentions-legales" className="hover:text-white transition-colors cursor-pointer">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-white transition-colors cursor-pointer">Confidentialité</a>
            <a href="/cgv" className="hover:text-white transition-colors cursor-pointer">CGV</a>
          </div>
        </div>
      </footer>

      {/* Modal IPT - z-[70] au-dessus de tout */}
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
// Forcer le deploiement Vercel