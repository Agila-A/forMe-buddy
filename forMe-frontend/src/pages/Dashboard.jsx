import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, TrendingUp, Zap, Calendar, ChevronRight, Layout } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';

const Dashboard = () => {
  const { stats, fetchStats, currentMonthData, fetchMonthTimetable } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    const today = new Date();
    const monthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    fetchMonthTimetable(monthPrefix);
  }, [fetchStats, fetchMonthTimetable]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = currentMonthData.find(t => t.date === todayStr)?.tasks || [];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="dashboard-page">
      <header style={{ marginBottom: '2.5rem' }}>
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
        >
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-green)' }}></span>
          <h1 className="text-sub" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Personal Study Space
          </h1>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '2.8rem', fontWeight: 600, color: 'var(--text-dark)' }}
        >
          Your daily focus <span style={{ color: 'var(--primary-green)' }}>flow.</span>
        </motion.h2>
      </header>

      <div className="stats-grid">
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="glass stat-card"
        >
          <div style={{ background: 'rgba(182, 187, 121, 0.12)', padding: '0.8rem', borderRadius: '15px', color: 'var(--primary-green)' }}>
            <Clock size={20} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-dark)' }}>{stats.totalHours || 0}h</div>
          <div className="text-sub" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Hours</div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="glass stat-card"
        >
          <div style={{ background: 'rgba(182, 187, 121, 0.12)', padding: '0.8rem', borderRadius: '15px', color: 'var(--primary-green)' }}>
            <CheckCircle size={20} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-dark)' }}>{stats.completedSessions || 0}</div>
          <div className="text-sub" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Completed</div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="glass stat-card"
        >
          <div style={{ background: 'rgba(242, 151, 160, 0.12)', padding: '0.8rem', borderRadius: '15px', color: 'var(--accent-pink)' }}>
            <TrendingUp size={20} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-dark)' }}>{stats.consistency || 0}%</div>
          <div className="text-sub" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Consistency</div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="glass stat-card"
        >
          <div style={{ background: 'rgba(242, 151, 160, 0.12)', padding: '0.8rem', borderRadius: '15px', color: 'var(--accent-pink)' }}>
            <Zap size={20} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-dark)' }}>{stats.streak || 0}</div>
          <div className="text-sub" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Day Streak</div>
        </motion.div>
      </div>

      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass" 
          style={{ padding: '2rem', minHeight: '280px', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
              <Calendar size={18} color="var(--primary-green)" />
              Daily Roadmap
            </h3>
            <Link to="/timetable" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-green)', display: 'flex', alignItems: 'center' }}>
              PLANNER <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '180px', paddingRight: '0.5rem' }}>
            {todayTasks.length > 0 ? (
              todayTasks.map((task, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: 'rgba(255,255,255,0.4)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: task.category === 'Study' ? 'var(--primary-green)' : task.category === 'Break' ? 'var(--accent-pink)' : '#D6CEA0' }} />
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.4 }}>{task.startTime} — {task.endTime}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{task.title}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4, border: '2px dashed rgba(0,0,0,0.05)', borderRadius: '20px', padding: '1rem' }}>
                <Layout size={24} style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.8rem' }}>No plans for today yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="glass pulse" 
          style={{ 
            padding: '2rem', 
            background: 'linear-gradient(135deg, #F9D0CE 0%, var(--bg-cream) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center',
            border: '2px solid rgba(242, 151, 160, 0.2)'
          }}
        >
          <h3 style={{ color: 'var(--accent-pink)', fontSize: '1.4rem' }}>Time for Focus?</h3>
          <p className="text-sub" style={{ fontSize: '0.9rem', maxWidth: '200px' }}>
            Click below to enter your immersive matcha study mode.
          </p>
          <button 
            onClick={() => navigate('/focus')}
            className="glass" 
            style={{
              background: 'var(--accent-pink)',
              color: 'white',
              padding: '0.8rem 2.5rem',
              borderRadius: '50px',
              fontWeight: 600,
              marginTop: '0.5rem',
              boxShadow: '0 4px 15px rgba(242, 151, 160, 0.3)'
            }}>
            Enter Focus Mode
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
