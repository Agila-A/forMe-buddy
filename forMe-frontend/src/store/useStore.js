import { create } from 'zustand';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const useStore = create((set, get) => ({
  // Timer State
  timeLeft: 25 * 60,
  isRunning: false,
  mode: 'study', // 'study', 'break'
  sessionLabel: '',
  
  // Dashboard Data
  stats: {
    totalHours: 0,
    completedSessions: 0,
    consistency: 0,
    streak: 0
  },
  
  // Schedule & Logs
  schedules: [],
  logs: [],
  
  // Timetable State
  currentMonthData: [], // Array of timetable objects for the month

  // Notification Permission
  notificationPermission: Notification.permission,

  // Actions
  fetchStats: async () => {
    try {
      const res = await axios.get(`${API_BASE}/dashboard`);
      set({ stats: res.data });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  },

  fetchSchedules: async () => {
    try {
      const res = await axios.get(`${API_BASE}/schedule`);
      set({ schedules: res.data });
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  },

  fetchLogs: async () => {
    try {
      const res = await axios.get(`${API_BASE}/logs`);
      set({ logs: res.data });
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  },

  fetchMonthTimetable: async (monthPrefix) => {
    try {
      const res = await axios.get(`${API_BASE}/timetable-month/${monthPrefix}`);
      set({ currentMonthData: res.data });
    } catch (err) {
      console.error("Error fetching month timetable:", err);
    }
  },

  saveDayTimetable: async (date, tasks) => {
    try {
      const res = await axios.post(`${API_BASE}/timetable`, { date, tasks });
      const { currentMonthData } = get();
      const index = currentMonthData.findIndex(t => t.date === date);
      let newData = [...currentMonthData];
      if (index > -1) {
        newData[index] = res.data;
      } else {
        newData.push(res.data);
      }
      set({ currentMonthData: newData });
      return res.data;
    } catch (err) {
      console.error("Error saving day timetable:", err);
    }
  },

  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),
  resetTimer: (minutes = 25) => set({ timeLeft: minutes * 60, isRunning: false }),
  tick: () => {
    const { timeLeft, isRunning } = get();
    if (isRunning && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else if (isRunning && timeLeft === 0) {
      set({ isRunning: false });
      // Notification trigger handled in component
    }
  },
  
  setMode: (mode) => {
    const time = mode === 'study' ? 25 * 60 : 5 * 60;
    set({ mode, timeLeft: time, isRunning: false });
  },

  setTimeLeft: (seconds) => set({ timeLeft: seconds }),

  completeSession: async (sessionData) => {
    try {
      console.log("Completing session:", sessionData);
      const res = await axios.post(`${API_BASE}/session`, {
        ...sessionData,
        userId: 'me',
        date: new Date()
      });
      get().fetchStats();
      return res.data;
    } catch (err) {
      console.error("Error completing session:", err);
    }
  },

  addLog: async (logData) => {
    try {
      const res = await axios.post(`${API_BASE}/logs`, {
        ...logData,
        userId: 'me',
        date: new Date()
      });
      get().fetchLogs();
      get().fetchStats();
      return res.data;
    } catch (err) {
      console.error("Error adding log:", err);
    }
  },

  saveSchedule: async (scheduleData) => {
    try {
      const res = await axios.post(`${API_BASE}/schedule`, {
        ...scheduleData,
        userId: 'me'
      });
      get().fetchSchedules();
      return res.data;
    } catch (err) {
      console.error("Error saving schedule:", err);
    }
  },

  adjustTime: (seconds) => {
    const { timeLeft } = get();
    set({ timeLeft: Math.max(0, timeLeft + seconds) });
  },

  requestNotificationPermission: async () => {
    const permission = await Notification.requestPermission();
    set({ notificationPermission: permission });
  }
}));

export default useStore;
