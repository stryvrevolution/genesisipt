'use client';

export function Footer() {
  return (
    <footer 
      className="py-8 px-6 md:px-12 lg:px-24 relative"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            className="text-sm"
            style={{
              fontFamily: 'var(--font-deep-tech-body)',
              color: 'var(--gray-500)',
            }}
          >
            © 2025 GENESIS — Forensic Metabolic Coaching
          </p>
          <p 
            className="text-sm font-mono"
            style={{
              fontFamily: 'var(--font-deep-tech-functional)',
              color: 'var(--gray-500)',
            }}
          >
            IPT — Indice de Potentiel de Transformation
          </p>
        </div>
      </div>
    </footer>
  );
}











