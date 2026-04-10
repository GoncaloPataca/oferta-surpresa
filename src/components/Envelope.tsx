import { motion, AnimatePresence } from 'framer-motion';

const W = 340;
const H = 230;
// How far down the flap triangle extends (% of height)
const FLAP_DEPTH = 0.54;

const LETTER_LINES = [
  'Hoje é um dia muito especial —',
  'o teu dia! ✨',
  '',
  'Estas palavras são pequenas de mais',
  'para dizer o quanto te amo,',
  'mas são escritas com o coração cheio. 💛',
  '',
  'Que este ano te traga muita saúde,',
  'alegria e todos os abraços que mereces.',
];

interface EnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
}

export function Envelope({ isOpen, onOpen }: EnvelopeProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
      }}
    >
      {/* Hint text */}
      <AnimatePresence>
        {!isOpen && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: [0.55, 1, 0.55], y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
            transition={{ duration: 2.4, repeat: Infinity }}
            style={{
              color: '#7b2d37',
              fontSize: '1rem',
              fontWeight: 300,
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            Clica no envelope para abrir a tua surpresa 🎁
          </motion.p>
        )}
      </AnimatePresence>

      {/* Envelope shell */}
      <motion.div
        onClick={!isOpen ? onOpen : undefined}
        whileHover={!isOpen ? { scale: 1.04, y: -4 } : {}}
        whileTap={!isOpen ? { scale: 0.97 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          position: 'relative',
          width: W,
          height: H,
          cursor: isOpen ? 'default' : 'pointer',
          filter: 'drop-shadow(0 14px 36px rgba(0,0,0,0.22))',
        }}
      >
        {/* ── Back panel ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fdf6ec',
            borderRadius: 6,
          }}
        />

        {/* ── Letter (rises out) ── */}
        <motion.div
          animate={isOpen ? { y: -(H * 0.9), zIndex: 4 } : { y: 0, zIndex: 4 }}
          transition={{ type: 'spring', stiffness: 110, damping: 22, delay: 0.4 }}
          style={{
            position: 'absolute',
            bottom: 8,
            left: 14,
            right: 14,
            height: H - 28,
            background: '#fffdf7',
            borderRadius: 4,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            zIndex: 4,
          }}
        >
          {/* Letter border accent */}
          <div
            style={{
              position: 'absolute',
              inset: 6,
              border: '1px solid #f0d9c0',
              borderRadius: 2,
              pointerEvents: 'none',
            }}
          />

          <div style={{ padding: '18px 22px' }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.85, duration: 0.4 }}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#c0575a',
                marginBottom: 10,
              }}
            >
              Querida Mãe,
            </motion.p>

            {LETTER_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: 1.0 + i * 0.07, duration: 0.35 }}
                style={{
                  fontSize: '0.8rem',
                  lineHeight: 1.75,
                  color: '#3d2b1f',
                  fontWeight: 300,
                  minHeight: line === '' ? '0.6em' : undefined,
                }}
              >
                {line}
              </motion.p>
            ))}

            <motion.p
              initial={{ opacity: 0 }}
              animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.0 + LETTER_LINES.length * 0.07 + 0.1, duration: 0.4 }}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontStyle: 'italic',
                fontSize: '0.85rem',
                color: '#d4a843',
                marginTop: 8,
              }}
            >
              Com todo o amor, <em>o teu filho/a</em> 🌸
            </motion.p>
          </div>
        </motion.div>

        {/* ── Left face triangle ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#f0d9c0',
            clipPath: `polygon(0 0, 0 100%, 50% 50%)`,
            borderRadius: 6,
            zIndex: 2,
          }}
        />

        {/* ── Right face triangle ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#eedcca',
            clipPath: `polygon(100% 0, 100% 100%, 50% 50%)`,
            borderRadius: 6,
            zIndex: 2,
          }}
        />

        {/* ── Bottom face triangle ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#f5e6d2',
            clipPath: `polygon(0 100%, 50% 50%, 100% 100%)`,
            borderRadius: 6,
            zIndex: 3,
          }}
        />

        {/* ── Flap (rotates open) ── */}
        <motion.div
          animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#e8c9a0',
            clipPath: `polygon(0 0, 50% ${FLAP_DEPTH * 100}%, 100% 0)`,
            borderRadius: 6,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            zIndex: 6,
            // slight gradient to look 3d when open
            backgroundImage: isOpen
              ? 'linear-gradient(180deg, #e0b98a 0%, #e8c9a0 100%)'
              : undefined,
          }}
        />

        {/* ── Wax seal ── */}
        <motion.div
          animate={isOpen ? { opacity: 0, scale: 0, y: -10 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          style={{
            position: 'absolute',
            top: `${FLAP_DEPTH * 55}%`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 52,
            height: 52,
            background: 'radial-gradient(circle at 35% 35%, #d4686b, #7b2d37)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 14px rgba(123,45,55,0.5)',
            zIndex: 7,
          }}
        >
          ❤️
        </motion.div>

        {/* ── Hover shimmer ── */}
        <motion.div
          animate={isOpen ? { opacity: 0 } : { opacity: [0, 0.07, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
            borderRadius: 6,
            pointerEvents: 'none',
            zIndex: 8,
          }}
        />
      </motion.div>
    </div>
  );
}
