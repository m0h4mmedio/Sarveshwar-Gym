import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Instagram, ArrowUpRight } from 'lucide-react';
import { Reveal } from './common/Reveal';

interface VideoSectionProps {
  instagramUrl?: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  instagramUrl = 'https://www.instagram.com/p/CRhdhTRljCT/',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // The sound and the video only start while scrolling into Section 05
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Guaranteed initial state: paused and muted before reaching section 05
    video.pause();
    video.muted = true;
    setIsPlaying(false);
    setIsMuted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // ONLY start playback and audio when scrolled into section 05
            video.muted = false;
            video
              .play()
              .then(() => {
                setIsPlaying(true);
                setIsMuted(false);
              })
              .catch(() => {
                // If browser autoplay policy requires prior gesture for unmuted audio,
                // start playing smoothly in muted mode, ready to unmute on tap
                video.muted = true;
                setIsMuted(true);
                video
                  .play()
                  .then(() => setIsPlaying(true))
                  .catch(() => {});
              });
          } else {
            // Stop playback and silence audio completely when scrolled away
            video.pause();
            video.muted = true;
            setIsPlaying(false);
            setIsMuted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (video) {
        video.pause();
        video.muted = true;
      }
    };
  }, []);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.muted || isMuted) {
      video.muted = false;
      video
        .play()
        .then(() => {
          setIsMuted(false);
          setIsPlaying(true);
        })
        .catch(() => {
          video.muted = true;
          setIsMuted(true);
        });
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="videography"
      className="py-20 lg:py-28 bg-[#070908] border-b border-[#263329]/60 relative overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c5a869]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c5a869] mb-3">
                <span>05</span>
                <span aria-hidden="true" className="text-[#263329]">/</span>
                <span>Videography & Culture</span>
              </div>
              <h2 className="font-['Montserrat'] font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#f2f3ee] tracking-tight leading-[1.1]">
                The Floor in Motion,{' '}
                <span className="text-[#c5a869] font-bold block sm:inline">
                  Real Athletes, Real Grit.
                </span>
              </h2>
            </div>
            <p className="mt-4 md:mt-0 text-xs sm:text-sm text-[#95a397] font-normal max-w-md leading-relaxed">
              Real iron. Real community. Authentic footage straight from our training floor in Kurla West.
            </p>
          </div>
        </Reveal>

        {/* Cinematic Video Showcase Container */}
        <Reveal delay={120}>
          <div className="relative mx-auto max-w-4xl border border-[#263329] bg-[#090d0a] shadow-2xl overflow-hidden group">
            
            {/* Native Clean Video Frame — Zero Overlay Badges or On-Screen Clutter */}
            <div
              className="relative aspect-[16/9] w-full bg-[#070908] flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => toggleSound()}
              title="Click video to toggle sound"
            >
              <video
                ref={videoRef}
                src="/videos/sarveshwar-experience.mp4"
                poster="/images/gym-hero.jpg"
                playsInline
                loop
                preload="metadata"
                className="w-full h-full object-contain max-h-[80vh] mx-auto bg-[#070908]"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* Clean Lower Utility Bar (Outside Video Frame) */}
            <div className="p-3.5 sm:p-4 bg-[#101511] border-t border-[#263329] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-['Syne'] font-bold text-[#f2f3ee] uppercase tracking-wide text-xs sm:text-sm">
                  Floor Energy & Community
                </span>
                <span className="hidden sm:inline-block text-[#263329]">|</span>
                <span className="text-[#95a397] text-[11px] font-mono hidden sm:inline-block">
                  Filmed on location at Sarveshwar Gym · Kurla West
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio toggle button in the bottom utility bar */}
                <button
                  type="button"
                  onClick={(e) => toggleSound(e)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#161c17] hover:bg-[#1f2821] text-[#c5a869] hover:text-[#dfc993] border border-[#263329] transition-colors text-[11px] font-mono uppercase tracking-wider"
                  aria-label="Toggle audio mute"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#95a397]" />
                      <span className="text-[#95a397]">Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#25d366]" />
                      <span className="text-[#25d366]">Sound On</span>
                    </>
                  )}
                </button>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#161c17] hover:bg-[#1f2821] text-[#c5a869] hover:text-[#dfc993] border border-[#263329] transition-colors text-[11px] font-mono uppercase tracking-wider"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram @sarveshwar_fitness</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </Reveal>

      </div>
    </section>
  );
};
