import React from 'react';
import { Save } from 'lucide-react';

export default function AdminContactTab({
  cmsContact,
  setCmsContact,
  handleSaveContact
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-zinc-900 dark:text-white">Contact & Social Links CMS</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage official contact information, social media links, and online delivery links</p>
        </div>
        <button
          onClick={handleSaveContact}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Contact & Social Links</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-6">
        
        {/* Management Contacts */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-lg text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2">Business & Management Directory</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">General Manager Name</label>
              <input
                type="text"
                value={cmsContact.general_manager || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, general_manager: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Physical HQ Address</label>
              <input
                type="text"
                value={cmsContact.address || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Phone Numbers (comma separated)</label>
              <input
                type="text"
                value={(cmsContact.phones || []).join(', ')}
                onChange={(e) => setCmsContact(prev => ({ ...prev, phones: e.target.value.split(',').map(s => s.trim()) }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-amber-600 dark:text-amber-300 outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Email Addresses (comma separated)</label>
              <input
                type="text"
                value={(cmsContact.emails || []).join(', ')}
                onChange={(e) => setCmsContact(prev => ({ ...prev, emails: e.target.value.split(',').map(s => s.trim()) }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
          <h3 className="font-heading font-bold text-lg text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2">Social Media Channels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Facebook Page Name</label>
              <input
                type="text"
                value={cmsContact.facebook || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, facebook: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Facebook URL</label>
              <input
                type="text"
                value={cmsContact.facebook_url || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, facebook_url: e.target.value }))}
                placeholder="https://www.facebook.com/..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-amber-600 dark:text-amber-300 outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Instagram URL</label>
              <input
                type="text"
                value={cmsContact.instagram_url || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, instagram_url: e.target.value }))}
                placeholder="https://www.instagram.com/..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-amber-600 dark:text-amber-300 outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">TikTok URL</label>
              <input
                type="text"
                value={cmsContact.tiktok_url || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, tiktok_url: e.target.value }))}
                placeholder="https://www.tiktok.com/@..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-amber-600 dark:text-amber-300 outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">YouTube Channel URL</label>
              <input
                type="text"
                value={cmsContact.youtube_url || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, youtube_url: e.target.value }))}
                placeholder="https://www.youtube.com/@..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-amber-600 dark:text-amber-300 outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Online Delivery Links */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
          <h3 className="font-heading font-bold text-lg text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2">Online Delivery & Messaging Platforms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Foodpanda Store URL</label>
              <input
                type="text"
                value={cmsContact.foodpanda_url || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, foodpanda_url: e.target.value }))}
                placeholder="https://www.foodpanda.ph/..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-pink-600 dark:text-pink-400 outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">GrabFood Store URL</label>
              <input
                type="text"
                value={cmsContact.grabfood_url || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, grabfood_url: e.target.value }))}
                placeholder="https://food.grab.com/ph/..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-emerald-600 dark:text-emerald-400 outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">WhatsApp Hotline Number</label>
              <input
                type="text"
                value={cmsContact.whatsapp_number || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                placeholder="0932 2329484"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Viber Hotline Number</label>
              <input
                type="text"
                value={cmsContact.viber_number || ''}
                onChange={(e) => setCmsContact(prev => ({ ...prev, viber_number: e.target.value }))}
                placeholder="0932 2329484"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
