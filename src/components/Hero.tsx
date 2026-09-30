import React, { useState, useEffect } from 'react';
import { ArrowDown, ChevronRight, ShieldCheck, Wind, Dumbbell } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { MagneticButton } from './common/MagneticButton';

interface HeroProps {
  headline: string;
  subhead: string;
  whatsapp: string;
}

export const Hero: React.FC<HeroProps> = ({ subhead, whatsapp }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waUrl = getWhatsAppUrl(
    whatsapp,
    "Hi Sarveshwar Fitness, I would like to join the gym in Kurla West. Please share membership details."
  );

  // Gentle parallax calculation capped for smooth performance
  const bgTranslateY = Math.min(180, scrollY * 0.22);
  const heroOpacity = Math.max(0, 1 - scrollY / 700);

  return (
    <section className="relative min-h-[92vh] sm:min-h-[95vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-28 pb-16">
      
      {/* Background AI-Generated Luxury Gym Image with Measured Parallax & Scrim */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${bgTranslateY}px, 0)`,
        }}
      >
        <img
          src="/images/hero-ai.jpg"
          alt="Sarveshwar Fitness Training Floor"
          className="w-full h-full object-cover object-center animate-hero-reveal filter brightness-[0.72] contrast-[1.12]"
          loading="eager"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/gym-hero.jpg';
          }}
        />
        {/* Measured dark scrims for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-[#070908]/75 to-[#070908]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070908]/92 via-[#070908]/55 to-transparent" />
        <div className="absolute inset-0 bg-[#0c2214]/20 mix-blend-multiply" />
      </div>

      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        style={{ opacity: heroOpacity }}
      >
        <div className="max-w-3xl">
          
          {/* Staggered Element 1: Location & Heritage Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-[#c5a869] mb-4 animate-fade-up [animation-delay:150ms]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a869]" />
            <span>Kurla West, Mumbai 400070</span>
            <span aria-hidden="true" className="text-[#263329]">·</span>
            <span>Disciplined Fitness</span>
          </div>

          {/* Staggered Element 2: Athletic Display Headline */}
          <h1 className="font-['Montserrat'] font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-[#f2f3ee] leading-[1.02] uppercase mb-5 sm:mb-6 drop-shadow-md">
            <span className="block overflow-hidden">
              <span className="block animate-fade-up [animation-delay:250ms]">
                Train Hard.
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="block animate-fade-up [animation-delay:400ms] text-transparent bg-clip-text bg-gradient-to-r from-[#f2f3ee] via-[#e6e8df] to-[#c5a869]">
                Stay Disciplined.
              </span>
            </span>
          </h1>

          {/* Staggered Element 3: Subheading */}
          <p className="text-sm sm:text-base lg:text-lg text-[#c4cebf] font-normal leading-relaxed max-w-2xl mb-8 animate-fade-up [animation-delay:550ms]">
            {subhead}
          </p>

          {/* Staggered Element 4: Desktop Magnetic CTA & Secondary Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-10 sm:mb-12 animate-fade-up [animation-delay:700ms]">
            <MagneticButton
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#070908] bg-gradient-to-r from-[#dfc993] via-[#c5a869] to-[#b39556] hover:from-[#f0deb3] hover:via-[#dfc993] hover:to-[#c5a869] transition-all duration-300 shadow-[0_8px_25px_rgba(197,168,105,0.28),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_12px_32px_rgba(197,168,105,0.4)] active:scale-[0.98] group text-center"
            >
              <span>Join Sarveshwar Fitness</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </MagneticButton>

            <a
              href="#memberships"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-4 text-xs sm:text-sm font-semibold tracking-wider text-[#f2f3ee] bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 hover:border-[#c5a869]/70 backdrop-blur-md transition-all duration-200 text-center group"
            >
              <span>Explore Memberships</span>
              <span className="text-[#c5a869] transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
          </div>

          {/* Staggered Element 5: Concrete Anchors */}
          <div className="pt-6 border-t border-[#263329]/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-xl text-left animate-fade-up [animation-delay:600ms]">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869] shrink-0" />
              <div className="text-xs font-mono tracking-wider uppercase text-[#c4cebf]">
                Kurla West, Mumbai
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869] shrink-0" />
              <div className="text-xs font-mono tracking-wider uppercase text-[#c4cebf]">
                Est. 2017 · 8+ Years
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869] shrink-0" />
              <div className="text-xs font-mono tracking-wider uppercase text-[#c4cebf]">
                Open 6 AM — 11 PM
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <a
        href="#stats"
        className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center text-[#95a397] hover:text-[#c5a869] transition-colors group"
        aria-label="Scroll down to content"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest mb-1 group-hover:tracking-wider transition-all">Scroll</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:text-[#c5a869]" />
      </a>
    </section>
  );
};
