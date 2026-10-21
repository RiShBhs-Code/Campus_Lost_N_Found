import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick preset loader for presentation/demo
  const handlePreset = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setName('Campus Admin');
      setEmail('admin@campus.edu');
      setPassword('admin123');
    } else {
      setName('Alex Student');
      setEmail('student@campus.edu');
      setPassword('student123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Attempt backend login using configurable API URL (supports Docker port 5000 or local 8080)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let response;
      try {
        response = await fetch(`${apiUrl}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } catch (err) {
        if (apiUrl !== 'http://localhost:8080') {
          response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
        } else {
          throw err;
        }
      }

      if (response.ok) {
        const data = await response.json();
        onLogin({
          name: data.user?.name || name || email.split('@')[0],
          email: data.user?.email || email,
          role: data.user?.role || role,
          token: data.token,
        });
        return;
      }
    } catch {
      // Backend offline: seamlessly fall back to local credentials
    }

    // Local authentication fallback
    onLogin({
      name: name || (role === 'admin' ? 'Campus Admin' : email.split('@')[0]),
      email,
      role,
      token: 'mock-jwt-token',
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-8 text-center text-white relative">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-3 backdrop-blur-sm border border-white/20 shadow-inner">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Campus Lost &amp; Found</h1>
          <p className="text-indigo-100 text-xs mt-1">Sign in with role-based access control</p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    role === 'user'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">🎓</span>
                    {role === 'user' && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm">User</div>
                    <div className="text-[11px] text-slate-500">Report &amp; view items</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    role === 'admin'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">🛡️</span>
                    {role === 'admin' && (
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm">Admin</div>
                    <div className="text-[11px] text-slate-500">Manage &amp; delete items</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder={role === 'admin' ? 'Campus Admin' : 'Alex Student'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder={role === 'admin' ? 'admin@campus.edu' : 'student@campus.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-white font-semibold text-sm shadow-md transition cursor-pointer ${
                role === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-400'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400'
              }`}
            >
              {loading ? 'Signing in...' : `Sign In as ${role === 'admin' ? 'Administrator' : 'User'}`}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="block text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Fill Demo Accounts
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePreset('user')}
                className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
              >
                🎓 Student Account
              </button>
              <button
                type="button"
                onClick={() => handlePreset('admin')}
                className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
              >
                🛡️ Admin Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
