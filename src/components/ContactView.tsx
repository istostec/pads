/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

interface ContactViewProps {
  onSubmitContact: (data: { name: string; email: string; phone: string; message: string }) => void;
}

export default function ContactView({ onSubmitContact }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    
    onSubmitContact({ name, email, phone, message });
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setSubmitted(submitted => true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full border border-brand-purple/20">
          Corporate Relations
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
          Clinical Grace Headquarters
        </h1>
        <p className="text-xs text-gray-500">
          Have direct questions regarding packaging certifications, custom hospital shipments, or regional wholesale supply? Contact our administration offices today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Coordinates & Vector Google Maps Mock (Left Side) */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-white p-6 rounded-3xl border border-brand-lavender/60 shadow-sm space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">
              Office Coordinates
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3 text-xs">
                <MapPin className="w-5 h-5 text-brand-dark shrink-0" />
                <div>
                  <h4 className="font-heading font-bold text-gray-900 uppercase tracking-wide">Main Facility Headquarters</h4>
                  <p className="text-gray-500 mt-1 leading-relaxed">
                    Clinical Grace Healthcare Pvt. Ltd.<br />
                    Plot No. 142, Medical-Hygiene Industrial Park, Phase III<br />
                    Industrial Area, New Delhi - 110020
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-xs border-t border-brand-clinical pt-4">
                <Phone className="w-5 h-5 text-brand-dark shrink-0" />
                <div>
                  <h4 className="font-heading font-bold text-gray-900 uppercase tracking-wide">Customer Assistance Hotlines</h4>
                  <p className="text-gray-500 mt-1">
                    Phone: +91 11 4055 9000 (Mon - Sat, 9 AM to 6 PM)<br />
                    WhatsApp Direct: +91 98110 98110 (24/7 Support)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-xs border-t border-brand-clinical pt-4">
                <Mail className="w-5 h-5 text-brand-dark shrink-0" />
                <div>
                  <h4 className="font-heading font-bold text-gray-900 uppercase tracking-wide">Secure Email Transmissions</h4>
                  <p className="text-gray-500 mt-1">
                    Wholesale Enquiries: supply@clinicalgrace.com<br />
                    General Assistance: info@clinicalgrace.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Maps Mock (Stitch Color Theme) */}
          <div className="bg-white p-4 rounded-3xl border border-brand-lavender/60 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider px-2">
              Facility Location Plan
            </h3>
            
            <div className="relative aspect-[16/9] bg-brand-blue/30 rounded-2xl border border-brand-purple/20 overflow-hidden flex items-center justify-center">
              {/* Simulated styled map background using grid vectors */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-30">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-brand-dark" />
                ))}
              </div>

              {/* Mock Road vectors */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/70 rotate-2 -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/3 w-6 bg-white/70 -rotate-12" />

              {/* Hospital Area Circle */}
              <div className="absolute top-1/3 left-1/4 w-28 h-20 bg-brand-pink/40 border border-brand-purple rounded-full flex items-center justify-center p-2 text-center text-[8px] font-mono font-bold uppercase tracking-wider text-brand-dark z-0 shadow-inner">
                Medical hygiene Park
              </div>

              {/* Pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="px-3 py-1.5 bg-brand-dark text-white rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider shadow-md">
                  Clinical Grace Plant 142
                </div>
                <div className="w-2.5 h-2.5 bg-brand-dark rotate-45 -mt-1.5 shadow" />
                <div className="w-3 h-3 bg-brand-dark rounded-full border-2 border-white mt-1 shadow animate-ping" />
              </div>

              <span className="absolute bottom-2 right-2 text-[8px] text-gray-400 font-mono">
                Map Scale: 1:2000 m
              </span>
            </div>
          </div>

        </div>

        {/* Contact Form (Right Side) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-brand-lavender shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-dark" />
          <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider mb-2">
            File an Inquiry Coordinates
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            Input your coordinates below. A clinic relations officer will process your query and reply with complete technical specs.
          </p>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl space-y-4 text-center max-w-md mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-heading font-extrabold text-sm">Message Transmitted Successfully!</h4>
              <p className="text-emerald-600 font-medium font-sans text-xs">
                Your parameters have been transmitted safely. We usually address general support emails within 12-18 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Meera Nair"
                    className="w-full px-4 py-2.5 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="meera@healthcare.com"
                    className="w-full px-4 py-2.5 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Mobile Contact No. *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9988776655"
                  className="w-full px-4 py-2.5 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Additional Message Context</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Elaborate on your requirement or clinical context..."
                  className="w-full px-4 py-2.5 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-dark text-white text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-brand-darker transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                Transmit Secure Coordinates
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
