import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { GalleryItem } from '../types';
import { Reveal } from './common/Reveal';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Close lightbox on Escape key & Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, gallery.length]);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#0a0d0b] border-b border-[#263329]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869] mb-3">
                <span>05</span>
                <span aria-hidden="true" className="text-[#263329]">/</span>
                <span>The Facility · Authentic Photography</span>
              </div>
              <h2 className="font-['Syne'] font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#f2f3ee]">
                The Space. For Real.
              </h2>
            </div>
            <p className="mt-4 md:mt-0 text-sm text-[#95a397] max-w-md">
              No stock imagery or computer renders. Genuine photography of our equipment, floor culture, and facilities in Kurla West.
            </p>
          </div>
        </Reveal>

        {/* Asymmetric Editorial Gallery Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {gallery.map((item, idx) => {
            // Curated asymmetric feature frames
            const isLarge = idx === 0 || idx === 5;
            const isWide = idx === 3;

            return (
              <Reveal
                key={item.id || idx}
                delay={idx * 70}
                className={`${
                  isLarge
                    ? 'sm:col-span-2 sm:row-span-2 min-h-[320px] sm:min-h-[440px]'
                    : isWide
                    ? 'sm:col-span-2 min-h-[240px]'
                    : 'min-h-[220px]'
                }`}
              >
                <div
                  onClick={() => setSelectedIdx(idx)}
                  className="group relative h-full w-full overflow-hidden border border-[#263329] bg-[#101411] cursor-pointer hover:border-[#c5a869]/60 transition-colors duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.06] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                  
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070908]/90 via-[#070908]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Category Tag */}
                  <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a869] bg-[#070908]/90 px-2.5 py-1 border border-[#263329]">
                      {item.category}
                    </span>
                  </div>

                  {/* Centered Luxury View Indicator Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#070908]/90 border border-[#c5a869] text-xs font-mono font-bold tracking-widest uppercase text-[#c5a869] shadow-2xl backdrop-blur-md">
                      <span>View Photo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Bottom Caption Strip */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-xs font-semibold text-[#f2f3ee] bg-[#070908]/90 p-2.5 border border-[#263329] backdrop-blur-sm truncate">
                      {item.caption}
                    </div>
                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedIdx !== null && gallery[selectedIdx] && (
        <div
          className="fixed inset-0 z-50 bg-[#070908]/96 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setSelectedIdx(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-6 right-6 p-2.5 text-[#95a397] hover:text-[#f2f3ee] bg-[#101411] border border-[#263329] hover:border-[#c5a869] transition-colors focus:outline-none z-20"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1));
            }}
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 p-3 text-[#f2f3ee] bg-[#101411]/90 hover:bg-[#101411] border border-[#263329] hover:border-[#c5a869] transition-colors z-20"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIdx((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 p-3 text-[#f2f3ee] bg-[#101411]/90 hover:bg-[#101411] border border-[#263329] hover:border-[#c5a869] transition-colors z-20"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image Container */}
          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[selectedIdx].image}
              alt={gallery[selectedIdx].caption}
              className="max-h-[72vh] w-auto object-contain border border-[#263329] shadow-2xl"
            />
            <div className="mt-4 text-center max-w-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a869] block mb-1">
                {gallery[selectedIdx].category} · Image {selectedIdx + 1} of {gallery.length}
              </span>
              <p className="text-sm text-[#f2f3ee] font-medium">
                {gallery[selectedIdx].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
