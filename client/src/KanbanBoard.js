import React, { useState, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskContext } from './TaskContext';
import { Tilt } from 'react-tilt';

const KanbanBoard = ({ tasks, editTask }) => {
  const { users, assignTask } = useContext(TaskContext);
  const [selectedStatus, setSelectedStatus] = useState('To Do'); // Default to "To Do"

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);
    const updatedTasks = newTasks.map((task) => ({
      ...task,
      status: selectedStatus, // Update status based on the current view
    }));
    updatedTasks.forEach((task) => editTask(task._id, { ...task, status: task.status }));
  };

  const getTasksByStatus = (status) => tasks.filter((task) => task.status === status);

  const statuses = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="status-select" className="text-lg font-semibold text-gray-800 dark:text-gray-100 mr-2">
          View Tasks:
        </label>
        <select
          id="status-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 rounded-lg neumorphic focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={selectedStatus}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg min-h-[400px] max-h-[400px] overflow-y-auto"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{selectedStatus}</h2>
              {getTasksByStatus(selectedStatus).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No tasks in this status.</p>
              ) : (
                getTasksByStatus(selectedStatus).map((task, index) => (
                  <Draggable key={task._id.toString()} draggableId={task._id.toString()} index={index}>
                    {(provided) => (
                      <Tilt
                        options={{ max: 25, scale: 1.05, speed: 300 }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 mb-2 rounded-md shadow hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center">
                            <span className={task.completed ? 'line-through text-green-600' : 'text-gray-800 dark:text-gray-100'}>
                              {task.title}
                            </span>
                            <select
                              value={task.assignedTo || ''}
                              onChange={(e) => assignTask(task._id, e.target.value)}
                              className="ml-2 p-1 border rounded text-sm"
                            >
                              <option value="">Unassigned</option>
                              {users.map((user) => (
                                <option key={user} value={user}>
                                  {user}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </Tilt>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
