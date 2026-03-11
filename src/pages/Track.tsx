import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { transactionService } from '../services/transactions';
import { Transaction } from '../types';
import { TransactionTimeline } from '../components/transactions/Timeline';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { ArrowLeft, Share2, Copy, ExternalLink, ShieldCheck, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Track: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      transactionService.getTransactionById(id).then((data) => {
        setTransaction(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex h-[80vh] w-full items-center justify-center p-10">
      <div className="h-10 w-10 animate-spin border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!transaction) return (
    <div className="flex h-screen flex-col items-center justify-center text-center px-4 bg-slate-50">
      <div className="mb-6 p-4 rounded-full bg-red-100 text-red-600">
        <AlertCircle size={48} />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Transaction Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        We couldn't find a transaction with that reference ID. Please check the link and try again.
      </p>
      <Link to="/" className="inline-flex items-center text-blue-600 font-semibold hover:underline">
        <ArrowLeft size={18} className="mr-2" /> Return Home
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-indigo-600" size={24} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Secure Tracking Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Transfer Tracking
            </h1>
            <p className="mt-2 text-slate-500 flex items-center font-medium">
              Ref: <span className="ml-1 text-slate-900 font-mono text-sm tracking-widest">{transaction.reference_number}</span>
            </p>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 border border-slate-200 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:bg-slate-100"
          >
            {copied ? (
              <><span className="text-emerald-500 font-medium">Copied!</span></>
            ) : (
              <><Share2 size={18} className="text-slate-600" /> <span className="text-slate-700 font-medium">Share Tracking Link</span></>
            )}
          </button>
        </div>

        {/* Status Card and Main Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 rounded-3xl bg-white p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-blue-50/10 rounded-bl-3xl">
              {/* Subtle design element */}
            </div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest leading-none">Status</span>
              <Badge status={transaction.status}>{transaction.status.toUpperCase()}</Badge>
            </div>
            <div className="mb-8">
              <span className="text-slate-400 text-sm font-medium">Transfer Amount</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-extrabold text-slate-900">{transaction.currency} {transaction.amount.toLocaleString()}</span>
                <span className="text-slate-400 text-lg font-medium">Net</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sender</p>
                <p className="text-lg font-bold text-slate-900">{transaction.sender_name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1"><CornerDownRight size={12} /> {transaction.sending_bank}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Recipient</p>
                <p className="text-lg font-bold text-slate-900 text-right">{transaction.recipient_name}</p>
                <p className="text-xs text-slate-500 text-right flex items-center justify-end gap-1">{transaction.receiving_bank} <CornerDownRight size={12} /></p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-200/50 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ExternalLink size={18} className="text-blue-400" />
                Details
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Date Sent</p>
                  <p className="text-sm font-medium">{new Date(transaction.date_sent).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Method</p>
                  <p className="text-sm font-medium">Swift Transfer (Priority)</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Est. Completion</p>
                  <p className="text-sm font-medium">Within 24-48 hours</p>
                </div>
              </div>
            </div>
            
            <button className="mt-8 rounded-2xl bg-slate-800 px-4 py-4 text-center text-xs font-bold tracking-widest uppercase transition-all hover:bg-slate-700 hover:scale-[1.02] border border-slate-700">
              Need Help?
            </button>
          </motion.div>
        </div>

        {/* Timeline Tracking Section */}
        <section className="bg-white rounded-[2rem] p-10 md:p-14 shadow-[0_4px_35px_rgba(0,0,0,0.02)] border border-slate-100">
          <div className="mb-12 border-b border-slate-50 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Timeline Update</h3>
              <p className="text-slate-500 mt-1 font-medium italic">Monitor the journey of your funds in real-time.</p>
            </div>
          </div>
          {transaction.stages && (
            <TransactionTimeline stages={transaction.stages} />
          )}
        </section>

        <footer className="pt-12 text-center text-slate-400 text-sm font-medium">
          <p>© 2026 TransactionTracker Secure Transfer System</p>
          <div className="flex items-center justify-center gap-6 mt-4 opacity-50">
            <ShieldCheck size={18} />
            <span className="tracking-widest uppercase font-bold text-[10px]">End-to-End Encrypted</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
