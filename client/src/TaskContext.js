import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [points, setPoints] = useState(0);
  const [users] = useState(['Alice', 'Bob', 'Charlie']);
  const [unlockedThemes, setUnlockedThemes] = useState(['default']);
  const [unlockedMusic, setUnlockedMusic] = useState(['lofi']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        // Convert createdAt to Date object if it's a string
        const formattedTasks = response.data.map(task => ({
          ...task,
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          reminder: task.reminder ? new Date(task.reminder) : null,
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks. Check backend connection.');
      }
    };
    fetchData();
  }, []);

  const addTask = async (task) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', {
        ...task,
        completed: false,
        assignedTo: '',
        reminderNotified: false,
        createdAt: new Date(),
      });
      // Ensure createdAt is a Date object in the response
      const newTask = { ...response.data, createdAt: new Date(response.data.createdAt) };
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task.');
    }
  };

  const toggleTask = async (taskId) => {
    const taskToUpdate = tasks.find(task => task._id === taskId);
    if (!taskToUpdate) return;
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask);
      const updatedTaskWithDate = { ...response.data, createdAt: new Date(response.data.createdAt) };
      setTasks(tasks.map(task => task._id === taskId ? updatedTaskWithDate : task));
      if (updatedTask.completed) {
        setPoints(prev => prev + 10);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to toggle task.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task.');
    }
  };

  const editTask = async (taskId, updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask);
      const updatedTaskWithDate = { ...response.data, createdAt: new Date(response.data.createdAt) };
      setTasks(tasks.map(task => task._id === taskId ? updatedTaskWithDate : task));
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task.');
    }
  };

  const assignTask = async (taskId, user) => {
    const taskToUpdate = tasks.find(task => task._id === taskId);
    if (!taskToUpdate) return;
    const updatedTask = { ...taskToUpdate, assignedTo: user };
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask);
      const updatedTaskWithDate = { ...response.data, createdAt: new Date(response.data.createdAt) };
      setTasks(tasks.map(task => task._id === taskId ? updatedTaskWithDate : task));
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error('Failed to assign task.');
    }
  };

  const addPoints = (amount) => {
    setPoints(prev => prev + amount);
  };

  const addHabit = (habit) => {
    setHabits([...habits, { ...habit, completionDates: [], category: 'Productivity', reminder: null, createdAt: new Date() }]);
  };

  const toggleHabit = (habitId, date) => {
    setHabits(habits.map((habit) => {
      if (habit.createdAt.getTime() === habitId) {
        const dateStr = date.toDateString();
        const completionDates = habit.completionDates || [];
        const dateExists = completionDates.some(d => d.toDateString() === dateStr);
        return {
          ...habit,
          completionDates: dateExists
            ? completionDates.filter(d => d.toDateString() !== dateStr)
            : [...completionDates, date],
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter((habit) => habit.createdAt.getTime() !== habitId));
  };

  const editHabit = (habitId, updatedHabit) => {
    setHabits(habits.map((habit) => (habit.createdAt.getTime() === habitId ? { ...habit, ...updatedHabit } : habit)));
  };

  const unlockTheme = (theme) => {
    if (points >= 50 && !unlockedThemes.includes(theme)) {
      setPoints(prev => prev - 50);
      setUnlockedThemes([...unlockedThemes, theme]);
    }
  };

  const unlockMusic = (track) => {
    if (points >= 30 && !unlockedMusic.includes(track)) {
      setPoints(prev => prev - 30);
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
