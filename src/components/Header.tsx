import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface HeaderProps {
  phone: string;
  whatsapp: string;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ phone, whatsapp, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 30);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waUrl = getWhatsAppUrl(
    whatsapp,
    "Hi Sarveshwar Fitness, I would like to enquire about membership."
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#070908]/94 backdrop-blur-md border-b border-[#263329]/80 py-2.5 sm:py-3 shadow-2xl'
            : 'bg-gradient-to-b from-[#070908]/95 via-[#070908]/50 to-transparent py-3 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-12">
            
            {/* Zone 1: Brand Wordmark (Guaranteed No Truncation on Mobile) */}
            <a
              href="#"
              className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none shrink-0"
              aria-label="Sarveshwar Fitness Home"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-sm overflow-hidden bg-[#101411] border border-[#263329] flex items-center justify-center p-0.5 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Sarveshwar Fitness"
                  className="w-full h-full object-contain filter contrast-125"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="font-['Syne'] font-extrabold text-[13px] xs:text-sm sm:text-base md:text-lg tracking-tight xs:tracking-normal sm:tracking-wider text-[#f2f3ee] uppercase whitespace-nowrap">
                Sarveshwar <span className="text-[#c5a869]">Fitness</span>
              </span>
            </a>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold tracking-widest uppercase text-[#95a397]">
              <a
                href="#about"
                className="hover:text-[#f2f3ee] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#c5a869] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
              >
                About
              </a>
              <a
                href="#facilities"
                className="hover:text-[#f2f3ee] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#c5a869] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
              >
                Facilities
              </a>
              <a
                href="#memberships"
                className="hover:text-[#f2f3ee] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#c5a869] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
              >
                Memberships
              </a>
              <a
                href="#training"
                className="hover:text-[#f2f3ee] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#c5a869] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
              >
                Training
              </a>
              <a
                href="#videography"
                className="hover:text-[#f2f3ee] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#c5a869] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
              >
                Videography
              </a>
              <a
                href="#contact"
                className="hover:text-[#f2f3ee] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#c5a869] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
              >
                Visit
              </a>
            </nav>

            {/* Zone 3: Primary Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href="#memberships"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#070908] bg-gradient-to-r from-[#dfc993] via-[#c5a869] to-[#b39556] hover:from-[#f0deb3] hover:via-[#dfc993] hover:to-[#c5a869] transition-all shadow-sm hover:shadow-md hover:shadow-[#c5a869]/20"
              >
                Join Now
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-wider text-[#25d366] bg-[#0c1f13] hover:bg-[#102d1b] border border-[#25d366]/40 hover:border-[#25d366] transition-all"
                title="Chat on WhatsApp"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-pulse" />
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>

              {/* Discrete Staff Login Portal Key (Desktop only to prevent mobile crowding) */}
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex p-2 text-[#95a397] hover:text-[#c5a869] transition-colors rounded hover:bg-[#151b16] border border-transparent hover:border-[#263329]"
                title="Staff Portal"
                aria-label="Staff Portal"
              >
                <Shield className="w-4 h-4" />
              </button>

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#f2f3ee] hover:text-[#c5a869] transition-colors focus:outline-none"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Integrated Scroll Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1a231c]/60 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-[#183e26] via-[#c5a869] to-[#dfc993] transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-[#070908]/98 backdrop-blur-2xl pt-24 px-6 pb-8 flex flex-col justify-between animate-fadeIn">
          <div className="space-y-6">
            <div className="text-[11px] font-mono tracking-widest text-[#c5a869] uppercase border-b border-[#263329] pb-3 flex items-center justify-between">
              <span>Sarveshwar Fitness</span>
              <span>Navigation</span>
            </div>
            <nav className="flex flex-col space-y-4 text-base font-semibold tracking-widest uppercase">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#f2f3ee] hover:text-[#c5a869] transition-colors py-1 flex items-center justify-between"
              >
                <span>About The Gym</span>
                <ChevronRight className="w-4 h-4 text-[#95a397]" />
              </a>
              <a
                href="#facilities"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#f2f3ee] hover:text-[#c5a869] transition-colors py-1 flex items-center justify-between"
              >
                <span>Facilities & Floor</span>
                <ChevronRight className="w-4 h-4 text-[#95a397]" />
              </a>
              <a
                href="#memberships"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#f2f3ee] hover:text-[#c5a869] transition-colors py-1 flex items-center justify-between"
              >
                <span>Memberships & Pricing</span>
                <ChevronRight className="w-4 h-4 text-[#95a397]" />
              </a>
              <a
                href="#training"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#f2f3ee] hover:text-[#c5a869] transition-colors py-1 flex items-center justify-between"
              >
                <span>Personal Training</span>
                <ChevronRight className="w-4 h-4 text-[#95a397]" />
              </a>
              <a
                href="#videography"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#f2f3ee] hover:text-[#c5a869] transition-colors py-1 flex items-center justify-between"
              >
                <span>Videography</span>
                <ChevronRight className="w-4 h-4 text-[#95a397]" />
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#f2f3ee] hover:text-[#c5a869] transition-colors py-1 flex items-center justify-between"
              >
                <span>Location & Visit</span>
                <ChevronRight className="w-4 h-4 text-[#95a397]" />
              </a>
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#263329]">
            <a
              href="#memberships"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-3.5 px-4 text-xs font-bold uppercase tracking-widest text-[#070908] bg-[#c5a869] hover:bg-[#dfc993] transition-colors"
            >
              Explore Memberships
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center justify-center gap-1.5 py-3 px-2 text-xs font-semibold uppercase tracking-wider text-[#f2f3ee] bg-[#161c17] border border-[#263329]"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a869]" />
                <span>Call Gym</span>
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 px-2 text-xs font-semibold uppercase tracking-wider text-[#f2f3ee] bg-[#161c17] border border-[#263329]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25d366]" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile Staff Portal Link */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-[#95a397] hover:text-[#c5a869] transition-colors py-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Staff Portal Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
