import React from 'react';

function TaskList({ tasks, toggleTask }) {
  return (
    <ul className="p-4">
      {tasks.map((task) => (
        <li key={task.createdAt} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.createdAt)}
            className="mr-2"
          />
          <span className={task.completed ? 'line-through text-green-600' : 'text-gray-800'}>
            {task.title} - {task.description}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
