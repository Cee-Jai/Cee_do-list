import React, { useContext, useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { ThemeContext } from './ThemeContext';
import { TaskContext } from './TaskContext';
import Confetti from 'react-confetti';
import './App.css';

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { tasks, points } = useContext(TaskContext);
  const [showConfetti, setShowConfetti] = useState(false);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    if (completedTasks > 0 && completedTasks % 5 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [completedTasks]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {showConfetti && <Confetti />}
      <header className="p-4 neumorphic flex justify-between items-center">
        <h1 className="text-3xl font-bold dark:text-gray-100">Cee_do-list</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg dark:text-gray-100">Points: {points}</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full neumorphic dark:bg-gray-800 dark:text-gray-100"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 neumorphic p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 mb-2 sm:text-lg">
              Progress: {completedTasks}/{totalTasks} tasks completed
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 sm:h-6">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-300 sm:h-6"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <TaskForm />
          <TaskList />
        </div>
      </main>
      <footer className="p-4 neumorphic text-center dark:text-gray-100">
        Boost Your Agility with Cee_do-list &copy; 2025
      </footer>
    </div>
  );
};

export default App;
