  import React, { useState, useContext } from 'react';
import { TaskContext } from './TaskContext';

const TaskList = () => {
  const { tasks, toggleTask, deleteTask, editTask } = useContext(TaskContext);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAccomplishment, setEditAccomplishment] = useState('');
  const [editLessonsLearned, setEditLessonsLearned] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');

  const handleEdit = (task) => {
    setEditingTask(task.createdAt);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditAccomplishment(task.accomplishment || '');
    setEditLessonsLearned(task.lessonsLearned || '');
    setEditPriority(task.priority || 'Medium');
  };

  const handleSave = (taskId) => {
    if (!editTitle.trim()) return;
    editTask(taskId, {
      title: editTitle,
      description: editDescription,
      accomplishment: editAccomplishment,
      lessonsLearned: editLessonsLearned,
      priority: editPriority,
    });
    setEditingTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'border-red-500';
      case 'Medium':
        return 'border-yellow-500';
      case 'Low':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return task.completed;
    if (filter === 'Pending') return !task.completed;
    return true;
  });

  return (
    <div className="flex mt-6">
      <aside className="w-64 p-4 neumorphic mr-4 hidden md:block">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Filters</h3>
        <button
          onClick={() => setFilter('All')}
          className={`w-full text-left px-3 py-2 mb-2 rounded ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Completed')}
          className={`w-full text-left px-3 py-2 mb-2 rounded ${filter === 'Completed' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('Pending')}
          className={`w-full text-left px-3 py-2 rounded ${filter === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'}`}
        >
          Pending
        </button>
      </aside>
      <ul className="flex-1">
        {filteredTasks.map((task) => (
          <li
            key={task.createdAt}
            className={`flex flex-col p-4 mb-2 neumorphic rounded-lg hover:scale-105 transition-transform duration-200 border-l-4 ${getPriorityColor(task.priority)} animate-fade-in sm:p-5`}
          >
            {editingTask === task.createdAt ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 mb-2 border-none rounded-lg dark:bg-gray-800 dark:text-gray-100 sm:p-3"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 mb-2 border-none rounded-lg dark:bg-gray-800 dark:text-gray-100 sm:p-3"
                />
                <textarea
                  value={editAccomplishment}
                  onChange={(e) => setEditAccomplishment(e.target.value)}
                  placeholder="What did you accomplish?"
                  className="w-full p-2 mb-2 border-none rounded-lg dark:bg-gray-800 dark:text-gray-100 sm:p-3"
                />
                <textarea
                  value={editLessonsLearned}
                  onChange={(e) => setEditLessonsLearned(e.target.value)}
                  placeholder="What did you learn?"
                  className="w-full p-2 mb-2 border-none rounded-lg dark:bg-gray-800 dark:text-gray-100 sm:p-3"
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full p-2 mb-2 border-none rounded-lg dark:bg-gray-800 dark:text-gray-100 sm:p-3"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <button
                  onClick={() => handleSave(task.createdAt)}
                  className="bg-green-500 text-white p-2 rounded-lg mr-2 sm:p-3"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-500 text-white p-2 rounded-lg sm:p-3"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.createdAt)}
                    className="mr-3 sm:mr-4"
                  />
                  <div>
                    <span
                      className={
                        task.completed
                          ? 'line-through text-green-600 font-semibold dark:text-green-400'
                          : 'font-semibold dark:text-gray-100'
                      }
                    >
                      {task.title}
                    </span>
                    <p className="text-sm sm:text-base dark:text-gray-300">{task.description}</p>
                    {task.accomplishment && (
                      <p className="text-sm sm:text-base dark:text-gray-300">
                        <strong>Accomplished:</strong> {task.accomplishment}
                      </p>
                    )}
                    {task.lessonsLearned && (
                      <p className="text-sm sm:text-base dark:text-gray-300">
                        <strong>Learned:</strong> {task.lessonsLearned}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm dark:text-gray-400">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-blue-500 hover:text-blue-700 sm:text-lg dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.createdAt)}
                    className="text-red-500 hover:text-red-700 sm:text-lg dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
