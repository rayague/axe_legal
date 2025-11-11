import React from 'react';

type Props = {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
};

export const SectionHeader: React.FC<Props> = ({ badge, title, subtitle, center = true }) => {
  return (
    <div className={`text-${center ? 'center' : 'left'} mb-12 animate-fade-in-up`}>
      {badge && <div className="section-badge inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full mb-4">{badge}</div>}
      <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground mt-3 max-w-3xl mx-auto">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
