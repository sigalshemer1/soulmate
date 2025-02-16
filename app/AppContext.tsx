import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Context to share the reminder times
const AppContext = createContext(null);

export const useAppContext = () => useContext(AppContext);
export const AppProvider = ({ children }) => {
  const [reminderTimes, setReminderTimes] = useState([]);

  // Load the reminder times from AsyncStorage on app load
  useEffect(() => {
    const loadReminderTimes = async () => {
      const savedTimes = await AsyncStorage.getItem('reminderTimes');
      if (savedTimes) {
        setReminderTimes(JSON.parse(savedTimes));
      }
    };
    loadReminderTimes();
  }, []);

  // Save reminder times when updated
  useEffect(() => {
    if (reminderTimes.length) {
      AsyncStorage.setItem('reminderTimes', JSON.stringify(reminderTimes));
    }
  }, [reminderTimes]);

  return (
    <AppContext.Provider value={{ reminderTimes, setReminderTimes }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the AppContext
export default AppProvider;
