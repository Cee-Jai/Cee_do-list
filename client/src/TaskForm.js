import React, { useState, useContext } from 'react';
import { TaskContext } from './TaskContext';

const TaskForm = () => {
  const { addTask } = useContext(TaskContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accomplishment, setAccomplishment] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title,
      description,
      accomplishment,
      lessonsLearned,
      priority,
      completed: false,
      createdAt: new Date(),
    });
    setTitle('');
    setDescription('');
    setAccomplishment('');
    setLessonsLearned('');
    setPriority('Medium');
    setShowForm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 lg:hidden z-20 transform hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>

      <div className={`${showForm ? 'block' : 'hidden'} lg:block fixed lg:static top-0 left-0 w-full h-full lg:h-auto bg-gray-100 dark:bg-gray-900 lg:bg-transparent p-4 lg:p-0 z-10`}>
        <form onSubmit={handleSubmit} className="p-6 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg max-w-md w-full mx-auto lg:mx-0 transform transition-all duration-300">
          <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100">Add a New Task</h2>
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
            value={accomplishment}
            onChange={(e) => setAccomplishment(e.target.value)}
            placeholder="What did you accomplish?"
            className="w-full p-3 mb-4 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
            rows="3"
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
    </>
  );
};

export default TaskForm;
