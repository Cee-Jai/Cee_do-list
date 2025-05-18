import React, { useState, useContext } from 'react';
import { TaskContext } from './TaskContext';

const TaskList = ({ menuOpen }) => {
  const { tasks, toggleTask, deleteTask, editTask } = useContext(TaskContext);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editWeeklyAccomplishment, setEditWeeklyAccomplishment] = useState('');
  const [editLessonsLearned, setEditLessonsLearned] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [filter, setFilter] = useState('All');

  const handleEdit = (task) => {
    setEditingTask(task.createdAt);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditWeeklyAccomplishment(task.weeklyAccomplishment || '');
    setEditLessonsLearned(task.lessonsLearned || '');
    setEditPriority(task.priority || 'Medium');
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
  };

  const handleSave = (taskId) => {
    if (!editTitle.trim()) return;
    editTask(taskId, {
      title: editTitle,
      description: editDescription,
      weeklyAccomplishment: editWeeklyAccomplishment,
      lessonsLearned: editLessonsLearned,
      priority: editPriority,
      dueDate: editDueDate ? new Date(editDueDate) : null,
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
      <aside className={`w-64 p-5 neumorphic rounded-xl bg-white dark:bg-gray-800 mr-5 shadow-lg ${menuOpen ? 'block' : 'hidden'} md:block transition-all duration-300`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Filters</h3>
        <button
          onClick={() => setFilter('All')}
          className={`w-full text-left px-4 py-2 mb-2 rounded-lg text-sm ${filter === 'All' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Completed')}
          className={`w-full text-left px-4 py-2 mb-2 rounded-lg text-sm ${filter === 'Completed' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('Pending')}
          className={`w-full text-left px-4 py-2 mb-2 rounded-lg text-sm ${filter === 'Pending' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200`}
        >
          Pending
        </button>
      </aside>
      <ul className="flex-1 space-y-4">
        {filteredTasks.map((task) => (
          <li
            key={task.createdAt}
            className={`flex flex-col p-4 neumorphic rounded-xl bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 border-l-4 ${getPriorityColor(task.priority)} transform hover:scale-[1.02]`}
          >
            {editingTask === task.createdAt ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  rows="2"
                />
                <textarea
                  value={editWeeklyAccomplishment}
                  onChange={(e) => setEditWeeklyAccomplishment(e.target.value)}
                  placeholder="Weekly Accomplishments"
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  rows="2"
                />
                <textarea
                  value={editLessonsLearned}
                  onChange={(e) => setEditLessonsLearned(e.target.value)}
                  placeholder="What did you learn?"
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  rows="2"
                />
                <input
                  type="datetime-local"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full p-3 mb-3 border-none rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSave(task.createdAt)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
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
                    checked={task.completed}
                    onChange={() => toggleTask(task.createdAt)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span
                      className={
                        task.completed
                          ? 'line-through text-green-600 font-semibold dark:text-green-400 text-lg'
                          : 'font-semibold text-gray-800 dark:text-gray-100 text-lg'
                      }
                    >
                      {task.title}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                    {task.weeklyAccomplishment && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <strong>Weekly Accomplishments:</strong> {task.weeklyAccomplishment}
                      </p>
                    )}
                    {task.lessonsLearned && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <strong>Learned:</strong> {task.lessonsLearned}
                      </p>
                    )}
                    {task.dueDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.createdAt)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition"
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
