import React, { useRef, useState, useEffect } from 'react';

interface MagneticButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.18,
  ...rest
}) => {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Only enable magnetic pull on desktop devices with precision pointers
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!canHover || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    // Clamp to max 6px in each direction
    const clampedX = Math.max(-6, Math.min(6, deltaX));
    const clampedY = Math.max(-6, Math.min(6, deltaY));

    setOffset({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    if (canHover) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <a
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: canHover ? `translate3d(${offset.x}px, ${offset.y}px, 0)` : 'none',
        transition: isHovered
          ? 'transform 120ms cubic-bezier(0.2, 0, 0.38, 0.9)'
          : 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: isHovered ? 'transform' : 'auto',
      }}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
};
