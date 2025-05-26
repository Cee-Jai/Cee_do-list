import React, { useState, useContext } from 'react';
import { TaskContext } from './TaskContext';

const HabitTracker = () => {
  const { habits, addHabit, toggleHabit } = useContext(TaskContext);
  const [newHabit, setNewHabit] = useState('');

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      console.log('Adding habit from input:', { name: newHabit });
      addHabit({ name: newHabit });
      setNewHabit('');
    }
  };

  return (
    <div className="p-5 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Habit Tracker</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddHabit();
            }
          }}
          placeholder="Add a new habit"
          className="flex-1 p-3 rounded-l-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
        />
        <button
          onClick={handleAddHabit}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-r-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm"
        >
          Add
        </button>
      </div>
      <ul className="space-y-3">
        {habits.map((habit) => (
          <li
            key={habit._id}
            className="flex items-center justify-between p-3 rounded-lg neumorphic bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={habit.completed || false}
                onChange={() => toggleHabit(habit._id)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
              />
              <span
                className={`text-gray-800 dark:text-gray-100 ${
                  habit.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}
              >
                {habit.name || 'Unnamed Habit'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitTracker;

