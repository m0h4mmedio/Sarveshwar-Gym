import React, { useState } from 'react';
import { Check, MessageSquare, Phone, Sparkles, ArrowRight, Flame, Dumbbell } from 'lucide-react';
import { MembershipPlan } from '../types';
import { formatINR, getWhatsAppUrl } from '../utils/whatsapp';
import { Reveal } from './common/Reveal';

interface MembershipSectionProps {
  plans: MembershipPlan[];
  whatsapp: string;
  phone: string;
  onSelectPlanForEnquiry?: (plan: MembershipPlan, planType: 'cardio' | 'nonCardio') => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({
  plans,
  whatsapp,
  phone,
  onSelectPlanForEnquiry,
}) => {
  const [selectedType, setSelectedType] = useState<'cardio' | 'nonCardio'>('cardio');

  return (
    <section id="memberships" className="py-20 lg:py-28 bg-[#070908] border-b border-[#263329]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869] mb-3">
              <span>03</span>
              <span aria-hidden="true" className="text-[#263329]">/</span>
              <span>Direct Membership Tariffs</span>
            </div>
            <h2 className="font-['Montserrat'] font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#f2f3ee] tracking-tight leading-[1.1]">
              Transparent Pricing,{' '}
              <span className="text-[#c5a869] font-bold block sm:inline">
                Zero Hidden Fees.
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#95a397] leading-relaxed max-w-2xl mx-auto font-normal">
              Direct access to Kurla West’s premier disciplined lifting arena. All plans include certified floor coaching support and air-conditioned training.
            </p>

            {/* Interactive Category Segmented Control with Icons */}
            <div className="mt-8 inline-flex p-1.5 bg-[#090d0b] border border-[#263329] max-w-md w-full sm:w-auto shadow-inner">
              <button
                onClick={() => setSelectedType('cardio')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  selectedType === 'cardio'
                    ? 'bg-gradient-to-r from-[#dfc993] via-[#c5a869] to-[#b39556] text-[#070908] shadow-md shadow-[#c5a869]/20'
                    : 'text-[#95a397] hover:text-[#f2f3ee]'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>With Cardio Included</span>
              </button>
              <button
                onClick={() => setSelectedType('nonCardio')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  selectedType === 'nonCardio'
                    ? 'bg-gradient-to-r from-[#dfc993] via-[#c5a869] to-[#b39556] text-[#070908] shadow-md shadow-[#c5a869]/20'
                    : 'text-[#95a397] hover:text-[#f2f3ee]'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Strength Floor Only</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => {
            const price = selectedType === 'cardio' ? plan.cardioPrice : plan.nonCardioPrice;
            const features = selectedType === 'cardio' ? plan.cardioFeatures : plan.nonCardioFeatures;
            const isFeatured = plan.isPopular || plan.duration === '6 Months';
            
            const waMessage = `Hi Sarveshwar Fitness, I am interested in the ${plan.duration} ${
              selectedType === 'cardio' ? 'With Cardio' : 'Without Cardio'
            } membership. Please share enrollment details.`;
            const planWaUrl = getWhatsAppUrl(whatsapp, waMessage);

            return (
              <Reveal key={plan.id} delay={idx * 100}>
                <div
                  className={`relative flex flex-col justify-between p-6 sm:p-7 bg-[#101411] border transition-all duration-300 md:hover:-translate-y-1.5 md:hover:shadow-2xl md:hover:shadow-[#c5a869]/5 h-full ${
                    isFeatured
                      ? 'border-[#c5a869] bg-[#121914] md:hover:border-[#dfc993]'
                      : 'border-[#263329] md:hover:border-[#3d5341]'
                  }`}
                >
                  {/* Badge Tag */}
                  {(plan.badge || isFeatured) && (
                    <div className="absolute -top-3 left-6">
                      <span className="inline-flex items-center gap-1 bg-[#c5a869] text-[#070908] text-[9px] font-mono font-extrabold uppercase px-2.5 py-0.5 tracking-widest shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" />
                        {plan.badge || 'RECOMMENDED'}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Plan Duration Header */}
                    <div className="flex items-baseline justify-between mb-4 mt-2">
                      <h3 className="font-['Montserrat'] font-extrabold text-2xl text-[#f2f3ee] uppercase tracking-wide">
                        {plan.duration}
                      </h3>
                    </div>

                    {/* Plan Price */}
                    <div className="mb-6 pb-6 border-b border-[#263329]">
                      <div className="flex items-baseline gap-1">
                        <span className="font-['Montserrat'] text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-[#f2f3ee]">
                          {formatINR(price)}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#95a397] mt-1">
                        {selectedType === 'cardio' ? 'Gym + Cardio Included' : 'Strength Only (No Cardio)'}
                      </div>
                      {plan.duration === '12 Months' && (
                        <div className="text-[10px] font-mono text-[#c5a869] font-semibold mt-1">
                          Best Annual Rate: ~₹{Math.round(price / 12)} / month
                        </div>
                      )}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8">
                      {features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#c4cebf] leading-relaxed">
                          <Check className="w-4 h-4 text-[#c5a869] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Conversion Actions: Differentiated Buttons */}
                  <div className="space-y-2.5 pt-4 border-t border-[#263329]/60">
                    <a
                      href={planWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all text-center bg-[#25d366] hover:bg-[#20ba5a] text-[#070908] shadow-md shadow-[#25d366]/15 group"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#070908] animate-pulse" />
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    {onSelectPlanForEnquiry && (
                      <button
                        onClick={() => onSelectPlanForEnquiry(plan, selectedType)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-[11px] font-mono tracking-wider uppercase text-[#c5a869] hover:text-[#070908] bg-[#121c15] hover:bg-[#c5a869] border border-[#2b3d2f] hover:border-[#c5a869] transition-all duration-200 font-semibold group"
                      >
                        <span>Select Plan &amp; Book Trial</span>
                        <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Assistance Strip */}
        <Reveal delay={200}>
          <div className="mt-12 p-6 bg-[#0f1411] border border-[#263329] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-['Syne'] font-bold text-base text-[#f2f3ee] uppercase">
                Need guidance choosing your membership?
              </h4>
              <p className="text-xs text-[#95a397] mt-1">
                Visit our training floor in Kurla West or connect directly with our head trainers on WhatsApp or call.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#f2f3ee] bg-[#161c17] hover:bg-[#1f2821] border border-[#263329] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a869]" />
                <span>Call: {phone}</span>
              </a>
              <a
                href={getWhatsAppUrl(whatsapp, "Hi Sarveshwar Fitness, I would like guidance on membership plans.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#070908] bg-[#c5a869] hover:bg-[#dfc993] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
