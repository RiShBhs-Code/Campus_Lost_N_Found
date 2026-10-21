import { useState, useEffect } from 'react';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialData = [
      { id: 1, name: 'Blue Water Bottle', status: 'lost', location: 'Lab 3', date: 'Today' },
      { id: 2, name: 'Black Calculator', status: 'found', location: 'Library', date: 'Yesterday' },
      { id: 3, name: 'Student ID Card', status: 'lost', location: 'Canteen', date: 'Aug 24' },
    ];

    const timer = setTimeout(() => {
      setItems(initialData);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const addItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, loading, addItem, deleteItem };
}
