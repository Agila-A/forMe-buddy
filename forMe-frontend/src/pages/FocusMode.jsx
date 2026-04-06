import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Bell, BellOff, Sparkles, Wind } from 'lucide-react';
import useStore from '../store/useStore';
import DigitalAlarmClock from '../components/DigitalAlarmClock';

const FocusMode = () => {
  const { 
    timeLeft, 
    isRunning, 
    mode, 
    pauseTimer, 
    resetTimer, 
    setMode, 
    completeSession,
    notificationPermission,
    requestNotificationPermission
  } = useStore();

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  // Using a cozy chime sound
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleSessionEnd();
    }
  }, [timeLeft, isRunning]);

  const handleSessionEnd = () => {
    audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    
    if (notificationPermission === 'granted') {
      new Notification(mode === 'study' ? 'Time for a break! 🍃' : 'Break over! Ready to focus?', {
        body: 'Relax and refresh your mind.',
        icon: '/favicon.ico'
      });
    }
    
    if (mode === 'study') {
      setShowCompleteModal(true);
      pauseTimer();
    } else {
      setMode('study');
      pauseTimer();
      resetTimer(25);
    }
  };

  const onComplete = async (status) => {
    await completeSession({
      duration: 25,
      status,
      type: 'study',
      label: 'Focus Session'
    });
    setShowCompleteModal(false);
    setMode('break');
    resetTimer(5);
  };

  return (
    <div className="focus-mode-page" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '88vh',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Immersive Background Glows */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, opacity: 0.1, overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'var(--primary-green)', filter: 'blur(100px)', borderRadius: '50%' }}
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '15%', right: '15%', width: '350px', height: '350px', background: 'var(--soft-pink)', filter: 'blur(120px)', borderRadius: '50%' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem', zIndex: 1 }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.8rem', 
          color: 'var(--primary-green)', 
          marginBottom: '1rem',
          background: 'rgba(255,255,255,0.4)',
          padding: '0.5rem 1.5rem',
          borderRadius: '50px',
          width: 'fit-content',
          margin: '0 auto 1.5rem',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(10px)'
        }}>
          <Sparkles size={18} />
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 800 }}>
            {mode === 'study' ? 'Digital Flow' : 'Matcha Rest'}
          </span>
          <Wind size={18} />
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 400, opacity: 0.5, letterSpacing: '0.05em' }}>
          {mode === 'study' ? "You're doing amazing, keep flowing." : "Breathe in, breathe out."}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <DigitalAlarmClock />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ marginTop: '5rem', display: 'flex', gap: '3rem', alignItems: 'center' }}
      >
        <button 
          onClick={requestNotificationPermission}
          className="glass"
          style={{ 
            padding: '0.8rem 1.8rem', 
            borderRadius: '50px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.8rem',
            fontSize: '0.85rem',
            color: notificationPermission === 'granted' ? 'var(--primary-green)' : 'var(--text-dark)',
            fontWeight: 700,
            opacity: 0.8,
            border: '1px solid var(--glass-border)'
          }}
        >
          {notificationPermission === 'granted' ? <Bell size={18} fill="currentColor" /> : <BellOff size={18} />}
          {notificationPermission === 'granted' ? 'Alerts Enabled' : 'Enable Alerts'}
        </button>
      </motion.div>

      <AnimatePresence>
        {showCompleteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(74, 78, 47, 0.25)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="glass"
              style={{ 
                padding: '4rem', 
                textAlign: 'center', 
                maxWidth: '480px',
                width: '90%',
                borderRadius: '50px',
                border: '2px solid rgba(255,255,255,0.6)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                background: 'rgba(182, 187, 121, 0.1)', 
                width: '120px', height: '120px', 
                borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 2rem'
              }}>
                <Trophy size={54} color="var(--primary-green)" />
              </div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.8rem', fontWeight: 800 }}>Bloom gracefully!</h2>
              <p className="text-sub" style={{ marginBottom: '3rem', lineHeight: 1.8, fontSize: '1.1rem' }}>
                You completed your focus session. How do you feel about your progress today?
              </p>
              
              <div style={{ display: 'grid', gap: '1.2rem' }}>
                <button 
                  onClick={() => onComplete('completed')} 
                  className="glass" 
                  style={{ 
                    background: 'var(--primary-green)', 
                    color: 'white', padding: '1.4rem', 
                    borderRadius: '25px', fontWeight: 700,
                    fontSize: '1.1rem',
                    boxShadow: '0 10px 25px rgba(182, 187, 121, 0.3)'
                  }}
                >
                  Fully Focused 🍃
                </button>
                <button 
                  onClick={() => onComplete('partial')} 
                  className="glass" 
                  style={{ 
                    background: 'var(--soft-pink)', 
                    color: 'var(--text-dark)', 
                    padding: '1.4rem', 
                    borderRadius: '25px', 
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}
                >
                  Small Progress ✨
                </button>
                <button 
                  onClick={() => onComplete('skipped')} 
                  className="text-sub" 
                  style={{ padding: '0.8rem', fontSize: '0.95rem', fontWeight: 600 }}
                >
                  Didn't go as planned
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusMode;
