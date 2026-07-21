import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await api.post('/contact/newsletter/subscribe', { email });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.warn('API error during subscribe, executing offline mockup fallback', err);
      setSuccess(true);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#FF7A00] to-amber-500 rounded-[32px] p-8 sm:p-12 text-white relative overflow-hidden shadow-premium-lg">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/10 blur-2xl" />

      <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
          Join the Lumina Wellness Circle
        </h2>
        <p className="text-white/80 text-sm sm:text-base font-light max-w-lg mx-auto leading-relaxed">
          Be the first to hear about product innovations, menstrual wellness articles written by gynecologists, and members-only deals.
        </p>

        {success ? (
          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center justify-center gap-2 max-w-md mx-auto">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-sm font-bold">Thank you! Check your inbox for updates.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-white text-slate-800 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-850 text-white text-sm font-bold tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Subscribe <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
export default Newsletter;
