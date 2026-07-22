import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiArrowRight } from 'react-icons/fi';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets/' + id + '/')
      .then((res) => setTicket(res.data))
      .finally(() => setLoading(false));
  }, [id]);

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
  const typeLabel = { bug: 'ایراد', suggestion: 'پیشنهاد', new_feature: 'درخواست جدید', question: 'سوال' };

  if (loading) {
    return (
      <Layout>
        <div className="text-slate-400 text-center mt-20">{"در حال بارگذاری..."}</div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="text-slate-400 text-center mt-20">{"تیکت یافت نشد"}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/tickets')}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <FiArrowRight className="text-xl" />
        </button>
        <div>
          <h1 className="text-white text-2xl font-bold">{ticket.ticket_number}</h1>
          <p className="text-slate-400 mt-1">{ticket.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 bg-slate-900 border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-white font-bold mb-4">{"توضیحات"}</h2>
          <p className="text-slate-300 leading-8">{ticket.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-white font-bold mb-4">{"جزئیات تیکت"}</h2>
          <div>
            <p className="text-slate-500 text-xs mb-1">{"وضعیت"}</p>
            <span className={'px-3 py-1 rounded-full text-sm ' + statusColor[ticket.status]}>
              {statusLabel[ticket.status]}
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">{"اولویت"}</p>
            <span className={'px-3 py-1 rounded-full text-sm ' + priorityColor[ticket.priority]}>
              {priorityLabel[ticket.priority]}
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">{"نوع"}</p>
            <p className="text-white text-sm">{typeLabel[ticket.type]}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">{"واحد"}</p>
            <p className="text-white text-sm">{ticket.unit}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">{"تاریخ ثبت"}</p>
            <p className="text-white text-sm">
              {new Date(ticket.created_at).toLocaleDateString('fa-IR')}
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">{"ثبت کننده"}</p>
            <p className="text-white text-sm">{ticket.created_by_name || ticket.created_by}</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TicketDetail;