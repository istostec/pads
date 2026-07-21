/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Sparkles, MessageSquare, ShieldAlert, HeartHandshake } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'materials' | 'absorption' | 'safety' | 'distribution';
}

export default function FaqView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'materials' | 'absorption' | 'safety' | 'distribution'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All FAQs' },
    { id: 'materials', label: 'Material Safety' },
    { id: 'absorption', label: 'Fluid Dynamics' },
    { id: 'safety', label: 'Skin Certification' },
    { id: 'distribution', label: 'Bulk Procurement' }
  ];

  const faqItems: FaqItem[] = [
    {
      q: 'Do Clinical Grace sanitary pads contain any artificial perfumes or chemicals?',
      a: 'Absolutely not. Clinical Grace is committed to 100% pure organic cotton top layers. We do not incorporate any synthetic fragrances, parabens, artificial dyes, phthalates, or odor-masking chemicals. True safety comes from clean materials, not synthetic perfumes.',
      category: 'materials'
    },
    {
      q: 'Are your pads bleached with chlorine gas?',
      a: 'No. Standard pads are bleached with chlorine gas, producing dioxin byproducts that are absorbable by vaginal tissues. Clinical Grace pads undergo pure active oxygenation treatment. This removes natural impurities from organic cotton without producing any chlorine byproducts.',
      category: 'materials'
    },
    {
      q: 'What is your quick-dry absorption mechanism?',
      a: 'We use high-retention medical-grade Super Absorbent Polymers (SAP) integrated between structural cotton layers. This converts fluid instantly into a secure gel. This ensures that the surface remains entirely dry and prevents back-flow even during high pressure sitting states.',
      category: 'absorption'
    },
    {
      q: 'Can the Sleep-Safe XXL pads handle extremely heavy flow lochia bleeding?',
      a: 'Yes. Our Postpartum Maternity (380mm) and Sleep-Safe Overnight (320mm) pads are highly recommended by obstetric practitioners. They hold up to 180ml of fluid with advanced rear wings that completely mitigate sleep staining risks.',
      category: 'absorption'
    },
    {
      q: 'What certifications back up your rash-free claims?',
      a: 'Clinical Grace pads are clinically certified 100% Hypoallergenic and Rash-Free under dermatological human skin trials. We manufacture in an FDA registered facility following ISO 9001:2015 global medical-quality manufacturing codes.',
      category: 'safety'
    },
    {
      q: 'Is the adhesive backing safe for sensitive skin?',
      a: 'Yes, the adhesive backing on our pads and wings is made of bio-safe, non-sensitizing food-grade adhesive. It provides high clothing grip while remaining safe and leaving no synthetic chemical residues on fabrics.',
      category: 'safety'
    },
    {
      q: 'What is the minimum order quantity for pharmacy bulk supply?',
      a: 'Our wholesale logistics support begins at 100 units for regional clinics, NGOs, and pharmacies. We offer scaled discounts for enterprise distributions of 1,000+ packs. Requisitions can be directly initiated on our "Bulk Inquiry" panel.',
      category: 'distribution'
    },
    {
      q: 'Do you ship bulk orders internationally?',
      a: 'Yes, Clinical Grace Healthcare supports bulk custom supply and export shipping across APAC, EMEA, and European territories. All exports carry ISO and CE compliance certifications.',
      category: 'distribution'
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full border border-brand-purple/20">
          Knowledge Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
          Clinical Guidance &amp; Support
        </h1>
        <p className="text-xs text-gray-500">
          Find analytical answers regarding organic material synthesis, medical certifications, absorption metrics, and distribution operations.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setExpandedIndex(null); // collapse all on search
          }}
          placeholder="Search materials, certifications, MOQ, absorbent core..."
          className="w-full pl-10 pr-4 py-2.5 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark bg-white"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-brand-lavender pb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              setExpandedIndex(null); // collapse all on category switch
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeCategory === cat.id
                ? 'bg-brand-dark text-white'
                : 'bg-white border border-brand-lavender text-gray-600 hover:bg-brand-clinical'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-brand-lavender overflow-hidden transition-all duration-300 shadow-sm hover:border-brand-purple/40"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-brand-clinical transition-colors"
                >
                  <span className="font-heading font-bold text-sm text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-brand-dark shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 text-xs text-gray-600 leading-relaxed border-t border-brand-clinical">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Search State */
        <div className="text-center bg-white p-12 rounded-3xl border border-brand-lavender max-w-sm mx-auto space-y-4">
          <ShieldAlert className="w-12 h-12 text-brand-purple mx-auto" />
          <h3 className="font-heading font-semibold text-sm text-gray-900">No FAQs found</h3>
          <p className="text-xs text-gray-400">
            No FAQ articles match "{searchQuery}". Try using basic keywords like "cotton" or "export".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="px-4 py-2 bg-brand-dark text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Reset Help Center Filters
          </button>
        </div>
      )}

      {/* Assistance Contact Card */}
      <section className="bg-brand-blue/30 p-8 rounded-3xl border border-brand-purple/20 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
            <HeartHandshake className="w-4.5 h-4.5 text-brand-dark" />
            Bespoke Medical Support
          </h3>
          <p className="text-xs text-gray-500 max-w-md">
            Can’t find specialized answers concerning your medical requisition or chemical specifications? Our in-house research laboratory provides direct advice.
          </p>
        </div>
        <a
          href="mailto:support@clinicalgrace.com"
          className="px-5 py-3 bg-brand-dark text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-darker transition-colors whitespace-nowrap shadow-sm"
        >
          Email Dr. Ananya Goel
        </a>
      </section>

    </div>
  );
}
