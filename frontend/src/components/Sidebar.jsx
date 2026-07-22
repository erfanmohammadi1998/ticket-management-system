import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FiHome, FiPlusCircle, FiList, FiLogOut, FiUser
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'داشبورد' },
    { path: '/new-ticket', icon: <FiPlusCircle />, label: 'ثبت تیکت جدید' },
    { path: '/tickets', icon: <FiList />, label: 'تیکت‌های من' },
  ];

  return (
    <motion.div
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      className="w-64 min-h-screen bg-slate-900 border-l border-white/10 flex flex-col"
      dir="rtl"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-white font-bold text-xl">🎫 سیستم تیکتینگ</h1>
        <p className="text-slate-400 text-sm mt-1">شرکت الوان</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
          <FiUser className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">{user?.username}</p>
          <p className="text-slate-400 text-xs">کاربر</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 w-full"
        >
          <FiLogOut className="text-lg" />
          خروج
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;