import React, { useState } from 'react';
import { Eye, Search, ClipboardList } from 'lucide-react';
import api from '../frontend/src/services/api';

interface OrdersProps {
  orders: any[];
  refreshData: () => void;
}

export const Orders: React.FC<OrdersProps> = ({ orders, refreshData }) => {
  const [searchVal, setSearchVal] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal toggle state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('Pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState('Pending');
  const [updating, setUpdating] = useState(false);

  const handleOpenDetails = (ord: any) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setNewPaymentStatus(ord.payment_status);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    setUpdating(true);
    try {
      await api.put(`/orders/${selectedOrder.id}/status`, {
        status: newStatus,
        payment_status: newPaymentStatus
      });
      refreshData();
      setSelectedOrder(null);
    } catch (err) {
      console.warn('API status change failed, updating mock local state', err);
      // local mockup modification
      orders.forEach(o => {
        if (o.id === selectedOrder.id) {
          o.status = newStatus;
          o.payment_status = newPaymentStatus;
        }
      });
      setSelectedOrder(null);
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.order_number.toLowerCase().includes(searchVal.toLowerCase()) || 
                          o.coupon_code?.toLowerCase().includes(searchVal.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-800">Consumer Order Records</h1>
        <p className="text-slate-400 text-xs font-light">Monitor active checkout orders, trace delivery timelines, and issue payment checks.</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex items-center w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search order number..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#FF7A00]"
          />
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#FF7A00] cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider bg-slate-50/50">
                <th className="p-4">Order No</th>
                <th className="p-4">Date Placed</th>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Final Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Shipping Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-light">No order records matched.</td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/40">
                    <td className="p-4 font-bold text-slate-800">{ord.order_number}</td>
                    <td className="p-4">{new Date(ord.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold">User #{ord.user_id}</td>
                    <td className="p-4 font-black text-[#FF7A00]">₹{ord.final_amount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        ord.payment_status === 'Paid'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-500 border-red-200'
                      }`}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        ord.status === 'Delivered'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : ord.status === 'Cancelled'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleOpenDetails(ord)}
                        className="p-1.5 hover:bg-[#FF7A00]/5 hover:text-[#FF7A00] text-slate-400 rounded-xl cursor-pointer"
                        title="Moderate order status"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Moderation modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-6 shadow-premium border border-slate-100 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-slate-800 text-base flex items-center gap-1.5">
                <ClipboardList className="w-5 h-5 text-[#FF7A00]" /> Order details #{selectedOrder.order_number}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">Close</button>
            </div>

            {/* Client address */}
            {selectedOrder.shipping_address && (
              <div className="space-y-1 bg-[#FFF8F2]/30 p-4 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Deliver coordinates</span>
                <p className="font-semibold text-slate-800">{selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}</p>
                <p className="text-slate-500 font-light leading-relaxed">
                  {selectedOrder.shipping_address.address_line1}, {selectedOrder.shipping_address.address_line2 && `${selectedOrder.shipping_address.address_line2}, `}{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.postal_code}
                </p>
                <p className="text-slate-400">Phone: {selectedOrder.shipping_address.phone}</p>
              </div>
            )}

            {/* Item list details */}
            <div className="space-y-3">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">Products purchased</span>
              <div className="space-y-2 border-b border-slate-100 pb-3">
                {selectedOrder.items && selectedOrder.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-slate-700">
                    <span className="font-semibold">{item.product_name} <span className="text-slate-400 font-light font-sans">({item.size}) x {item.quantity}</span></span>
                    <span className="font-bold text-[#FF7A00]">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Status Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase tracking-wider">Shipping Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2 border border-slate-200 bg-white rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase tracking-wider">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full p-2 border border-slate-200 bg-white rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 bg-[#FF7A00] hover:bg-[#E06B00] text-white font-bold uppercase tracking-wider rounded-full shadow-sm cursor-pointer text-center"
              >
                {updating ? 'Updating Order status...' : 'Save modification changes'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
export default Orders;
