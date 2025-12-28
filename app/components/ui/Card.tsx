import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  const hoverClass = hover ? 'hover:-translate-y-1' : '';
  return (
    <div 
      className={`glass-card rounded-2xl p-6 transition-all ${hoverClass} ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'none',
      }}
    >
      {children}
    </div>
  );
}











