import React, { useState } from 'react';
import { useItems } from './useItems';

export default function App() {
  // 1. CUSTOM HOOK
  // What it does: Calls custom hook useItems() to get items state, loading flag, and addItem handler.
  // Why it is used: Separates data management logic from UI presentation.
  const { items, loading, addItem } = useItems();

  // 2. useState: Filter State
  // What it does: Tracks current filter selection ("all", "lost", or "found").
  // Why it is used: React re-renders card list dynamically whenever filter state changes.
  const [filter, setFilter] = useState('all');

  // 3. useState: Modal Visibility State
  // What it does: Toggles "Report Item" modal popup (true = visible, false = hidden).
  // Why it is used: Replaces direct DOM manipulation (classList.toggle) with declarative state.
  const [showModal, setShowModal] = useState(false);

  // 4. useState: Controlled Form State
  // What it does: Holds current text inputs for the "Report Item" form.
  // Why it is used: Demonstrates controlled components where React state is single source of truth.
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'lost',
  });

  // 5. REACT FORM HANDLING (onSubmit handler)
  // Demonstrates: preventDefault(), state reading, addItem invocation, modal close, form reset
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents default browser page reload

    if (!formData.name || !formData.location) return;

    // Add new item via custom hook function
    addItem({
      id: Date.now(),
      name: formData.name,
      location: formData.location,
      status: formData.status,
      date: 'Just now',
    });

    // Reset form state & close modal
    setFormData({ name: '', location: '', status: 'lost' });
    setShowModal(false);
  };

  // Filtered items computation
  const filteredItems = items.filter((item) =>
    filter === 'all' ? true : item.status === filter
  );

  return (
    <div class="bg-slate-50 font-sans text-slate-800 min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav class="bg-indigo-600 text-white shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="text-xl font-bold tracking-wide">Campus Radar</span>
          </div>

          {/* Button triggers useState to show modal */}
          <button
            onClick={() => setShowModal(true)}
            class="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-indigo-50 transition active:scale-95 cursor-pointer"
          >
            + Report Item
          </button>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main class="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
        {/* HEADING */}
        <header class="mb-8">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Campus Lost &amp; Found Radar
          </h1>
          <p class="text-slate-600 text-base sm:text-lg">
            Experiment 2: React Hooks Demonstration (useState, useEffect, Custom Hooks &amp; Controlled Forms)
          </p>
        </header>

        {/* FILTER SECTION (Dropdown with useState) */}
        <section class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span class="text-sm font-semibold text-slate-700 uppercase tracking-wider">Filter Items:</span>

          <div class="flex items-center space-x-2">
            <label htmlFor="filter-select" class="text-sm text-slate-600 font-medium">Status:</label>
            {/* Controlled Select Dropdown updating filter state */}
            <select
              id="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              class="bg-slate-50 border border-slate-300 text-slate-800 text-sm font-medium rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Items</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
        </section>

        {/* ITEM CARDS GRID */}
        {loading ? (
          <div class="text-center py-12 text-slate-500 font-medium animate-pulse">
            Loading items from hook (useEffect simulated fetch)...
          </div>
        ) : (
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                class="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-bold text-slate-800">{item.name}</h3>
                    <span
                      class={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        item.status === 'lost'
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p class="text-slate-600 text-sm mb-4">
                    Reported item around campus grounds.
                  </p>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span>📍 Location: <strong class="text-slate-700">{item.location}</strong></span>
                  <span>📅 {item.date}</span>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer class="bg-slate-800 text-slate-400 text-center py-4 text-xs mt-auto">
        <p>College Lab Experiment 2 &bull; React Hooks (useState, useEffect, Custom Hook)</p>
      </footer>

      {/* REPORT ITEM MODAL (Controlled by showModal useState) */}
      {showModal && (
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-slate-900">Report an Item</h2>
              <button
                onClick={() => setShowModal(false)}
                class="text-slate-400 hover:text-slate-600 text-xl font-bold px-2 py-1"
              >
                &times;
              </button>
            </div>

            {/* REACT CONTROLLED FORM */}
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Water Bottle"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Lab 3, Library, Canteen"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div class="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  class="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
