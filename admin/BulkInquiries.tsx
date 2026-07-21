import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Search, RefreshCw, Pencil } from 'lucide-react';
import api from './src/services/api';


type InquiryStatus = 'New Inquiry' | 'Contacted' | 'In Discussion' | 'Completed';

type BulkInquiry = {
  id: number;
  full_name: string;
  company_name: string;
  mobile_number: string;
  email_address: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  product_name: string;
  quantity: number;
  message?: string;
  status: InquiryStatus | string;
  created_at: string;
  updated_at: string;
};

export const BulkInquiries: React.FC = () => {
  const [token] = useState<string | null>(localStorage.getItem('access_token'));


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [inquiries, setInquiries] = useState<BulkInquiry[]>([]);
  const [search, setSearch] = useState('');

  const [selected, setSelected] = useState<BulkInquiry | null>(null);
  const [newStatus, setNewStatus] = useState<InquiryStatus>('New Inquiry');


  const [updating, setUpdating] = useState(false);

  const filtered = useMemo(() => {
    const list = Array.isArray(inquiries) ? inquiries : [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((i) => {
      const hay = [
        i.full_name,
        i.company_name,
        i.email_address,
        i.mobile_number,
        i.product_name,
        String(i.quantity),
        i.status,
      ]
        .join(' | ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [inquiries, search]);

  const fetchInquiries = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      // Admin-only endpoint — server returns { items: [...], total, page, page_size }
      const res = await api.get('/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(res.data?.items ?? []);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch bulk inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openDetails = (inq: BulkInquiry) => {
    setSelected(inq);
    const s = inq.status;
    if (s === 'New Inquiry' || s === 'Contacted' || s === 'In Discussion' || s === 'Completed') {
      setNewStatus(s);
    } else {
      setNewStatus('New Inquiry');
    }
  };

  const updateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setUpdating(true);
    try {
      await api.put(`/inquiries/${selected.id}/status`, {
        status: newStatus,
      });
      // re-fetch list
      await fetchInquiries();
      setSelected(null);
    } catch (err) {
      // still refresh so admin sees latest state
      await fetchInquiries();
      setSelected(null);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-800">Bulk Wholesale Inquiries</h1>
          <p className="text-slate-400 text-xs font-light">Search inquiries and update their processing status.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex items-center w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search name / company / email / product / status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#FF7A00]"
          />
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-xs font-bold">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider bg-slate-50/50">
                <th className="p-4">Inquiry ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Product</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-light">No inquiries found.</td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/40">
                    <td className="p-4 font-bold text-slate-800">{inq.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{inq.full_name}</div>
                      <div className="text-slate-400">{inq.company_name}</div>
                    </td>
                    <td className="p-4">{inq.product_name}</td>
                    <td className="p-4 font-bold text-[#FF7A00]">{inq.quantity}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                          inq.status === 'Completed'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : inq.status === 'In Discussion'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : inq.status === 'Contacted'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-4">{inq.created_at ? new Date(inq.created_at).toLocaleDateString() : '-'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => openDetails(inq)}
                        className="p-1.5 hover:bg-[#FF7A00]/5 hover:text-[#FF7A00] text-slate-400 rounded-xl cursor-pointer"
                        title="Moderate inquiry"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6 shadow-premium border border-slate-100 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-slate-800 text-base flex items-center gap-1.5">
                <Eye className="w-5 h-5 text-[#FF7A00]" /> Inquiry #{selected.id}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
                <div className="text-slate-400 font-bold uppercase tracking-wider">Customer</div>
                <div className="font-semibold text-slate-800">{selected.full_name}</div>
                <div className="text-slate-500">{selected.company_name}</div>
                <div className="text-slate-400">Email: {selected.email_address}</div>
                <div className="text-slate-400">Mobile: {selected.mobile_number}</div>
              </div>

              <div className="space-y-1 bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
                <div className="text-slate-400 font-bold uppercase tracking-wider">Request</div>
                <div className="font-semibold text-slate-800">{selected.product_name}</div>
                <div className="text-slate-400">Quantity: {selected.quantity}</div>
                <div className="text-slate-400">Current status: {selected.status}</div>
              </div>
            </div>

            <div className="space-y-1 bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
              <div className="text-slate-400 font-bold uppercase tracking-wider">Address</div>
              <div className="text-slate-800 font-semibold">
                {selected.address}, {selected.city}, {selected.state} - {selected.pincode}
              </div>
            </div>

            {selected.message && (
              <div className="space-y-1 bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
                <div className="text-slate-400 font-bold uppercase tracking-wider">Message</div>
                <div className="text-slate-800">{selected.message}</div>
              </div>
            )}

            <form onSubmit={updateStatus} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase tracking-wider">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as InquiryStatus)}
                    className="w-full p-2 border border-slate-200 bg-white rounded-lg focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="New Inquiry">New Inquiry</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase tracking-wider">Submitted</label>
                  <div className="w-full p-2 border border-slate-100 bg-slate-50 rounded-lg text-slate-700">
                    {selected.created_at ? new Date(selected.created_at).toLocaleString() : '-'}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 bg-[#FF7A00] hover:bg-[#E06B00] text-white font-bold uppercase tracking-wider rounded-full shadow-sm cursor-pointer text-center disabled:opacity-60"
              >
                {updating ? 'Updating status...' : 'Save status change'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkInquiries;

