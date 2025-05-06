import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.createdAt === taskId
          ? { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date() }
          : task
      )
    );
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

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Cee_do-list</h1>
      <div className="max-w-md w-full mb-6">
        <p className="text-gray-700 mb-2">
          Progress: {completedTasks}/{totalTasks} tasks completed
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <TaskForm addTask={addTask} />
      <TaskList
        tasks={tasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    </div>
  );
}

export default App;
