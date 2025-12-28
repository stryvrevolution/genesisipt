import { ReactNode } from 'react';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string | ReactNode;
  className?: string;
}

export function SectionHeader({ label, title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={`section-header ${className}`}>
      {label && <p className="text-label">{label}</p>}
      <h2 className="text-title">{title}</h2>
      {description && (
        <p className="text-body-lg">{description}</p>
      )}
    </div>
  );
}











