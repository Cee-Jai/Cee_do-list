const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: { type: String, default: 'Medium' },
  weeklyAccomplishment: String,
  lessonsLearned: String,
  recurrence: { type: String, default: 'none' },
  reminder: Date,
  reminderNotified: { type: Boolean, default: false },
  status: { type: String, default: 'To Do' },
  completed: { type: Boolean, default: false },
  assignedTo: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
