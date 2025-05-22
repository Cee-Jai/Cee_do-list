const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const User = require('../models/User');

// Tasks
router.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

router.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

router.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

// Habits
router.get('/habits', async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

router.post('/habits', async (req, res) => {
  const habit = new Habit(req.body);
  await habit.save();
  res.json(habit);
});

router.put('/habits/:id', async (req, res) => {
  const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(habit);
});

router.delete('/habits/:id', async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ message: 'Habit deleted' });
});

// User
router.get('/user', async (req, res) => {
  let user = await User.findOne();
  if (!user) {
    user = new User();
    await user.save();
  }
  res.json(user);
});

router.put('/user', async (req, res) => {
  const user = await User.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json(user);
});

module.exports = router;
