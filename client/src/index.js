import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './ThemeContext';
import { TaskProvider } from './TaskContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TaskProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </TaskProvider>
  </React.StrictMode>
);
