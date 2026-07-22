import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FiList, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';

const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-slate-900 border border-white/10 rounded-2xl p-6 flex items-center gap-4`}
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white text-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets/')
      .then((res) => setTickets(res.data))
      .finally(() => setLoading(false));
  }, []);

  const total = tickets.length;
  const newTickets = tickets.filter(t => t.status === 'new').length;
  const reviewing = tickets.filter(t => t.status === 'reviewing').length;
  const done = tickets.filter(t => t.status === 'done').length;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">داشبورد</h1>
        <p className="text-slate-400 mt-1">خلاصه وضعیت تیکت‌ها</p>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center mt-20">در حال بارگذاری...</div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard icon={<FiList />} label="کل تیکت‌ها" value={total} color="bg-blue-600" />
            <StatCard icon={<FiAlertCircle />} label="جدید" value={newTickets} color="bg-yellow-500" />
            <StatCard icon={<FiClock />} label="در حال بررسی" value={reviewing} color="bg-purple-600" />
            <StatCard icon={<FiCheckCircle />} label="انجام شده" value={done} color="bg-green-600" />
          </div>

          {/* آخرین تیکت‌ها */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-4">آخرین تیکت‌ها</h2>
            {tickets.length === 0 ? (
              <p className="text-slate-400 text-center py-8">هنوز تیکتی ثبت نشده</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10">
                    <th className="text-right py-2 pb-3">شماره</th>
                    <th className="text-right py-2 pb-3">عنوان</th>
                    <th className="text-right py-2 pb-3">واحد</th>
                    <th className="text-right py-2 pb-3">اولویت</th>
                    <th className="text-right py-2 pb-3">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 5).map((ticket) => (
                    <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-blue-400">{ticket.ticket_number}</td>
                      <td className="py-3 text-white">{ticket.title}</td>
                      <td className="py-3 text-slate-300">{ticket.unit}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                          ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {ticket.priority === 'urgent' ? 'فوری' :
                           ticket.priority === 'high' ? 'زیاد' :
                           ticket.priority === 'medium' ? 'متوسط' : 'کم'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ticket.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                          ticket.status === 'reviewing' ? 'bg-purple-500/20 text-purple-400' :
                          ticket.status === 'done' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {ticket.status === 'new' ? 'جدید' :
                           ticket.status === 'reviewing' ? 'در حال بررسی' :
                           ticket.status === 'done' ? 'انجام شده' : 'رد شده'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;