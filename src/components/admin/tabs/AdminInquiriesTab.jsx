import React, { useState } from 'react';
import { Users, RefreshCw, Search, Eye, X, Mail, Phone, MapPin, Package } from 'lucide-react';

export default function AdminInquiriesTab({ inquiries, loadingInquiries, fetchInquiries, handleUpdateLeadStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.custom_fields?.target_city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.custom_fields?.selected_package || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || item.inquiry_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const onUpdateStatus = (id, newStatus) => {
    handleUpdateLeadStatus(id, newStatus);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-extrabold text-3xl text-zinc-900 dark:text-white">Customer Leads & Inquiries</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Incoming franchise applications & customer inquiries</p>
          </div>
          <button
            onClick={fetchInquiries}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingInquiries ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              <option value="all">All Types</option>
              <option value="franchise">Franchise</option>
              <option value="bulk_order">Bulk Order</option>
              <option value="general">General</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="In Contact">In Contact</option>
              <option value="Qualified">Qualified</option>
              <option value="Approved">Approved</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-sm text-zinc-700 dark:text-zinc-300">
            <thead className="bg-gray-50 dark:bg-zinc-950 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="py-4 px-5">Applicant</th>
                <th className="py-4 px-5">Type</th>
                <th className="py-4 px-5">Target City</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800/60">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 space-y-1">
                    <Users className="w-8 h-8 mx-auto text-zinc-600" />
                    <p className="font-semibold text-zinc-500 dark:text-zinc-400">No leads found</p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-zinc-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{item.email} • {item.phone}</div>
                    </td>
                    <td className="py-4 px-5 text-xs font-bold text-rose-600 dark:text-rose-400 capitalize">{item.inquiry_type}</td>
                    <td className="py-4 px-5 text-xs text-zinc-700 dark:text-zinc-300">{item.custom_fields?.target_city || 'N/A'}</td>
                    <td className="py-4 px-5">
                      <select
                        value={item.status || 'New'}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                        className="bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 text-xs rounded-lg px-2 py-1 font-semibold text-zinc-800 dark:text-zinc-200"
                      >
                        <option value="New">New</option>
                        <option value="In Contact">In Contact</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Approved">Approved</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-4 px-5 text-xs text-zinc-500">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedLead(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/40 cursor-pointer ml-auto transition-colors"
                        title="View Lead Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-[10px] uppercase tracking-wider border border-rose-500/20">
                    {selectedLead.inquiry_type || 'General'}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Submitted: {new Date(selectedLead.created_at || Date.now()).toLocaleString()}
                  </span>
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-zinc-900 dark:text-white">
                  {selectedLead.name}
                </h2>
              </div>
              
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Information & Target City / Package */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Contact Info</span>
                <div className="space-y-1.5 text-xs">
                  <p className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                    <Mail className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <a href={`mailto:${selectedLead.email}`} className="hover:underline hover:text-rose-300 truncate">
                      {selectedLead.email}
                    </a>
                  </p>
                  <p className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <a href={`tel:${selectedLead.phone}`} className="hover:underline hover:text-emerald-600 dark:text-emerald-300">
                      {selectedLead.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Inquiry Details</span>
                <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <p className="flex items-center gap-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Target Location: <strong className="text-zinc-900 dark:text-white">{selectedLead.custom_fields?.target_city || 'Not specified'}</strong></span>
                  </p>
                  {selectedLead.custom_fields?.selected_package && (
                    <p className="flex items-center gap-2 font-medium">
                      <Package className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>Selected Package: <strong className="text-amber-600 dark:text-amber-300">{selectedLead.custom_fields.selected_package}</strong></span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Lead Status Control */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800/80 flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Application Status</span>
              <select
                value={selectedLead.status || 'New'}
                onChange={(e) => onUpdateStatus(selectedLead.id, e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-xs font-bold text-rose-600 dark:text-rose-400 focus:border-rose-500 outline-none cursor-pointer"
              >
                <option value="New">New Lead</option>
                <option value="In Contact">In Contact</option>
                <option value="Qualified">Qualified</option>
                <option value="Approved">Approved</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* Complete Submitted Message */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Customer Message / Note</span>
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800/80 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap font-medium">
                {selectedLead.message || 'No additional message provided.'}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedLead.phone}</span>
                </a>
                <a
                  href={`mailto:${selectedLead.email}?subject=Misis%20Siomai%20Inquiry%20Response`}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Send Email</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
