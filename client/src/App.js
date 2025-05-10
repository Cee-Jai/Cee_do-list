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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [lastStreakUpdate, setLastStreakUpdate] = useState(new Date().toDateString());
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboardingSeen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    const storedLastUpdate = localStorage.getItem('lastStreakUpdate');
    if (storedLastUpdate) {
      setLastStreakUpdate(storedLastUpdate);
    }
  }, []);

  const completedTasks = tasks ? tasks.filter((task) => task.completed).length : 0;
  const totalTasks = tasks ? tasks.length : 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    if (completedTasks > 0 && completedTasks % 5 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    const today = new Date().toDateString();
    if (lastStreakUpdate !== today && completedTasks > 0) {
      localStorage.setItem('lastStreakUpdate', today);
      setLastStreakUpdate(today);
    }
  }, [completedTasks, tasks, lastStreakUpdate]);

  const getStreak = () => {
    const today = new Date().toDateString();
    if (lastStreakUpdate !== today && completedTasks > 0) {
      return parseInt(localStorage.getItem('streak') || '0') + 1;
    }
    return parseInt(localStorage.getItem('streak') || '0');
  };

  useEffect(() => {
    localStorage.setItem('streak', getStreak().toString());
  }, [lastStreakUpdate, completedTasks]);

  const handleNextStep = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem('onboardingSeen', 'true');
    }
  };

  const tipsOfTheDay = [
    "Break tasks into smaller steps to stay motivated and achieve more!",
    "Take short breaks to boost focus and productivity.",
    "Prioritize your most important task each day.",
    "Reflect on your progress to stay inspired.",
    "Celebrate small wins to keep the momentum going!",
  ];

  const getTipOfTheDay = () => {
    const now = new Date();
    const dayIndex = now.getDate() % tipsOfTheDay.length;
    return tipsOfTheDay[dayIndex];
  };

  const onboardingMessages = [
    { title: "Welcome to Cee_do-list! 🎉", message: "Start by adding a task using the button below." },
    { title: "Personalize Your Experience", message: "Switch between light and dark themes in the header." },
    { title: "Earn Rewards!", message: "Complete tasks to earn points and celebrate with confetti!" },
  ];

  if (!tasks) {
    return <div className="text-center text-gray-500">Loading tasks...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col font-sans">
      {showConfetti && <Confetti />}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neumorphic max-w-md w-full shadow-lg transform transition-all duration-300 scale-100 hover:scale-105">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">{onboardingMessages[onboardingStep].title}</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">{onboardingMessages[onboardingStep].message}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">{onboardingStep + 1} of 3</span>
              <button
                onClick={handleNextStep}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md"
              >
                {onboardingStep < 2 ? 'Next' : 'Let’s Start!'}
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="p-5 neumorphic flex justify-between items-center bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden p-2 rounded-full neumorphic dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Cee_do-list</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-200">Points: {points}</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full neumorphic dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-5 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Tasks Completed</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-200">{completedTasks}/{totalTasks}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="p-5 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Streak 🔥</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-200">{getStreak()} days</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">You’re on a roll!</p>
            </div>
            <div className="p-5 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 hidden sm:block">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Tip of the Day 💡</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{getTipOfTheDay()}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md text-sm mb-4"
              >
                Add Today's Accomplishment
              </button>
              <TaskForm showForm={showForm} setShowForm={setShowForm} />
            </div>
            <div className="lg:col-span-2">
              <TaskList menuOpen={menuOpen} />
            </div>
          </div>
        </div>
      </main>
      <footer className="p-5 neumorphic text-center bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm shadow-inner">
        Boost Your Agility with Cee_do-list © 2025
      </footer>
    </div>
  );
};

export default App;
