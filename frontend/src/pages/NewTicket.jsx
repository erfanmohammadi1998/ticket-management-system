import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const NewTicket = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    unit: user?.unit || '',
    type: 'bug',
    priority: 'medium',
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment') {
      setForm({ ...form, attachment: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });
      await api.post('/tickets/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/tickets');
    } catch {
      setError('خطا در ثبت تیکت. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-800 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-slate-400 text-sm mb-2";

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">ثبت تیکت جدید</h1>
        <p className="text-slate-400 mt-1">درخواست، ایراد یا پیشنهاد خود را ثبت کنید</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-2xl"
      >
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>عنوان *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="عنوان مشکل یا درخواست را بنویسید"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>واحد</label>
            <input
              type="text"
              name="unit"
              value={form.unit}
              readOnly
              className={inputClass + " opacity-60 cursor-not-allowed"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>نوع درخواست *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="bug">ایراد</option>
                <option value="suggestion">پیشنهاد</option>
                <option value="new_feature">درخواست جدید</option>
                <option value="question">سوال</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>اولویت *</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">زیاد</option>
                <option value="urgent">فوری</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>توضیحات *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="مشکل یا درخواست خود را به طور کامل توضیح دهید"
              rows={5}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>فایل پیوست (اختیاری)</label>
            <label className="flex items-center gap-3 w-full bg-slate-800 border border-dashed border-white/20 rounded-lg py-4 px-4 text-slate-400 cursor-pointer hover:border-blue-500 transition-colors">
              <FiPaperclip />
              <span className="text-sm">{form.attachment ? form.attachment.name : 'انتخاب فایل'}</span>
              <input
                type="file"
                name="attachment"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FiSend />
            {loading ? 'در حال ثبت...' : 'ثبت تیکت'}
          </button>
        </form>
      </motion.div>
    </Layout>
  );
};

export default NewTicket;