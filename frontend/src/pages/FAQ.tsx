import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import api from '../services/api';
import { pageTransition, fadeInUp } from '../animations/framer-variants';

export const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await api.get('/faq');
        setFaqs(response.data);
      } catch (err) {
        console.error('Failed to load FAQ data', err);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleAccordion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 py-10 min-h-screen space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-[#FF7A00]" /> Help Center
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-light max-w-md mx-auto">
          Find fast answers regarding organic ingredients, shipping, subscriptions, and hygiene.
        </p>

        {/* Filter Input */}
        <div className="relative max-w-md mx-auto flex items-center pt-2">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-[#FF7A00] text-sm bg-white shadow-premium"
          />
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">Loading questions...</div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-3xl shadow-premium p-6">
          No matches found for "{searchQuery}". Try typing another keyword.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = activeId === faq.id;
            return (
              <motion.div
                key={faq.id}
                variants={fadeInUp}
                custom={idx}
                className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif font-bold text-slate-800 text-sm sm:text-base leading-tight">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-[#FF7A00]' : ''
                      }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 border-t border-slate-50 text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

    </motion.div>
  );
};
export default FAQ;
