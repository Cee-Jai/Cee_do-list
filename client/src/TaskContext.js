;import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);
  const [habits, setHabits] = useState([]);
  const [unlockedThemes, setUnlockedThemes] = useState(['default']);
  const [unlockedMusic, setUnlockedMusic] = useState(['lofi']);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        console.log('Fetched tasks:', response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchHabits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/habits');
        console.log('Fetched habits:', response.data);
        setHabits(response.data);
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };

    fetchTasks();
    fetchHabits();
  }, []);

  const addTask = async (task) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', task);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const editTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const addHabit = async (habit) => {
    console.log('Adding habit:', habit);
    try {
      const response = await axios.post('http://localhost:5000/api/habits', {
        name: habit.name,
        completed: false,
      });
      console.log('Backend response:', response.data);
      setHabits((prevHabits) => {
        const updatedHabits = [...prevHabits, response.data];
        console.log('Updated habits:', updatedHabits);
        return updatedHabits;
      });
      console.log('Habit added successfully, new state:', habits); // Add this line
    } catch (error) {
      console.error('Error adding habit:', error.response ? error.response.data : error.message);
      alert('Failed to add habit. Check console for details.');
    }
  };

  const toggleHabit = async (id) => {
    try {
      const habit = habits.find((h) => h._id === id);
      const updatedHabit = { ...habit, completed: !habit.completed };
      const response = await axios.put(`http://localhost:5000/api/habits/${id}`, updatedHabit);
      setHabits(habits.map((h) => (h._id === id ? response.data : h)));
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const addPoints = (amount) => {
    setPoints(points + amount);
  };

  const unlockTheme = (theme) => {
    if (points >= 50 && !unlockedThemes.includes(theme)) {
      setUnlockedThemes([...unlockedThemes, theme]);
      setPoints(points - 50);
    }
  };

  const unlockMusic = (music) => {
    if (points >= 30 && !unlockedMusic.includes(music)) {
      setUnlockedMusic([...unlockedMusic, music]);
      setPoints(points - 30);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        points,
        addTask,
        editTask,
        addPoints,
        habits,
        addHabit,
        toggleHabit,
        unlockedThemes,
        unlockedMusic,
        unlockTheme,
        unlockMusic,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
