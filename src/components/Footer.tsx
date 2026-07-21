/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Shield, Star, Award, CheckCircle2, MessageSquareCode } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const certifications = [
    { label: 'Dermatologically Tested', desc: '100% Rash-Free Certified' },
    { label: 'Hypoallergenic organic', desc: 'Zero Perfumes or Dyes' },
    { label: 'ISO 9001 : 2015', desc: 'Medical Manufacturing Standard' },
    { label: 'CE Certified Quality', desc: 'Efficacy Standard Compliant' }
  ];

  return (
    <footer className="bg-white border-t border-brand-lavender mt-20">
      {/* Top Certifications Trust Bar */}
      <div className="bg-brand-blue/40 border-b border-brand-lavender py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-brand-purple/40 text-brand-dark shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-xs text-gray-900 leading-none">{cert.label}</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-1">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center">
                <Heart className="w-4 h-4 text-brand-dark" fill="currentColor" />
              </div>
              <span className="text-md font-heading font-bold text-gray-900 tracking-tight">Clinical Grace</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Clinical Grace is India’s premier manufacturer and distributor of high-absorbency, pure medical-grade sanitary pads. Dedicated to providing rash-free, ultra-soft, and hypoallergenic solutions for women’s wellness.
            </p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded bg-brand-lavender/40 text-[10px] text-brand-dark font-mono font-bold tracking-wider uppercase border border-brand-purple/20">
                100% Breathable
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-[10px] text-emerald-700 font-mono font-bold tracking-wider uppercase border border-emerald-200">
                FDA Registered Facility
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 mb-4">Product Offerings</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-brand-dark transition-colors">
                  Ultra Thin Pads
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-brand-dark transition-colors">
                  Extra Large (XL) Pads
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-brand-dark transition-colors">
                  Overnight Back-Coverage Pads
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-brand-dark transition-colors">
                  Cotton Panty Liners
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-brand-dark transition-colors">
                  Clinical Maternity Pads
                </button>
              </li>
            </ul>
          </div>

          {/* Support / Legal */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 mb-4">Corporate &amp; Contact</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-brand-dark transition-colors">
                  Our Story &amp; Facility
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bulk-inquiry')} className="hover:text-brand-dark transition-colors">
                  Bulk Inquiry &amp; Distribution
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-brand-dark transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-brand-dark transition-colors">
                  Customer Assistance Hotlines
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 mb-4">Headquarters</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Clinical Grace Healthcare Private Limited<br />
              Plot No. 142, Medical-Hygiene Park, Phase III<br />
              Industrial Area, New Delhi - 110020
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div><strong>Email:</strong> info@clinicalgrace.com</div>
              <div><strong>Phone:</strong> +91 11 4055 9000</div>
              <div><strong>WhatsApp Inquiry:</strong> +91 98110 98110</div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="border-t border-brand-lavender/60 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>
            &copy; {currentYear} Clinical Grace Sanitary Pads. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-dark transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-brand-dark transition-colors">Terms of Supply</a>
            <span>•</span>
            <button onClick={() => onNavigate('admin')} className="text-brand-dark font-medium hover:underline flex items-center gap-1">
              <Shield className="w-3 h-3" /> Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
