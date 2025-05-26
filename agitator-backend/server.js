const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/agitator')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: String,
  weeklyAccomplishment: String,
  lessonsLearned: String,
  recurrence: String,
  reminder: Date,
  reminderNotified: Boolean,
  status: String,
  assignee: String,
  createdAt: Date,
  completed: Boolean,
});

const habitSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);
const Habit = mongoose.model('Habit', habitSchema);

// Task Routes
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Habit Routes
app.get('/api/habits', async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

app.post('/api/habits', async (req, res) => {
  console.log('Received habit data:', req.body); // Debug log
  const habit = new Habit(req.body);
  await habit.save();
  res.json(habit);
});

app.put('/api/habits/:id', async (req, res) => {
  const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(habit);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
