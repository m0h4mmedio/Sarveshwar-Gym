import React from 'react';
import { Clock, Sparkles, Users } from 'lucide-react';
import { SiteContent } from '../types';
import { Reveal } from './common/Reveal';

interface GymStandardsProps {
  contact: SiteContent['contact'];
  rules: SiteContent['rules'];
}

export const GymStandards: React.FC<GymStandardsProps> = ({ rules }) => {
  return (
    <section id="standards" className="py-20 lg:py-28 bg-[#070908] border-b border-[#263329]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869] mb-3">
                <span>06</span>
                <span aria-hidden="true" className="text-[#263329]">/</span>
                <span>Discipline & Timings</span>
              </div>
              <h2 className="font-['Montserrat'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#f2f3ee] tracking-tight leading-[1.12]">
                The Floor Standards,{' '}
                <span className="text-[#c5a869] font-bold block sm:inline">
                  Strictly Enforced.
                </span>
              </h2>
            </div>
            <p className="mt-4 md:mt-0 text-sm text-[#95a397] max-w-md">
              Our training floor is built on mutual respect, hygiene, and serious dedication. We protect this environment for every member.
            </p>
          </div>
        </Reveal>

        {/* Operating Hours Visual Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* General Operating Hours */}
          <Reveal delay={100}>
            <div className="bg-[#101411] border border-[#263329] p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between text-[#c5a869] mb-4">
                  <Clock className="w-5 h-5" />
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-[#161c17] px-2 py-0.5 border border-[#263329]">
                    Mon – Sat
                  </span>
                </div>
                <h3 className="font-['Syne'] font-bold text-lg uppercase text-[#f2f3ee]">
                  General Training
                </h3>
                <p className="text-xs text-[#95a397] mt-1">Open 17 hours daily for early risers and evening athletes.</p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#263329]">
                <div className="font-['Syne'] text-2xl font-extrabold text-[#f2f3ee]">
                  6:00 AM — 11:00 PM
                </div>
                <div className="text-[11px] font-mono text-[#95a397] mt-0.5">Continuous Access</div>
              </div>
            </div>
          </Reveal>

          {/* Ladies Only Dedicated Hours */}
          <Reveal delay={200}>
            <div className="bg-[#141b15] border border-[#c5a869]/50 p-6 flex flex-col justify-between shadow-lg shadow-[#0c2214]/30 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#c5a869]/5 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center justify-between text-[#c5a869] mb-4">
                  <Users className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#070908] bg-[#c5a869] px-2.5 py-0.5">
                    Exclusive Session
                  </span>
                </div>
                <h3 className="font-['Syne'] font-bold text-lg uppercase text-[#f2f3ee]">
                  Ladies Dedicated Period
                </h3>
                <p className="text-xs text-[#c4cebf] mt-1">
                  A private, comfortable, women-only training space with zero male presence on the floor.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#263329]">
                <div className="font-['Syne'] text-2xl font-extrabold text-[#c5a869]">
                  1:00 PM — 4:00 PM
                </div>
                <div className="text-[11px] font-mono text-[#c4cebf] mt-0.5">Monday through Saturday</div>
              </div>
            </div>
          </Reveal>

          {/* Sunday Maintenance */}
          <Reveal delay={300}>
            <div className="bg-[#101411] border border-[#263329] p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between text-[#95a397] mb-4">
                  <Sparkles className="w-5 h-5 text-[#c5a869]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-[#161c17] px-2 py-0.5 border border-[#263329]">
                    Deep Sanitization
                  </span>
                </div>
                <h3 className="font-['Syne'] font-bold text-lg uppercase text-[#f2f3ee]">
                  Sunday Schedule
                </h3>
                <p className="text-xs text-[#95a397] mt-1">
                  Reserved for deep sanitization, machine lubrication, and equipment maintenance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#263329]">
                <div className="font-['Syne'] text-2xl font-extrabold text-[#95a397]">
                  Closed All Day
                </div>
                <div className="text-[11px] font-mono text-[#95a397] mt-0.5">Weekly Restoration</div>
              </div>
            </div>
          </Reveal>

        </div>

        {/* The 6 Pillars of the Gym Code */}
        <div>
          <Reveal>
            <div className="text-xs font-mono tracking-widest uppercase text-[#c5a869] mb-4">
              The Gym Code · Non-Negotiables
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map((rule, idx) => (
              <Reveal key={idx} delay={idx * 60}>
                <div className="p-5 bg-[#0f1411] border border-[#263329] hover:border-[#3d5341] transition-colors h-full">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#c5a869]">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#95a397]">Code</span>
                  </div>
                  <h4 className="font-['Syne'] font-bold text-sm uppercase text-[#f2f3ee] tracking-wide mb-1">
                    {rule.title}
                  </h4>
                  <p className="text-xs text-[#95a397] leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
