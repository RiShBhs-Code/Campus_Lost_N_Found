import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  // Load initial state from localStorage if available
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_lost_found_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('campus_lost_found_user');
  });

  const login = (userData) => {
    const userObj = typeof userData === 'string' ? { name: userData, role: 'user' } : userData;
    setUser(userObj);
    setIsLoggedIn(true);
    localStorage.setItem('campus_lost_found_user', JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('campus_lost_found_user');
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
