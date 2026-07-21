import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { pageTransition } from '../animations/framer-variants';

export const Login: React.FC = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from as string | undefined;

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate(from || '/', { replace: true });
    }
  }, [loading, user, navigate, from]);

  
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
       setError('Please enter both email and password.');
       return;
    }

    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);


    if (success) {
      navigate(from || '/', { replace: true });
    } else {
      setError('Invalid login email or password. Verify credentials.');
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-md mx-auto px-4 py-16 min-h-[80vh] flex flex-col justify-center space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-400 text-xs sm:text-sm font-light">Login to manage your profile and secure cart comfort.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-premium border border-slate-100/50 space-y-6">
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-200 flex items-center gap-1.5">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@jiyoni.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-[#FFF8F2]/30 focus:outline-none focus:border-[#FF7A00]"
              />
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Password</label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-[#FFF8F2]/30 focus:outline-none focus:border-[#FF7A00]"
              />
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || loading}

            className="w-full py-3.5 bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-premium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {submitting || loading ? 'Verifying Session...' : 'Sign In'} <LogIn className="w-4 h-4" />

          </button>

        </form>

        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-[10px] text-amber-700 leading-relaxed space-y-1">
          <span className="font-bold">Demonstration Credentials:</span>
          <div>Customer: <span className="font-mono bg-white px-1 py-0.5 rounded">customer@jiyoni.com</span> / <span className="font-mono bg-white px-1 py-0.5 rounded">customer123</span></div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#FF7A00] hover:underline font-bold">
            Create Account
          </Link>
        </p>

      </div>
    </motion.div>
  );
};
export default Login;
