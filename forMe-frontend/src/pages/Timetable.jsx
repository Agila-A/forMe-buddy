import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import DailyTimetableModal from '../components/DailyTimetableModal';

const Timetable = () => {
  const { currentMonthData, fetchMonthTimetable } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const monthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    fetchMonthTimetable(monthPrefix);
  }, [monthPrefix, fetchMonthTimetable]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = [];
  // Padding for first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`pad-${i}`} className="calendar-day-card other-month"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${monthPrefix}-${String(d).padStart(2, '0')}`;
    const dayData = currentMonthData.find(t => t.date === dateStr);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <motion.div
        key={d}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`calendar-day-card ${isToday ? 'current' : ''}`}
        onClick={() => setSelectedDate(dateStr)}
      >
        <span className="day-number">{d}</span>
        <div className="day-tasks-dots">
          {dayData?.tasks.slice(0, 4).map((t, i) => (
            <div 
              key={i} 
              className="task-dot" 
              style={{ 
                background: t.category === 'Study' ? 'var(--primary-green)' : t.category === 'Break' ? 'var(--accent-pink)' : '#D6CEA0' 
              }}
            ></div>
          ))}
          {dayData?.tasks.length > 4 && <span style={{fontSize: '0.6rem', opacity: 0.5}}>+</span>}
        </div>
      </motion.div>
    );
  }

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="timetable-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(182, 187, 121, 0.2)', padding: '0.5rem', borderRadius: '12px', color: 'var(--primary-green)' }}>
              <CalendarIcon size={20} />
            </div>
            <h1 className="text-sub" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Planned Routine
            </h1>
          </div>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 600, color: 'var(--text-dark)' }}>
            {monthYear}
            <Sparkles size={24} color="var(--accent-pink)" style={{ marginLeft: '1rem', display: 'inline' }} />
          </h2>
        </div>

        <div className="glass" style={{ display: 'flex', gap: '1.2rem', padding: '0.8rem 1.5rem', borderRadius: '50px', background: 'rgba(255,255,255,0.6)' }}>
          <button onClick={prevMonth} className="hover-scale" style={{ color: 'var(--text-dark)' }}><ChevronLeft size={28} /></button>
          <div style={{ width: '1px', background: 'rgba(0,0,0,0.05)', height: '24px' }}></div>
          <button onClick={nextMonth} className="hover-scale" style={{ color: 'var(--text-dark)' }}><ChevronRight size={28} /></button>
        </div>
      </header>

      <div className="calendar-grid">
        {dayHeaders.map(day => <div key={day} className="calendar-day-header">{day}</div>)}
        {days}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <DailyTimetableModal 
            date={selectedDate} 
            onClose={() => setSelectedDate(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timetable;
