const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  userId: { type: String, default: 'me' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  timeSlots: [{
    startTime: String, // "HH:mm"
    endTime: String,   // "HH:mm"
    label: String,
    repeatDays: [Number], // 0-7 (Mon-Sun or Sun-Sat)
  }],
  breakConfig: {
    type: { type: String, enum: ['fixed', 'interval'], default: 'fixed' },
    value: Number, // Number of breaks if 'fixed', Interval minutes if 'interval'
  }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
