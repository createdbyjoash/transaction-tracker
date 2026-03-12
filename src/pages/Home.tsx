import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, Activity, Globe, CreditCard } from 'lucide-react';

export const Home: React.FC = () => {
  console.log('HOME COMPONENT: Rendering...');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for confirmation!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 relative overflow-hidden font-sans">
      {/* Visual Background Decoration */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full hidden md:block opacity-5">
        <div className="absolute -top-40 -right-40 w-full h-[120%] bg-blue-600 rounded-bl-[40%] transform rotate-3" />
      </div>

      <div className="container mx-auto px-6 h-screen flex flex-col md:flex-row items-center justify-center gap-16 relative z-10">
        
        {/* Left Side: Branding and Features */}
        <div className="flex-1 max-w-xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 mb-10 justify-center md:justify-start"
          >
            <div className="h-10 w-10 flex items-center justify-center bg-blue-600 rounded-xl text-white shadow-[0_8px_20px_rgba(37,99,235,0.4)]">
              <Activity size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">TranxTrack</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[0.95] tracking-tight mb-8"
          >
            Global money <br/><span className="text-blue-600">movement</span> transparent.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-sm md:max-w-md"
          >
            The world's most intuitive platform for logging and tracking cross-border financial transactions in real-time.
          </motion.p>

          <div className="grid grid-cols-3 gap-8 opacity-60">
            <Feature icon={<Globe size={18} />} label="150+ Countries" />
            <Feature icon={<Shield size={18} />} label="Bank-Grade" />
            <Feature icon={<CreditCard size={18} />} label="Multicurrency" />
          </div>
        </div>

        {/* Right Side: Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md bg-white rounded-[3rem] p-12 md:p-14 shadow-[0_20px_100px_rgba(0,0,0,0.08)] border border-slate-100"
        >
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2">{isSignUp ? 'Join the movement' : 'Secure Login'}</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{isSignUp ? 'Get started today' : 'Enter your credentials'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-14 py-4 text-sm font-bold transition focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Access Code</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-14 py-4 text-sm font-bold transition focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-5 rounded-2xl transition-all hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] shadow-[0_5px_15px_rgba(37,99,235,0.2)] hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-3 overflow-hidden"
              disabled={loading}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin border-3 border-white border-t-transparent rounded-full" />
              ) : (
                <>{isSignUp ? 'Create Account' : 'Gateway Access'} <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-slate-400 text-sm font-bold uppercase tracking-tighter hover:text-slate-900 transition"
            >
              {isSignUp ? 'Already registered? Login' : 'New to TranxTrack? Sign up'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Feature = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center md:items-start">
    <div className="text-blue-600 mb-2">{icon}</div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{label}</span>
  </div>
);
