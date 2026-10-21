import React, { useState, useContext } from 'react';
import { useItems } from './useItems';
import { UserContext } from './UserContext';
import LoginPage from './LoginPage';

export default function App() {
  const { user, isLoggedIn, login, logout } = useContext(UserContext);
  const { items, loading, addItem, deleteItem } = useItems();

  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', status: 'lost' });

  // If not logged in, show dedicated Login Page with Role selection
  if (!isLoggedIn) {
    return <LoginPage onLogin={login} />;
  }

  const isAdmin = user?.role === 'admin';
  const userName = user?.name || user?.email || 'User';

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

  const filteredItems = items.filter((item) =>
    filter === 'all' ? true : item.status === filter
  );

  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-indigo-600 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Campus Radar</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* User & Role Badge */}
            <div className="flex items-center space-x-2 bg-indigo-700/60 px-3 py-1.5 rounded-full border border-indigo-500/40 text-xs">
              <span className="font-medium text-white">{userName}</span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  isAdmin
                    ? 'bg-purple-200 text-purple-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}
              >
                {isAdmin ? '🛡️ Admin' : '🎓 User'}
              </span>
            </div>

            {/* Report Button */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-indigo-600 font-semibold px-3.5 py-1.5 rounded-lg shadow hover:bg-indigo-50 transition cursor-pointer text-xs sm:text-sm"
            >
              + Report Item
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
        {/* HEADER & ROLE PRIVILEGE BANNER */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Campus Lost &amp; Found Radar
              </h1>
              <p className="text-slate-500 text-sm">
                Real-time dashboard for items reported lost or found across campus
              </p>
            </div>

            {/* Role Notice */}
            <div
              className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium border ${
                isAdmin
                  ? 'bg-purple-50 border-purple-200 text-purple-800'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}
            >
              {isAdmin ? (
                <>🛡️ Admin Access: You can view, report, and delete items.</>
              ) : (
                <>🎓 User Access: You can view and report lost/found items.</>
              )}
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Filter Status ({filteredItems.length} items)
          </span>
          <div className="flex items-center space-x-2">
            <label htmlFor="filter-select" className="text-xs text-slate-500 font-medium">Status:</label>
            <select
              id="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Items</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
        </section>

        {/* ITEM CARDS GRID */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium animate-pulse">
            Loading items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-500">
            No items found matching the selected filter.
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        item.status === 'lost'
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mb-4">
                    Reported on campus grounds.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <div className="text-slate-500">
                    📍 <strong className="text-slate-700">{item.location}</strong> &bull; {item.date}
                  </div>

                  {/* Admin Delete Action */}
                  {isAdmin && (
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                      title="Admin-only: Delete Item"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 text-slate-400 text-center py-4 text-xs mt-auto">
        <p>Campus Lost &amp; Found Radar &bull; Full Stack Development</p>
      </footer>

      {/* REPORT ITEM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Report an Item</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold px-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Name</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
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
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow"
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
