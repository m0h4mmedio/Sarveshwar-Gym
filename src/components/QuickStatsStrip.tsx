import React from 'react';
import { Reveal } from './common/Reveal';

interface QuickStat {
  number: string;
  title: string;
  description: string;
}

interface QuickStatsStripProps {
  stats: QuickStat[];
}

export const QuickStatsStrip: React.FC<QuickStatsStripProps> = ({ stats }) => {
  return (
    <section id="stats" className="border-y border-[#263329] bg-[#0c100e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#263329]/60">
          {stats.map((item, idx) => (
            <Reveal
              key={idx}
              delay={idx * 90}
              className={`pt-6 sm:pt-0 ${idx !== 0 ? 'sm:pl-6 lg:pl-8' : ''}`}
            >
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#c5a869] tracking-wider">
                  {item.number} —
                </span>
                <h3 className="font-['Syne'] text-base font-bold tracking-wider uppercase text-[#f2f3ee]">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#95a397] leading-relaxed">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
