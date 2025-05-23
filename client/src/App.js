   import { ThemeContext } from './ThemeContext';
import { TaskContext, TaskProvider } from './TaskContext';
import React, { useContext, useState, useEffect, useRef } from 'react';
import TaskList from './TaskList';
import KanbanBoard from './KanbanBoard';
import HabitTracker from './HabitTracker';
import UserProfile from './UserProfile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import './App.css';

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { tasks, points, addTask, editTask, addPoints, habits, unlockedThemes, unlockedMusic, unlockTheme, unlockMusic } = useContext(TaskContext);
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
    recurrence: 'none',
    reminder: null,
    reminderNotified: false,
    status: 'To Do',
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [voiceActive, setVoiceActive] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);
  const [customBackground, setCustomBackground] = useState(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  const completedTasks = tasks ? tasks.filter((task) => task.completed).length : 0;
  const totalTasks = tasks ? tasks.length : 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const presetThemes = [
    { name: 'default', url: '' },
    { name: 'forest', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b' },
    { name: 'ocean', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' },
  ];
  const presetMusic = [
    { name: 'lofi', url: 'https://www.chosic.com/wp-content/uploads/2021/07/Im-Lo-Fi.mp3' },
    { name: 'chill', url: 'https://www.chosic.com/wp-content/uploads/2021/06/Chill-Day.mp3' },
  ];

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboardingSeen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (command.includes('add task')) {
          const title = command.replace('add task', '').trim();
          if (title) {
            addTask({ ...newTask, title, createdAt: new Date(), status: 'To Do' });
            toast.success(`Added task: ${title}`);
          }
        }
      };
      recognitionRef.current.onerror = (event) => console.error('Speech recognition error:', event.error);
    }
  }, [addTask, newTask]);

  useEffect(() => {
    const overdueNotifications = tasks
      .filter((task) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        return dueDate && dueDate <= new Date() && !task.completed;
      })
      .map((task) => ({
        id: task._id,
        message: `Task "${task.title}" is overdue!`,
        read: false,
      }));
    setNotifications(overdueNotifications);

    tasks.forEach((task) => {
      if (task.reminder && new Date(task.reminder) <= new Date() && !task.reminderNotified) {
        toast.info(`Reminder: ${task.title}`, {
          onClose: () => editTask(task._id, { ...task, reminderNotified: true }),
        });
      }
    });
  }, [tasks, editTask]);

  useEffect(() => {
    if (completedTasks > 0 && completedTasks % 5 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [completedTasks, tasks]);

  useEffect(() => {
    let timer;
    if (pomodoroActive && pomodoroTime > 0) {
      timer = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
      setPomodoroSessions((prev) => prev + 1);
      addPoints(5);
      toast.success('Pomodoro completed! +5 points');
      setPomodoroTime(25 * 60);
    }
    return () => clearInterval(timer);
  }, [pomodoroActive, pomodoroTime, addPoints]);

  useEffect(() => {
    const recurringTasks = tasks.filter((task) => task.recurrence !== 'none' && task.completed && new Date(task.dueDate) < new Date());
    recurringTasks.forEach((task) => {
      let nextDueDate = new Date(task.dueDate);
      if (task.recurrence === 'daily') nextDueDate.setDate(nextDueDate.getDate() + 1);
      else if (task.recurrence === 'weekly') nextDueDate.setDate(nextDueDate.getDate() + 7);
      else if (task.recurrence === 'monthly') nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      editTask(task._id, { ...task, dueDate: nextDueDate, completed: false });
    });
  }, [tasks, editTask]);

  const getStreak = () => {
    const completedDates = tasks
      .filter((task) => task.completed)
      .map((task) => new Date(task.dueDate).toDateString())
      .reduce((acc, date) => {
        acc[date] = true;
        return acc;
      }, {});
    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      if (completedDates[date.toDateString()]) streak++;
      else break;
    }
    return streak;
  };

  const handleNextStep = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem('onboardingSeen', 'true');
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)));
  };

  const clearNotifications = () => setNotifications([]);
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask({
      ...newTask,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      createdAt: new Date(),
      reminder: newTask.reminder ? new Date(newTask.reminder) : null,
    });
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      weeklyAccomplishment: '',
      lessonsLearned: '',
      recurrence: 'none',
      reminder: null,
      status: 'To Do',
    });
    setShowTaskForm(false);
  };

  const toggleVoice = () => {
    if (voiceActive) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setVoiceActive(!voiceActive);
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  const togglePomodoro = () => {
    setPomodoroActive(!pomodoroActive);
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroTime(25 * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBackground(url);
    }
  };

  const selectPresetTheme = (theme) => {
    if (unlockedThemes.includes(theme.name)) {
      setCustomBackground(theme.url);
    } else {
      toast.error('Theme not unlocked! Spend 50 points to unlock.');
    }
  };

  const selectPresetMusic = (track) => {
    if (unlockedMusic.includes(track.name)) {
      audioRef.current.src = track.url;
      audioRef.current.play();
    } else {
      toast.error('Music track not unlocked! Spend 30 points to unlock.');
    }
  };

  const onboardingMessages = [
    { title: "Welcome to Agitator! 🎉", message: "Start by adding a task or habit using the dropdown or voice!" },
    { title: "Personalize Your Experience", message: "Switch themes, use the Pomodoro timer, or track habits!" },
    { title: "Earn Rewards!", message: "Complete tasks and Pomodoro sessions for points to unlock themes and music!" },
  ];

  if (!tasks) return <div className="text-center text-gray-500">Loading tasks...</div>;

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col font-sans" style={{ backgroundImage: customBackground ? `url(${customBackground})` : 'none', backgroundSize: 'cover' }}>
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
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Agitator</h1>
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
                  <input
                    type="datetime-local"
                    name="reminder"
                    value={newTask.reminder}
                    onChange={handleTaskInputChange}
                    placeholder="Reminder (optional)"
                    className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  />
                  <select
                    name="recurrence"
                    value={newTask.recurrence}
                    onChange={handleTaskInputChange}
                    className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  >
                    <option value="none">No Recurrence</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
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
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition flex items-center justify-center"
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
                      <button onClick={clearNotifications} className="text-sm text-red-500 dark:text-red-400 hover:underline">
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to Agitator!</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-200">Total Points: {points}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200">Tasks Completed: {completedTasks}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200">Pomodoro Sessions: {pomodoroSessions}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200">Streak: {getStreak()} days</p>
                    {getStreak() >= 7 && <p className="text-sm text-green-600">Badge: Streak Master!</p>}
                    <button
                      onClick={toggleTheme}
                      className="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                      {theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
                    </button>
                    <button
                      onClick={toggleVoice}
                      className={`w-full p-2 rounded-lg text-sm ${voiceActive ? 'bg-red-500' : 'bg-green-500'} text-white hover:bg-opacity-90 transition`}
                    >
                      {voiceActive ? 'Stop Voice' : 'Start Voice'}
                    </button>
                    <button
                      onClick={toggleMusic}
                      className={`w-full p-2 rounded-lg text-sm ${musicPlaying ? 'bg-red-500' : 'bg-green-500'} text-white hover:bg-opacity-90 transition`}
                    >
                      {musicPlaying ? 'Pause Music' : 'Play Music'}
                    </button>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Point Store</h4>
                      <button
                        onClick={() => unlockTheme('forest')}
                        className="w-full p-2 mb-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        disabled={points < 50 || unlockedThemes.includes('forest')}
                      >
                        Unlock Forest Theme (50 pts)
                      </button>
                      <button
                        onClick={() => unlockTheme('ocean')}
                        className="w-full p-2 mb-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        disabled={points < 50 || unlockedThemes.includes('ocean')}
                      >
                        Unlock Ocean Theme (50 pts)
                      </button>
                      <button
                        onClick={() => unlockMusic('chill')}
                        className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        disabled={points < 30 || unlockedMusic.includes('chill')}
                      >
                        Unlock Chill Music (30 pts)
                      </button>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="w-full p-2 mb-2 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                    />
                    <select
                      onChange={(e) => selectPresetTheme(presetThemes.find(t => t.name === e.target.value))}
                      className="w-full p-2 mb-2 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                    >
                      <option value="">Select Theme</option>
                      {presetThemes.map((theme) => (
                        <option key={theme.name} value={theme.name} disabled={!unlockedThemes.includes(theme.name)}>
                          {theme.name} {unlockedThemes.includes(theme.name) ? '' : '(Locked)'}
                        </option>
                      ))}
                    </select>
                    <select
                      onChange={(e) => selectPresetMusic(presetMusic.find(t => t.name === e.target.value))}
                      className="w-full p-2 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                    >
                      <option value="">Select Music</option>
                      {presetMusic.map((track) => (
                        <option key={track.name} value={track.name} disabled={!unlockedMusic.includes(track.name)}>
                          {track.name} {unlockedMusic.includes(track.name) ? '' : '(Locked)'}
                        </option>
                      ))}
                    </select>
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
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm"
            >
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <KanbanBoard tasks={filteredTasks} editTask={editTask} />
            </div>
            <div className="mb-8">
              <HabitTracker />
            </div>
            {showCalendar && (
              <div className="mb-8">
                <StaticDatePicker
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  renderInput={(params) => <input {...params} />}
                />
              </div>
            )}
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Pomodoro Timer</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-200">{formatTime(pomodoroTime)}</p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={togglePomodoro}
                    className={`px-3 py-1 rounded-lg text-sm ${pomodoroActive ? 'bg-red-500' : 'bg-green-500'} text-white hover:bg-opacity-90 transition`}
                  >
                    {pomodoroActive ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={resetPomodoro}
                    className="px-3 py-1 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500 transition text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="p-5 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Streak 🔥</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-200">{getStreak()} days</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">You’re on a roll!</p>
              </div>
            </div>
            <div className="p-5 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Analytics Dashboard</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Task Completion Rate</h3>
                  <p className="text-2xl text-gray-900 dark:text-gray-100">{progress.toFixed(1)}%</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Habit Consistency</h3>
                  <p className="text-2xl text-gray-900 dark:text-gray-100">{habits.filter(h => h.completionDates && h.completionDates.length > 0).length}/{habits.length}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Pomodoro Sessions</h3>
                  <p className="text-2xl text-gray-900 dark:text-gray-100">{pomodoroSessions}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Current Streak</h3>
                  <p className="text-2xl text-gray-900 dark:text-gray-100">{getStreak()} days</p>
                </div>
              </div>
            </div>
            <TaskList />
            <UserProfile />
          </div>
        </main>
        <footer className="p-5 neumorphic text-center bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm shadow-inner">
          <div className="mb-2">
            <audio
              ref={audioRef}
              src={presetMusic.find(t => unlockedMusic.includes(t.name))?.url || presetMusic[0].url}
              loop
            />
          </div>
          Boost Your Agility with Agitator © 2025
        </footer>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </LocalizationProvider>
  );
};

// Wrap App with TaskProvider at the top level
const AppWrapper = () => (
  <TaskProvider>
    <App />
  </TaskProvider>
);

export default AppWrapper;
