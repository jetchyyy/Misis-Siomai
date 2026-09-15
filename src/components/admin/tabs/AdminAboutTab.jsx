import React from 'react';
import { Save, Info } from 'lucide-react';

export default function AdminAboutTab({ cmsAbout, setCmsAbout, handleSaveAbout }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-zinc-900 dark:text-white">About Us CMS (Mission & Vision)</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure core mission, vision, brand story, and brand name</p>
        </div>
        <button
          onClick={handleSaveAbout}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Mission & Vision</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Brand Name</label>
            <input
              type="text"
              value={cmsAbout.brand_name || ''}
              onChange={(e) => setCmsAbout(prev => ({ ...prev, brand_name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Tagline</label>
            <input
              type="text"
              value={cmsAbout.tagline || ''}
              onChange={(e) => setCmsAbout(prev => ({ ...prev, tagline: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Mission Statement
          </label>
          <textarea
            rows={4}
            value={cmsAbout.mission || ''}
            onChange={(e) => setCmsAbout(prev => ({ ...prev, mission: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Vision Statement
          </label>
          <textarea
            rows={4}
            value={cmsAbout.vision || ''}
            onChange={(e) => setCmsAbout(prev => ({ ...prev, vision: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Brand Story</label>
          <textarea
            rows={4}
            value={cmsAbout.story || ''}
            onChange={(e) => setCmsAbout(prev => ({ ...prev, story: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
          />
        </div>
      </div>
    </div>
  );
}
