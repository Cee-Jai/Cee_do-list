import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from './ThemeContext';
import { TaskProvider } from './TaskContext';
import { GoalsProvider } from './GoalsContext';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <TaskProvider>
        <GoalsProvider>
          <App />
        </GoalsProvider>
      </TaskProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
