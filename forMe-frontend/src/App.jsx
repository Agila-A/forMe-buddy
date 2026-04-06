import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Calendar, Clock, BookOpen, Layout } from 'lucide-react';
import useStore from './store/useStore';
import Dashboard from './pages/Dashboard';
import Scheduler from './pages/Scheduler';
import FocusMode from './pages/FocusMode';
import DailyLog from './pages/DailyLog';
import Timetable from './pages/Timetable';

function App() {
  const { fetchStats, fetchSchedules, fetchLogs, tick } = useStore();

  useEffect(() => {
    fetchStats();
    fetchSchedules();
    fetchLogs();
    
    const intervalId = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [fetchStats, fetchSchedules, fetchLogs, tick]);

  return (
    <Router>
      <nav>
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
          for<span style={{ color: 'var(--primary-green)' }}>Me</span> 🍃
        </div>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title="Dashboard"
          >
            <Home size={22} />
          </NavLink>
          <NavLink 
            to="/timetable" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title="Timetable Planner"
          >
            <Calendar size={22} />
          </NavLink>
          <NavLink 
            to="/scheduler" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title="Schedule Builder"
          >
            <Layout size={22} />
          </NavLink>
          <NavLink 
            to="/focus" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title="Focus Mode"
          >
            <Clock size={22} />
          </NavLink>
          <NavLink 
            to="/log" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title="Daily Log"
          >
            <BookOpen size={22} />
          </NavLink>
        </div>
        <div style={{ width: '60px' }}></div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="/log" element={<DailyLog />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
