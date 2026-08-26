import React, { useState, useContext } from 'react';
import { useItems } from './useItems';
import { UserContext } from './UserContext';

export default function App() {
  // 1. CONTEXT API (useContext)
  // What it does: Accesses global user state directly from UserContext.
  // Why it is used: Demonstrates reading global state without passing props down component trees (no prop drilling).
  const { user, isLoggedIn, login, logout } = useContext(UserContext);

  // Local state for Login Input field
  const [loginInput, setLoginInput] = useState('');

  // 2. Custom Hook from Exp 2 (Item management)
  const { items, loading, addItem } = useItems();

  // Local state for Filtering and Modal
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', status: 'lost' });

  // Handle Login Submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(loginInput);
    setLoginInput('');
  };

  // Handle Item Report Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    addItem({
      id: Date.now(),
      name: formData.name,
      location: formData.location,
      status: formData.status,
      date: 'Just now',
    });

    setFormData({ name: '', location: '', status: 'lost' });
    setShowModal(false);
  };

  // Filtered items computation
  const filteredItems = items.filter((item) =>
    filter === 'all' ? true : item.status === filter
  );

  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen flex flex-col">
      {/* NAVBAR: Reads UserContext directly via useContext (No prop drilling!) */}
      <nav className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span className="text-xl font-bold tracking-wide">Campus Radar</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Global User Greeting from Context */}
            <span className="text-sm font-semibold bg-indigo-700/60 px-3 py-1.5 rounded-full border border-indigo-500/40">
              {isLoggedIn ? `Welcome, ${user}` : 'Guest'}
            </span>

            {/* Logout Button if Logged In */}
            {isLoggedIn && (
              <button
                onClick={logout}
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition cursor-pointer"
              >
                Logout
              </button>
            )}

            {/* Report Button */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-indigo-600 font-semibold px-4 py-1.5 rounded-lg shadow hover:bg-indigo-50 transition cursor-pointer text-sm"
            >
              + Report Item
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
        {/* HEADING */}
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Campus Lost &amp; Found Radar
          </h1>
          <p className="text-slate-600 text-base">
            Experiment 3: Context API &amp; Global State Management (createContext, Provider &amp; useContext)
          </p>
        </header>

        {/* MOCK LOGIN SECTION (Demonstrates Global State Update) */}
        {!isLoggedIn ? (
          <section className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-indigo-900">Student Sign-In Demo</h3>
              <p className="text-xs text-indigo-700">Enter your name to test global Context API state.</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Enter Student Name"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                required
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-grow sm:w-48"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg shadow transition cursor-pointer"
              >
                Login
              </button>
            </form>
          </section>
        ) : (
          <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-8 flex items-center justify-between text-xs text-emerald-800 font-semibold">
            <span>Logged in via Global Context API as: <strong>{user}</strong></span>
            <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full text-[10px]">Context Active</span>
          </section>
        )}

        {/* FILTER SECTION */}
        <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Filter Items:</span>
          <div className="flex items-center space-x-2">
            <label htmlFor="filter-select" className="text-sm text-slate-600 font-medium">Status:</label>
            <select
              id="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-sm font-medium rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Items</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
        </section>

        {/* DASHBOARD / ITEM CARDS GRID */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium animate-pulse">
            Loading items...
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        item.status === 'lost'
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Reported item around campus grounds.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span>📍 Location: <strong className="text-slate-700">{item.location}</strong></span>
                  <span>📅 {item.date}</span>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-800 text-slate-400 text-center py-4 text-xs mt-auto">
        <p>College Lab Experiment 3 &bull; Context API (createContext, Provider, useContext)</p>
      </footer>

      {/* REPORT ITEM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Report an Item</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2 py-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Water Bottle"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Lab 3, Library, Canteen"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow"
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
