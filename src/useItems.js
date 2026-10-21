import { useState, useEffect, useCallback } from 'react';
import * as api from './api';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real items from GET /api/items on MongoDB
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchItems();
      setItems(data);
    } catch (err) {
      console.warn('Backend fetch failed, using fallback items:', err.message);
      setError(err.message);
      // Fallback initial sample data if backend connection is unavailable
      setItems([
        { id: '1', name: 'Blue Water Bottle', status: 'lost', location: 'Lab 3', date: 'Today' },
        { id: '2', name: 'Black Calculator', status: 'found', location: 'Library', date: 'Yesterday' },
        { id: '3', name: 'Student ID Card', status: 'lost', location: 'Canteen', date: 'Aug 24' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Create an item: POST /api/items
  const addItem = async (newItemData, token) => {
    try {
      if (token) {
        const created = await api.createItem(newItemData, token);
        setItems((prev) => [created, ...prev.filter((i) => i.id !== created.id)]);
        return created;
      }
    } catch (err) {
      console.error('Failed to create item in backend:', err.message);
      throw err;
    }

    // Fallback local addition if token is missing
    const fallbackItem = {
      id: Date.now().toString(),
      name: newItemData.name,
      location: newItemData.location,
      status: newItemData.status,
      date: 'Just now',
    };
    setItems((prev) => [fallbackItem, ...prev]);
    return fallbackItem;
  };

  // Delete an item: DELETE /api/items/:id (Admin only)
  const deleteItem = async (itemId, token) => {
    try {
      if (token) {
        await api.deleteItem(itemId, token);
      }
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Failed to delete item from backend:', err.message);
      throw err;
    }
  };

  return { items, loading, error, addItem, deleteItem, reloadItems: loadItems };
}
