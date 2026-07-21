/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Landmark, Heart, FileSpreadsheet } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
}

export default function Navbar({ currentView, onNavigate, isAdminLoggedIn, onLogoutAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'bulk-inquiry', label: 'Bulk Inquiry' },
    { id: 'about', label: 'About Us' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-lavender">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          {/* Brand Logo & Identification */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="relative w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center shadow-inner">
              <Heart className="w-5 h-5 text-brand-dark" fill="currentColor" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-brand-purple flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-brand-dark" />
              </div>
            </div>
            <div>
              <span className="text-lg font-heading font-bold text-gray-900 tracking-tight leading-none block">
                Clinical Grace
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-brand-dark font-semibold">
                Medical-Grade Hygiene
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.id
                    ? 'bg-brand-blue text-brand-dark-text border-b-2 border-brand-dark shadow-sm'
                    : 'text-gray-600 hover:text-brand-dark hover:bg-brand-lavender/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Buttons: Admin Quick Toggle / Bulk Order CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('bulk-inquiry')}
              className="flex items-center gap-2 px-4 py-2 bg-brand-pink text-brand-dark-text hover:bg-brand-purple/40 border border-brand-purple rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Bulk Order
            </button>
            
            {isAdminLoggedIn ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white hover:bg-brand-darker rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow"
              >
                <Landmark className="w-4 h-4" />
                Admin Dashboard
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1.5 px-3 py-2 border border-brand-dark/20 text-gray-600 hover:text-brand-dark hover:border-brand-dark rounded-xl text-xs font-medium transition-all"
              >
                <Landmark className="w-3.5 h-3.5" />
                Admin Portal
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => handleNavClick('bulk-inquiry')}
              className="p-2 bg-brand-pink text-brand-dark-text border border-brand-purple rounded-lg text-xs font-semibold"
            >
              Bulk Inquiry
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-brand-lavender bg-white p-4 space-y-2 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id
                  ? 'bg-brand-blue text-brand-dark border-l-4 border-brand-dark'
                  : 'text-gray-600 hover:bg-brand-lavender/30'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {isAdminLoggedIn ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-dark text-white rounded-lg text-sm font-semibold uppercase tracking-wider"
              >
                <Landmark className="w-4 h-4" />
                Admin Panel
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-brand-dark/30 text-gray-700 rounded-lg text-sm font-medium"
              >
                <Landmark className="w-4 h-4" />
                Administrative Portal Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
