import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  bg?: 'dark' | 'gradient';
}

export const Section: React.FC<SectionProps> = ({ 
  id, 
  className = '', 
  children,
  bg = 'dark'
}) => {
  // SaaS designs often alternate between solid dark and subtle gradients
  const bgClass = bg === 'dark' 
    ? 'bg-transparent' 
    : 'bg-gradient-to-b from-[#0f172a] to-[#020617]'; 
  
  return (
    <section id={id} className={`py-24 lg:py-32 relative overflow-hidden ${bgClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
};