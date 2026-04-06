import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Clock, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';

const DailyTimetableModal = ({ date, onClose }) => {
  const { currentMonthData, saveDayTimetable } = useStore();
  const dayData = currentMonthData.find(t => t.date === date) || { date, tasks: [] };
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', startTime: '08:00', endTime: '09:00', category: 'Study' });

  const hours = Array.from({ length: 16 }).map((_, i) => i + 8); // 8 AM to 11 PM

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    // Enforce 30 min minimum duration
    const [h1, m1] = newTask.startTime.split(':').map(Number);
    const [h2, m2] = newTask.endTime.split(':').map(Number);
    const duration = (h2 * 60 + m2) - (h1 * 60 + m1);
    
    if (duration < 30) {
      alert("A cozy session should be at least 30 minutes! 🍃");
      return;
    }

    const updatedTasks = [...dayData.tasks, newTask].sort((a, b) => a.startTime.localeCompare(b.startTime));
    await saveDayTimetable(date, updatedTasks);
    setNewTask({ title: '', startTime: '08:00', endTime: '09:00', category: 'Study' });
    setShowAddForm(false);
  };

  const removeTask = async (index) => {
    const updatedTasks = dayData.tasks.filter((_, i) => i !== index);
    await saveDayTimetable(date, updatedTasks);
  };

  const timeToY = (time) => {
    const [h, m] = time.split(':').map(Number);
    // 8 AM is 0 offset. 1 hour = 80px.
    const hourOffset = (h - 8) * 80;
    const minOffset = (m / 60) * 80;
    return hourOffset + minOffset;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass"
        onClick={e => e.stopPropagation()}
        style={{ 
          width: '90%', maxWidth: '650px', height: '88vh', 
          padding: '2.5rem', display: 'flex', flexDirection: 'column',
          borderRadius: '45px', border: '2px solid rgba(255,255,255,0.7)',
          boxShadow: '0 40px 100px rgba(74, 78, 47, 0.2)'
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-green)', marginBottom: '0.2rem' }}>
              <Clock size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>TIMELINE</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>{new Date(date).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
          </div>
          <button onClick={onClose} className="hover-scale" style={{ background: 'rgba(0,0,0,0.04)', padding: '0.6rem', borderRadius: '50%' }}>
            <X size={24} />
          </button>
        </header>

        <div className="timeline-scroll">
          {hours.map(h => (
            <div key={h} className="timeline-hour-row">
              <span className="timeline-label">
                {h === 12 ? '12 PM' : h > 12 ? `${h-12} PM` : `${h} AM`}
              </span>
            </div>
          ))}

          {dayData.tasks.map((task, i) => {
            const top = timeToY(task.startTime);
            const height = timeToY(task.endTime) - top;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`timetable-task-block task-${task.category}`}
                style={{ top: top + 1, height: Math.max(height - 2, 40) }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 600 }}>{task.startTime} — {task.endTime}</div>
                  </div>
                  <button 
                    onClick={() => removeTask(i)} 
                    style={{ 
                      opacity: 0.3, background: 'rgba(0,0,0,0.1)', 
                      borderRadius: '50%', padding: '4px', display: 'flex' 
                    }}
                    className="hover-scale"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          {!showAddForm ? (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              className="glass"
              style={{ 
                width: '100%', padding: '1.2rem', borderRadius: '25px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                gap: '0.8rem', color: 'var(--primary-green)', fontWeight: 800,
                background: 'rgba(182, 187, 121, 0.08)',
                border: '1px dashed var(--primary-green)'
              }}
            >
              <Plus size={20} /> Add New Activity
            </motion.button>
          ) : (
            <motion.form 
              onSubmit={handleAddTask}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass" 
              style={{ padding: '2rem', background: 'rgba(255,255,255,0.7)', borderRadius: '30px' }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="text-sub" style={{ fontSize: '0.75rem', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>ACTIVITY TITLE</label>
                <input 
                  type="text" 
                  placeholder="e.g. Matcha Coffee Break 🍵" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  autoFocus
                  className="glass"
                  style={{ borderRadius: '15px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="text-sub" style={{ fontSize: '0.75rem', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>START</label>
                  <input type="time" value={newTask.startTime} onChange={e => setNewTask({...newTask, startTime: e.target.value})} className="glass" style={{ borderRadius: '12px' }} />
                </div>
                <div>
                  <label className="text-sub" style={{ fontSize: '0.75rem', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>END</label>
                  <input type="time" value={newTask.endTime} onChange={e => setNewTask({...newTask, endTime: e.target.value})} className="glass" style={{ borderRadius: '12px' }} />
                </div>
                <div>
                  <label className="text-sub" style={{ fontSize: '0.75rem', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>VIBE</label>
                  <select value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})} className="glass" style={{ borderRadius: '12px' }}>
                    <option value="Study">Study 📚</option>
                    <option value="Break">Break 🍵</option>
                    <option value="Personal">Personal ✨</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="glass" style={{ flex: 2, padding: '1rem', color: 'white', background: 'var(--primary-green)', borderRadius: '18px', fontWeight: 700, boxShadow: '0 8px 20px rgba(182, 187, 121, 0.3)' }}>
                  Add to Routine
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '18px', fontWeight: 700 }}>
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DailyTimetableModal;
