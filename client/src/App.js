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
  const [menuOpen, setMenuOpen] = useState(false);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    if (completedTasks > 0 && completedTasks % 5 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [completedTasks]);

  const getStreak = () => {
    // Placeholder: Calculate streak based on task completion dates (to be implemented with backend)
    return 3; // Mock streak for now
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {showConfetti && <Confetti />}
      <header className="p-4 neumorphic flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden p-2 rounded-full neumorphic dark:bg-gray-800 dark:text-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold dark:text-gray-100 sm:text-3xl">Cee_do-list</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-base sm:text-lg dark:text-gray-100">Points: {points}</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full neumorphic dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Dashboard Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 neumorphic rounded-lg">
              <h3 className="text-lg font-semibold dark:text-gray-100">Tasks Completed</h3>
              <p className="text-2xl dark:text-gray-300">{completedTasks}/{totalTasks}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 mt-2">
                <div
                  className="bg-blue-500 h-3 sm:h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="p-4 neumorphic rounded-lg">
              <h3 className="text-lg font-semibold dark:text-gray-100">Streak</h3>
              <p className="text-2xl dark:text-gray-300">{getStreak()} days</p>
              <p className="text-sm dark:text-gray-400">Keep it up!</p>
            </div>
            <div className="p-4 neumorphic rounded-lg hidden sm:block">
              <h3 className="text-lg font-semibold dark:text-gray-100">Tip of the Day</h3>
              <p className="text-sm dark:text-gray-300">Break tasks into smaller steps to stay motivated!</p>
            </div>
          </div>
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TaskForm />
            </div>
            <div className="lg:col-span-2">
              <TaskList menuOpen={menuOpen} />
            </div>
          </div>
        </div>
      </main>
      <footer className="p-4 neumorphic text-center dark:text-gray-100 text-sm sm:text-base">
        Boost Your Agility with Cee_do-list © 2025
      </footer>
    </div>
  );
};

export default App;
