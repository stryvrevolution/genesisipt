'use client';

export default function CGVPage() {
  return (
    <main className="relative min-h-screen flex flex-col text-[#E6E6E6]" style={{ fontFamily: 'var(--font-outfit)' }}>
      
      {/* 🎥 BACKGROUND VIDÉO FIXE */}
      <div className="fixed inset-0 z-0">
        <video
          className="w-full h-full object-cover opacity-50"
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[#0E0E0E]/85" />
      </div>
      
      <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 md:px-16 pt-6 sm:pt-7 md:pt-8 flex justify-between items-center bg-gradient-to-b from-[#0E0E0E] to-transparent">
        <a href="/" className="block group">
          <div className="leading-none tracking-wide flex items-baseline gap-[6px] text-white transition-transform duration-200 group-hover:scale-[1.04]">
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

        <a 
          href="/analyse-ipt" 
          className="text-[13px] text-black bg-[#DAFA72] px-5 py-[8px] rounded-full transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98]"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Fermer ✕
        </a>
      </header>

      <section className="relative z-10 flex-1 max-w-3xl mx-auto px-6 pt-40 pb-20">
        <h1 
          className="text-4xl md:text-5xl mb-16 text-white leading-none tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500 }}
        >
          Conditions Générales
        </h1>

        <div className="space-y-16 text-sm md:text-[15px] leading-relaxed text-white/70 font-light backdrop-blur-sm">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#DAFA72] mb-4">01. Objet</div>
            <p>
              Les présentes conditions régissent les services d'analyse et de coaching fournis par STRYV lab. L'utilisation du questionnaire IPT implique l'acceptation sans réserve de ces conditions.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-[#DAFA72] mb-4">02. Nature des prestations</div>
            <p>
              STRYV lab fournit une prestation de conseil et d'analyse. Nous ne remplaçons en aucun cas un avis médical. Avant d'entreprendre toute modification de votre régime alimentaire ou de votre activité physique, il est recommandé de consulter un professionnel de santé.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-[#DAFA72] mb-4">03. Responsabilité</div>
            <p>
              STRYV lab ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation des informations fournies. L'utilisateur reste seul responsable de ses décisions et de sa santé.
            </p>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="relative z-10 bg-[#303030] text-white/40 py-12 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div 
            className="text-[11px] tracking-wide font-light"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            © {new Date().getFullYear()} STRYV lab - Genesis. Tous droits réservés.
          </div>
          
          <div 
            className="flex items-center gap-6 text-[11px] tracking-wide"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            <a href="/mentions-legales" className="hover:text-white transition-colors cursor-pointer">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-white transition-colors cursor-pointer">Confidentialité</a>
            <a href="/cgv" className="hover:text-white transition-colors cursor-pointer">CGV</a>
          </div>
        </div>
      </footer>
    </main>
  );
}