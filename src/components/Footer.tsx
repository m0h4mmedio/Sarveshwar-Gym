import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';
import { SiteContent } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  content: SiteContent;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ content, onOpenAdmin }) => {
  const { brandName, contact } = content;
  const waUrl = getWhatsAppUrl(contact.whatsapp, "Hi Sarveshwar Fitness, I would like to enquire about the gym.");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050706] border-t border-[#263329] pt-20 pb-28 lg:pb-20 text-[#95a397] relative overflow-hidden">
      
      {/* Subtle Background Watermark Typography */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.02] translate-y-1/3">
        <span className="font-['Syne'] font-extrabold text-[18vw] uppercase leading-none whitespace-nowrap text-[#f2f3ee]">
          Sarveshwar
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Large Signature Statement */}
        <div className="pb-16 border-b border-[#263329]/70 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#c5a869] mb-3">
              Sarveshwar Fitness · Est. Kurla West
            </div>
            <h3 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase text-[#f2f3ee] tracking-tight leading-[0.98]">
              Train Hard.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2f3ee] via-[#c5a869] to-[#8b7647]">
                Stay Disciplined.
              </span>
            </h3>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#95a397] hover:text-[#c5a869] transition-colors group self-start md:self-end"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </div>

        {/* Minimal Navigation & Location Grid */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-[#263329]/60 text-xs">
          
          {/* Identity */}
          <div className="space-y-3">
            <div className="font-['Syne'] font-extrabold text-base text-[#f2f3ee] uppercase tracking-wider">
              {brandName}
            </div>
            <p className="text-xs text-[#95a397] leading-relaxed max-w-xs">
              A serious, air-conditioned strength and physique facility in Kurla West. Disciplined training without distractions.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#f2f3ee]">
              Navigation
            </h4>
            <div className="flex flex-col space-y-2">
              <a href="#about" className="hover:text-[#c5a869] transition-colors">01 · About & Heritage</a>
              <a href="#facilities" className="hover:text-[#c5a869] transition-colors">02 · Facilities & Ladies Hours</a>
              <a href="#memberships" className="hover:text-[#c5a869] transition-colors">03 · Memberships & Pricing</a>
              <a href="#training" className="hover:text-[#c5a869] transition-colors">04 · Personal Coaching</a>
              <a href="#standards" className="hover:text-[#c5a869] transition-colors">05 · Discipline & Standards</a>
              <a href="#contact" className="hover:text-[#c5a869] transition-colors">06 · Location & Trial</a>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#f2f3ee]">
              Facility Timings
            </h4>
            <div className="space-y-1.5">
              <div>
                <span className="text-[#f2f3ee] block font-medium">Mon — Sat General:</span>
                <span className="text-[#95a397]">6:00 AM – 11:00 PM</span>
              </div>
              <div>
                <span className="text-[#c5a869] block font-medium">Ladies Special Hours:</span>
                <span className="text-[#c5a869]">1:00 PM – 4:00 PM Daily</span>
              </div>
              <div>
                <span className="text-[#95a397] block font-medium">Sunday:</span>
                <span className="text-[#95a397]">Closed for Deep Clean</span>
              </div>
            </div>
          </div>

          {/* Direct Line */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#f2f3ee]">
              Direct Contact
            </h4>
            <div className="space-y-1.5">
              <a
                href={`tel:${contact.phoneRaw}`}
                className="block text-[#f2f3ee] hover:text-[#c5a869] transition-colors font-mono"
              >
                {contact.phone}
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#25d366] hover:underline"
              >
                WhatsApp Chat: 084336 50068
              </a>
              <p className="text-[#95a397] pt-1">
                Kurla West, Mumbai 400070
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Sarveshwar Fitness. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-[#95a397]">Kurla West, Mumbai</span>
            <span aria-hidden="true" className="text-[#263329]">·</span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-[#95a397] hover:text-[#c5a869] transition-colors"
              title="Staff Login"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Staff Key</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
