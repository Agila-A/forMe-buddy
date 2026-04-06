const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const Session = require('../models/Session');
const Log = require('../models/Log');
const Timetable = require('../models/Timetable');

// ----- Timetable Routes -----
router.get('/timetable/:date', async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ userId: 'me', date: req.params.date });
    res.json(timetable || { date: req.params.date, tasks: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/timetable', async (req, res) => {
  const { date, tasks } = req.body;
  console.log("Incoming Timetable Data:", { date, tasks });
  try {
    let timetable = await Timetable.findOne({ userId: 'me', date });
    if (timetable) {
      timetable.tasks = tasks;
      timetable.markModified('tasks');
      const updatedTimetable = await timetable.save();
      console.log("Timetable Updated ✅");
      res.json(updatedTimetable);
    } else {
      const newTimetable = new Timetable({ userId: 'me', date, tasks });
      const savedTimetable = await newTimetable.save();
      console.log("New Timetable Created ✅");
      res.json(savedTimetable);
    }
  } catch (err) {
    console.error("Timetable Save Error ❌:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// For Month view (fetch all tasks for a specific month prefix "YYYY-MM")
router.get('/timetable-month/:month', async (req, res) => {
  try {
    const monthPrefix = req.params.month; // "2026-04"
    const timetables = await Timetable.find({ 
      userId: 'me', 
      date: { $regex: `^${monthPrefix}` } 
    });
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----- Schedule Routes -----
router.get('/schedule', async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: 'me' });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/schedule', async (req, res) => {
  const schedule = new Schedule({
    ...req.body,
    userId: 'me'
  });
  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update schedule (for repeating daily time slots)
router.patch('/schedule/:id', async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ----- Session Routes -----
router.get('/session', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: 'me' }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/session', async (req, res) => {
  const session = new Session({
    ...req.body,
    userId: 'me'
  });
  try {
    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ----- Log Routes -----
router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find({ userId: 'me' }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/logs', async (req, res) => {
  const log = new Log({
    ...req.body,
    userId: 'me'
  });
  try {
    const newLog = await log.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ----- Dashboard Routes -----
router.get('/dashboard', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: 'me' });
    const logs = await Log.find({ userId: 'me' });

    const studySessions = sessions.filter(s => s.type === 'study' || !s.type); // backward compatibility if type missing

    const totalStudyMinutes = studySessions
      .filter(s => s.status === 'completed')
      .reduce((acc, s) => acc + (s.duration || 0), 0);

    const totalSessions = studySessions.length;
    const completedSessions = studySessions.filter(s => s.status === 'completed').length;
    const missedSessions = studySessions.filter(s => s.status === 'skipped').length;

    const consistencyScore = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    // Streak calculation (days with at least one completed session)
    let streakCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const datesWithCompletedSessions = [...new Set(studySessions
      .filter(s => s.status === 'completed')
      .map(s => {
        const d = new Date(s.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }))].sort((a, b) => b - a);

    // Basic streak check
    let checkDay = today.getTime();
    for (let sDate of datesWithCompletedSessions) {
      if (sDate === checkDay) {
        streakCount++;
        checkDay -= 86400000;
      } else if (sDate < checkDay) {
        break;
      }
    }

    res.json({
      totalHours: (totalStudyMinutes / 60).toFixed(1),
      completedSessions: completedSessions,
      missedSessions: missedSessions,
      consistency: consistencyScore.toFixed(0),
      streak: streakCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
