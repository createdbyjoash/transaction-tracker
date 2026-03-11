import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, Clock, Banknote, User, MessageCircle, MoreVertical } from 'lucide-react';
import { transactionService } from '../services/transactions';
import { Transaction } from '../types';
import { supabase } from '../lib/supabase';
import { Badge } from '../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      transactionService.getTransactions(user.id).then((data) => {
        setTransactions(data);
        setLoading(false);
      });
    });

    // Real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          // Refresh transactions or handle specific change
          console.log('Change received!', payload);
          if (user) {
            transactionService.getTransactions(user.id).then(setTransactions);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const filteredTransactions = transactions.filter(t => 
    t.recipient_name.toLowerCase().includes(search.toLowerCase()) || 
    t.reference_number.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: transactions.length,
    active: transactions.filter(t => t.status === 'processing').length,
    completed: transactions.filter(t => t.status === 'completed').length,
    amountTotal: transactions.reduce((acc, t) => acc + Number(t.amount), 0)
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center p-12">
      <div className="h-10 w-10 animate-spin border-4 border-blue-600 border-t-transparent rounded-full shadow-lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Navbar Style Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">FinDashboard</h1>
            <p className="mt-1 text-slate-500 font-medium">Welcome back, <span className="text-slate-900 font-bold">{user.email?.split('@')[0]}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4 transition-colors group-hover:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search txns..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm"
              />
            </div>
            <Link 
              to="/create" 
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 hover:scale-[1.02] active:scale-95 shadow-lg shadow-slate-200/50"
            >
              <Plus size={18} /> New Transfer
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mb-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Transfers" value={stats.active} icon={<Clock className="text-blue-600" size={24} />} trend="+1 today" />
          <StatCard label="Completed" value={stats.completed} icon={<Banknote className="text-emerald-600" size={24} />} trend="Global coverage" />
          <StatCard label="Total Volume" value={`$${stats.amountTotal.toLocaleString()}`} icon={<ArrowUpRight className="text-indigo-600" size={24} />} trend="Last 30 days" />
          <StatCard label="Pending Approval" value="0" icon={<Filter className="text-slate-400" size={24} />} trend="All clear" />
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-[2rem] shadow-[0_4px_45px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <MoreVertical size={20} className="text-slate-300" /> Recent Transactions
            </h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"><Filter size={18} /></button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-8 py-5">Recipient & Ref</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                {filteredTransactions.map((t, idx) => (
                  <motion.tr 
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {t.recipient_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{t.recipient_name}</p>
                          <p className="text-xs font-mono text-slate-400 mt-1">{t.reference_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-extrabold text-slate-900 text-sm">
                        {t.currency} {Number(t.amount).toLocaleString()}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Cross-Border</p>
                    </td>
                    <td className="px-8 py-6">
                      <Badge status={t.status}>{t.status}</Badge>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">
                      {new Date(t.date_sent).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <Link 
                        to={`/track/${t.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm transition hover:bg-blue-600 hover:text-white hover:border-blue-600 group-hover:shadow-md"
                        title="Track"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
                </AnimatePresence>
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                          <Banknote size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No transactions found</h3>
                        <p className="text-slate-500 max-w-xs text-sm">You haven't initiated any transfers yet. Start by creating a new transaction.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, trend }: { label: string, value: any, icon: React.ReactNode, trend: string }) => (
  <div className="rounded-3xl bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 transition hover:shadow-lg group">
    <div className="flex items-center justify-between mb-4">
      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center transition group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-400 tracking-widest leading-none bg-slate-100/50 px-2 py-1 rounded-md uppercase">{trend}</span>
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

const ArrowRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
);
