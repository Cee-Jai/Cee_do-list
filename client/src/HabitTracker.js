import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from './TaskContext';
import { Tilt } from 'react-tilt';
import axios from 'axios';

const HabitTracker = () => {
  const { habits, addHabit, toggleHabit, deleteHabit, editHabit } = useContext(TaskContext);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Productivity');
  const [editReminder, setEditReminder] = useState('');
  const [editRecurrence, setEditRecurrence] = useState('none');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // No need to fetch here; TaskContext handles it
  }, []);

  const handleEdit = (habit) => {
    setEditingHabit(habit._id);
    setEditTitle(habit.title);
    setEditCategory(habit.category || 'Productivity');
    setEditReminder(habit.reminder ? new Date(habit.reminder).toISOString().slice(0, 16) : '');
    setEditRecurrence(habit.recurrence || 'none');
  };

  const handleSave = (habitId) => {
    if (!editTitle.trim()) return;
    const updatedHabit = {
      title: editTitle,
      category: editCategory,
      reminder: editReminder ? new Date(editReminder) : null,
      recurrence: editRecurrence,
    };
    editHabit(habitId, updatedHabit);
    setEditingHabit(null);
  };

  const setReminder = (habit) => {
    const reminderDate = prompt('Enter reminder date and time (YYYY-MM-DDTHH:MM)', habit.reminder ? new Date(habit.reminder).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
    if (reminderDate) {
      editHabit(habit._id, { ...habit, reminder: new Date(reminderDate), reminderNotified: false });
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Health': return 'border-blue-500';
      case 'Productivity': return 'border-green-500';
      case 'Personal': return 'border-purple-500';
      default: return 'border-gray-300';
    }
  };

  const formatDate = (date) => {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return 'Invalid Date';
      return parsedDate.toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const filteredHabits = habits.filter((habit) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return habit.completionDates.length === 0 || !habit.completionDates.some(d => new Date(d).toDateString() === new Date().toDateString());
    if (filter === 'Completed') return habit.completionDates.some(d => new Date(d).toDateString() === new Date().toDateString());
    return true;
  });

  return (
    <div className="flex mt-6">
      <aside className="w-64 p-5 neumorphic rounded-xl bg-white dark:bg-gray-800 mr-5 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Filters</h3>
        <button
          onClick={() => setFilter('All')}
          className={`w-full text-left px-4 py-2 mb-2 rounded-lg text-sm ${filter === 'All' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Active')}
          className={`w-full text-left px-4 py-2 mb-2 rounded-lg text-sm ${filter === 'Active' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('Completed')}
          className={`w-full text-left px-4 py-2 mb-2 rounded-lg text-sm ${filter === 'Completed' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200`}
        >
          Completed
        </button>
      </aside>
      <ul className="flex-1 space-y-4">
        <li className="flex items-center justify-between p-4 neumorphic rounded-xl bg-white dark:bg-gray-800">
          <input
            type="text"
            placeholder="New Habit"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                addHabit({ title: e.target.value.trim() });
                e.target.value = '';
              }
            }}
            className="w-full p-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
          />
        </li>
        {filteredHabits.map((habit) => (
          <Tilt key={habit._id} options={{ max: 25, scale: 1.05, speed: 300 }}>
            <li
              className={`flex flex-col p-4 neumorphic rounded-xl bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 border-l-4 ${getCategoryColor(habit.category)} transform hover:scale-[1.02]`}
            >
              {editingHabit === habit._id ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  />
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  >
                    <option value="Productivity">Productivity</option>
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                  </select>
                  <input
                    type="datetime-local"
                    value={editReminder}
                    onChange={(e) => setEditReminder(e.target.value)}
                    className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  />
                  <select
                    value={editRecurrence}
                    onChange={(e) => setEditRecurrence(e.target.value)}
                    className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  >
                    <option value="none">No Recurrence</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleSave(habit._id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingHabit(null)}
                      className="bg-gray-500 dark:bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-all duration-200 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={habit.completionDates.some(d => new Date(d).toDateString() === new Date().toDateString())}
                      onChange={() => toggleHabit(habit._id, new Date())}
                      className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                        {habit.title}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Category: {habit.category}
                      </p>
                      {habit.reminder && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <strong>Reminder:</strong> {formatDate(habit.reminder)}
                        </p>
                      )}
                      {habit.recurrence !== 'none' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <strong>Recurs:</strong> {habit.recurrence}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Created: {formatDate(habit.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(habit)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setReminder(habit)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium transition"
                    >
                      Set Reminder
                    </button>
                    <button
                      onClick={() => deleteHabit(habit._id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          </Tilt>
        ))}
      </ul>
    </div>
  );
};

export default HabitTracker;
