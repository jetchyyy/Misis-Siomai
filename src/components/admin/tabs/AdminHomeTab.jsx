import React from 'react';
import { Save } from 'lucide-react';

export default function AdminHomeTab({ cmsHome, setCmsHome, handleSaveHome }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-zinc-900 dark:text-white">Home Page CMS</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure hero section title, subtitle, badge, and stats</p>
        </div>
        <button
          onClick={handleSaveHome}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Home CMS</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Hero Section Title</label>
          <input
            type="text"
            value={cmsHome.hero_title || ''}
            onChange={(e) => setCmsHome(prev => ({ ...prev, hero_title: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Hero Subtitle</label>
          <textarea
            rows={3}
            value={cmsHome.hero_subtitle || ''}
            onChange={(e) => setCmsHome(prev => ({ ...prev, hero_subtitle: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Header Tagline / Badge</label>
            <input
              type="text"
              value={cmsHome.badge || ''}
              onChange={(e) => setCmsHome(prev => ({ ...prev, badge: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">CTA Button Text</label>
            <input
              type="text"
              value={cmsHome.cta_button || ''}
              onChange={(e) => setCmsHome(prev => ({ ...prev, cta_button: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
