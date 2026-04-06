import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Clock, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';

const Scheduler = () => {
  const { saveSchedule } = useStore();
  const [slots, setSlots] = useState([
    { startTime: '09:00', endTime: '10:30', label: 'Morning Focus', repeatDays: [1,2,3,4,5] }
  ]);
  const [dateRange, setDateRange] = useState({ 
    start: new Date().toISOString().split('T')[0], 
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
  });

  const addSlot = () => {
    setSlots([...slots, { startTime: '11:00', endTime: '12:30', label: 'New Focus Slot', repeatDays: [1,2,3,4,5] }]);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!dateRange.start || !dateRange.end) {
      alert('Please select a date range 🍃');
      return;
    }
    await saveSchedule({
      startDate: dateRange.start,
      endDate: dateRange.end,
      timeSlots: slots
    });
    alert('Your routine has been beautifully saved! ✨');
  };

  return (
    <div className="scheduler-page">
      <header style={{ marginBottom: '2.5rem' }}>
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
        >
          <Sparkles size={18} color="var(--primary-green)" />
          <h1 className="text-sub" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Routine Builder
          </h1>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '2.8rem', fontWeight: 600, color: 'var(--text-dark)' }}
        >
          Design your <span style={{ color: 'var(--primary-green)' }}>matcha flow.</span>
        </motion.h2>
        <p className="text-sub" style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
          Craft study sessions that feel like a gentle breeze.
        </p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass" 
        style={{ padding: '2.5rem', marginBottom: '3rem', borderRadius: '40px' }}
      >
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="text-sub" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.8rem', fontWeight: 600 }}>STARTING FROM</label>
            <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="glass" style={{ borderRadius: '15px' }} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="text-sub" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.8rem', fontWeight: 600 }}>ENDING AT</label>
            <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="glass" style={{ borderRadius: '15px' }} />
          </div>
        </div>

        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Time Slots</h3>
        <div className="slots-container" style={{ display: 'grid', gap: '1.2rem' }}>
          <AnimatePresence mode="popLayout">
            {slots.map((slot, index) => (
              <motion.div 
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass"
                style={{ 
                  padding: '1.5rem 2rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '2rem', 
                  background: 'rgba(255,255,255,0.4)',
                  borderRadius: '25px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flex: 1, minWidth: '250px' }}>
                  <div style={{ background: 'rgba(182, 187, 121, 0.1)', padding: '0.8rem', borderRadius: '15px' }}>
                    <Clock size={20} color="var(--primary-green)" />
                  </div>
                  <input type="time" value={slot.startTime} onChange={e => {
                    const newSlots = [...slots];
                    newSlots[index].startTime = e.target.value;
                    setSlots(newSlots);
                  }} style={{ width: 'auto', background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: 500 }} />
                  <span className="text-sub" style={{ opacity: 0.5 }}>-</span>
                  <input type="time" value={slot.endTime} onChange={e => {
                    const newSlots = [...slots];
                    newSlots[index].endTime = e.target.value;
                    setSlots(newSlots);
                  }} style={{ width: 'auto', background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: 500 }} />
                </div>
                
                <input 
                  type="text" 
                  placeholder="Focus Goal (e.g. Algorithms)" 
                  value={slot.label} 
                  onChange={e => {
                    const newSlots = [...slots];
                    newSlots[index].label = e.target.value;
                    setSlots(newSlots);
                  }}
                  style={{ 
                    flex: 2, 
                    minWidth: '200px', 
                    background: 'transparent', 
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: 0,
                    padding: '0.5rem 0'
                  }}
                />

                <button 
                  onClick={() => removeSlot(index)} 
                  className="text-sub hover-scale"
                  style={{ padding: '0.5rem', color: '#F297A0' }}
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <button 
            onClick={addSlot} 
            className="glass" 
            style={{ 
              padding: '1rem 2rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.8rem', 
              color: 'var(--primary-green)', 
              fontWeight: 600,
              borderRadius: '50px'
            }}
          >
            <Plus size={20} /> Add Time Slot
          </button>
          
          <button 
            onClick={handleSave} 
            className="glass" 
            style={{ 
              background: 'var(--primary-green)', 
              color: 'white', 
              padding: '1rem 3rem', 
              borderRadius: '50px', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              boxShadow: '0 8px 25px rgba(182, 187, 121, 0.3)'
            }}
          >
            <Save size={20} /> Save Routine
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Scheduler;
