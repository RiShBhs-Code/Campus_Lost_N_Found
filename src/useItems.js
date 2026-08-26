import { useState, useEffect } from 'react';

// CUSTOM HOOK: useItems
// What it does: Encapsulates item data state, mock API data fetching, and item addition logic.
// Why it is used: Custom hooks start with "use" and allow reusable stateful logic across components.
export function useItems() {
  // useState: Manages items list and loading status
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect: Runs side-effect (mock data fetching) once when component mounts
  useEffect(() => {
    // Simulated asynchronous API fetch function
    const fetchItems = () => {
      const initialData = [
        { id: 1, name: 'Blue Water Bottle', status: 'lost', location: 'Lab 3', date: 'Today' },
        { id: 2, name: 'Black Calculator', status: 'found', location: 'Library', date: 'Yesterday' },
        { id: 3, name: 'Student ID Card', status: 'lost', location: 'Canteen', date: 'Aug 24' },
      ];

      // Simulated network delay (500ms)
      setTimeout(() => {
        setItems(initialData);
        setLoading(false);
      }, 500);
    };

    fetchItems();
  }, []); // Empty dependency array [] ensures effect runs only once on mount

  // Helper function to add a new item to state
  const addItem = (newItem) => {
    setItems((prevItems) => [newItem, ...prevItems]);
  };

  // Return state variables and updater function
  return { items, loading, addItem };
}
