import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiPlus, FiSearch } from 'react-icons/fi';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/tickets/')
      .then((res) => setTickets(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter(t =>
    t.title.includes(search) ||
    t.ticket_number.includes(search) ||
    t.unit.includes(search)
  );

  const priorityLabel = { low: 'کم', medium: 'متوسط', high: 'زیاد', urgent: 'فوری' };
  const priorityColor = {
    low: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-orange-500/20 text-orange-400',
    urgent: 'bg-red-500/20 text-red-400',
  };
  const statusLabel = { new: 'جدید', reviewing: 'در حال بررسی', done: 'انجام شده', rejected: 'رد شده' };
  const statusColor = {
    new: 'bg-blue-500/20 text-blue-400',
    reviewing: 'bg-purple-500/20 text-purple-400',
    done: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">تیکت‌های من</h1>
          <p className="text-slate-400 mt-1">لیست تمام تیکت‌های ثبت شده</p>
        </div>
        <button
          onClick={() => navigate('/new-ticket')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus />
          تیکت جدید
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute right-4 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="جستجو در تیکت‌ها..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-white/10 rounded-lg py-3 pr-11 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        {loading ? (
          <div className="text-slate-400 text-center py-16">در حال بارگذاری...</div>
        ) : filtered.length === 0 ? (
          <div className="text-slate-400 text-center py-16">تیکتی یافت نشد</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-white/10 bg-slate-800/50">
                <th className="text-right py-4 px-6">شماره</th>
                <th className="text-right py-4 px-6">عنوان</th>
                <th className="text-right py-4 px-6">واحد</th>
                <th className="text-right py-4 px-6">نوع</th>
                <th className="text-right py-4 px-6">اولویت</th>
                <th className="text-right py-4 px-6">وضعیت</th>
                <th className="text-right py-4 px-6">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 text-blue-400 font-medium">{ticket.ticket_number}</td>
                  <td className="py-4 px-6 text-white">{ticket.title}</td>
                  <td className="py-4 px-6 text-slate-300">{ticket.unit}</td>
                  <td className="py-4 px-6 text-slate-300">
                    {ticket.type === 'bug' ? 'ایراد' :
                     ticket.type === 'suggestion' ? 'پیشنهاد' :
                     ticket.type === 'new_feature' ? 'درخواست جدید' : 'سوال'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${priorityColor[ticket.priority]}`}>
                      {priorityLabel[ticket.priority]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColor[ticket.status]}`}>
                      {statusLabel[ticket.status]}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {new Date(ticket.created_at).toLocaleDateString('fa-IR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </Layout>
  );
};

export default TicketList;