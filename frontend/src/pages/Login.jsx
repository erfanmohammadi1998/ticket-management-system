import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiLock, FiLogIn, FiUser } from 'react-icons/fi';
import api from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (username.length >= 1) {
      api.get('/users/?search=' + username)
        .then((res) => {
          setUsers(res.data);
          setShowDropdown(true);
        })
        .catch(() => setUsers([]));
    } else {
      setUsers([]);
      setShowDropdown(false);
    }
  }, [username]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (user) => {
    setUsername(user.username);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch {
      setError('نام کاربری یا رمز عبور اشتباه است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiLogIn className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">سیستم تیکتینگ</h1>
          <p className="text-blue-200 mt-1">ورود به حساب کاربری</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg p-3 mb-4 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative" ref={dropdownRef}>
            <FiUser className="absolute right-3 top-3.5 text-blue-300 z-10" />
            <input
              type="text"
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pr-10 pl-4 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
              autoComplete="off"
            />
            {showDropdown && users.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-12 right-0 left-0 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
              >
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelect(user)}
                    className="px-4 py-3 text-white hover:bg-blue-600/40 cursor-pointer flex items-center gap-2 border-b border-white/5 last:border-0"
                  >
                    <FiUser className="text-blue-300 text-sm" />
                    <span>{user.username}</span>
                    <span className="text-slate-400 text-sm">{user.family}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <div className="relative">
            <FiLock className="absolute right-3 top-3.5 text-blue-300" />
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pr-10 pl-4 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;