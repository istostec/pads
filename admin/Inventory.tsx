import React, { useState } from 'react';
import { PackageOpen, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../frontend/src/services/api';

interface InventoryProps {
  products: any[];
  refreshData: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, refreshData }) => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [newQty, setNewQty] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleOpenUpdate = (p: any) => {
    setSelectedProduct(p);
    setNewQty(p.quantity || 0);
    setSuccessMsg('');
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    setUpdating(true);
    setSuccessMsg('');
    try {
      await api.put(`/products/${selectedProduct.id}`, {
        quantity: Number(newQty)
      });
      setSuccessMsg('✓ Stock level updated successfully!');
      refreshData();
      setTimeout(() => setSelectedProduct(null), 1000);
    } catch (err) {
      console.warn('API inventory update failed, modifying mockup values', err);
      // mockup update
      products.forEach(p => {
        if (p.id === selectedProduct.id) {
          p.quantity = Number(newQty);
        }
      });
      setSuccessMsg('✓ Mock Stock level updated!');
      setTimeout(() => setSelectedProduct(null), 1000);
    } finally {
      setUpdating(false);
    }
  };

  const lowStockItems = products.filter(p => (p.quantity || 0) <= (p.low_stock_threshold || 10));

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-800">Inventory Stock Management</h1>
        <p className="text-slate-400 text-xs font-light">Inspect comfort product quantities, manage warehouse logs, and override stock volumes.</p>
      </div>

      {/* Warnings Block */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-red-700 block">Low Stock Warnings!</span>
            <p className="text-slate-500 font-light leading-relaxed">
              We detected {lowStockItems.length} products running below their minimum warehouse parameters. Order restocking immediately.
            </p>
          </div>
        </div>
      )}

      {/* Inventory table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider bg-slate-50/50">
                <th className="p-4">Product Name</th>
                <th className="p-4">Product Type</th>
                <th className="p-4">Low stock threshold</th>
                <th className="p-4">Available Quantity</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {products.map((p) => {
                const isLow = (p.quantity || 0) <= (p.low_stock_threshold || 10);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/40">
                    <td className="p-4 font-serif font-bold text-slate-800 text-sm">{p.name}</td>
                    <td className="p-4 font-semibold">{p.product_type}</td>
                    <td className="p-4 font-bold text-slate-400">{p.low_stock_threshold || 10} Units</td>
                    <td className="p-4">
                      <span className={`font-bold text-sm ${isLow ? 'text-red-500' : 'text-slate-800'}`}>{p.quantity} Units</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleOpenUpdate(p)}
                        className="flex items-center gap-1 text-[#FF7A00] font-bold border border-[#FF7A00]/20 px-3.5 py-1.5 rounded-full hover:bg-[#FF7A00]/5 cursor-pointer uppercase text-[9px] tracking-wider"
                      >
                        <RefreshCw className="w-3 h-3" /> Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-premium border border-slate-100 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-serif font-bold text-slate-800 text-base flex items-center gap-1.5">
                <PackageOpen className="w-5 h-5 text-[#FF7A00]" /> RESTOCK: {selectedProduct.name}
              </h3>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">Close</button>
            </div>

            {successMsg && (
              <div className="p-3 bg-green-50 rounded-xl text-green-700 text-xs font-bold border border-green-200 mb-4 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateStock} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Quantity In Warehouse</label>
                <input
                  type="number"
                  required
                  value={newQty}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#FF7A00] font-bold text-base"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 bg-[#FF7A00] hover:bg-[#E06B00] text-white font-bold uppercase tracking-wider rounded-full shadow-sm cursor-pointer"
              >
                {updating ? 'Updating Warehouse Stocks...' : 'Commit restock values'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Inventory;
