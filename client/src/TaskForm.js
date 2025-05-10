import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from './TaskContext';

const TaskForm = ({ showForm, setShowForm }) => {
  const { addTask } = useContext(TaskContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weeklyAccomplishment, setWeeklyAccomplishment] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [canEditWeekly, setCanEditWeekly] = useState(true);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks).map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      }));
      localStorage.setItem('tasks', JSON.stringify(parsedTasks));
    }
    const lastUpdate = localStorage.getItem('weeklyAccomplishmentLastUpdate');
    if (lastUpdate) {
      const lastUpdateDate = new Date(lastUpdate);
      const now = new Date();
      const diffTime = Math.abs(now - lastUpdateDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        setCanEditWeekly(false);
        setWeeklyAccomplishment(localStorage.getItem('weeklyAccomplishment') || '');
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (canEditWeekly && weeklyAccomplishment.trim()) {
      localStorage.setItem('weeklyAccomplishment', weeklyAccomplishment);
      localStorage.setItem('weeklyAccomplishmentLastUpdate', new Date().toISOString());
      setCanEditWeekly(false);
    }
    addTask({
      title,
      description,
      weeklyAccomplishment: canEditWeekly ? weeklyAccomplishment : '',
      lessonsLearned,
      priority,
      completed: false,
      createdAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
    });
    setTitle('');
    setDescription('');
    if (canEditWeekly) setWeeklyAccomplishment('');
    setLessonsLearned('');
    setPriority('Medium');
    setDueDate('');
    setShowForm(false);
  };

  return (
    <>
      {showForm && (
        <div className="fixed lg:static top-0 left-0 w-full h-full lg:h-auto bg-gray-100 dark:bg-gray-900 lg:bg-transparent p-4 lg:p-0 z-10">
          <form onSubmit={handleSubmit} className="p-6 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg max-w-md w-full mx-auto lg:mx-0 transform transition-all duration-300">
            <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100">Add Today's Accomplishment</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full p-3 mb-4 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="w-full p-3 mb-4 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
              rows="3"
            />
            <textarea
              value={weeklyAccomplishment}
              onChange={(e) => setWeeklyAccomplishment(e.target.value)}
              placeholder="Weekly Accomplishments (editable once per week)"
              className="w-full p-3 mb-4 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
              rows="3"
              disabled={!canEditWeekly}
            />
            <textarea
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              placeholder="What did you learn?"
              className="w-full p-3 mb-4 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
              rows="3"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 mb-4 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 mb-4 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
              placeholder="Due Date (optional)"
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md text-sm"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full bg-gray-500 dark:bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-md text-sm lg:hidden"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default TaskForm;
