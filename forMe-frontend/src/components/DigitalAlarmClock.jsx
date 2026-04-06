import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Plus, Minus } from 'lucide-react';
import useStore from '../store/useStore';

const DigitalAlarmClock = () => {
  const { 
    timeLeft, 
    isRunning, 
    mode, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    setMode,
    adjustTime 
  } = useStore();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="digital-clock-body">
      {/* Top Handle Decoration */}
      <div style={{ 
        position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
        width: '140px', height: '12px', background: 'rgba(255,255,255,0.4)',
        borderRadius: '8px 8px 0 0', border: '1px solid var(--glass-border)',
        borderBottom: 'none'
      }}></div>

      {/* Main Digital Display Area */}
      <div className="lcd-screen">
        <div style={{ 
          position: 'absolute', top: '15px', left: '25px', right: '25px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div 
              className="led-indicator" 
              style={{ color: isRunning ? 'var(--primary-green)' : 'rgba(0,0,0,0.1)', background: 'currentColor' }}
            ></div>
            <span className="text-sub" style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em' }}>
              {isRunning ? 'RECORDING FLOW' : 'STANDBY'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="text-sub" style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', color: mode === 'study' ? 'var(--primary-green)' : 'var(--accent-pink)' }}>
              {mode.toUpperCase()}
            </span>
            <div 
              className="led-indicator" 
              style={{ 
                color: mode === 'study' ? 'var(--primary-green)' : 'var(--accent-pink)', 
                background: 'currentColor',
                width: '6px', height: '6px'
              }}
            ></div>
          </div>
        </div>

        <motion.div 
          key={timeLeft}
          initial={{ opacity: 0.9, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="digital-font"
          style={{ 
            fontSize: '8.5rem', 
            fontWeight: 700, 
            color: 'var(--text-dark)',
            lineHeight: 1,
            marginTop: '1.2rem',
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 4px 20px rgba(74, 78, 47, 0.08)'
          }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </motion.div>

        <div style={{ 
          marginTop: '1rem', 
          opacity: 0.3, 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          {mode === 'study' ? 'Deep Work Cycle' : 'Matcha Transition'}
        </div>

        {/* Ambient Glows Inside LCD */}
        <div style={{ 
          position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px',
          background: mode === 'study' ? 'var(--primary-green)' : 'var(--accent-pink)',
          filter: 'blur(60px)', opacity: isRunning ? 0.15 : 0.05, borderRadius: '50%'
        }}></div>
      </div>

      {/* Control Hub Layout */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.2rem' }}>
          <button 
            onClick={() => adjustTime(-60)} 
            className="tactile-btn"
            title="Subtract 1m"
          >
            <Minus size={18} /> 1m
          </button>

          <button 
            onClick={() => resetTimer(mode === 'study' ? 25 : 5)}
            className="tactile-btn"
            title="Reset Session"
          >
            <RotateCcw size={18} />
          </button>

          <button 
            onClick={isRunning ? pauseTimer : startTimer}
            className="tactile-btn primary"
            style={{ padding: '1rem' }}
          >
            {isRunning ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" style={{ marginLeft: '4px' }} />}
          </button>

          <button 
            onClick={() => setMode(mode === 'study' ? 'break' : 'study')}
            className="tactile-btn accent"
            title="Switch Mode"
          >
            {mode === 'study' ? <Coffee size={18} /> : <Zap size={18} />}
          </button>

          <button 
            onClick={() => adjustTime(60)} 
            className="tactile-btn"
            title="Add 1m"
          >
            <Plus size={18} /> 1m
          </button>
        </div>

        {/* Quick Shift Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '2.5rem',
          padding: '0.8rem',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          border: '1px solid var(--glass-border)'
        }}>
          <button 
            onClick={() => adjustTime(-300)} 
            className="hover-scale"
            style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-pink)', letterSpacing: '0.1em' }}
          >
            -5 MINS
          </button>
          
          <div style={{ width: '1px', height: '12px', background: 'rgba(0,0,0,0.06)' }}></div>
          
          <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dark)', opacity: 0.3, letterSpacing: '0.2em' }}>
            QUICK ADJUST
          </span>
          
          <div style={{ width: '1px', height: '12px', background: 'rgba(0,0,0,0.06)' }}></div>
          
          <button 
            onClick={() => adjustTime(300)} 
            className="hover-scale"
            style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-green)', letterSpacing: '0.1em' }}
          >
            +5 MINS
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalAlarmClock;
