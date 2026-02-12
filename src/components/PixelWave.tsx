'use client';

import React, { useEffect, useState } from 'react';

const COLUMN_WIDTH = 44; // 40px width + 4px margin
const ANIMATION_DURATION = 4; // 4 seconds

// Function to generate random blue/blue-green shades
function getRandomBlueOrGreen() {
  const hue = Math.floor(Math.random() * (240 - 170) + 170);
  const saturation = Math.floor(Math.random() * (100 - 60) + 60);
  const lightness = Math.floor(Math.random() * (70 - 40) + 40);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function PixelWave() {
  const [columns, setColumns] = useState<{ color: string; delay: number }[]>([]);

  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;
      const count = Math.ceil(width / COLUMN_WIDTH);

      // Generate column data
      const newColumns = Array.from({ length: count }).map((_, index) => {
        // To have exactly TWO waves on the screen,
        // the total phase shift across all columns should be 2 * Duration.
        const totalPhaseShift = 2 * ANIMATION_DURATION;
        const delay = (index / count) * totalPhaseShift;

        return {
          color: getRandomBlueOrGreen(),
          delay: -delay // Negative to start mid-cycle
        };
      });

      setColumns(newColumns);
    };

    calculateColumns();
    window.addEventListener('resize', calculateColumns);

    return () => window.removeEventListener('resize', calculateColumns);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-[30vh] z-0 pointer-events-none overflow-hidden flex items-end justify-center">
      {columns.map((col, index) => (
        <div
          key={index}
          className="w-10 mx-0.5 animate-[wave_4s_infinite_ease-in-out] opacity-80 rounded-t"
          style={{
            backgroundColor: col.color,
            animationDelay: `${col.delay}s`,
            animationDuration: `${ANIMATION_DURATION}s`,
            height: '20%'
          }}
        />
      ))}
    </div>
  );
}
