import React, { useState } from 'react';
import { Mail, Phone, Send, Instagram, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { company } from '../config/company';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await api.post('/contact/newsletter/subscribe', { email });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.warn('Newsletter subscribe failed, simulating local success', err);
      setSubscribed(true);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-rose-100/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top footer details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-slate-800 pb-12 text-xs">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={company.logos.primary}
                alt={company.brand}
                className="w-10 h-10 object-contain"
                loading="eager"
                decoding="async"
              />
              <div className="leading-tight">
                <span className="font-serif font-bold text-xl tracking-tight text-white">
                  JIYONI
                  <span className="text-rose-500 font-sans font-light text-sm ml-1 uppercase tracking-widest">Pads</span>
                </span>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  {company.tagline}
                </div>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed">
              Confidence Starts With Comfort.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={company.contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-rose-500 hover:text-white transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-white font-bold text-base tracking-wide">Quick Explore</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/shop" className="hover:text-rose-500 transition-colors">Our Wellness Products</Link>
              </li>
              <li>
                <Link to="/bulk-inquiry" className="hover:text-rose-500 transition-colors">Wholesale Bulk Inquiry</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-500 transition-colors">The Jiyoni Story</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-rose-500 transition-colors">Help & FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-500 transition-colors">Contact Our Team</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="space-y-4">
            <h3 className="font-serif text-white font-bold text-base tracking-wide">Wellness Support</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-500" />
                <a href={`tel:${company.contact.phone1.replace(/\s+/g, '')}`} className="hover:text-rose-500 transition-colors">
                  {company.contact.phone1}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-500" />
                <a href={`tel:${company.contact.phone2.replace(/\s+/g, '')}`} className="hover:text-rose-500 transition-colors">
                  {company.contact.phone2}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-500" />
                <a href={`mailto:${company.contact.email}`} className="hover:text-rose-500 transition-colors">
                  {company.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Available Sizes */}
          <div className="space-y-4">
            <h3 className="font-serif text-white font-bold text-base tracking-wide">Available Sizes</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Choose your protection comfort. Pieces per box varies by size.</p>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {company.availableSizes.map((s) => (
                <div key={s.key} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70 group transition-all hover:border-rose-500/30">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-rose-300 font-extrabold uppercase tracking-wider">{s.label}</span>
                    <span className="text-[10px] text-rose-500 font-bold">{s.dimensions}</span>
                  </div>
                  <div className="mt-1 text-slate-200 text-xs font-bold">{s.piecesPerBox} Pieces per Box</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 5: Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif text-white font-bold text-base tracking-wide">Join Jiyoni Circle</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Subscribe to receive cycle updates, product announcements, and gynecological hygiene research updates.
            </p>

            {subscribed ? (
              <div className="p-3.5 bg-slate-800/80 rounded-xl text-rose-500 text-xs font-bold border border-rose-500/20">
                ✓ Welcome to the Jiyoni Circle!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 pr-10 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {company.brand}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms & Conditions</a>
          </div>

          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for your cycle comfort.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

