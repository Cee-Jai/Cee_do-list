import React, { createContext, useState, useEffect } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks).map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      }));
      setTasks(parsedTasks);
    } else {
      setTasks([]);
    }
    const storedPoints = localStorage.getItem('points');
    if (storedPoints) {
      setPoints(parseInt(storedPoints, 10));
    }
  }, []);

  useEffect(() => {
    if (tasks !== null) {
      const serializedTasks = tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      }));
      localStorage.setItem('tasks', JSON.stringify(serializedTasks));
      localStorage.setItem('points', points.toString());
    }
  }, [tasks, points]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const toggleTask = (createdAt) => {
    const updatedTasks = tasks.map((task) => {
      if (task.createdAt.getTime() === createdAt.getTime()) {
        const newCompleted = !task.completed;
        if (newCompleted && !task.completed) {
          setPoints(points + 10);
        } else if (!newCompleted && task.completed) {
          setPoints(Math.max(0, points - 10));
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (createdAt) => {
    const taskToDelete = tasks.find((task) => task.createdAt.getTime() === createdAt.getTime());
    if (taskToDelete && taskToDelete.completed) {
      setPoints(Math.max(0, points - 10));
    }
    setTasks(tasks.filter((task) => task.createdAt.getTime() !== createdAt.getTime()));
  };

  const editTask = (createdAt, updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.createdAt.getTime() === createdAt.getTime() ? { ...task, ...updatedTask } : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, points, addTask, toggleTask, deleteTask, editTask }}>
      {children}
    </TaskContext.Provider>
  );
};
