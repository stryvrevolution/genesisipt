'use client';

export default function MentionsLegalesPage() {
  return (
    <main className="relative min-h-screen flex flex-col text-[#E6E6E6]" style={{ fontFamily: 'var(--font-outfit)' }}>
      
      {/* 🎥 BACKGROUND VIDÉO FIXE (Même source que la Landing) */}
      <div className="fixed inset-0 z-0">
        <video
          className="w-full h-full object-cover opacity-50"
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay sombre pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-[#0E0E0E]/85" />
      </div>

      {/* HEADER (z-50 pour passer au-dessus de la vidéo) */}
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

      {/* CONTENU (z-10 relative pour passer au-dessus du fond) */}
      <section className="relative z-10 flex-1 max-w-3xl mx-auto px-6 pt-40 pb-20">
        <h1 
          className="text-4xl md:text-5xl mb-16 text-white leading-none tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500 }}
        >
          Mentions Légales
        </h1>

        <div className="space-y-16 text-sm md:text-[15px] leading-relaxed text-white/70 font-light backdrop-blur-sm">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#DAFA72] mb-4">01. Éditeur</div>
            <p>
              Le site STRYV lab est édité par [NOM DE VOTRE SOCIÉTÉ], [FORME JURIDIQUE] au capital de [MONTANT] €, immatriculée au Registre du Commerce et des Sociétés de [VILLE] sous le numéro [NUMÉRO SIREN].
              <br /><br />
              <span className="text-white">Siège social :</span> [VOTRE ADRESSE]<br />
              <span className="text-white">Email :</span> [VOTRE EMAIL]<br />
              <span className="text-white">Directeur de la publication :</span> [VOTRE NOM]
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-[#DAFA72] mb-4">02. Hébergement</div>
            <p>
              Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-[#DAFA72] mb-4">03. Propriété Intellectuelle</div>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
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