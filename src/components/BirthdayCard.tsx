import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const BRAND_COLOURS = ['#d4a843', '#c0575a', '#f5c6cb', '#fceabb', '#e8c8f0', '#7b2d37', '#ffffff'];

function fireConfetti() {
  const base = {
    colors: BRAND_COLOURS,
    gravity: 0.85,
    ticks: 320,
  };

  // Central burst
  confetti({ ...base, particleCount: 130, spread: 110, origin: { x: 0.5, y: 0.55 }, startVelocity: 42 });

  // Side bursts
  setTimeout(() => {
    confetti({ ...base, particleCount: 70, spread: 75, angle: 60,  origin: { x: 0.1, y: 0.5 }, startVelocity: 38 });
    confetti({ ...base, particleCount: 70, spread: 75, angle: 120, origin: { x: 0.9, y: 0.5 }, startVelocity: 38 });
  }, 320);

  // Lingering shower
  setTimeout(() => {
    confetti({ ...base, particleCount: 50, spread: 140, origin: { x: 0.5, y: 0.2 }, startVelocity: 18, gravity: 0.4 });
  }, 700);
}

const FLOATERS = ['💛', '🌸', '💗', '✨', '🌺', '💫', '⭐'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 220, damping: 22 },
  },
};

interface BirthdayCardProps {
  onRestart: () => void;
}

export function BirthdayCard({ onRestart }: BirthdayCardProps) {
  useEffect(() => {
    fireConfetti();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.55, y: 70, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 17 }}
      style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #fffdf7 0%, #fdf0e8 100%)',
        borderRadius: 28,
        padding: '64px 52px 48px',
        maxWidth: 460,
        width: '90vw',
        textAlign: 'center',
        boxShadow: '0 24px 70px rgba(0,0,0,0.2), 0 0 0 1px rgba(212,168,67,0.2)',
      }}
    >
      {/* Top ribbon */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 30,
          background: 'linear-gradient(180deg, #c0575a, #a04548)',
          borderRadius: '0 0 10px 10px',
          boxShadow: '0 4px 10px rgba(192,87,90,0.4)',
        }}
      />
      {/* Ribbon knot circle */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 18,
          height: 18,
          background: '#d4a843',
          borderRadius: '50%',
          border: '2px solid #b8942f',
          zIndex: 1,
        }}
      />

      <motion.div variants={containerVariants} initial="hidden" animate="show">

        {/* Floating emoji row */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}
        >
          {FLOATERS.map((emoji, i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -(8 + i * 2), 0],
                rotate: [0, i % 2 === 0 ? 14 : -14, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.6 + i * 0.18,
                repeat: Infinity,
                delay: i * 0.12,
                ease: 'easeInOut',
              }}
              style={{ fontSize: '1.35rem', display: 'inline-block' }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Cake */}
        <motion.div
          variants={itemVariants}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -3, 3, 0],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '4.5rem', marginBottom: 8, lineHeight: 1 }}
        >
          🎂
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 6vw, 2.6rem)',
            fontWeight: 700,
            color: '#7b2d37',
            marginBottom: 6,
            lineHeight: 1.2,
          }}
        >
          Parabéns, Mãe!
        </motion.h1>

        {/* Gold underline */}
        <motion.div
          variants={itemVariants}
          style={{
            width: 64,
            height: 3,
            background: 'linear-gradient(90deg, #d4a843, #f5c6cb)',
            borderRadius: 2,
            margin: '0 auto 22px',
          }}
        />

        {/* Message */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.85,
            color: '#3d2b1f',
            fontWeight: 300,
            marginBottom: 14,
          }}
        >
          Obrigado/a por tudo o que és<br />
          e tudo o que fazes cada dia. 🌷
        </motion.p>

        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontSize: '1.05rem',
            color: '#c0575a',
            marginBottom: 36,
          }}
        >
          És a melhor mãe do mundo —<br />
          não há dúvida nenhuma! 💛
        </motion.p>

        {/* Restart button */}
        <motion.button
          variants={itemVariants}
          whileHover={{
            scale: 1.07,
            background: 'linear-gradient(135deg, #7b2d37, #a04548)',
            boxShadow: '0 8px 24px rgba(123,45,55,0.4)',
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          style={{
            background: 'linear-gradient(135deg, #c0575a, #a04548)',
            color: '#fff',
            border: 'none',
            borderRadius: 50,
            padding: '13px 36px',
            fontSize: '0.92rem',
            fontFamily: 'Lato, sans-serif',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(192,87,90,0.35)',
          }}
        >
          ↩ Recomeçar
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
