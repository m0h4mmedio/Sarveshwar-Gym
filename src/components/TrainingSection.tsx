import React from 'react';
import { Target, Activity, Flame, ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { Reveal } from './common/Reveal';

interface TrainingSectionProps {
  whatsapp: string;
}

export const TrainingSection: React.FC<TrainingSectionProps> = ({ whatsapp }) => {
  const ptWaUrl = getWhatsAppUrl(
    whatsapp,
    "Hi Sarveshwar Fitness, I would like to enquire about Personal Training sessions and trainer availability."
  );

  return (
    <section id="training" className="py-20 lg:py-28 bg-[#0a0d0b] border-b border-[#263329]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic PT Photography */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Reveal direction="up">
              <div className="relative aspect-[4/3] overflow-hidden border border-[#263329] group">
                <img
                  src="/images/personal-training.jpg"
                  alt="Personal Training Coaching at Sarveshwar Fitness"
                  className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-transparent to-transparent opacity-50" />
                
                <div className="absolute bottom-4 left-4 right-4 bg-[#070908]/90 backdrop-blur-md p-4 border border-[#263329]">
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#c5a869] mb-1">
                    Coaching Standard
                  </div>
                  <div className="text-xs text-[#f2f3ee] font-semibold uppercase tracking-wider">
                    Personalized Biomechanics & Safe Progression
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Training Narrative */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            
            <Reveal direction="up">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869]">
                <span>04</span>
                <span aria-hidden="true" className="text-[#263329]">/</span>
                <span>Personal Coaching</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={100}>
              <h2 className="font-['Montserrat'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#f2f3ee] tracking-tight leading-[1.12]">
                Master Your Lifts with{' '}
                <span className="text-[#c5a869] font-bold block sm:inline">
                  Anatomical Science.
                </span>
              </h2>
            </Reveal>

            <Reveal direction="up" delay={200}>
              <p className="text-base sm:text-lg text-[#d8decb] leading-relaxed font-normal">
                Random workouts yield random results. Our personal coaching is designed around structured progressive overload, meticulous posture alignment, and real anatomical science.
              </p>
            </Reveal>

            {/* Structured Pillars */}
            <Reveal direction="up" delay={300}>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#101411] border border-[#263329] flex items-center justify-center shrink-0 mt-0.5 text-[#c5a869]">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">Goal-Centric Periodization</h4>
                    <p className="text-xs text-[#95a397] mt-0.5">Whether cutting fat or building raw strength, your training timeline is planned week by week.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#101411] border border-[#263329] flex items-center justify-center shrink-0 mt-0.5 text-[#c5a869]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">Biomechanical Form Correction</h4>
                    <p className="text-xs text-[#95a397] mt-0.5">Protect your spine and joints while maximizing mechanical tension on target muscle fibers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#101411] border border-[#263329] flex items-center justify-center shrink-0 mt-0.5 text-[#c5a869]">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f3ee]">Uncompromising Accountability</h4>
                    <p className="text-xs text-[#95a397] mt-0.5">Our trainers hold you accountable to your scheduled sessions, form standards, and effort.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Action CTA */}
            <Reveal direction="up" delay={400}>
              <div className="pt-4">
                <a
                  href={ptWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#070908] bg-gradient-to-r from-[#dfc993] via-[#c5a869] to-[#b39556] hover:from-[#f0deb3] hover:via-[#dfc993] hover:to-[#c5a869] transition-all duration-300 shadow-lg shadow-[#c5a869]/20 hover:shadow-[#c5a869]/35 group"
                >
                  <span>Consult A Head Coach</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </Reveal>

          </div>

        </div>

      </div>
    </section>
  );
};
