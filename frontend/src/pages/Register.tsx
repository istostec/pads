import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { pageTransition } from '../animations/framer-variants';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
       setError('Please fill in name, email, and password details.');
       return;
    }

    setLoading(true);
    const success = await register(name, email, password, phone);
    setLoading(false);

    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Email address may already be registered.');
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-md mx-auto px-4 py-10 min-h-[80vh] flex flex-col justify-center space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-slate-800">Create Account</h1>
        <p className="text-slate-400 text-xs sm:text-sm font-light">Join Lumina Circle for rash-free comfort cycles.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-premium border border-slate-100/50 space-y-6">
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-200 flex items-center gap-1.5">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Full Name *</label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aishwarya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-[#FFF8F2]/30 focus:outline-none focus:border-[#FF7A00]"
              />
              <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Address *</label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aishwarya@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-[#FFF8F2]/30 focus:outline-none focus:border-[#FF7A00]"
              />
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Phone Number</label>
            <div className="relative flex items-center">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-[#FFF8F2]/30 focus:outline-none focus:border-[#FF7A00]"
              />
              <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Password *</label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-[#FFF8F2]/30 focus:outline-none focus:border-[#FF7A00]"
              />
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-premium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {loading ? 'Registering Account...' : 'Register'} <UserPlus className="w-4 h-4" />
          </button>

        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF7A00] hover:underline font-bold">
            Sign In
          </Link>
        </p>

      </div>
    </motion.div>
  );
};
export default Register;
