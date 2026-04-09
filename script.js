/* ─── script.js ─────────────────────────────────────────────── */

const envelope    = document.getElementById('envelope');
const envWrapper  = document.getElementById('envelope-wrapper');
const cardWrapper = document.getElementById('card-wrapper');
const restartBtn  = document.getElementById('restart-btn');
const canvas      = document.getElementById('confetti-canvas');
const ctx         = canvas.getContext('2d');

// ── Confetti ────────────────────────────────────────────────────
let pieces = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLOURS = ['#d4a843', '#c0575a', '#f5c6cb', '#fceabb', '#f8b4b8', '#7b2d37', '#fff'];

function spawnConfetti() {
  pieces = [];
  for (let i = 0; i < 160; i++) {
    pieces.push({
      x:    Math.random() * canvas.width,
      y:    -20 - Math.random() * 100,
      w:    6 + Math.random() * 8,
      h:    3 + Math.random() * 5,
      r:    Math.random() * Math.PI * 2,
      dr:   (Math.random() - 0.5) * 0.15,
      vx:   (Math.random() - 0.5) * 3,
      vy:   2 + Math.random() * 4,
      colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      alpha: 1
    });
  }
  cancelAnimationFrame(animFrame);
  drawConfetti();
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let alive = false;
  for (const p of pieces) {
    p.x  += p.vx;
    p.y  += p.vy;
    p.r  += p.dr;
    p.vy += 0.06; // gravity
    if (p.y > canvas.height - 60) p.alpha -= 0.025;
    if (p.alpha > 0) alive = true;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.colour;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  if (alive) animFrame = requestAnimationFrame(drawConfetti);
  else ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ── Envelope click ───────────────────────────────────────────────
envelope.addEventListener('click', openEnvelope);

function openEnvelope() {
  envelope.classList.add('is-open');

  // After letter slides up, show the card
  setTimeout(() => {
    envWrapper.style.opacity = '0';
    envWrapper.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      envWrapper.style.display = 'none';
      cardWrapper.classList.remove('hidden');
      spawnConfetti();
    }, 500);
  }, 1000);
}

// ── Restart ──────────────────────────────────────────────────────
restartBtn.addEventListener('click', () => {
  // Reset envelope
  envelope.classList.remove('is-open');
  envWrapper.style.display  = '';
  envWrapper.style.opacity  = '1';
  cardWrapper.classList.add('hidden');
  cancelAnimationFrame(animFrame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
