import React, { useContext, useEffect } from 'react';
import { TaskContext } from './TaskContext';

const ProgressChart = () => {
  const { tasks } = useContext(TaskContext);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(50, 50, 200, 100);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 50, (progress / 100) * 200, 100);

    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText(`Progress: ${progress.toFixed(1)}%`, 150, 80);

    const panel = document.querySelector('#canvas-panel');
    if (panel) {
      panel.innerHTML = '';
      panel.appendChild(canvas);
    }
  }, [tasks]);

  return (
    <div id="canvas-panel" className="mt-6 p-4 neumorphic rounded-xl bg-white dark:bg-gray-800 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Progress Trend</h3>
    </div>
  );
};

export default ProgressChart;
