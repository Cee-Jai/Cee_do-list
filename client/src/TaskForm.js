import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from './TaskContext';

const TaskForm = () => {
  const { addTask } = useContext(TaskContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weeklyAccomplishment, setWeeklyAccomplishment] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [canEditWeekly, setCanEditWeekly] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleAddTask = () => {
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
    setShowDetails(false);
  };

  return (
    <div className="p-4 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg mb-4">
      <div className="flex items-center space-x-3 mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 p-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          onClick={handleAddTask}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md text-sm"
        >
          Add
        </button>
      </div>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition mb-3"
      >
        {showDetails ? 'Hide Details' : 'Add Details'}
      </button>
      {showDetails && (
        <div className="space-y-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className="w-full p-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
            rows="3"
          />
          <textarea
            value={weeklyAccomplishment}
            onChange={(e) => setWeeklyAccomplishment(e.target.value)}
            placeholder="Weekly Accomplishments (editable once per week)"
            className="w-full p-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
            rows="3"
            disabled={!canEditWeekly}
          />
          <textarea
            value={lessonsLearned}
            onChange={(e) => setLessonsLearned(e.target.value)}
            placeholder="What did you learn?"
            className="w-full p-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
            rows="3"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
            placeholder="Due Date (optional)"
          />
        </div>
      )}
    </div>
  );
};

export default TaskForm;
