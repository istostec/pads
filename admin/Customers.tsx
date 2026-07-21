import React, { useState } from 'react';
import { Search, UserCheck } from 'lucide-react';

interface CustomersProps {
  customers: any[];
}

export const Customers: React.FC<CustomersProps> = ({ customers }) => {
  const [searchVal, setSearchVal] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchVal.toLowerCase()) || 
    c.email.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-800">Customer Accounts</h1>
        <p className="text-slate-400 text-xs font-light">View customer emails, phone listings, and platform registration timelines.</p>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex items-center w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search email or name..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#FF7A00]"
          />
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        </div>
        <span className="text-slate-400 font-semibold block">{filteredCustomers.length} Users found</span>
      </div>

      {/* Customer Lists Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider bg-slate-50/50">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Platform Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-light">No customer accounts matched.</td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/40">
                    <td className="p-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FF7A00]/10 flex items-center justify-center font-serif text-[#FF7A00] font-black text-sm">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{c.name}</span>
                    </td>
                    <td className="p-4 font-semibold">{c.email}</td>
                    <td className="p-4">{c.phone || 'N/A'}</td>
                    <td className="p-4">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full uppercase">
                        <UserCheck className="w-3 h-3" /> customer
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default Customers;
