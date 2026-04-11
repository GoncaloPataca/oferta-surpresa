import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

/* ─── Dimensions ───────────────────────────────────────────── */
const W = 360;   // envelope width
const H = 240;   // envelope height
const R = 10;    // corner radius on the body rect

/* ─── Colour palette ───────────────────────────────────────── */
const C = {
  body:       '#FDEBD0',   // warm cream body
  bodyShade:  '#F5D5B0',   // slightly darker for side triangles
  bottom:     '#EEC89A',   // bottom flap
  lid:        '#E8A87C',   // lid / top flap (outside)
  lidInner:   '#F5D0A9',   // lid inside (seen when open)
  fold:       '#D4956A',   // fold crease line colour
  paper:      '#FFFDF5',   // letter paper
  paperLine:  '#F0E8D8',   // ruled lines on paper
  rose:       '#C0575A',
  deep:       '#7B2D37',
  gold:       '#D4A843',
  text:       '#3D2B1F',
};

/* ─── Letter content ───────────────────────────────────────── */
const LETTER_LINES = [
  { text: 'Querida Mãe,', style: 'salutation' as const },
  { text: '', style: 'gap' as const },
  { text: 'Hoje é um dia muito especial —', style: 'body' as const },
  { text: 'o teu dia! ✨', style: 'body' as const },
  { text: '', style: 'gap' as const },
  { text: 'Estas palavras são pequenas de mais', style: 'body' as const },
  { text: 'para dizer o quanto te amo,', style: 'body' as const },
  { text: 'mas são escritas com o coração. 💛', style: 'body' as const },
  { text: '', style: 'gap' as const },
  { text: 'Com todo o amor, o teu filho/a 🌸', style: 'sig' as const },
];

interface EnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
}

