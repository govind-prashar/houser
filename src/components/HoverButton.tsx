'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HoverButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  iconSize?: number;
}

export default function HoverButton({ href, children, className, iconSize = 16 }: HoverButtonProps) {
  return (
    <Link
      href={href}
      className="inline-block text-xs uppercase tracking-[0.25em] font-medium transition-all duration-500"
      style={{
        padding: '14px 40px',
        border: '1px solid rgba(201,168,76,0.65)',
        color: '#C9A84C',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#C9A84C';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.borderColor = '#C9A84C';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#C9A84C';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.65)';
      }}
    >
      {children}
    </Link>
  );
}
