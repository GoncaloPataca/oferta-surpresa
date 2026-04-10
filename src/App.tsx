import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FloatingPetals } from './components/FloatingPetals';
import { Envelope } from './components/Envelope';
import { BirthdayCard } from './components/BirthdayCard';
import './App.css';

type Stage = 'idle' | 'opening' | 'card';

function App() {
  const [stage, setStage] = useState<Stage>('idle');

  function handleOpen() {
    setStage('opening');
    // After the letter finishes rising, cross-fade to the card
    setTimeout(() => setStage('card'), 2400);
  }

  function handleRestart() {
    setStage('idle');
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {stage !== 'card' ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.88, transition: { duration: 0.45 } }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Envelope onOpen={handleOpen} isOpen={stage === 'opening'} />
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <BirthdayCard onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
