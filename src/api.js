// Resilient API service client connecting Frontend to Backend REST endpoints
const configuredApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').trim().replace(/\/+$/, '');
let activeBaseUrl = configuredApiUrl;

// List of candidate URLs to automatically try (handles IPv4 vs IPv6 and port 8080 vs 5000)
const CANDIDATE_URLS = [
  configuredApiUrl,
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
].filter(Boolean);

export function getBaseUrl() {
  return activeBaseUrl;
}

export const BASE_URL = activeBaseUrl;

// Resilient fetch helper that automatically falls back across candidates on network failure
async function apiFetch(endpoint, options = {}) {
  const urlsToTry = [activeBaseUrl, ...CANDIDATE_URLS.filter((u) => u !== activeBaseUrl)];

  let lastError = null;
  for (const base of urlsToTry) {
    try {
      const res = await fetch(`${base}${endpoint}`, options);
      activeBaseUrl = base; // Remember the reachable backend URL
      return res;
    } catch (err) {
      lastError = err;
      // Failed to reach this candidate, attempt next one in list
    }
  }

  throw new Error(
    `Cannot connect to backend server at ${urlsToTry.join(' or ')}. Make sure the backend container or server is running.`
  );
}

// User Login: POST /api/users/login
export async function loginUser(email, password) {
  const res = await apiFetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed: Invalid credentials');
  }
  return data;
}

// User Registration: POST /api/users/register
export async function registerUser(name, email, password, role = 'user') {
  const res = await apiFetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.errors
      ? data.errors.map((e) => e.msg).join(', ')
      : data.message || 'Registration failed';
    throw new Error(errorMsg);
  }
  return data;
}

// Fetch Items: GET /api/items (Public)
export async function fetchItems() {
  const res = await apiFetch('/api/items');
  if (!res.ok) {
    throw new Error('Failed to fetch items from backend');
  }
  const items = await res.json();

  // Normalize MongoDB document (_id, itemName) to frontend schema (id, name)
  return items.map((item) => ({
    id: item._id,
    name: item.itemName,
    description: item.description,
    location: item.location,
    status: (item.status || 'lost').toLowerCase(),
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now',
  }));
}

// Create Item: POST /api/items (Protected - requires JWT Bearer token)
export async function createItem(itemData, token) {
  const res = await apiFetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      itemName: itemData.name,
      description: itemData.description || 'Reported item around campus',
      location: itemData.location,
      status: itemData.status === 'found' ? 'Found' : 'Lost',
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.errors
      ? data.errors.map((e) => e.msg).join(', ')
      : data.error || data.message || 'Failed to create item';
    throw new Error(errorMsg);
  }
  return {
    id: data._id,
    name: data.itemName,
    description: data.description,
    location: data.location,
    status: (data.status || 'lost').toLowerCase(),
    date: 'Just now',
  };
}

// Delete Item: DELETE /api/items/:id (Protected - requires Admin JWT Bearer token)
export async function deleteItem(itemId, token) {
  const res = await apiFetch(`/api/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Failed to delete item: Forbidden');
  }
  return data;
}
