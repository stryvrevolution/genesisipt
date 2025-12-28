interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'flat';
  glow?: boolean;
  header?: {
    title?: string;
    subtitle?: string;
    badge?: string;
  };
}

export function Panel({
  children,
  className = '',
  variant = 'default',
  glow = false,
  header,
}: PanelProps) {
  
  const variantStyles = {
    default: `
      bg-white/[0.03]
      backdrop-blur-md
      border border-white/10
      shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    `,
    glass: `
      bg-white/[0.04]
      backdrop-blur-2xl
      border border-white/6
      shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
    `,
    elevated: `
      bg-white/[0.06]
      border border-white/12
      shadow-[0_12px_40px_rgba(0,0,0,0.6)]
    `,
    flat: `
      bg-[#1a1a1a]
      border border-white/8
    `,
  };

  const glowStyles = glow ? `
    shadow-[0_0_40px_rgba(16,185,129,0.15)]
    border-emerald-500/30
  ` : '';

  return (
    <section
      className={`
        rounded-xl
        overflow-hidden
        transition-all duration-300
        ${variantStyles[variant]}
        ${glowStyles}
        ${className}
      `}
    >
      {/* Header optionnel */}
      {header && (
        <div className="px-6 py-4 md:px-8 md:py-5 lg:px-12 lg:py-6 border-b border-white/8">
          <div className="flex items-center justify-between">
            <div>
              {header.title && (
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {header.title}
                </h3>
              )}
              {header.subtitle && (
                <p className="mt-1 text-sm text-white/60">
                  {header.subtitle}
                </p>
              )}
            </div>
            {header.badge && (
              <span className="chip chip-emerald">
                {header.badge}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-8 md:px-8 md:py-10 lg:px-12 lg:py-12">
        {children}
      </div>
    </section>
  );
}