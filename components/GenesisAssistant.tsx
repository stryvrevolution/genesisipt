'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, X, RotateCcw } from 'lucide-react'
// -------------------------------------------------------------------------
// 🛑 MODIFICATION POUR MOBILE (CAPACITOR)
// On commente l'import serveur car il empêche le build statique
// import { chatWithGenesis } from '@/app/_actions/genesis'
// -------------------------------------------------------------------------
import { CalendlyButton } from './CalendlyButton'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

interface GenesisAssistantProps {
  onStartIPT?: () => void;
}

export default function GenesisAssistant({ onStartIPT }: GenesisAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('genesis-chat-history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    if (typeof window !== 'undefined') {
      localStorage.setItem('genesis-chat-history', JSON.stringify(messages));
    }
  }, [messages, isOpen, isLoading])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMsg = inputValue.trim()
    setInputValue('')
    setIsLoading(true)

    // 1. Ajout du message utilisateur
    const newHistory = [...messages, { role: 'user', content: userMsg } as Message]
    setMessages(newHistory)

    // ---------------------------------------------------------------------
    // 🛑 LOGIQUE MOBILE (SIMULATION)
    // Au lieu d'appeler le serveur, on simule une réponse locale pour que le build passe.
    
    // Simulation du temps de réponse (1.5 secondes)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Réponse statique pour la démo mobile
    const fakeResponse = "Mode Mobile Autonome : La connexion neuronale (IA) est désactivée sur cette version pour garantir la performance hors-ligne. Veuillez utiliser la version Web pour l'assistant complet.";
    
    setMessages(prev => [...prev, { role: 'assistant', content: fakeResponse }]);
    
    /* --- ANCIEN CODE SERVEUR (Garder pour la version Web plus tard) ---
    const currentPage = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const result = await chatWithGenesis(userMsg, messages, currentPage)
    if (result.success) {
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }])
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur de connexion..." }])
    }
    */
    // ---------------------------------------------------------------------
    
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearHistory = () => {
    if (confirm('Effacer toute la conversation ?')) {
      setMessages([]);
      localStorage.removeItem('genesis-chat-history');
    }
  }

  const renderMessageContent = (content: string) => {
    let cleanContent = content
      .replace('[BOUTON_CALENDLY]', '')
      .replace('[BOUTON_IPT]', '')
      .trim();

    return (
      <div className="flex flex-col gap-3">
        <div className="whitespace-pre-wrap">{cleanContent}</div>
        
        {content.includes('[BOUTON_CALENDLY]') && (
           <CalendlyButton 
             text="RÉSERVER CONSULTATION" 
             className="w-full text-center text-black text-[13px] px-5 py-[10px] rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer font-medium"
           />
        )}

        {content.includes('[BOUTON_IPT]') && onStartIPT && (
           <button 
             onClick={() => {
                setIsOpen(false);
                onStartIPT();
             }}
             className="w-full text-center text-black text-[13px] px-5 py-[10px] rounded-full bg-[#DAFA72] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98] cursor-pointer font-medium"
           >
             DÉMARRER L'ANALYSE IPT
           </button>
        )}
      </div>
    )
  }

  return (
    <>
      {/* BOUTON FLOTTANT */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#DAFA72] rounded-[14px] flex items-center justify-center hover:scale-[1.06] transition-transform cursor-pointer shadow-[0_0_20px_-5px_rgba(218,250,114,0.3)]"
        aria-label="Chat"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#303030">
          <path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H9L5 20V17H5.5C4.67 17 4 16.33 4 15.5V5.5Z" />
        </svg>
      </button>

      {/* MODAL / DRAWER */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-[2px]"
          />

          <aside className="fixed top-0 right-0 w-full sm:w-[420px] h-full bg-[#0E0E0E] z-[60] p-6 flex flex-col border-l border-white/5 shadow-2xl animate-in slide-in-from-right duration-300">
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                 <span className="text-white text-lg font-azonix">GENESIS</span>
                 <span className="text-white/40 text-sm font-outfit">Assistant</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={clearHistory}
                  className="text-white/40 hover:text-white/80 transition-colors"
                  title="Nouvelle conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 border border-white/10 rounded-lg p-4 overflow-auto text-sm space-y-4 bg-[#0E0E0E]">
              
              {messages.length === 0 && !isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                   <Sparkles className="w-8 h-8 text-[#DAFA72] mb-4" />
                   <p className="text-white/60 font-outfit">
                    GENESIS est prêt pour répondre à vos questions.
                   </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={`inline-block max-w-[85%] px-4 py-3 rounded-lg text-[13px] leading-relaxed font-outfit ${
                      msg.role === 'user'
                        ? 'bg-[#DAFA72] text-[#303030]'
                        : 'bg-white/5 text-white/80 border border-white/5'
                    }`}>
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="text-left">
                  <div className="inline-block bg-white/5 text-white/80 px-4 py-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-[#DAFA72] rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                      <div className="w-1 h-1 bg-[#DAFA72] rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
                      <div className="w-1 h-1 bg-[#DAFA72] rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écris ici…"
                disabled={isLoading}
                className="flex-1 bg-[#1A1A1A] text-white/90 px-4 py-3 rounded-lg outline-none border border-white/5 focus:border-[#DAFA72]/30 transition-colors font-outfit placeholder:text-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />

              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-[#DAFA72] text-[#303030] px-4 py-3 rounded-lg hover:scale-[1.03] transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}