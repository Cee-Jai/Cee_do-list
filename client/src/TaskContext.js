import React, { createContext, useState, useEffect } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [points, setPoints] = useState(0);
  const [users] = useState(['Alice', 'Bob', 'Charlie']);
  const [unlockedThemes, setUnlockedThemes] = useState(['default']);
  const [unlockedMusic, setUnlockedMusic] = useState(['lofi']);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedHabits = JSON.parse(localStorage.getItem('habits')) || [];
    const storedPoints = JSON.parse(localStorage.getItem('points')) || 0;
    const storedThemes = JSON.parse(localStorage.getItem('unlockedThemes')) || ['default'];
    const storedMusic = JSON.parse(localStorage.getItem('unlockedMusic')) || ['lofi'];
    setTasks(storedTasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      reminder: task.reminder ? new Date(task.reminder) : null,
    })));
    setHabits(storedHabits.map(habit => ({
      ...habit,
      createdAt: new Date(habit.createdAt),
      completionDates: habit.completionDates ? habit.completionDates.map(date => new Date(date)) : [],
      reminder: habit.reminder ? new Date(habit.reminder) : null,
    })));
    setPoints(storedPoints);
    setUnlockedThemes(storedThemes);
    setUnlockedMusic(storedMusic);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('points', JSON.stringify(points));
    localStorage.setItem('unlockedThemes', JSON.stringify(unlockedThemes));
    localStorage.setItem('unlockedMusic', JSON.stringify(unlockedMusic));
  }, [tasks, habits, points, unlockedThemes, unlockedMusic]);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, completed: false, assignedTo: '', reminderNotified: false }]);
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.createdAt.getTime() === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    if (updatedTasks.find((task) => task.createdAt.getTime() === taskId).completed) {
      setPoints(points + 10);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.createdAt.getTime() !== taskId));
  };

  const editTask = (taskId, updatedTask) => {
    setTasks(tasks.map((task) => (task.createdAt.getTime() === taskId ? { ...task, ...updatedTask } : task)));
  };

  const assignTask = (taskId, user) => {
    setTasks(tasks.map((task) => (task.createdAt.getTime() === taskId ? { ...task, assignedTo: user } : task)));
  };

  const addPoints = (amount) => {
    setPoints(points + amount);
  };

  const addHabit = (habit) => {
    setHabits([...habits, { ...habit, completionDates: [], category: 'Productivity', reminder: null }]);
  };

  const toggleHabit = (habitId, date) => {
    setHabits(habits.map((habit) => {
      if (habit.createdAt.getTime() === habitId) {
        const dateStr = date.toDateString();
        const completionDates = habit.completionDates || [];
        const dateExists = completionDates.some(d => d.toDateString() === dateStr);
        if (dateExists) {
          return {
            ...habit,
            completionDates: completionDates.filter(d => d.toDateString() !== dateStr),
          };
        } else {
          return {
            ...habit,
            completionDates: [...completionDates, date],
          };
        }
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
