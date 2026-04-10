import { useMemo } from 'react';
import { motion } from 'framer-motion';

const SYMBOLS = ['🌸', '🌺', '🌻', '🌹', '🌷', '💐', '✨', '💛', '💗', '💫', '⭐', '🍃', '🦋', '🎀'];

interface Petal {
  id: number;
  symbol: string;
  left: number;       // vw %
  size: number;       // px
  duration: number;   // s
  delay: number;      // s
  drift: number;      // px horizontal sway
  spin: number;       // deg final rotation
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Generate once (stable across re-renders)
const PETALS: Petal[] = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  left: rand(0, 98),
  size: rand(16, 38),
  duration: rand(9, 22),
  delay: rand(0, 12),
  drift: rand(-80, 80),
  spin: rand(-270, 270),
}));

export function FloatingPetals() {
  // useMemo so the array is stable if component remounts
  const petals = useMemo(() => PETALS, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {petals.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.left}%`,
            fontSize: p.size,
            userSelect: 'none',
            willChange: 'transform',
          }}
          animate={{
            y: ['-80px', '110vh'],
            x: [0, p.drift],
            rotate: [0, p.spin],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.08, 0.85, 1],
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
}
