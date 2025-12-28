import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  href, 
  onClick, 
  className = '',
  size = 'sm'
}: ButtonProps) {
  const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const sizeClasses = size === 'lg' ? 'px-8 py-4 text-base' : '';
  
  const classes = `${baseClasses} ${sizeClasses} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}











