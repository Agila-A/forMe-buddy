const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: String, default: 'me' },
  date: { type: Date, default: Date.now },
  startTime: Date,
  endTime: Date,
  duration: Number, // in minutes
  status: { type: String, enum: ['completed', 'partial', 'skipped'], default: 'completed' },
  type: { type: String, enum: ['study', 'break'], default: 'study' },
  label: String,
  delayedMinutes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
