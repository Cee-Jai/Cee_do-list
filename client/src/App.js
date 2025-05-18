import React, { useContext, useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { ThemeContext } from './ThemeContext';
import { TaskContext } from './TaskContext';
import Confetti from 'react-confetti';
import './App.css';

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { tasks, points } = useContext(TaskContext) || { tasks: [], points: 0 }; // Default to empty array and 0 points
  const [showConfetti, setShowConfetti] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDashboard, setShowDashboard] = useState(true);

  console.log('App rendering, tasks:', tasks); // Debug log

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboardingSeen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const safeTasks = tasks || []; // Ensure tasks is an array
    const newNotifications = safeTasks
      .filter((task) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        return dueDate && dueDate <= today && !task.completed;
      })
      .map((task) => ({
        id: task.createdAt,
        message: `Task "${task.title}" is overdue!`,
        read: false,
      }));
    setNotifications(newNotifications);
  }, [tasks]);

  const completedTasks = tasks ? tasks.filter((task) => task.completed).length : 0;
  const totalTasks = tasks ? tasks.length : 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    if (completedTasks > 0 && completedTasks % 5 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [completedTasks, tasks]);

  const getStreak = () => {
    return 3; // Mock streak for now
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleNextStep = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem('onboardingSeen', 'true');
    }
  };

  const onboardingMessages = [
    { title: "Welcome to Cee_do-list! 🎉", message: "Start by adding a task using the form below." },
    { title: "Personalize Your Experience", message: "Switch between light and dark themes in the header." },
    { title: "Earn Rewards!", message: "Complete tasks to earn points and celebrate with confetti!" },
  ];

  if (!tasks) {
    console.log('Tasks not loaded yet'); // Debug log
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
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full neumorphic dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              🔔
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter((notif) => !notif.read).length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="fixed top-16 right-4 sm:right-8 w-80 sm:w-96 max-h-80 bg-white dark:bg-gray-800 p-4 rounded-xl neumorphic shadow-lg z-50 overflow-y-auto sm:absolute sm:top-12 sm:right-0 sm:w-72 sm:max-h-64">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-sm text-red-500 dark:text-red-400 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 mb-2 rounded-lg ${notif.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-600'} flex justify-between items-center`}
                    >
                      <p className={`text-sm ${notif.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-800 dark:text-gray-100 font-medium'}`}>
                        {notif.message}
                      </p>
                      {!notif.read && (
                        <button
                          onClick={() => markNotificationAsRead(notif.id)}
                          className="text-xs text-blue-500 dark:text-blue-400 hover:underline"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 rounded-full neumorphic dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center space-x-2"
            >
              <span className="text-lg">👤</span>
              <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-200">Guest</span>
            </button>
            {showProfile && (
              <div className="fixed top-16 right-4 sm:right-8 w-80 sm:w-96 bg-white dark:bg-gray-800 p-4 rounded-xl neumorphic shadow-lg z-50 sm:absolute sm:top-12 sm:right-0 sm:w-64">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Guest</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to Cee_do-list!</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-200">Total Points: {points}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">Tasks Completed: {completedTasks}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">Streak: {getStreak()} days</p>
                  <button
                    onClick={toggleTheme}
                    className="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                  >
                    {theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
                  </button>
                  <button
                    disabled
                    className="w-full p-2 bg-gray-300 dark:bg-gray-500 rounded-lg text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  >
                    Sign Up (Coming Soon)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h2>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="lg:hidden p-2 rounded-full neumorphic dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              {showDashboard ? 'Hide' : 'Show'} Dashboard
            </button>
          </div>
          <div className={`${showDashboard ? 'block' : 'hidden'} lg:block grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8`}>
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
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Break tasks into smaller steps to stay motivated and achieve more!
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TaskForm />
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
