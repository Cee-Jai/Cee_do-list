const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  title: String,
  category: { type: String, default: 'Productivity' },
  completionDates: [{ type: Date }],
  reminder: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Habit', habitSchema);
