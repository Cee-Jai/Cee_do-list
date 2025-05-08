import React, { useState } from 'react';

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accomplishment, setAccomplishment] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [priority, setPriority] = useState('Medium');

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
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg animate-fade-in sm:p-8 md:max-w-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 sm:text-2xl">Add a New Task</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-4"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-4"
      />
      <textarea
        value={accomplishment}
        onChange={(e) => setAccomplishment(e.target.value)}
        placeholder="What did you accomplish?"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-4"
      />
      <textarea
        value={lessonsLearned}
        onChange={(e) => setLessonsLearned(e.target.value)}
        placeholder="What did you learn?"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-4"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-4"
      >
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 sm:p-4"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
