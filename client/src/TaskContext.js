import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [points, setPoints] = useState(0);
  const [users] = useState(['Alice', 'Bob', 'Charlie']);
  const [unlockedThemes, setUnlockedThemes] = useState(['default']);
  const [unlockedMusic, setUnlockedMusic] = useState(['lofi']);

  // Fetch initial data from API
  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(response => setTasks(response.data.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        reminder: task.reminder ? new Date(task.reminder) : null,
      }))))
      .catch(error => console.error('Error fetching tasks:', error));

    axios.get('http://localhost:5000/api/habits')
      .then(response => setHabits(response.data.map(habit => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        completionDates: habit.completionDates ? habit.completionDates.map(date => new Date(date)) : [],
        reminder: habit.reminder ? new Date(habit.reminder) : null,
      }))))
      .catch(error => console.error('Error fetching habits:', error));

    axios.get('http://localhost:5000/api/user')
      .then(response => {
        setPoints(response.data.points || 0);
        setUnlockedThemes(response.data.unlockedThemes || ['default']);
        setUnlockedMusic(response.data.unlockedMusic || ['lofi']);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  // Sync state with API on change
  useEffect(() => {
    axios.put('http://localhost:5000/api/user', { points, unlockedThemes, unlockedMusic })
      .catch(error => console.error('Error syncing user data:', error));
  }, [points, unlockedThemes, unlockedMusic]);

  const addTask = (task) => {
    const newTask = { ...task, completed: false, assignedTo: '', reminderNotified: false };
    axios.post('http://localhost:5000/api/tasks', newTask)
      .then(response => setTasks([...tasks, response.data]))
      .catch(error => console.error('Error adding task:', error));
  };

  const toggleTask = (taskId) => {
    const taskToUpdate = tasks.find(t => t._id === taskId);
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask)
      .then(response => {
        setTasks(tasks.map(t => t._id === taskId ? response.data : t));
        if (response.data.completed) setPoints(points + 10);
      })
      .catch(error => console.error('Error toggling task:', error));
  };

  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
      .then(() => setTasks(tasks.filter(t => t._id !== taskId)))
      .catch(error => console.error('Error deleting task:', error));
  };

  const editTask = (taskId, updatedTask) => {
    const taskToUpdate = tasks.find(t => t._id === taskId);
    const fullUpdatedTask = { ...taskToUpdate, ...updatedTask };
    axios.put(`http://localhost:5000/api/tasks/${taskId}`, fullUpdatedTask)
      .then(response => setTasks(tasks.map(t => t._id === taskId ? response.data : t)))
      .catch(error => console.error('Error editing task:', error));
  };

  const assignTask = (taskId, user) => {
    const taskToUpdate = tasks.find(t => t._id === taskId);
    const updatedTask = { ...taskToUpdate, assignedTo: user };
    axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask)
      .then(response => setTasks(tasks.map(t => t._id === taskId ? response.data : t)))
      .catch(error => console.error('Error assigning task:', error));
  };

  const addPoints = (amount) => {
    setPoints(prevPoints => {
      const newPoints = prevPoints + amount;
      axios.put('http://localhost:5000/api/user', { points: newPoints })
        .catch(error => console.error('Error adding points:', error));
      return newPoints;
    });
  };

  const addHabit = (habit) => {
    const newHabit = { ...habit, completionDates: [], category: 'Productivity', reminder: null };
    axios.post('http://localhost:5000/api/habits', newHabit)
      .then(response => setHabits([...habits, response.data]))
      .catch(error => console.error('Error adding habit:', error));
  };

  const toggleHabit = (habitId, date) => {
    const habitToUpdate = habits.find(h => h._id === habitId);
    const dateStr = date.toDateString();
    const completionDates = habitToUpdate.completionDates || [];
    const updatedHabit = {
      ...habitToUpdate,
      completionDates: completionDates.some(d => d.toDateString() === dateStr)
        ? completionDates.filter(d => d.toDateString() !== dateStr)
        : [...completionDates, date],
    };
    axios.put(`http://localhost:5000/api/habits/${habitId}`, updatedHabit)
      .then(response => {
        setHabits(habits.map(h => h._id === habitId ? response.data : h));
      })
      .catch(error => console.error('Error toggling habit:', error));
  };

  const deleteHabit = (habitId) => {
    axios.delete(`http://localhost:5000/api/habits/${habitId}`)
      .then(() => setHabits(habits.filter(h => h._id !== habitId)))
      .catch(error => console.error('Error deleting habit:', error));
  };

  const editHabit = (habitId, updatedHabit) => {
    const habitToUpdate = habits.find(h => h._id === habitId);
    const fullUpdatedHabit = { ...habitToUpdate, ...updatedHabit };
    axios.put(`http://localhost:5000/api/habits/${habitId}`, fullUpdatedHabit)
      .then(response => setHabits(habits.map(h => h._id === habitId ? response.data : h)))
      .catch(error => console.error('Error editing habit:', error));
  };

  const unlockTheme = (theme) => {
    if (points >= 50 && !unlockedThemes.includes(theme)) {
      setPoints(points - 50);
      setUnlockedThemes([...unlockedThemes, theme]);
    }
  };

  const unlockMusic = (track) => {
    if (points >= 30 && !unlockedMusic.includes(track)) {
      setPoints(points - 30);
      setUnlockedMusic([...unlockedMusic, track]);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        habits,
        points,
        users,
        unlockedThemes,
        unlockedMusic,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        assignTask,
        addPoints,
        addHabit,
        toggleHabit,
        deleteHabit,
        editHabit,
        unlockTheme,
        unlockMusic,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
