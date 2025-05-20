import React, { createContext, useState, useEffect } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt), // Ensure createdAt is a Date object
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      }));
      setTasks(parsedTasks);
    }
    const savedPoints = localStorage.getItem('points');
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks.map((task) => ({
      ...task,
      createdAt: task.createdAt.toISOString(), // Store as ISO string to preserve Date
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    }))));
    localStorage.setItem('points', points.toString());
  }, [tasks, points]);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, createdAt: new Date(), dueDate: task.dueDate ? new Date(task.dueDate) : null }]);
    setPoints(points + 10);
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.createdAt.getTime() === taskId
        ? { ...task, completed: !task.completed }
        : task
    );
    setTasks(updatedTasks);
    const completedCount = updatedTasks.filter((task) => task.completed).length;
    setPoints(completedCount * 20);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.createdAt.getTime() !== taskId);
    setTasks(updatedTasks);
    const completedCount = updatedTasks.filter((task) => task.completed).length;
    setPoints(completedCount * 20);
  };

  const editTask = (taskId, updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.createdAt.getTime() === taskId ? { ...task, ...updatedTask, dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTask, deleteTask, editTask, points }}
    >
      {children}
    </TaskContext.Provider>
  );
};
