import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { company } from '../config/company';



const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const topLinks = useMemo(
    () => [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/shop' },
      { label: 'Bulk Inquiry', path: '/bulk-inquiry' },
      { label: 'About Us', path: '/about' },
      { label: 'Blog', path: '/blog' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Contact Us', path: '/contact' },
    ],
    []
  );


  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = profileRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [profileOpen]);


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-[8px] py-0 shadow-[0_6px_24px_-14px_rgba(245,158,11,0.20)] border-b border-[#F59E0B]/10'
          : 'bg-white/50 py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[76px]">
       <Link to="/" className="flex items-center group">
  <motion.div whileHover={{ rotate: 15 }} className="relative h-[60px] w-auto">
    <img
      src={company.logos.primary}
      alt={company.brand}
      className="h-[60px] w-auto object-contain select-none"
      loading="eager"
      decoding="async"
    />
  </motion.div>
</Link>


        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-9">
          {topLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative text-[13px] font-semibold tracking-wide transition-all py-1 uppercase select-none ${
                  isActive ? 'text-[#F59E0B]' : 'text-[#1F2937]/85'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="inline-flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-[2px]">
                    {link.label}
                  </span>

                  {/* Underline */}
                  <motion.span
                    className="absolute left-0 right-0 -bottom-[2px] h-[2px] origin-left rounded-full bg-[#F59E0B]"
                    initial={false}
                    animate={{
                      scaleX: isActive ? 1 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  />

                  {/* Hover underline */}
                  {!isActive && (
                    <motion.span
                      className="absolute left-0 right-0 -bottom-[2px] h-[2px] origin-left rounded-full bg-[#F59E0B]"
                      initial={false}
                      animate={{ scaleX: 0, opacity: 0 }}
                      whileHover={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>


        {/* Right ops */}
        <div className="flex items-center gap-3">
          {/* Wishlist Icon */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
               ${isActive ? 'text-[#F59E0B]' : 'text-[#6B7280] hover:text-[#F59E0B]'}`
            }
            aria-label="Wishlist"
          >
            <span className="sr-only">Wishlist</span>
            <User className="w-5 h-5" />
          </NavLink>


          {/* Login Button */}
          {!loading && user ? (
            <div ref={profileRef} className="relative hidden sm:flex items-center">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 py-2 px-3 rounded-full border border-[#F59E0B]/20 bg-white/70 hover:border-[#F59E0B]/40 text-[#1F2937]/90 transition-all cursor-pointer text-xs font-semibold"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
              </button>


              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-slate-100 shadow-premium overflow-hidden z-50"
                  >
                    <div className="py-2">
                      <NavLink
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-xs font-bold transition-colors ${
                            isActive ? 'text-rose-500 bg-rose-50/60' : 'text-slate-700 hover:bg-rose-50'
                          }`
                        }
                      >
                        Dashboard
                      </NavLink>
                      <NavLink
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-xs font-bold transition-colors ${
                            isActive ? 'text-rose-500 bg-rose-50/60' : 'text-slate-700 hover:bg-rose-50'
                          }`
                        }
                      >
                        Profile
                      </NavLink>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}

          {/* Mobile Hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 lg:hidden text-slate-600 hover:text-rose-500 transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-b border-rose-100 overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-2 text-xs uppercase font-bold">
              {loading ? (
                <span className="text-slate-600">Loading session…</span>
              ) : (
                topLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-slate-700 hover:text-rose-500 transition-colors py-2 px-3 rounded-xl hover:bg-rose-50 ${
                        isActive ? 'text-rose-500' : ''
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))
              )}

              {!loading && user && (
                <div className="pt-2">
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block text-slate-700 hover:text-rose-500 transition-colors py-2 px-3 rounded-xl hover:bg-rose-50 ${
                        isActive ? 'text-rose-500' : ''
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block text-slate-700 hover:text-rose-500 transition-colors py-2 px-3 rounded-xl hover:bg-rose-50 ${
                        isActive ? 'text-rose-500' : ''
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left text-slate-700 hover:text-rose-500 transition-colors py-2 px-3 rounded-xl hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;


