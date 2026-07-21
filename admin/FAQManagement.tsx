import React, { useState } from 'react';
import { Plus, Trash2, Edit, HelpCircle } from 'lucide-react';
import api from '../frontend/src/services/api';

interface FAQProps {
  faqs: any[];
  refreshData: () => void;
}

export const FAQManagement: React.FC<FAQProps> = ({ faqs, refreshData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form Fields
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Products');
  const [orderIndex, setOrderIndex] = useState(0);

  const handleOpenCreate = () => {
    setEditId(null);
    setQuestion(''); setAnswer(''); setCategory('Products'); setOrderIndex(0);
    setIsOpen(true);
  };

  const handleOpenEdit = (f: any) => {
    setEditId(f.id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setOrderIndex(f.order_index || 0);
    setIsOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      question,
      answer,
      category,
      order_index: Number(orderIndex)
    };

    try {
      if (editId) {
        await api.put(`/faq/${editId}`, payload);
      } else {
        await api.post('/faq', payload);
      }
      refreshData();
      setIsOpen(false);
    } catch (err) {
      console.warn('API FAQ save failed, updating mockup state', err);
      // mockup edits
      if (editId) {
        faqs.forEach(f => {
          if (f.id === editId) {
             f.question = payload.question; f.answer = payload.answer;
             f.category = payload.category; f.order_index = payload.order_index;
          }
        });
      } else {
        faqs.push({ id: Date.now(), ...payload });
      }
      refreshData();
      setIsOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await api.delete(`/faq/${id}`);
      refreshData();
    } catch (err) {
      console.warn('API delete failed, updating mockup state', err);
      const idx = faqs.findIndex(f => f.id === id);
      if (idx > -1) faqs.splice(idx, 1);
      refreshData();
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-800">Frequently Asked Questions Manager</h1>
          <p className="text-slate-400 text-xs font-light">Moderate public FAQ lists, write answers, and adjust sequence order.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1 bg-[#FF7A00] hover:bg-[#E06B00] text-white px-5 py-2.5 rounded-full font-bold uppercase tracking-wider shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {/* Grid list of FAQs */}
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5 flex-grow">
                <span className="bg-[#FF7A00]/10 text-[#FF7A00] px-2 py-0.5 rounded text-[8px] font-bold uppercase block w-fit">{f.category}</span>
                <span className="font-serif font-bold text-slate-800 text-sm block leading-tight">{f.question}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(f)} className="p-1 hover:text-[#FF7A00] text-slate-400 transition-colors cursor-pointer" title="Edit FAQ">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(f.id)} className="p-1 hover:text-red-500 text-slate-400 transition-colors cursor-pointer" title="Delete FAQ">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-slate-500 font-light leading-relaxed border-t border-slate-50 pt-2.5 italic">
              {f.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-premium border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-slate-800 text-base flex items-center gap-1.5">
                <HelpCircle className="w-5 h-5 text-[#FF7A00]" /> {editId ? 'Modify FAQ Details' : 'Write FAQ Entry'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">Close</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Question *</label>
                <input type="text" required value={question} onChange={e => setQuestion(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Category Topic Link</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border border-slate-200 bg-white rounded-lg focus:outline-none cursor-pointer">
                  <option value="Products">Products</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Returns">Returns</option>
                  <option value="Subscription">Subscription</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">Answer Body *</label>
                <textarea required rows={4} value={answer} onChange={e => setAnswer(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase block">List Display Order Index</label>
                <input type="number" value={orderIndex} onChange={e => setOrderIndex(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF7A00] hover:bg-[#E06B00] text-white font-bold uppercase tracking-wider rounded-full shadow-sm cursor-pointer"
              >
                Commit FAQ entry
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default FAQManagement;
