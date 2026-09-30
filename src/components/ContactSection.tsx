import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle2,
  Send,
  Navigation,
  Star,
  ExternalLink,
} from 'lucide-react';
import { SiteContent } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { api } from '../utils/api';
import { Reveal } from './common/Reveal';
import { MagneticButton } from './common/MagneticButton';

interface ContactSectionProps {
  contact: SiteContent['contact'];
  initialPlan?: { duration: string; type: string } | null;
  onSuccessEnquiry?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contact,
  initialPlan,
  onSuccessEnquiry,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    goal: 'General Strength & Conditioning',
    preferredPlan: initialPlan ? `${initialPlan.duration} (${initialPlan.type})` : '6 Months (Cardio Included)',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedWaUrl, setSubmittedWaUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Update preferred plan when user clicks a plan card
  useEffect(() => {
    if (initialPlan) {
      setFormData((prev) => ({
        ...prev,
        preferredPlan: `${initialPlan.duration} (${initialPlan.type})`,
      }));
    }
  }, [initialPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.replace(/[^0-9]/g, '').length < 8) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitLead({
        name: formData.name,
        phone: formData.phone,
        goal: formData.goal,
        notes: `Selected plan: ${formData.preferredPlan}`,
      });

      // Prepare instant WhatsApp message link
      const waMsg = `Hi Sarveshwar Fitness! My name is ${formData.name}. I would like to visit the gym in Kurla West for a trial. Interested in: ${formData.preferredPlan} (Goal: ${formData.goal}). Mobile: ${formData.phone}`;
      const waUrl = getWhatsAppUrl(contact.whatsapp, waMsg);
      setSubmittedWaUrl(waUrl);

      setSubmitted(true);
      if (onSuccessEnquiry) onSuccessEnquiry();

      // Open WhatsApp automatically
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please try again or WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate natural WhatsApp URL using user brief guidelines
  const defaultWaMsg = initialPlan
    ? `Hi, I'm interested in joining Sarveshwar Fitness with the ${initialPlan.duration} (${initialPlan.type}) plan. I'd like to know more about the membership options.`
    : "Hi, I'm interested in joining Sarveshwar Fitness. I'd like to know more about the membership options.";
  
  const directWaUrl = getWhatsAppUrl(contact.whatsapp, defaultWaMsg);

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#070908] border-b border-[#263329]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================== */}
        {/* PREMIUM SHOWSTOPPER FINAL CTA (POST-VIDEO CONCLUSION)          */}
        {/* ============================================================== */}
        <Reveal>
          <div className="relative overflow-hidden border border-[#263329] bg-[#0c140f] p-8 sm:p-14 lg:p-16 mb-20 text-center shadow-2xl">
            {/* Authentic Gym Photo Background with Measured Dark Scrim */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/gym-hero.jpg"
                alt="Sarveshwar Fitness Training Floor"
                className="w-full h-full object-cover filter brightness-[0.38] contrast-[1.15]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-[#070908]/75 to-[#070908]/45" />
              <div className="absolute inset-0 bg-[#0c2214]/30 mix-blend-multiply" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869]" />
                <span>SARVESHWAR FITNESS</span>
                <span aria-hidden="true" className="text-[#263329]">·</span>
                <span>KURLA WEST, MUMBAI</span>
              </div>

              <h2 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase text-[#f2f3ee] tracking-tight leading-[1.02]">
                Ready To Train?
              </h2>

              <p className="text-sm sm:text-base text-[#c4cebf] max-w-lg mx-auto font-normal leading-relaxed">
                Step onto the floor in Kurla West. Start your fitness commitment today.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#070908] bg-[#c5a869] hover:bg-[#dfc993] transition-all border border-[#c5a869] shadow-2xl shadow-[#c5a869]/20"
                >
                  <MessageSquare className="w-4 h-4 text-[#070908]" />
                  <span>Enquire On WhatsApp</span>
                </MagneticButton>

                <a
                  href={`tel:${contact.phoneRaw}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f2f3ee] bg-[#161c17]/90 hover:bg-[#1f2821] border border-[#263329] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#c5a869]" />
                  <span>Call: {contact.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Section Header */}
        <Reveal>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869] mb-3">
            <span>Direct Floor Visit</span>
            <span aria-hidden="true" className="text-[#263329]">·</span>
            <span>Kurla West, Mumbai</span>
          </div>
          <h3 className="font-['Montserrat'] font-extrabold text-3xl sm:text-5xl text-[#f2f3ee] tracking-tight mb-12 leading-[1.12]">
            Step Onto the Floor,{' '}
            <span className="text-[#c5a869] font-bold block sm:inline">
              Experience the Discipline.
            </span>
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Gym Address & Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal delay={100}>
              {/* Address card */}
              <div className="p-6 bg-[#101411] border border-[#263329]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#c5a869] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#c5a869] mb-1">
                      Official Gym Address
                    </h4>
                    <p className="text-sm text-[#f2f3ee] font-medium leading-relaxed">
                      {contact.address}
                    </p>
                    <div className="mt-4">
                      <a
                        href={contact.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c5a869] hover:text-[#dfc993] transition-colors"
                      >
                        <span>Get Directions on Google Maps</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Direct Phone & WhatsApp buttons with distinct color coding */}
            <Reveal delay={200}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${contact.phoneRaw}`}
                  className="p-5 bg-[#0f1411] border border-[#263329] hover:border-[#c5a869]/70 transition-all flex flex-col justify-between group shadow-sm hover:bg-[#141b16]"
                >
                  <div className="flex items-center justify-between text-[#c5a869] mb-3">
                    <Phone className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-[10px] font-mono uppercase text-[#95a397] px-1.5 py-0.5 bg-[#070908] border border-[#263329]">Direct Call</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#95a397] block">Reception Desk</span>
                    <span className="font-['Syne'] font-bold text-sm text-[#f2f3ee] group-hover:text-[#c5a869] transition-colors">
                      {contact.phone}
                    </span>
                  </div>
                </a>

                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 bg-[#0c1a11] border border-[#25d366]/40 hover:border-[#25d366] transition-all flex flex-col justify-between group shadow-sm hover:bg-[#0f2417]"
                >
                  <div className="flex items-center justify-between text-[#25d366] mb-3">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono uppercase text-[#25d366] font-bold px-1.5 py-0.5 bg-[#07130b] border border-[#25d366]/30">WhatsApp</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#95a397] block">Fast Response</span>
                    <span className="font-['Syne'] font-bold text-sm text-[#25d366] group-hover:text-white transition-colors">
                      084336 50068
                    </span>
                  </div>
                </a>
              </div>
            </Reveal>

            {/* Operational Hours card */}
            <Reveal delay={300}>
              <div className="p-6 bg-[#101411] border border-[#263329] space-y-3">
                <div className="flex items-center gap-2 text-[#c5a869]">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest font-bold">
                    Schedule Overview
                  </span>
                </div>
                <div className="divide-y divide-[#263329]/60 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-[#95a397]">Mon – Sat General:</span>
                    <span className="font-semibold text-[#f2f3ee]">6:00 AM – 11:00 PM</span>
                  </div>
                  <div className="py-2 flex justify-between text-[#c5a869]">
                    <span className="font-semibold">Ladies Special Hours:</span>
                    <span className="font-semibold">1:00 PM – 4:00 PM</span>
                  </div>
                  <div className="py-2 flex justify-between text-[#95a397]">
                    <span>Sunday:</span>
                    <span>Closed (Deep Sanitization)</span>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>

          {/* Right Column: Interactive Schedule a Visit / Trial Form */}
          <div className="lg:col-span-7">
            <Reveal delay={150}>
              <div className="bg-[#101411] border border-[#263329] p-6 sm:p-8 relative">
                
                <div className="mb-6">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#c5a869] block mb-1">
                    Book Floor Consultation
                  </span>
                  <h4 className="font-['Syne'] font-bold text-xl uppercase text-[#f2f3ee]">
                    Schedule A Free Floor Visit
                  </h4>
                  <p className="text-xs text-[#95a397] mt-1">
                    Meet head trainers, review membership plans, and tour the training floor.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-10 text-center space-y-5">
                    <div className="w-14 h-14 bg-[#18261e] border-2 border-[#25d366] text-[#25d366] flex items-center justify-center mx-auto shadow-lg shadow-[#25d366]/10">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#25d366] font-bold block mb-1">
                        Registration Logged in System
                      </span>
                      <h5 className="font-['Syne'] font-extrabold text-2xl uppercase text-[#f2f3ee]">
                        Enquiry Received!
                      </h5>
                    </div>
                    <p className="text-xs sm:text-sm text-[#c4cebf] max-w-md mx-auto leading-relaxed">
                      Your interest in <strong className="text-white">{formData.preferredPlan}</strong> has been stored in our Kurla West database.
                    </p>

                    {/* Instant WhatsApp Action Button */}
                    <div className="pt-2 space-y-3">
                      <a
                        href={submittedWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#25d366] hover:bg-[#20ba5a] text-[#070908] font-bold text-xs uppercase tracking-wider font-['Syne'] transition-all shadow-xl shadow-[#25d366]/20"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" />
                        <span>Chat Directly on WhatsApp Now</span>
                      </a>
                      <div className="block">
                        <span className="text-[11px] text-[#95a397] font-mono">
                          Or call head trainer directly at{' '}
                          <a href={`tel:${contact.phoneRaw}`} className="text-[#c5a869] underline font-bold">
                            {contact.phone}
                          </a>
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#1d2b21]">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-xs font-mono text-[#95a397] hover:text-[#c5a869] underline uppercase tracking-wider transition-colors"
                      >
                        Submit another visitor enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 bg-red-950/70 border border-red-800 text-xs text-red-200">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#95a397] mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 bg-[#070908] border border-[#263329] focus:border-[#c5a869] text-xs text-[#f2f3ee] outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#95a397] mb-1.5">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 98201 12345"
                          className="w-full px-4 py-3 bg-[#070908] border border-[#263329] focus:border-[#c5a869] text-xs text-[#f2f3ee] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#95a397] mb-1.5">
                          Primary Fitness Goal
                        </label>
                        <select
                          value={formData.goal}
                          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                          className="w-full px-4 py-3 bg-[#070908] border border-[#263329] focus:border-[#c5a869] text-xs text-[#f2f3ee] outline-none transition-colors"
                        >
                          <option>General Strength & Conditioning</option>
                          <option>Hypertrophy / Muscle Building</option>
                          <option>Fat Loss & Metabolic Conditioning</option>
                          <option>Posture & Mobility Correction</option>
                          <option>Ladies Hours Training (1 PM - 4 PM)</option>
                          <option>1-on-1 Personal Coaching</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#95a397] mb-1.5">
                          Interested Membership
                        </label>
                        <input
                          type="text"
                          value={formData.preferredPlan}
                          onChange={(e) => setFormData({ ...formData, preferredPlan: e.target.value })}
                          className="w-full px-4 py-3 bg-[#070908] border border-[#263329] focus:border-[#c5a869] text-xs text-[#f2f3ee] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#070908] bg-gradient-to-r from-[#dfc993] via-[#c5a869] to-[#b39556] hover:from-[#f0deb3] hover:via-[#dfc993] hover:to-[#c5a869] transition-all duration-300 shadow-[0_8px_25px_rgba(197,168,105,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_12px_30px_rgba(197,168,105,0.38)] active:scale-[0.99] flex items-center justify-center gap-2 group disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        <span>{isSubmitting ? 'Registering...' : 'Request Free Trial Visit'}</span>
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <span className="text-[10px] font-mono text-[#95a397]">
                        Submitting directly opens WhatsApp to confirm your preferred slot.
                      </span>
                    </div>

                  </form>
                )}

              </div>
            </Reveal>
          </div>

        </div>

        {/* Embedded Interactive Google Map with 1-Tap Navigation */}
        <Reveal delay={250}>
          <div className="mt-16 border border-[#263329] overflow-hidden bg-[#0c140f]">
            <div className="p-3.5 sm:p-4 bg-[#101411] border-b border-[#263329] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c5a869] shrink-0" />
                <span className="font-['Syne'] font-bold text-white uppercase tracking-wider text-xs">
                  Sarveshwar Fitness Training Floor
                </span>
                <span className="hidden sm:inline-block text-[#263329]">|</span>
                <span className="text-[#95a397] font-mono text-[11px] hidden sm:inline-block">
                  Near Kurla Police Station, Takia Ward, Kurla West
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Sarveshwar Fitness Kurla West Mumbai')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c5a869] hover:bg-[#dfc993] text-[#070908] text-[11px] font-bold font-['Syne'] uppercase tracking-wider transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 fill-current" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#161c17] hover:bg-[#1f2821] text-[#c5a869] border border-[#263329] text-[11px] font-mono uppercase tracking-wider transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-[#c5a869]" />
                  <span>Google Reviews</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <iframe
              src={contact.googleMapsEmbed}
              width="100%"
              height="380"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(105%)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sarveshwar Fitness Kurla West Location Map"
            />

            <div className="p-3 bg-[#080d0a] border-t border-[#263329] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#95a397]">
              <span>📍 Address: 216/1 Takia Ward, Sarveshwar Mandir Road, Kurla West, Mumbai 400070</span>
              <span className="text-[#c5a869]">🏍️ Dedicated two-wheeler parking available at the gym entrance</span>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
