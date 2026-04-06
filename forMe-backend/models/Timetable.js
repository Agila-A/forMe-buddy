const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  userId: { type: String, default: 'me' },
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  tasks: [{
    title: { type: String, required: true },
    startTime: { type: String, required: true }, // Format: "HH:mm"
    endTime: { type: String, required: true },   // Format: "HH:mm"
    category: { type: String, enum: ['Study', 'Break', 'Personal'], default: 'Study' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