export function Envelope({ isOpen, onOpen }: EnvelopeProps) {
  const sealCtrl = useAnimation();

  // Seal wobble on mount — beckoning the user
  useEffect(() => {
    if (!isOpen) {
      sealCtrl.start({
        rotate: [0, -8, 8, -5, 5, 0],
        scale:  [1, 1.08, 1.08, 1.04, 1.04, 1],
        transition: { duration: 1.8, repeat: Infinity, repeatDelay: 2.5 },
      });
    } else {
      sealCtrl.stop();
    }
  }, [isOpen, sealCtrl]);

  /* ── z-layer strategy:
       0  envelope back rect (clip = full)
       1  left + right inner triangles (decorative V seam on front face)
       2  bottom triangle (pocket, above letter when closed)
       3  letter (slides up through z:3, above pocket when rising)
       4  lid INNER face (visible when lid is open / flipped over)
       5  lid OUTER face (the flap, sits on top of seal when closed)
       6  seal (sits on the lid fold, disappears before lid opens)
  ── */

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>

      {/* ── Hint ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: [0.5, 1, 0.5], y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{ duration: 2.6, repeat: Infinity }}
            style={{
              color: C.deep,
              fontSize: '0.95rem',
              fontWeight: 300,
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            Clica no envelope para abrir a tua surpresa 🎁
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Outer wrapper: sets perspective for 3-D lid flip ── */}
      <motion.div
        onClick={!isOpen ? onOpen : undefined}
        whileHover={!isOpen ? { y: -6, scale: 1.03 } : {}}
        whileTap={!isOpen ? { scale: 0.97 } : {}}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          position: 'relative',
          width: W,
          height: H,
          cursor: isOpen ? 'default' : 'pointer',
          perspective: 900,
          filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.25))',
        }}
      >

        {/* ════════════════════════════════════════════
            LAYER 0 – envelope body (cream rectangle)
            Also carries the cute heart-dot pattern
        ════════════════════════════════════════════ */}
        <svg
          width={W} height={H}
          style={{ position: 'absolute', inset: 0, zIndex: 0, borderRadius: R, overflow: 'hidden' }}
          viewBox={`0 0 ${W} ${H}`}
        >
          <defs>
            {/* polka-dot pattern */}
            <pattern id="dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
              <text x="11" y="14" textAnchor="middle" fontSize="9" opacity="0.18">♥</text>
            </pattern>
          </defs>
          <rect x="0" y="0" width={W} height={H} rx={R} ry={R} fill={C.body} />
          <rect x="0" y="0" width={W} height={H} rx={R} ry={R} fill="url(#dots)" />
        </svg>

        {/* ════════════════════════════════════════════
            LAYER 1 – inner V seam (left + right triangles
            give the "folded sides" illusion on the front face)
        ════════════════════════════════════════════ */}
        <svg
          width={W} height={H}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
          viewBox={`0 0 ${W} ${H}`}
        >
          {/* left */}
          <polygon points={`0,0 0,${H} ${W / 2},${H * 0.52}`} fill={C.bodyShade} opacity="0.55" />
          {/* right */}
          <polygon points={`${W},0 ${W},${H} ${W / 2},${H * 0.52}`} fill={C.bodyShade} opacity="0.45" />
          {/* crease lines */}
          <line x1="0" y1="0"    x2={W / 2} y2={H * 0.52} stroke={C.fold} strokeWidth="0.8" opacity="0.35" />
          <line x1={W} y1="0"    x2={W / 2} y2={H * 0.52} stroke={C.fold} strokeWidth="0.8" opacity="0.35" />
          <line x1="0" y1={H}    x2={W / 2} y2={H * 0.52} stroke={C.fold} strokeWidth="0.8" opacity="0.35" />
          <line x1={W} y1={H}    x2={W / 2} y2={H * 0.52} stroke={C.fold} strokeWidth="0.8" opacity="0.35" />
        </svg>

        {/* ════════════════════════════════════════════
            LAYER 2 – bottom pocket triangle
            Sits ABOVE the letter when closed so the
            letter appears tucked inside.
        ════════════════════════════════════════════ */}
        <svg
          width={W} height={H}
          style={{ position: 'absolute', inset: 0, zIndex: 2 }}
          viewBox={`0 0 ${W} ${H}`}
        >
          <polygon
            points={`0,${H} ${W / 2},${H * 0.52} ${W},${H}`}
            fill={C.bottom}
          />
          {/* subtle highlight along top edge */}
          <line
            x1="0" y1={H}
            x2={W / 2} y2={H * 0.52}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"
          />
          <line
            x1={W} y1={H}
            x2={W / 2} y2={H * 0.52}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"
          />
        </svg>

        {/* ════════════════════════════════════════════
            LAYER 3 – the LETTER
            Peeks out of the pocket, then rises up.
            z:3 means it's ABOVE the pocket but BELOW
            the lid, so it looks like it slides out
            cleanly.
        ════════════════════════════════════════════ */}
        <motion.div
          initial={false}
          animate={isOpen
            ? { y: -(H * 0.78), rotate: -2 }
            : { y: H * 0.12,    rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 95,
            damping: 18,
            delay: isOpen ? 0.72 : 0,
          }}
          style={{
            position: 'absolute',
            left: W * 0.08,
            width: W * 0.84,
            top: 0,
            height: H * 0.88,
            zIndex: 3,
            borderRadius: 6,
            overflow: 'hidden',
            transformOrigin: 'bottom center',
            boxShadow: '0 4px 18px rgba(0,0,0,0.13)',
          }}
        >
          {/* Paper background with ruled lines */}
          <svg
            width="100%" height="100%"
            style={{ position: 'absolute', inset: 0 }}
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="lines" x="0" y="28" width="100%" height="22" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="100%" y2="0" stroke={C.paperLine} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={C.paper} />
            <rect width="100%" height="100%" fill="url(#lines)" />
            {/* left margin rule */}
            <line x1="36" y1="0" x2="36" y2="100%" stroke="#F5C6CB" strokeWidth="1.2" />
          </svg>

          {/* Text content */}
          <div style={{ position: 'relative', padding: '16px 18px 16px 44px' }}>
            {LETTER_LINES.map((line, i) => {
              const isSalutation = line.style === 'salutation';
              const isSig        = line.style === 'sig';
              const isGap        = line.style === 'gap';
              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                  transition={{ delay: 0.95 + i * 0.08, duration: 0.3 }}
                  style={{
                    fontFamily:  isSalutation || isSig ? 'Playfair Display, serif' : 'Lato, sans-serif',
                    fontStyle:   isSig ? 'italic' : 'normal',
                    fontSize:    isSalutation ? '1rem' : isSig ? '0.85rem' : '0.78rem',
                    fontWeight:  isSalutation ? 700 : 300,
                    color:       isSalutation ? C.rose : isSig ? C.gold : C.text,
                    lineHeight:  1.75,
                    marginBottom: isGap ? '0.5em' : 0,
                    minHeight:   isGap ? '0.5em' : undefined,
                  }}
                >
                  {line.text}
                </motion.p>
              );
            })}
          </div>

          {/* Tiny folded-corner dog-ear */}
          <svg
            width="28" height="28"
            style={{ position: 'absolute', top: 0, right: 0 }}
            viewBox="0 0 28 28"
          >
            <polygon points="28,0 28,28 0,0" fill={C.paperLine} />
            <line x1="0" y1="0" x2="28" y2="28" stroke={C.paperLine} strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* ════════════════════════════════════════════
            LAYER 4 – lid INNER face
            Revealed when the lid flips back.
            Same triangle shape as outer lid but inner colour.
            Rendered slightly BEHIND the outer lid (same
            transformOrigin, so they flip together).
        ════════════════════════════════════════════ */}
        <motion.div
          initial={false}
          animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: isOpen ? 0.05 : 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            pointerEvents: 'none',
          }}
        >
          {/* Back-face (inner lid colour) */}
          <svg
            width={W} height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          >
            <polygon
              points={`0,0 ${W / 2},${H * 0.54} ${W},0`}
              fill={C.lidInner}
            />
            <line
              x1="0" y1="0" x2={W / 2} y2={H * 0.54}
              stroke={C.fold} strokeWidth="0.7" opacity="0.4"
            />
            <line
              x1={W} y1="0" x2={W / 2} y2={H * 0.54}
              stroke={C.fold} strokeWidth="0.7" opacity="0.4"
            />
          </svg>
        </motion.div>

        {/* ════════════════════════════════════════════
            LAYER 5 – lid OUTER face (the flap)
            This is what flips open. Rendered as a div
            with perspective so it rotates around its
            top edge revealing the inner face above.
        ════════════════════════════════════════════ */}
        <motion.div
          initial={false}
          animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: isOpen ? 0.05 : 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            pointerEvents: 'none',
          }}
        >
          {/* Front face of lid */}
          <svg
            width={W} height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
            }}
          >
            <defs>
              <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#EF9D5A" />
                <stop offset="100%" stopColor={C.lid} />
              </linearGradient>
              {/* scalloped / lace edge along the bottom of the flap */}
              <clipPath id="flapClip">
                <polygon points={`0,0 ${W / 2},${H * 0.56} ${W},0`} />
              </clipPath>
            </defs>
            {/* Main flap shape */}
            <polygon
              points={`0,0 ${W / 2},${H * 0.56} ${W},0`}
              fill="url(#lidGrad)"
            />
            {/* Subtle inner shadow at the fold */}
            <polygon
              points={`0,0 ${W / 2},${H * 0.56} ${W},0`}
              fill="none"
              stroke={C.fold}
              strokeWidth="1.2"
              opacity="0.3"
            />
            {/* Decorative scallop row near the flap edge */}
            {Array.from({ length: 11 }, (_, k) => {
              const t  = (k + 0.5) / 11;
              const cx = t * W;
              const cy = t < 0.5
                ? (t / 0.5) * (H * 0.56)
                : ((1 - t) / 0.5) * (H * 0.56);
              return (
                <circle
                  key={k}
                  cx={cx}
                  cy={cy - 7}
                  r="4.5"
                  fill={C.bottom}
                  opacity="0.55"
                />
              );
            })}
            {/* Tiny flower motif in center of flap */}
            <text x={W / 2} y={H * 0.22} textAnchor="middle" fontSize="26" opacity="0.22">
              🌸
            </text>
          </svg>
        </motion.div>

        {/* ════════════════════════════════════════════
            LAYER 6 – wax seal
            Sits right on the fold crease. Pops off
            before the lid starts rotating.
        ════════════════════════════════════════════ */}
        <motion.div
          initial={false}
          animate={isOpen
            ? { scale: 0, opacity: 0, y: -16, rotate: 20 }
            : { scale: 1, opacity: 1, y: 0,   rotate: 0 }}
          transition={{ duration: 0.22, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            top: H * 0.5,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 6,
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div animate={sealCtrl} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Outer ring */}
            <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <radialGradient id="sealGrad" cx="38%" cy="35%">
                  <stop offset="0%"   stopColor="#D4686B" />
                  <stop offset="100%" stopColor={C.deep}  />
                </radialGradient>
              </defs>
              {/* 12-pointed star for a proper wax-seal look */}
              <polygon
                points={[...Array(12)].map((_, k) => {
                  const angle = (k * 30 - 90) * (Math.PI / 180);
                  const r     = k % 2 === 0 ? 27 : 20;
                  return `${28 + r * Math.cos(angle)},${28 + r * Math.sin(angle)}`;
                }).join(' ')}
                fill="url(#sealGrad)"
              />
              <circle cx="28" cy="28" r="17" fill="url(#sealGrad)" />
              <circle cx="28" cy="28" r="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            </svg>
            {/* Heart emoji centred on the seal */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
            }}>
              ❤️
            </div>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════════
            Idle shimmer sweep
        ════════════════════════════════════════════ */}
        <motion.div
          animate={isOpen ? { opacity: 0 } : { opacity: [0, 0.06, 0], x: [-W * 0.5, W * 0.5] }}
          transition={isOpen ? { duration: 0 } : { duration: 2.8, repeat: Infinity, repeatDelay: 3 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: R,
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 9,
          }}
        />

      </motion.div>
    </div>
  );
}
