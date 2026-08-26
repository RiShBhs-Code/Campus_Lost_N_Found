import React, { createContext, useState } from 'react';

// 1. createContext: Creates Context object for global state sharing
// What it does: Defines a global context container for user data.
// Why it is used: Solves prop drilling by allowing components anywhere in the tree to access user state.
export const UserContext = createContext();

// 2. UserProvider Component
// What it does: Holds the global user state and provides it to all child components via Context.Provider.
// Why it is used: Wraps the app so any component can read/update user state without props.
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock Login Function
  const login = (name) => {
    if (name.trim()) {
      setUser(name);
      setIsLoggedIn(true);
    }
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    // Provider exposes global state and action methods to all descendant components
    <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
