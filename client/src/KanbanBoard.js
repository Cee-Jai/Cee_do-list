import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useContext } from 'react';
import { TaskContext } from './TaskContext';
import { Tilt } from 'react-tilt'; // Fixed import: use named export

const KanbanBoard = ({ tasks, editTask }) => {
  const { users, assignTask } = useContext(TaskContext);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      status: getStatusFromIndex(result.destination.droppableId, index),
    }));
    updatedTasks.forEach((task, i) => editTask(task.createdAt.getTime(), { ...task, status: task.status }));
  };

  const getStatusFromIndex = (droppableId, index) => {
    const statuses = ['To Do', 'In Progress', 'Done'];
    return statuses[parseInt(droppableId)];
  };

  const getTasksByStatus = (status) => tasks.filter((task) => task.status === status);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 overflow-x-auto p-4">
        {['0', '1', '2'].map((id) => (
          <Droppable droppableId={id} key={id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-1/3 min-w-[250px] h-[400px] overflow-y-auto"
              >
                <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  {getStatusFromIndex(id, 0)}
                </h2>
                {getTasksByStatus(getStatusFromIndex(id, 0)).map((task, index) => (
                  <Draggable key={task.createdAt.getTime()} draggableId={task.createdAt.getTime().toString()} index={index}>
                    {(provided) => (
                      <Tilt
                        options={{ max: 25, scale: 1.05, speed: 300 }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div
                          className="bg-gray-100 dark:bg-gray-700 p-3 mb-2 rounded-md shadow hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-center">
                            <span className={task.completed ? 'line-through text-green-600' : 'text-gray-800 dark:text-gray-100'}>
                              {task.title}
                            </span>
                            <select
                              value={task.assignedTo}
                              onChange={(e) => assignTask(task.createdAt.getTime(), e.target.value)}
                              className="ml-2 p-1 border rounded"
                            >
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
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
