import React, { useState } from 'react';

function TaskList({ tasks, toggleTask, deleteTask, editTask }) {
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAccomplishment, setEditAccomplishment] = useState('');
  const [editLessonsLearned, setEditLessonsLearned] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');

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

  return (
    <ul className="max-w-md mx-auto mt-6">
      {tasks.map((task) => (
        <li
          key={task.createdAt}
          className={`flex flex-col p-4 mb-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition duration-200 border-l-4 ${getPriorityColor(task.priority)} animate-fade-in`}
        >
          {editingTask === task.createdAt ? (
            <div className="flex-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              />
              <textarea
                value={editAccomplishment}
                onChange={(e) => setEditAccomplishment(e.target.value)}
                placeholder="What did you accomplish?"
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              />
              <textarea
                value={editLessonsLearned}
                onChange={(e) => setEditLessonsLearned(e.target.value)}
                placeholder="What did you learn?"
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              />
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <button
                onClick={() => handleSave(task.createdAt)}
                className="bg-green-500 text-white p-2 rounded-lg mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="bg-gray-500 text-white p-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.createdAt)}
                    className="mr-3"
                  />
                  <div>
                    <span
                      className={
                        task.completed
                          ? 'line-through text-green-600 font-semibold'
                          : 'text-gray-800 font-semibold'
                      }
                    >
                      {task.title}
                    </span>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                    {task.accomplishment && (
                      <p className="text-gray-600 text-sm">
                        <strong>Accomplished:</strong> {task.accomplishment}
                      </p>
                    )}
                    {task.lessonsLearned && (
                      <p className="text-gray-600 text-sm">
                        <strong>Learned:</strong> {task.lessonsLearned}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.createdAt)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
