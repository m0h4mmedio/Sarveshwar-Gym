import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Dumbbell, Users, Wind } from 'lucide-react';
import { SiteContent } from '../types';
import { Reveal } from './common/Reveal';

interface AboutSectionProps {
  content: SiteContent;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  const { aboutParagraph1, aboutParagraph2 } = content;

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#070908] border-b border-[#263329]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Numbering */}
        <Reveal>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869] mb-4">
            <span>01</span>
            <span aria-hidden="true" className="text-[#263329]">/</span>
            <span>About The Gym</span>
          </div>
        </Reveal>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Real Gym Floor & Equipment Showcase */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Gym Interior Photo */}
            <Reveal direction="up" delay={100}>
              <div className="relative aspect-[16/10] overflow-hidden border border-[#263329] group">
                <img
                  src="/images/gym-interior.jpg"
                  alt="Sarveshwar Fitness Interior Training Floor"
                  className="w-full h-full object-cover filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#f2f3ee] bg-[#070908]/90 backdrop-blur-md px-3 py-2 border border-[#263329]">
                  <span className="font-semibold tracking-wider uppercase text-[11px]">
                    Training Floor · Kurla West
                  </span>
                  <span className="font-mono text-[#c5a869] text-[10px]">
                    100% Climate Controlled
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Dual Gym Action Split */}
            <Reveal direction="up" delay={200}>
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Active Trainer Coaching */}
                <div className="space-y-1.5">
                  <div className="aspect-[4/3] overflow-hidden border border-[#263329] bg-[#070908] relative group">
                    <img
                      src="/images/personal-training.jpg"
                      alt="Floor Coaching in Action"
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070908]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[9px] font-mono tracking-wider uppercase text-[#c5a869] bg-[#070908]/90 px-1.5 py-0.5">
                      Hands-On Coaching
                    </span>
                  </div>
                  <span className="text-[11px] text-[#95a397] block leading-tight">
                    Active trainer spotters &amp; posture correction
                  </span>
                </div>

                {/* Free Weights & Rig */}
                <div className="space-y-1.5">
                  <div className="aspect-[4/3] overflow-hidden border border-[#263329] bg-[#070908] relative group">
                    <img
                      src="/images/gallery-01.jpg"
                      alt="Heavy Dumbbells and Barbell Rig"
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070908]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[9px] font-mono tracking-wider uppercase text-[#c5a869] bg-[#070908]/90 px-1.5 py-0.5">
                      Iron &amp; Racks
                    </span>
                  </div>
                  <span className="text-[11px] text-[#95a397] block leading-tight">
                    Calibrated Olympic plates &amp; dumbbells up to 40kg
                  </span>
                </div>

              </div>
            </Reveal>

          </div>

          {/* Right Column: Editorial Narrative & Gym Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <Reveal direction="up" delay={150}>
              <h2 className="font-['Montserrat'] font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#f2f3ee] tracking-tight leading-[1.12]">
                Built for Real Strength,{' '}
                <span className="text-[#c5a869] block sm:inline">
                  Forged in Kurla West.
                </span>
              </h2>
            </Reveal>

            <Reveal direction="up" delay={250}>
              <p className="text-base sm:text-lg text-[#d8decb] leading-relaxed font-normal">
                {aboutParagraph1}
              </p>
            </Reveal>

            <Reveal direction="up" delay={300}>
              <p className="text-xs sm:text-sm text-[#95a397] leading-relaxed font-normal">
                {aboutParagraph2}
              </p>
            </Reveal>

            {/* Core Values Matrix — Clean, Balanced Credibility */}
            <Reveal direction="up" delay={350}>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#263329]">
                <div className="flex items-start gap-2.5">
                  <Dumbbell className="w-4 h-4 text-[#c5a869] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">Compound Lifting Focus</h4>
                    <p className="text-[11px] text-[#95a397] mt-0.5">Proper squat, bench, and deadlift mechanics over quick shortcuts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Wind className="w-4 h-4 text-[#c5a869] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">100% Climate Controlled</h4>
                    <p className="text-[11px] text-[#95a397] mt-0.5">Full air-conditioning throughout the floor for optimal endurance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#c5a869] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">Disciplined Floor Culture</h4>
                    <p className="text-[11px] text-[#95a397] mt-0.5">Strict zero-nuisance etiquette for uninterrupted training focus.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-[#c5a869] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">Proven Technical Roots</h4>
                    <p className="text-[11px] text-[#95a397] mt-0.5">Coaching methods shaped with insights from state award-winning lifters.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Quick Action Link */}
            <Reveal direction="up" delay={450}>
              <div className="pt-2">
                <a
                  href="#facilities"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c5a869] hover:text-[#dfc993] transition-colors group"
                >
                  <span>Explore Facilities &amp; Floor</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>
              </div>
            </Reveal>

          </div>

        </div>

      </div>
    </section>
  );
};
