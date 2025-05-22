import React, { createContext, useState, useEffect } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [points, setPoints] = useState(0);
  const [users] = useState(['Alice', 'Bob', 'Charlie']);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedHabits = JSON.parse(localStorage.getItem('habits')) || [];
    const storedPoints = JSON.parse(localStorage.getItem('points')) || 0;
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
    })));
    setPoints(storedPoints);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('points', JSON.stringify(points));
  }, [tasks, habits, points]);

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
    setHabits([...habits, { ...habit, completionDates: [] }]);
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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        habits,
        points,
        users,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        assignTask,
        addPoints,
        addHabit,
        toggleHabit,
        deleteHabit,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
