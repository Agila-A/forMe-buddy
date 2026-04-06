const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: String, default: 'me' },
  date: { type: Date, default: Date.now },
  category: { type: String, enum: ['Aptitude', 'Coding', 'Core'], required: true },
  description: String,
  timeSpent: Number, // in minutes
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
