'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useAnimate } from 'framer-motion';

interface FloatingTitleProps {
  name: string;
}

const titleStyle = {
  fontSize: '5rem',
  textAlign: 'center' as const,
  zIndex: 10,
};

const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };

export default function FloatingTitle({ name }: FloatingTitleProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsMobile(!query.matches);
  }, []);

  // Hydration-safe: render plain h1 before client detection
  if (isMobile === null) {
    return <h1 style={titleStyle}>{name}</h1>;
  }

  return isMobile ? (
    <MobileTitle name={name} />
  ) : (
    <DesktopTitle name={name} />
  );
}

function DesktopTitle({ name }: FloatingTitleProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = (e.clientX - window.innerWidth / 2) * 0.5;
      const offsetY = (e.clientY - window.innerHeight / 2) * 0.5;
      x.set(offsetX);
      y.set(offsetY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y]);

  return (
    <motion.h1 style={{ ...titleStyle, x: springX, y: springY }}>
      {name}
    </motion.h1>
  );
}

function MobileTitle({ name }: FloatingTitleProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    let cancelled = false;

    async function floatLoop() {
      while (!cancelled) {
        const randX = (Math.random() - 0.5) * 200;  // ±100px
        const randY = (Math.random() - 0.5) * 120;  // ±60px
        const duration = 3 + Math.random() * 4;      // 3-7s

        try {
          await animate(
            scope.current,
            { x: randX, y: randY },
            { duration, ease: 'easeInOut' }
          );
        } catch {
          // Animation interrupted on unmount
          break;
        }
      }
    }

    floatLoop();

    return () => {
      cancelled = true;
    };
  }, [animate, scope]);

  return (
    <motion.h1 ref={scope} style={titleStyle}>
      {name}
    </motion.h1>
  );
}
