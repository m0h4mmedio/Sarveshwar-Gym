import React from 'react';
import { Facility } from '../types';
import { ShieldCheck, HeartHandshake, Dumbbell, Sparkles, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { Reveal } from './common/Reveal';

interface FacilitiesSectionProps {
  facilities: Facility[];
  whatsapp?: string;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  facilities,
  whatsapp = '918433650068',
}) => {
  const ladiesWaUrl = getWhatsAppUrl(
    whatsapp,
    "Hi Sarveshwar Fitness, I would like to enquire about the Ladies Special Hours (1:00 PM - 4:00 PM) and gym membership."
  );

  return (
    <section id="facilities" className="py-20 lg:py-28 bg-[#0a0d0b] border-b border-[#263329]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869] mb-3">
                <span>02</span>
                <span aria-hidden="true" className="text-[#263329]">/</span>
                <span>Facilities & Floor</span>
              </div>
              <h2 className="font-['Montserrat'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#f2f3ee] tracking-tight leading-[1.12]">
                Engineered for Progression,{' '}
                <span className="text-[#c5a869] font-bold block sm:inline">
                  Built for Heavy Iron.
                </span>
              </h2>
            </div>
            <p className="mt-4 md:mt-0 text-sm text-[#95a397] max-w-md font-normal leading-relaxed">
              Every square foot is calibrated for biomechanical efficiency, progressive overload, hygiene, and athletic safety.
            </p>
          </div>
        </Reveal>

        {/* Dynamic Bento Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {facilities.map((facility, index) => (
            <Reveal key={facility.id || index} delay={index * 80}>
              <div className="group relative h-96 overflow-hidden border border-[#263329] bg-[#101411] flex flex-col justify-end p-6 transition-all duration-500 hover:border-[#c5a869]/50 hover:shadow-xl hover:shadow-[#0c140f]">
                {/* Background Imagery with smooth hover zoom */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.08] transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-[0.78]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-[#070908]/70 to-[#070908]/20" />
                </div>

                {/* Tag / Index */}
                <div className="relative z-10 mb-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#c5a869] bg-[#070908]/85 backdrop-blur-sm px-2.5 py-1 border border-[#263329]">
                      {facility.tag || `0${index + 1}`}
                    </span>
                    <span className="text-xs font-mono text-[#95a397] opacity-60">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Content block */}
                <div className="relative z-10 pt-4">
                  <h3 className="font-['Syne'] font-extrabold text-xl text-[#f2f3ee] uppercase tracking-wide group-hover:text-[#c5a869] transition-colors duration-200">
                    {facility.title}
                  </h3>
                  <p className="text-xs text-[#c4cebf] mt-2 leading-relaxed">
                    {facility.description}
                  </p>
                </div>

                {/* Subtle accent border bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-[#c5a869] transition-colors duration-300" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* --- LADIES SPECIAL HOURS FEATURE SPOTLIGHT IN SECTION 02 --- */}
        <Reveal delay={150}>
          <div className="relative overflow-hidden border border-[#c5a869]/60 bg-gradient-to-b from-[#131b15] to-[#0c120e] p-6 sm:p-8 lg:p-10 shadow-2xl">
            {/* Subtle decorative ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a869]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Column: Photographic Showcase */}
              <div className="lg:col-span-6 space-y-3">
                <div className="relative aspect-[16/10] overflow-hidden border border-[#263329] group">
                  <img
                    src="/images/ladies-special-hours.jpg"
                    alt="Women training comfortably during Ladies Special Hours at Sarveshwar Fitness"
                    className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-transparent to-transparent opacity-65" />
                  
                  {/* Floating Top Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#070908]/90 backdrop-blur-md px-3 py-1 border border-[#c5a869]/40 text-[#c5a869]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                      100% Women-Only Floor
                    </span>
                  </div>

                  {/* Official Sarveshwar Gym Crest Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#070908]/90 backdrop-blur-md px-2.5 py-1 border border-[#263329]">
                    <img src="/logo.png" alt="Sarveshwar Fitness" className="w-4 h-4 object-contain" />
                    <span className="font-['Syne'] text-[10px] font-bold text-[#f2f3ee] uppercase tracking-wider">
                      Sarveshwar <span className="text-[#c5a869]">Gym</span>
                    </span>
                  </div>

                  {/* Floating Bottom Bar */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#070908]/90 backdrop-blur-md p-3 border border-[#263329] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#c5a869]" />
                      <span className="font-['Syne'] text-xs sm:text-sm font-bold text-[#f2f3ee] uppercase">
                        1:00 PM — 4:00 PM Daily
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-[#95a397]">
                      Mon through Sat
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#95a397] px-1">
                  <span>Safe · Air-Conditioned · Completely Private</span>
                  <span className="text-[#c5a869]">Kurla West, Mumbai</span>
                </div>
              </div>

              {/* Right Column: Narrative & Comfort Pillars */}
              <div className="lg:col-span-6 space-y-5">
                
                <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869]">
                  <span>Dedicated Program</span>
                  <span aria-hidden="true" className="text-[#263329]">·</span>
                  <span>Ladies Special Hours</span>
                </div>

                <h3 className="font-['Montserrat'] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#f2f3ee] tracking-tight leading-[1.15]">
                  Train With Absolute Comfort,{' '}
                  <span className="text-[#c5a869] font-bold block sm:inline">
                    Zero Distractions.
                  </span>
                </h3>

                <p className="text-xs sm:text-sm text-[#c4cebf] leading-relaxed">
                  Our dedicated afternoon window is reserved <strong className="text-[#f2f3ee]">exclusively for women and girls</strong> so you can focus 100% on your fitness, strength, and health without hesitation or self-consciousness.
                </p>

                {/* 3 Pillars of Female Comfort */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-[#162119] border border-[#263329] flex items-center justify-center shrink-0 mt-0.5 text-[#c5a869]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">
                        100% Exclusive Floor Privacy
                      </h4>
                      <p className="text-[11px] text-[#95a397] mt-0.5">
                        Zero male members or visitors are permitted onto the gym floor during 1:00 PM – 4:00 PM. Total privacy is rigorously enforced.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-[#162119] border border-[#263329] flex items-center justify-center shrink-0 mt-0.5 text-[#c5a869]">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">
                        Full Equipment Freedom
                      </h4>
                      <p className="text-[11px] text-[#95a397] mt-0.5">
                        Unrestricted access to all dumbbells, barbells, squat racks, cable stations, and treadmills without waiting or feeling rushed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-[#162119] border border-[#263329] flex items-center justify-center shrink-0 mt-0.5 text-[#c5a869]">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">
                        Welcoming & Respectful Guidance
                      </h4>
                      <p className="text-[11px] text-[#95a397] mt-0.5">
                        Whether you are starting out with fat loss, posture toning, or building strength, our trainers guide you step-by-step with proper form.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Differentiated Call-to-Action Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={ladiesWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#070908] bg-[#25d366] hover:bg-[#20ba5a] transition-all shadow-md shadow-[#25d366]/20 text-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#070908] animate-ping" />
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Women&apos;s Desk</span>
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 text-xs font-semibold tracking-wider text-[#f2f3ee] bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-[#c5a869]/70 backdrop-blur-sm transition-all text-center group"
                  >
                    <span>Visit Gym Floor</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </div>

              </div>

            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
