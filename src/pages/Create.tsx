import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../services/transactions';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Send, Landmark, Receipt, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CreateTransaction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sender_name: '',
    recipient_name: '',
    amount: '',
    currency: 'USD',
    sending_bank: '',
    receiving_bank: '',
    reference_number: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  });
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const tx = await transactionService.createTransaction({
        ...formData,
        amount: Number(formData.amount),
        user_id: user.id,
        date_sent: new Date().toISOString(),
        status: 'processing'
      });

      navigate(`/track/${tx.id}`);
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center text-slate-500 font-bold tracking-widest text-[10px] uppercase gap-2 hover:text-blue-600 transition group"
        >
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
            <ArrowLeft size={16} />
          </div>
          Return to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-[0_10px_60px_rgba(0,0,0,0.04)] border border-slate-100"
            >
              <div className="mb-10 text-center md:text-left">
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold tracking-[0.2em] uppercase mb-4">Transfer Window</span>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">New Transfer</h1>
                <p className="mt-4 text-slate-500 font-medium">Configure your cross-border payout details.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Sender Profile</label>
                    <input 
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder:text-slate-300 shadow-sm"
                      placeholder="Organization or Individual"
                      value={formData.sender_name}
                      onChange={(e) => setFormData({...formData, sender_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Recipient Identity</label>
                    <input 
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder:text-slate-300 shadow-sm"
                      placeholder="Legal Name"
                      value={formData.recipient_name}
                      onChange={(e) => setFormData({...formData, recipient_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Financial Amount</label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-extrabold text-slate-400 text-lg group-focus-within:text-blue-600 transition-colors">$</span>
                    <input 
                      type="number"
                      required
                      className="w-full rounded-3xl border border-slate-200 bg-white pl-12 pr-6 py-6 text-2xl font-black transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder:text-slate-200 shadow-sm"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Source Bank</label>
                    <div className="relative">
                      <Landmark className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-6 py-4 text-sm font-bold transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder:text-slate-300 shadow-sm"
                        placeholder="Sending Institution"
                        value={formData.sending_bank}
                        onChange={(e) => setFormData({...formData, sending_bank: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Payout Bank</label>
                    <div className="relative">
                      <Landmark className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-6 py-4 text-sm font-bold transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder:text-slate-300 shadow-sm"
                        placeholder="Destination Institution"
                        value={formData.receiving_bank}
                        onChange={(e) => setFormData({...formData, receiving_bank: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-[1.5rem] bg-blue-600 text-white font-extrabold text-lg transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200/50 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-12 overflow-hidden relative shadow-lg"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div 
                        key="loading" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="h-6 w-6 animate-spin border-3 border-white border-t-transparent rounded-full" 
                      />
                    ) : (
                      <motion.div key="ready" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                        Initiate Payment <Send size={20} className="-rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </motion.div>
          </div>

          {/* Side Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative"
            >
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-blue-600/20 blur-[60px] rounded-full" />
              <div className="relative z-10">
                <ShieldCheck className="text-blue-400 mb-6" size={32} />
                <h3 className="text-xl font-extrabold mb-4 tracking-tight leading-snug">Global Security Standards</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                  Every transaction is monitored via AES-256 encryption. We coordinate with multiple clearing houses to ensure your funds arrive safely.
                </p>
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
                      <Receipt size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none mb-1">Audit Log</p>
                      <p className="text-sm font-bold truncate max-w-[150px]">{formData.reference_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col items-center text-center group"
            >
              <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={28} className="text-indigo-200" />
              </div>
              <h4 className="text-lg font-extrabold mb-2 tracking-tight leading-none uppercase text-[12px] opacity-70">Pro Feature</h4>
              <p className="font-bold text-xl mb-4 leading-tight">Instant Payouts</p>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">
                Unlock real-time transfers to over 150 countries with our premium tiered plans.
              </p>
              <button className="mt-8 px-8 py-3 rounded-2xl bg-white text-indigo-600 font-extrabold text-sm tracking-widest uppercase hover:bg-slate-50 transition shadow-lg">Upgrade</button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
