import React, { createContext, useState, useEffect } from 'react';

export const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState({
    daily: localStorage.getItem('dailyGoal') ? parseInt(localStorage.getItem('dailyGoal'), 10) : 5,
  });

  useEffect(() => {
    localStorage.setItem('dailyGoal', goals.daily || 5);
  }, [goals.daily]);

  const setGoal = (newGoals) => {
    setGoals(newGoals);
  };

  return (
    <GoalsContext.Provider value={{ goals, setGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};
