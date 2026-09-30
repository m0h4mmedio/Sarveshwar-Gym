import React from 'react';

interface SectionDividerProps {
  index?: string;
  label?: string;
  tagline?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  index,
  label,
  tagline,
}) => {
  return (
    <div className="relative w-full py-3 sm:py-5 overflow-hidden bg-[#070908]" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left High-Contrast Hairline with Gradient Glow */}
          <div className="flex-1 flex items-center">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#2d3f31] to-[#c5a869]/60" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#c5a869] bg-[#070908] shrink-0 -ml-0.5" />
          </div>

          {/* Central Typographic Separator */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 px-3 sm:px-4 py-1.5 bg-[#0a0f0c] border border-[#263329] shadow-sm select-none">
            {index && (
              <span className="font-mono text-[10px] font-bold text-[#c5a869] tracking-wider">
                {index}
              </span>
            )}
            {index && label && (
              <span className="w-1 h-1 rounded-full bg-[#3d5341]" />
            )}
            {label && (
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#f2f3ee] font-semibold">
                {label}
              </span>
            )}
            {tagline && (
              <>
                <span className="hidden md:inline w-1 h-1 rounded-full bg-[#3d5341]" />
                <span className="hidden md:inline font-mono text-[9px] tracking-widest uppercase text-[#95a397]">
                  {tagline}
                </span>
              </>
            )}
          </div>

          {/* Right High-Contrast Hairline with Gradient Glow */}
          <div className="flex-1 flex items-center">
            <div className="w-1.5 h-1.5 rotate-45 border border-[#c5a869] bg-[#070908] shrink-0 -mr-0.5" />
            <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#2d3f31] to-[#c5a869]/60" />
          </div>

        </div>
      </div>
    </div>
  );
};
