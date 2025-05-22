import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from './TaskContext';
import { toast } from 'react-toastify';

const HabitTracker = () => {
  const { habits, addHabit, toggleHabit, deleteHabit, editHabit } = useContext(TaskContext);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Productivity');
  const [newHabitReminder, setNewHabitReminder] = useState('');

  const today = new Date();

  const handleAddHabit = () => {
    if (!newHabitTitle.trim()) return;
    addHabit({
      title: newHabitTitle,
      createdAt: new Date(),
      category: newHabitCategory,
      reminder: newHabitReminder ? new Date(newHabitReminder) : null,
    });
    setNewHabitTitle('');
    setNewHabitCategory('Productivity');
    setNewHabitReminder('');
  };

  const getStreak = (habit) => {
    if (!habit.completionDates || habit.completionDates.length === 0) return 0;
    const sortedDates = habit.completionDates
      .map(date => new Date(date))
      .sort((a, b) => b - a);
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toDateString();
      const wasCompleted = sortedDates.some(d => d.toDateString() === dateStr);
      if (!wasCompleted) break;
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  };

  const isCompletedToday = (habit) => {
    const todayStr = today.toDateString();
    return habit.completionDates && habit.completionDates.some(d => new Date(d).toDateString() === todayStr);
  };

  useEffect(() => {
    const checkReminders = () => {
      habits.forEach((habit) => {
        if (habit.reminder && new Date(habit.reminder) <= new Date() && !habit.reminderNotified) {
          toast.info(`Reminder: Time to work on "${habit.title}"!`, {
            onClose: () => editHabit(habit.createdAt.getTime(), { ...habit, reminderNotified: true }),
          });
        }
      });
    };
    const timer = setInterval(checkReminders, 60000); // Check every minute
    checkReminders();
    return () => clearInterval(timer);
  }, [habits, editHabit]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Habit Tracker</h2>
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          value={newHabitTitle}
          onChange={(e) => setNewHabitTitle(e.target.value)}
          placeholder="Add a new habit..."
          className="flex-1 p-2 border-none rounded-l-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
        />
        <select
          value={newHabitCategory}
          onChange={(e) => setNewHabitCategory(e.target.value)}
          className="p-2 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
        >
          <option value="Health">Health</option>
          <option value="Productivity">Productivity</option>
          <option value="Learning">Learning</option>
        </select>
        <input
          type="datetime-local"
          value={newHabitReminder}
          onChange={(e) => setNewHabitReminder(e.target.value)}
          placeholder="Reminder (optional)"
          className="p-2 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
        />
        <button
          onClick={handleAddHabit}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-r-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm"
        >
          Add
        </button>
      </div>
      {habits.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No habits yet. Add one to get started!</p>
      ) : (
        <ul className="space-y-2">
          {habits.map((habit) => (
            <li key={habit.createdAt.getTime()} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
              <span className="text-gray-800 dark:text-gray-100">{habit.title} ({habit.category})</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleHabit(habit.createdAt.getTime(), today)}
                  className={`px-2 py-1 rounded-lg text-sm ${isCompletedToday(habit) ? 'bg-red-500' : 'bg-green-500'} text-white hover:bg-opacity-90 transition`}
                >
                  {isCompletedToday(habit) ? 'Undo' : 'Done'}
                </button>
                <button
                  onClick={() => deleteHabit(habit.createdAt.getTime())}
                  className="px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300">Streak: {getStreak(habit)} days</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HabitTracker;
