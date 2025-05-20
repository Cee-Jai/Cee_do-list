   import React, { useContext, useState, useEffect } from 'react';
import TaskList from './TaskList';
import { ThemeContext } from './ThemeContext';
import { TaskContext } from './TaskContext';
import Confetti from 'react-confetti';
import './App.css';

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { tasks, points, addTask } = useContext(TaskContext) || { tasks: [], points: 0, addTask: () => {} };
  const [showConfetti, setShowConfetti] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    weeklyAccomplishment: '',
    lessonsLearned: '',
  });

  console.log('App rendering, tasks:', tasks);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboardingSeen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const safeTasks = tasks || [];
    const newNotifications = safeTasks
      .filter((task) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        return dueDate && dueDate <= today && !task.completed;
      })
      .map((task) => ({
        id: task.createdAt.getTime(), // Use getTime() for a number ID
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
    return 3;
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

  const setReminderForNotification = (notificationId) => {
    const task = tasks.find((t) => t.createdAt.getTime() === notificationId);
    if (!task) return;

    const reminderDate = prompt('Enter reminder date and time (YYYY-MM-DDTHH:MM)', new Date().toISOString().slice(0, 16));
    if (reminderDate) {
      const newReminderTask = {
        title: `Reminder: ${task.title}`,
        description: task.description,
        dueDate: new Date(reminderDate),
        priority: task.priority,
        completed: false,
        createdAt: new Date(),
        weeklyAccomplishment: task.weeklyAccomplishment,
        lessonsLearned: task.lessonsLearned,
      };
      addTask(newReminderTask);
      markNotificationAsRead(notificationId);
    }
  };

  const handleNextStep = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem('onboardingSeen', 'true');
    }
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask({
      ...newTask,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      completed: false,
      createdAt: new Date(),
    });
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      weeklyAccomplishment: '',
      lessonsLearned: '',
    });
    setShowTaskForm(false);
  };

  const onboardingMessages = [
    { title: "Welcome to Cee_do-list! 🎉", message: "Start by adding a task using the dropdown in the header." },
    { title: "Personalize Your Experience", message: "Switch between light and dark themes in the header." },
    { title: "Earn Rewards!", message: "Complete tasks to earn points and celebrate with confetti!" },
  ];

  if (!tasks) {
    console.log('Tasks not loaded yet');
    return <div className="text-center text-gray-500">Loading tasks...</div>;
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Cee_do-list</h1>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm w-64"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm"
            >
              {showTaskForm ? 'Close Form' : 'Add Task'}
            </button>
            {showTaskForm && (
              <div className="absolute top-12 left-0 w-96 bg-white dark:bg-gray-800 p-4 rounded-xl neumorphic shadow-lg z-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Add New Task</h3>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleTaskInputChange}
                  placeholder="Task title"
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                />
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleTaskInputChange}
                  placeholder="Description"
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  rows="2"
                />
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleTaskInputChange}
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                />
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleTaskInputChange}
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <textarea
                  name="weeklyAccomplishment"
                  value={newTask.weeklyAccomplishment}
                  onChange={handleTaskInputChange}
                  placeholder="Weekly Accomplishments"
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  rows="2"
                />
                <textarea
                  name="lessonsLearned"
                  value={newTask.lessonsLearned}
                  onChange={handleTaskInputChange}
                  placeholder="What did you learn?"
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  rows="2"
                />
                <button
                  onClick={handleAddTask}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm"
                >
                  Add Task
                </button>
              </div>
            )}
          </div>
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
              <div className="absolute top-12 right-0 w-96 max-h-80 bg-white dark:bg-gray-800 p-4 rounded-xl neumorphic shadow-lg z-50 overflow-y-auto">
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
                      <div className="flex space-x-2">
                        {!notif.read && (
                          <button
                            onClick={() => setReminderForNotification(notif.id)}
                            className="text-xs text-green-500 dark:text-green-400 hover:underline"
                          >
                            Set Reminder
                          </button>
                        )}
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationAsRead(notif.id)}
                            className="text-xs text-blue-500 dark:text-blue-400 hover:underline"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
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
              <span className="text-sm text-gray-700 dark:text-gray-200">Guest</span>
            </button>
            {showProfile && (
              <div className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 p-4 rounded-xl neumorphic shadow-lg z-50">
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
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-6 mb-8">
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
            <div className="p-5 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Tip of the Day 💡</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Break tasks into smaller steps to stay motivated and achieve more!
              </p>
            </div>
          </div>
          <TaskList tasks={filteredTasks} />
        </div>
      </main>
      <footer className="p-5 neumorphic text-center bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm shadow-inner">
        Boost Your Agility with Cee_do-list © 2025
      </footer>
    </div>
  );
};

export default App;
