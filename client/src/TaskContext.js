import React, { createContext, useState } from 'react';

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.createdAt === taskId
        ? {
            ...task,
            completed: !task.completed,
            completedAt: task.completed ? null : new Date(),
          }
        : task
    );
    setTasks(updatedTasks);
    if (updatedTasks.find((task) => task.createdAt === taskId).completed) {
      setPoints(points + 10);
    } else {
      setPoints(points - 10);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.createdAt !== taskId));
  };

  const editTask = (taskId, updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.createdAt === taskId
          ? {
              ...task,
              title: updatedTask.title,
              description: updatedTask.description,
              accomplishment: updatedTask.accomplishment,
              lessonsLearned: updatedTask.lessonsLearned,
              priority: updatedTask.priority,
            }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, editTask, points }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
