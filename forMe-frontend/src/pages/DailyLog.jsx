import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Send, Clock, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';

const DailyLog = () => {
  const { logs, fetchLogs, addLog } = useStore();
  const [formData, setFormData] = useState({ category: 'Coding', description: '', timeSpent: 30 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) return;
    
    setIsSubmitting(true);
    await addLog(formData);
    setFormData({ ...formData, description: '', timeSpent: 30 });
    setIsSubmitting(false);
  };

  const categories = ['Aptitude', 'Coding', 'Core'];

  return (
    <div className="daily-log-page">
      <header style={{ marginBottom: '2.5rem' }}>
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
        >
          <BookOpen size={18} color="var(--primary-green)" />
          <h1 className="text-sub" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Study Journal
          </h1>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '2.8rem', fontWeight: 600, color: 'var(--text-dark)' }}
        >
          Your daily <span style={{ color: 'var(--primary-green)' }}>reflections.</span>
        </motion.h2>
        <p className="text-sub" style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
          Document your progress, one step at a time.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass" 
          style={{ padding: '2.5rem', borderRadius: '40px', position: 'sticky', top: '100px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--primary-green)', width: '10px', height: '10px', borderRadius: '50%' }}></div>
            <h3 style={{ fontSize: '1.2rem' }}>Add New Entry</h3>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.8rem' }}>
            <div>
              <label className="text-sub" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.8rem', fontWeight: 600 }}>CHOOSE CATEGORY</label>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat})}
                    style={{ 
                      padding: '0.6rem 1.2rem', 
                      fontSize: '0.85rem', 
                      background: formData.category === cat ? 'var(--primary-green)' : 'rgba(255,255,255,0.4)',
                      color: formData.category === cat ? 'white' : 'var(--text-dark)',
                      borderRadius: '50px',
                      fontWeight: 600,
                      border: '1px solid var(--glass-border)',
                      boxShadow: formData.category === cat ? '0 5px 15px rgba(182, 187, 121, 0.3)' : 'none'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sub" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.8rem', fontWeight: 600 }}>DESCRIPTION</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="What did you focus on today? Any breakthroughs?"
                className="glass"
                style={{ height: '120px', resize: 'none', borderRadius: '20px', padding: '1.2rem' }}
                required
              />
            </div>

            <div>
              <label className="text-sub" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.8rem', fontWeight: 600 }}>TIME SPENT (MINS)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Clock size={20} color="var(--primary-green)" />
                <input 
                  type="number" 
                  value={formData.timeSpent} 
                  onChange={e => setFormData({...formData, timeSpent: e.target.value})}
                  className="glass"
                  style={{ borderRadius: '15px' }}
                  min="5"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="glass" 
              style={{ 
                background: 'var(--primary-green)', 
                color: 'white', 
                padding: '1.2rem', 
                borderRadius: '20px', 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.8rem',
                fontSize: '1.1rem',
                marginTop: '1rem',
                boxShadow: '0 8px 25px rgba(182, 187, 121, 0.3)'
              }}
            >
              <Send size={20} /> {isSubmitting ? 'Journaling...' : 'Add to Journal'}
            </button>
          </form>
        </motion.div>

        <div className="logs-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Recent Entries</h3>
            <Sparkles size={20} color="var(--accent-pink)" />
          </div>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <AnimatePresence mode="popLayout">
              {logs.map((log, index) => (
                <motion.div 
                  key={log._id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass"
                  style={{ 
                    padding: '2rem', 
                    display: 'flex', 
                    gap: '1.5rem', 
                    alignItems: 'flex-start',
                    borderRadius: '30px',
                    borderLeft: `6px solid ${log.category === 'Coding' ? 'var(--primary-green)' : log.category === 'Aptitude' ? 'var(--accent-pink)' : '#D17C84'}`
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="text-sub" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {new Date(log.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <div style={{ 
                        padding: '0.4rem 1rem', 
                        background: 'rgba(255,255,255,0.6)', 
                        borderRadius: '50px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        color: 'var(--text-dark)',
                        border: '1px solid var(--glass-border)'
                      }}>
                        {log.category.toUpperCase()}
                      </div>
                    </div>
                    <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: 'var(--text-dark)' }}>{log.description}</p>
                    <div style={{ 
                      marginTop: '1.2rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      color: 'var(--primary-green)', 
                      fontSize: '0.9rem', 
                      fontWeight: 600,
                      background: 'rgba(182, 187, 121, 0.1)',
                      width: 'fit-content',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '10px'
                    }}>
                      <Clock size={16} /> {log.timeSpent} mins session
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {logs.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                style={{ textAlign: 'center', padding: '6rem 2rem', border: '2px dashed rgba(0,0,0,0.05)', borderRadius: '40px' }}
              >
                <p style={{ fontSize: '1.1rem' }}>Your study journal is quiet. Time to add your first leaf! 🍃</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyLog;
