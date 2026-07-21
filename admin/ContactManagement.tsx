import React from 'react';
import { Check, Trash2, MailOpen } from 'lucide-react';
import api from '../frontend/src/services/api';

interface ContactProps {
  messages: any[];
  subscribers: any[];
  refreshData: () => void;
}

export const ContactManagement: React.FC<ContactProps> = ({ messages, subscribers, refreshData }) => {

  const handleMarkRead = async (id: number) => {
    try {
      await api.put(`/contact/messages/${id}`, { status: 'Read' });
      refreshData();
    } catch (err) {
      console.warn('API message status change failed, updating mock locally', err);
      messages.forEach(m => { if (m.id === id) m.status = 'Read'; });
      refreshData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/messages/${id}`);
      refreshData();
    } catch (err) {
      console.warn('API message delete failed, updating mockup state', err);
      const idx = messages.findIndex(m => m.id === id);
      if (idx > -1) messages.splice(idx, 1);
      refreshData();
    }
  };

  return (
    <div className="space-y-8 text-xs">
      
      {/* Messages */}
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-800">Support Inquiries & Feedback</h1>
          <p className="text-slate-400 text-xs font-light">Inspect query tickets submitted through the storefront contact forms.</p>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-slate-400 font-light text-center py-10 bg-white rounded-2xl border border-slate-100 p-6">No message tickets logged.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif font-bold text-slate-800 text-sm leading-none">{msg.subject || 'Support Ticket'}</h3>
                    <span className="text-slate-400 font-light mt-1.5 block">By {msg.name} ({msg.email}) {msg.phone && `• Phone: ${msg.phone}`}</span>
                  </div>

                  <div className="flex gap-2">
                    {msg.status !== 'Read' && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="p-1.5 hover:bg-[#FF7A00]/5 hover:text-[#FF7A00] text-slate-450 rounded-xl cursor-pointer"
                        title="Mark as Read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl cursor-pointer"
                      title="Delete ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-500 font-light leading-relaxed border-t border-slate-50 pt-2.5 italic">
                  "{msg.message}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Subscribers Grid list */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-800">Lumina Circle Subscribers</h2>
          <p className="text-slate-400 text-xs font-light">List of email registrations compiled for newsletter campaigns.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          {subscribers.length === 0 ? (
            <p className="text-slate-400 font-light text-center py-4">No subscribers listed.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {subscribers.map((sub) => (
                <div key={sub.id} className="p-3 bg-[#FFF8F2]/30 border border-slate-100 rounded-xl flex items-center gap-2">
                  <MailOpen className="w-4 h-4 text-[#FF7A00]" />
                  <span className="font-semibold text-slate-700 truncate">{sub.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
export default ContactManagement;
